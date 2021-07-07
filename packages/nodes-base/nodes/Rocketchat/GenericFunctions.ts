import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';
import { NodeApiError, NodeOperationError, } from 'n8n-workflow';

export async function rocketchatApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, resource: string, method: string, operation: string, body: any = {}, headers?: object): Promise<any> { // tslint:disable-line:no-any
	const credentials = this.getCredentials('rocketchatApi');

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	const headerWithAuthentication = Object.assign({}, headers,
		{
			'X-Auth-Token': credentials.authKey,
			'X-User-Id': credentials.userId,
		},
	);

	const options: OptionsWithUri = {
		headers: headerWithAuthentication,
		method,
		body,
		uri: `${credentials.domain}/api/v1${resource}.${operation}`,
		json: true,
	};
	if (Object.keys(options.body).length === 0) {
		delete options.body;
	}
	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export function validateJSON(json: string | undefined): any { // tslint:disable-line:no-any
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
		result = [];
	}
	return result;
}
