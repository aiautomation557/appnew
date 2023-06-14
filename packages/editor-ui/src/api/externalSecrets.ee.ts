import type {
	IRestApiContext,
	ExternalSecretsProvider,
	ExternalSecretsProviderWithProperties,
} from '@/Interface';
import { makeRestApiRequest } from '@/utils';

export const getExternalSecrets = async (
	context: IRestApiContext,
): Promise<Record<string, string[]>> => {
	return makeRestApiRequest(context, 'GET', '/external-secrets/secrets');
};

export const getExternalSecretsProviders = async (
	context: IRestApiContext,
): Promise<ExternalSecretsProvider[]> => {
	return makeRestApiRequest(context, 'GET', '/external-secrets/providers');
};

export const getExternalSecretsProvider = async (
	context: IRestApiContext,
	id: string,
): Promise<ExternalSecretsProviderWithProperties> => {
	return makeRestApiRequest(context, 'GET', `/external-secrets/providers/${id}`);
};

export const updateProvider = async (
	context: IRestApiContext,
	id: string,
	data: ExternalSecretsProvider['data'],
): Promise<boolean> => {
	return makeRestApiRequest(context, 'POST', `/external-secrets/providers/${id}`, data);
};

export const connectProvider = async (
	context: IRestApiContext,
	id: string,
	connected: boolean,
): Promise<boolean> => {
	return makeRestApiRequest(context, 'POST', `/external-secrets/providers/${id}/connect`, {
		connected,
	});
};
