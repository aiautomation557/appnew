import type { Entry as LdapUser, ClientOptions } from 'ldapts';
import { Client } from 'ldapts';
import type { LdapConfig } from './types';
import {
	createFilter,
	escapeFilter,
	formatUrl,
	getMappingAttributes,
	resolveEntryBinaryAttributes,
} from './helpers';
import { BINARY_AD_ATTRIBUTES } from './constants';
import type { ConnectionOptions } from 'tls';
import { ApplicationError } from 'n8n-workflow';
import Container from 'typedi';
import { InternalHooks } from '@/InternalHooks';
import { Logger } from '@/Logger';

export class LdapService {
	private client: Client | undefined;

	private _config: LdapConfig;

	/**
	 * Set the LDAP configuration and expire the current client
	 */
	set config(config: LdapConfig) {
		this._config = config;
		this.client = undefined;
	}

	/**
	 * Get new/existing LDAP client,
	 * depending on whether the credentials
	 * were updated or not
	 */
	private async getClient() {
		if (this._config === undefined) {
			throw new ApplicationError('Service cannot be used without setting the property config');
		}
		if (this.client === undefined) {
			const url = formatUrl(
				this._config.connectionUrl,
				this._config.connectionPort,
				this._config.connectionSecurity,
			);
			const ldapOptions: ClientOptions = { url };
			const tlsOptions: ConnectionOptions = {};

			if (this._config.connectionSecurity !== 'none') {
				Object.assign(tlsOptions, {
					rejectUnauthorized: !this._config.allowUnauthorizedCerts,
				});
				if (this._config.connectionSecurity === 'tls') {
					ldapOptions.tlsOptions = tlsOptions;
				}
			}

			this.client = new Client(ldapOptions);
			if (this._config.connectionSecurity === 'startTls') {
				await this.client.startTLS(tlsOptions);
			}
		}
	}

	/**
	 * Attempt a binding with the admin credentials
	 */
	private async bindAdmin(): Promise<void> {
		await this.getClient();
		if (this.client) {
			await this.client.bind(this._config.bindingAdminDn, this._config.bindingAdminPassword);
		}
	}

	/**
	 * Search the LDAP server using the administrator binding
	 * (if any, else a anonymous binding will be attempted)
	 */
	async searchWithAdminBinding(filter: string): Promise<LdapUser[]> {
		await this.bindAdmin();
		if (this.client) {
			const { searchEntries } = await this.client.search(this._config.baseDn, {
				attributes: getMappingAttributes(this._config),
				explicitBufferAttributes: BINARY_AD_ATTRIBUTES,
				filter,
				timeLimit: this._config.searchTimeout,
				paged: { pageSize: this._config.searchPageSize },
				...(this._config.searchPageSize === 0 && { paged: true }),
			});

			await this.client.unbind();
			return searchEntries;
		}
		return [];
	}

	/**
	 * Attempt binding with the user's credentials
	 */
	async validUser(dn: string, password: string): Promise<void> {
		await this.getClient();
		if (this.client) {
			await this.client.bind(dn, password);
			await this.client.unbind();
		}
	}

	/**
	 * Find and authenticate user in the LDAP server.
	 */
	findAndAuthenticateLdapUser = async (
		loginId: string,
		password: string,
		loginIdAttribute: string,
		userFilter: string,
	): Promise<LdapUser | undefined> => {
		// Search for the user with the administrator binding using the
		// the Login ID attribute and whatever was inputted in the UI's
		// email input.
		let searchResult: LdapUser[] = [];

		try {
			searchResult = await this.searchWithAdminBinding(
				createFilter(`(${loginIdAttribute}=${escapeFilter(loginId)})`, userFilter),
			);
		} catch (e) {
			if (e instanceof Error) {
				void Container.get(InternalHooks).onLdapLoginSyncFailed({
					error: e.message,
				});
				Container.get(Logger).error('LDAP - Error during search', { message: e.message });
			}
			return undefined;
		}

		if (!searchResult.length) {
			return undefined;
		}

		// In the unlikely scenario that more than one user is found (
		// can happen depending on how the LDAP database is structured
		// and the LDAP configuration), return the last one found as it
		// should be the less important in the hierarchy.
		let user = searchResult.pop();

		if (user === undefined) {
			user = { dn: '' };
		}

		try {
			// Now with the user distinguished name (unique identifier
			// for the user) and the password, attempt to validate the
			// user by binding
			await this.validUser(user.dn, password);
		} catch (e) {
			if (e instanceof Error) {
				Container.get(Logger).error('LDAP - Error validating user against LDAP server', {
					message: e.message,
				});
			}
			return undefined;
		}

		resolveEntryBinaryAttributes(user);

		return user;
	};

	/**
	 * Attempt binding with the administrator credentials, to test the connection
	 */
	async testConnection(): Promise<void> {
		await this.bindAdmin();
	}
}
