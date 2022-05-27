import {
	MigrationInterface,
	QueryRunner,
} from 'typeorm';

import * as config from '../../../../config';

export class IncreaseTypeVarcharLimit1646834195327 implements MigrationInterface {
	name = 'IncreaseTypeVarcharLimit1646834195327';

	async up(queryRunner: QueryRunner): Promise<void> {
		let tablePrefix = config.getEnv('database.tablePrefix');
		const tablePrefixPure = tablePrefix;
		const schema = config.getEnv('database.postgresdb.schema');
		if (schema) {
			tablePrefix = schema + '.' + tablePrefix;
		}
		await queryRunner.query(`ALTER TABLE ${tablePrefix}credentials_entity ALTER COLUMN "type" TYPE VARCHAR(128)`);
	}

	async down(queryRunner: QueryRunner): Promise<void> {}
}
