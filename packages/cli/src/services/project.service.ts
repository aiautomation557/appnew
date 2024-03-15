import { Project } from '@/databases/entities/Project';
import { ProjectRelation } from '@/databases/entities/ProjectRelation';
import type { ProjectRole } from '@/databases/entities/ProjectRelation';
import type { User } from '@/databases/entities/User';
import { ProjectRepository } from '@/databases/repositories/project.repository';
import { ProjectRelationRepository } from '@/databases/repositories/projectRelation.repository';
import { Not, type EntityManager } from '@n8n/typeorm';
import Container, { Service } from 'typedi';
import { type Scope } from '@n8n/permissions';
import { In } from '@n8n/typeorm';
import { RoleService } from './role.service';
import { ForbiddenError } from '@/errors/response-errors/forbidden.error';
import { NotFoundError } from '@/errors/response-errors/not-found.error';
import { CredentialsService } from '@/credentials/credentials.service';
import { SharedWorkflowRepository } from '@/databases/repositories/sharedWorkflow.repository';
import { WorkflowService } from '@/workflows/workflow.service';
import { SharedCredentials } from '@/databases/entities/SharedCredentials';
import { SharedWorkflow } from '@/databases/entities/SharedWorkflow';

@Service()
export class ProjectService {
	constructor(
		private readonly sharedWorkflowRepository: SharedWorkflowRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly projectRelationRepository: ProjectRelationRepository,
		private readonly roleService: RoleService,
	) {}

	// TODO: Should internal and external hooks run within transactions?
	// They are not guaranteed to run. They would need to be persisted to the db
	// within the same transaction and then a worker would need to pick them up and execute them.
	// That way we'd at least achieve "run at least once" SLA.
	async deleteProject(user: User, projectId: string) {
		const project = await this.getProjectWithScope(user, projectId, 'project:delete');

		console.log('project', project);

		if (!project) {
			throw new NotFoundError(`Could not find project with ID: ${projectId}`);
		}

		// 0. check if this is a team project
		if (project.type !== 'team') {
			throw new ForbiddenError(
				`Can't delete project. Project with ID "${projectId}" is not a team project.`,
			);
		}

		// TODO: do all of this inside a transaction

		await this.projectRelationRepository.manager.transaction(async (em) => {
			// 1. delete credentials owned by this project
			const ownedCredentials = await em.findBy(SharedCredentials, {
				projectId: project.id,
				role: 'credential:owner',
			});

			for (const credential of ownedCredentials) {
				await Container.get(CredentialsService).delete(credential.credentials, em);
			}

			// 2. delete workflows owned by this project
			const ownedSharedWorkflows = await em.findBy(SharedWorkflow, {
				projectId: project.id,
				role: 'workflow:owner',
			});

			for (const sharedWorkflow of ownedSharedWorkflows) {
				await Container.get(WorkflowService).delete(user, sharedWorkflow.workflow.id, em);
			}

			// 3. delete shared credentials into this project
			// Should cascade, but should this run the same hooks that unsharing does?
			// 4. delete shared workflows into this project
			// Should cascade, but should this run the same hooks that unsharing does?
			// 5. delete project
			await em.remove(project);
		});
	}

	/**
	 * Find all the projects where a workflow is accessible,
	 * along with the roles of a user in those projects.
	 */
	async findProjectsWorkflowIsIn(workflowId: string) {
		return await this.sharedWorkflowRepository.findProjectIds(workflowId);
	}

	async getAccessibleProjects(user: User): Promise<Project[]> {
		// This user is probably an admin, show them everything
		if (user.hasGlobalScope('project:read')) {
			return await this.projectRepository.find();
		}
		return await this.projectRepository.getAccessibleProjects(user.id);
	}

	async getPersonalProjectOwners(projectIds: string[]): Promise<ProjectRelation[]> {
		return await this.projectRelationRepository.getPersonalProjectOwners(projectIds);
	}

	async guaranteeProjectNames(projects: Project[]): Promise<Array<Project & { name: string }>> {
		const projectOwnerRelations = await this.getPersonalProjectOwners(projects.map((p) => p.id));

		return projects.map((p) => {
			if (p.name) {
				return p;
			}
			const pr = projectOwnerRelations.find((r) => r.projectId === p.id);
			let name = `Unclaimed Personal Project (${p.id})`;
			if (pr && !pr.user.isPending) {
				name = `${pr.user.firstName} ${pr.user.lastName}`;
			} else if (pr) {
				name = pr.user.email;
			}
			return this.projectRepository.create({
				...p,
				name,
			});
		}) as Array<Project & { name: string }>;
	}

	async createTeamProject(name: string, adminUser: User): Promise<Project> {
		const project = await this.projectRepository.save(
			this.projectRepository.create({
				name,
				type: 'team',
			}),
		);

		// Link admin
		await this.addUser(project.id, adminUser.id, 'project:admin');

		return project;
	}

	async updateProject(name: string, projectId: string): Promise<Project> {
		const result = await this.projectRepository.update(
			{
				id: projectId,
				type: 'team',
			},
			{
				name,
			},
		);

		if (!result.affected) {
			throw new ForbiddenError('Project not found');
		}
		return await this.projectRepository.findOneByOrFail({ id: projectId });
	}

	async getPersonalProject(user: User): Promise<Project | null> {
		return await this.projectRepository.getPersonalProjectForUser(user.id);
	}

	async getProjectRelationsForUser(user: User): Promise<ProjectRelation[]> {
		return await this.projectRelationRepository.find({
			where: { userId: user.id },
			relations: ['project'],
		});
	}

	async syncProjectRelations(
		projectId: string,
		relations: Array<{ userId: string; role: ProjectRole }>,
	) {
		const project = await this.projectRepository.findOneOrFail({
			where: { id: projectId, type: Not('personal') },
		});
		await this.projectRelationRepository.manager.transaction(async (em) => {
			await this.pruneRelations(em, project);
			await this.addManyRelations(em, project, relations);
		});
	}

	async pruneRelations(em: EntityManager, project: Project) {
		await em.delete(ProjectRelation, { projectId: project.id });
	}

	async addManyRelations(
		em: EntityManager,
		project: Project,
		relations: Array<{ userId: string; role: ProjectRole }>,
	) {
		await em.insert(
			ProjectRelation,
			relations.map((v) =>
				this.projectRelationRepository.create({
					projectId: project.id,
					userId: v.userId,
					role: v.role,
				}),
			),
		);
	}

	async getProjectWithScope(
		user: User,
		projectId: string,
		scope: Scope,
		entityManager?: EntityManager,
	) {
		const em = entityManager ?? this.projectRepository.manager;
		const projectRoles = this.roleService.rolesWithScope('project', [scope]);

		console.log('scope', scope);
		console.log('projectRoles', projectRoles);

		return await em.findOne(Project, {
			where: {
				id: projectId,
				projectRelations: {
					role: In(projectRoles),
					userId: user.id,
				},
			},
		});
	}

	async addUser(projectId: string, userId: string, role: ProjectRole) {
		return await this.projectRelationRepository.save({
			projectId,
			userId,
			role,
		});
	}

	async getProject(projectId: string): Promise<Project> {
		return await this.projectRepository.findOneOrFail({
			where: {
				id: projectId,
			},
		});
	}

	async getProjectRelations(projectId: string): Promise<ProjectRelation[]> {
		return await this.projectRelationRepository.find({
			where: { projectId },
			relations: { user: true },
		});
	}
}
