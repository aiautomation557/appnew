import {
	ActiveExecutions,
	DatabaseType,
	Db,
	GenericHelpers,
	IExecutionFlattedDb,
	IExecutionsStopData,
	IWorkflowExecutionDataProcess,
	ResponseHelper,
	WorkflowCredentials,
	WorkflowRunner,
} from './';

import {
	IRun,
	LoggerProxy as Logger,
	WorkflowOperationError,
} from 'n8n-workflow';

import {
	FindManyOptions,
	LessThanOrEqual,
	ObjectLiteral,
} from 'typeorm';

import { DateUtils } from 'typeorm/util/DateUtils';


export class SleepTrackerClass {
	activeExecutionsInstance: ActiveExecutions.ActiveExecutions;

	private sleepingExecutions: {
		[key: string]: {
			executionId: string,
			timer: NodeJS.Timeout,
		};
	} = {};

	mainTimer: NodeJS.Timeout;


	constructor() {
		// TODO: Allow to set time to continue (absolute & relative) in webhook-mode so that it goes on if no webhook is received (separate output? probably for now same output as we can not add them dynamically.)

		// Example URL:
		// http://localhost:5678/webhook-sleeping/13485

		this.activeExecutionsInstance = ActiveExecutions.getInstance();

		// Poll every 60 seconds a list of upcoming executions
		this.mainTimer = setInterval(() => {
			this.getSleepingExecutions();
		}, 60000);

		this.getSleepingExecutions();
	}


	async getSleepingExecutions() {
		Logger.debug('Sleep tracker querying database for sleeping executions...');
		// Find all the executions which should be triggered in the next 70 seconds
		const findQuery: FindManyOptions<IExecutionFlattedDb> = {
			select: ['id', 'sleepTill'],
			where: {
				sleepTill: LessThanOrEqual(new Date(Date.now() + 70000)),
			},
			order: {
				sleepTill: 'ASC',
			},
		};
		const dbType = await GenericHelpers.getConfigValue('database.type') as DatabaseType;
		if (dbType === 'sqlite') {
			// This is needed because of issue in TypeORM <> SQLite:
			// https://github.com/typeorm/typeorm/issues/2286
			(findQuery.where! as ObjectLiteral).sleepTill = LessThanOrEqual(DateUtils.mixedDateToUtcDatetimeString(new Date(Date.now() + 70000)));
		}

		const executions = await Db.collections.Execution!.find(findQuery);

		if (executions.length > 0) {
			const executionIds = executions.map(execution => execution.id.toString()).join(', ');
			Logger.debug(`Sleep tracker found ${executions.length} executions. Setting timer for IDs: ${executionIds}`);
		}

		// Add timers for each waiting execution that they get started at the correct time
		for (const execution of executions) {
			const executionId = execution.id.toString();
			if (this.sleepingExecutions[executionId] === undefined) {
				const triggerTime = execution.sleepTill!.getTime() - new Date().getTime();
				this.sleepingExecutions[executionId] = {
					executionId,
					timer: setTimeout(() => {
						this.startExecution(executionId);
					}, triggerTime),
				};
			}
		}
	}


	async stopExecution(executionId: string): Promise<IExecutionsStopData> {
		if (this.sleepingExecutions[executionId] !== undefined) {
			// The sleeping execution was already sheduled to execute.
			// So stop timer and remove.
			clearTimeout(this.sleepingExecutions[executionId].timer);
			delete this.sleepingExecutions[executionId];
		}

		// Also check in database
		const execution = await Db.collections.Execution!.findOne(executionId);

		if (execution === undefined || !execution.sleepTill) {
			throw new Error(`The execution ID "${executionId}" could not be found.`);
		}

		const fullExecutionData = ResponseHelper.unflattenExecutionData(execution);

		// Set in execution in DB as failed and remove sleepTill time
		const error = new WorkflowOperationError('Workflow-Execution has been canceled!');

		fullExecutionData.data.resultData.error = {
			...error,
			message: error.message,
			stack: error.stack,
		};

		fullExecutionData.stoppedAt = new Date();
		fullExecutionData.sleepTill = undefined;

		await Db.collections.Execution!.update(executionId, ResponseHelper.flattenExecutionData(fullExecutionData));

		return {
			mode: fullExecutionData.mode,
			startedAt: new Date(fullExecutionData.startedAt),
			stoppedAt: fullExecutionData.stoppedAt ? new Date(fullExecutionData.stoppedAt) : undefined,
			finished: fullExecutionData.finished,
		};
	}


	startExecution(executionId: string) {
		Logger.debug(`Sleep tracker resuming execution ${executionId}`, {executionId});
		delete this.sleepingExecutions[executionId];

		(async () => {
			try {
				// Get the data to execute
				const fullExecutionDataFlatted = await Db.collections.Execution!.findOne(executionId);

				if (fullExecutionDataFlatted === undefined) {
					throw new Error(`The execution with the id "${executionId}" does not exist.`);
				}

				const fullExecutionData = ResponseHelper.unflattenExecutionData(fullExecutionDataFlatted);

				if (fullExecutionData.finished === true) {
					throw new Error('The execution did succeed and can so not be started again.');
				}

				const credentials = await WorkflowCredentials(fullExecutionData.workflowData.nodes);

				const data: IWorkflowExecutionDataProcess = {
					credentials,
					executionMode: fullExecutionData.mode,
					executionData: fullExecutionData.data,
					workflowData: fullExecutionData.workflowData,
				};

				// Start the execution again
				const workflowRunner = new WorkflowRunner();
				await workflowRunner.run(data, false, false, executionId);
			} catch (error) {
				Logger.error(`There was a problem starting the sleeping execution with id "${executionId}": "${error.message}"`, { executionId });
			}

		})();

	}
}


let sleepTrackerInstance: SleepTrackerClass | undefined;

export function SleepTracker(): SleepTrackerClass {
	if (sleepTrackerInstance === undefined) {
		sleepTrackerInstance = new SleepTrackerClass();
	}

	return sleepTrackerInstance;
}
