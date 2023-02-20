import config from '@/config';
import { getLicense } from '../License';
import { isUserManagementEnabled } from '../UserManagement/UserManagementHelper';

/**
 *  Check whether the SAML feature is licensed and enabled in the instance
 */
export function isSamlEnabled(): boolean {
	return config.getEnv('sso.saml.enabled');
}

export function isSamlLicensed(): boolean {
	const license = getLicense();
	return isUserManagementEnabled() && license.isSamlEnabled();
}

export function isSamlCurrentAuthenticationMethod(): boolean {
	return config.getEnv('userManagement.authenticationMethod') === 'saml';
}

export function isSsoJustInTimeProvisioningEnabled(): boolean {
	return config.getEnv('sso.justInTimeProvisioning');
}
