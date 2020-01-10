import { INodeProperties } from 'n8n-workflow';

export const accountOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an account',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an account',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: `Returns an overview of account's metadata.`,
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all accounts',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an account',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const accountFields = [

/* -------------------------------------------------------------------------- */
/*                                account:create                              */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'Name of the account. Maximum size is 255 characters.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Fax number for the account.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccountTypes',
				},
				description: 'Type of account',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the account.',
			},
			{
				displayName: 'Jigsaw',
				name: 'jigsaw',
				type: 'string',
				default: '',
				description: 'references the ID of a company in Data.com',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the account.',
			},
			{
				displayName: 'SicDesc',
				name: 'sicDesc',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				description: 'A brief description of an organization’s line of business, based on its SIC code.',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'ID of the parent object, if any.',
			},
			{
				displayName: 'Billing City',
				name: 'billingCity',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 40 characters.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Text description of the account. Limited to 32,000 KB.',
			},
			{
				displayName: 'Billing State',
				name: 'billingState',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping City',
				name: 'shippingCity',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. City maximum size is 40 characters',
			},
			{
				displayName: 'Account Source',
				name: 'accountSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountSources',
				},
				default: '',
				description: 'The source of the account record',
			},
			{
				displayName: 'Annual Revenue',
				name: 'annualRevenue',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated annual revenue of the account.',
			},
			{
				displayName: 'Billing Street',
				name: 'billingStreet',
				type: 'string',
				default: '',
				description: 'Street address for the billing address of this account.',
			},
			{
				displayName: 'Shipping State',
				name: 'shippingState',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. State maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Country',
				name: 'billingCountry',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Street',
				name: 'shippingStreet',
				type: 'string',
				default: '',
				description: 'The street address of the shipping address for this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Shipping Country',
				name: 'shippingCountry',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Country maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Postal Code',
				name: 'billingPostalCode',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 20 characters.',
			},
			{
				displayName: 'Number Of Employees',
				name: 'numberOfEmployees',
				type: 'integer',
				default: '',
				description: 'Number of employees',
			},
			{
				displayName: 'Shipping Postal Code',
				name: 'shippingPostalCode',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Postal code maximum size is 20 characters.',
			},
		],
	},
/* -------------------------------------------------------------------------- */
/*                                 account:update                             */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'update',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'update',
				],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the account. Maximum size is 255 characters.',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Fax number for the account.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccountTypes',
				},
				description: 'Type of account',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the account.',
			},
			{
				displayName: 'Jigsaw',
				name: 'jigsaw',
				type: 'string',
				default: '',
				description: 'references the ID of a company in Data.com',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the account.',
			},
			{
				displayName: 'SicDesc',
				name: 'sicDesc',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				description: 'A brief description of an organization’s line of business, based on its SIC code.',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'The website of this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Parent Id',
				name: 'parentId',
				type: 'string',
				default: '',
				description: 'ID of the parent object, if any.',
			},
			{
				displayName: 'Billing City',
				name: 'billingCity',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 40 characters.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				description: 'Text description of the account. Limited to 32,000 KB.',
			},
			{
				displayName: 'Billing State',
				name: 'billingState',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping City',
				name: 'shippingCity',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. City maximum size is 40 characters',
			},
			{
				displayName: 'Account Source',
				name: 'accountSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccountSources',
				},
				default: '',
				description: 'The source of the account record',
			},
			{
				displayName: 'Annual Revenue',
				name: 'annualRevenue',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated annual revenue of the account.',
			},
			{
				displayName: 'Billing Street',
				name: 'billingStreet',
				type: 'string',
				default: '',
				description: 'Street address for the billing address of this account.',
			},
			{
				displayName: 'Shipping State',
				name: 'shippingState',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. State maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Country',
				name: 'billingCountry',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 80 characters.',
			},
			{
				displayName: 'Shipping Street',
				name: 'shippingStreet',
				type: 'string',
				default: '',
				description: 'The street address of the shipping address for this account. Maximum of 255 characters.',
			},
			{
				displayName: 'Shipping Country',
				name: 'shippingCountry',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Country maximum size is 80 characters.',
			},
			{
				displayName: 'Billing Postal Code',
				name: 'billingPostalCode',
				type: 'string',
				default: '',
				description: 'Details for the billing address of this account. Maximum size is 20 characters.',
			},
			{
				displayName: 'Number Of Employees',
				name: 'numberOfEmployees',
				type: 'integer',
				default: '',
				description: 'Number of employees',
			},
			{
				displayName: 'Shipping Postal Code',
				name: 'shippingPostalCode',
				type: 'string',
				default: '',
				description: 'Details of the shipping address for this account. Postal code maximum size is 20 characters.',
			},
		],
	},

/* -------------------------------------------------------------------------- */
/*                                  account:get                               */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'get',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                  account:delete                            */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'delete',
				]
			},
		},
		description: 'Id of account that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                 account:getAll                             */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
			},
		},
		default: false,
		description: 'If all results should be returned or only up to a given limit.',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'How many results to return.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'account',
				],
				operation: [
					'getAll',
				],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				description: 'Fields to include separated by ,',
			},
		]
	},
] as INodeProperties[];
