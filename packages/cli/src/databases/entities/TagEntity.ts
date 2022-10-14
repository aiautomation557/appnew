/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-cycle */
import { Column, Entity, Generated, Index, ManyToMany, PrimaryColumn } from 'typeorm';
import { IsString, Length } from 'class-validator';

import { ITagDb } from '../../Interfaces';
import { idStringifier } from '../utils/transformers';
import { WorkflowEntity } from './WorkflowEntity';
import { AbstractEntity } from './AbstractEntity';

@Entity()
export class TagEntity extends AbstractEntity implements ITagDb {
	@Generated()
	@PrimaryColumn({
		transformer: idStringifier,
	})
	id: number;

	@Column({ length: 24 })
	@Index({ unique: true })
	@IsString({ message: 'Tag name must be of type string.' })
	@Length(1, 24, { message: 'Tag name must be $constraint1 to $constraint2 characters long.' })
	name: string;

	@ManyToMany(() => WorkflowEntity, (workflow) => workflow.tags)
	workflows: WorkflowEntity[];
}
