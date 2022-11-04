import { INodeParameterResourceLocator } from "n8n-workflow";
import { ICredentialsResponse } from "./Interface";

export function isResourceLocatorValue(value: unknown): value is INodeParameterResourceLocator {
	return Boolean(typeof value === 'object' && value && 'mode' in value && 'value' in value);
}

export function isNotNull<T>(value: T | null): value is T {
	return value !== null;
}

export function isValidCredentialResponse(value: Object): value is ICredentialsResponse {
	return 'id' in value && 'createdAt' in value && 'createdAt' in value;
}
