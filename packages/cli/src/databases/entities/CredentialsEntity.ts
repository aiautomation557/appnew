import { Column, Entity, Index, OneToMany } from '@n8n/typeorm';
import { IsObject, IsString, Length } from 'class-validator';
import type { SharedCredentials } from './SharedCredentials';
import { WithTimestampsAndStringId } from './AbstractEntity';
import type { ICredentialsDb } from '@/Interfaces';

@Entity()
export class CredentialsEntity extends WithTimestampsAndStringId implements ICredentialsDb {
	@Column({ length: 128 })
	@IsString({ message: 'Credential `name` must be of type string.' })
	@Length(3, 128, {
		message: 'Credential name must be $constraint1 to $constraint2 characters long.',
	})
	name: string;

	@Column('text')
	@IsObject()
	data: string;

	@Index()
	@IsString({ message: 'Credential `type` must be of type string.' })
	@Column({
		length: 128,
	})
	type: string;

	@OneToMany('SharedCredentials', 'credentials')
	shared: SharedCredentials[];
}
