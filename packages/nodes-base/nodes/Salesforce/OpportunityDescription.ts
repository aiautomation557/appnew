import { INodeProperties } from 'n8n-workflow';

export const opportunityOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an opportunity',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an opportunity',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an opportunity',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: `Returns an overview of opportunity's metadata.`,
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all opportunitys',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an opportunity',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const opportunityFields = [

/* -------------------------------------------------------------------------- */
/*                                opportunity:create                                 */
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
					'opportunity',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'Required. Last name of the opportunity. Limited to 80 characters.',
	},
	{
		displayName: 'Close Date',
		name: 'closeDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'Required. Date when the opportunity is expected to close.',
	},
	{
		displayName: 'Stage Name',
		name: 'stageName',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getStages'
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
				operation: [
					'create',
				]
			},
		},
		description: 'Required. Date when the opportunity is expected to close.',
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
					'opportunity',
				],
				operation: [
					'create',
				],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Business',
						valie: 'Business',
					},
					{
						name: 'New Business',
						valie: 'New Business',
					},
				],
				description: 'Type of opportunity. For example, Existing Business or New Business. Label is Opportunity Type.',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated total sale amount',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the opportunity.',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the opportunity.',
			},
			{
				displayName: 'Next Step',
				name: 'nextStep',
				type: 'string',
				default: '',
				description: 'Description of next task in closing opportunity. Limit: 255 characters.',
			},
			{
				displayName: 'Account',
				name: 'accountId',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				description: 'ID of the account associated with this opportunity.',
			},
			{
				displayName: 'Campaign',
				name: 'campaignId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCampaigns',
				},
				default: '',
				description: 'Id of the campaign that needs to be fetched',
			},
			{
				displayName: 'Lead Source',
				name: 'leadSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLeadSources',
				},
				default: '',
				description: 'Source from which the lead was obtained.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the opportunity. Label is Contact Description. Limit: 32 KB.',
			},
			{
				displayName: 'Probability',
				name: 'probability',
				type: 'number',
				typeOptions: {
					numberPrecision: 1,
				},
				default: '',
				description: 'Percentage of estimated confidence in closing the opportunity',
			},
			{
				displayName: 'Pricebook2 Id',
				name: 'pricebook2Id',
				type: 'string',
				default: '',
				description: 'ID of a related Pricebook2 object',
			},
			{
				displayName: 'Forecast Category Name',
				name: 'forecastCategoryName',
				type: 'string',
				default: '',
				description: 'It is implied, but not directly controlled, by the StageName field',
			},
		],
	},
/* -------------------------------------------------------------------------- */
/*                                 opportunity:update                                */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
				operation: [
					'update',
				]
			},
		},
		description: 'Id of opportunity that needs to be fetched',
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
					'opportunity',
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
				description: 'Required. Last name of the opportunity. Limited to 80 characters.',
			},
			{
				displayName: 'Close Date',
				name: 'closeDate',
				type: 'dateTime',
				default: '',
				description: 'Required. Date when the opportunity is expected to close.',
			},
			{
				displayName: 'Stage Name',
				name: 'stageName',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getStages'
				},
				default: '',
				description: 'Required. Date when the opportunity is expected to close.',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Business',
						valie: 'Business',
					},
					{
						name: 'New Business',
						valie: 'New Business',
					},
				],
				description: 'Type of opportunity. For example, Existing Business or New Business. Label is Opportunity Type.',
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				default: '',
				description: 'Estimated total sale amount',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for the opportunity.',
			},
			{
				displayName: 'Owner',
				name: 'ownerId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'The owner of the opportunity.',
			},
			{
				displayName: 'Next Step',
				name: 'nextStep',
				type: 'string',
				default: '',
				description: 'Description of next task in closing opportunity. Limit: 255 characters.',
			},
			{
				displayName: 'Account',
				name: 'accountId',
				type: 'options',
				default: '',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				description: 'ID of the account associated with this opportunity.',
			},
			{
				displayName: 'Campaign',
				name: 'campaignId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCampaigns',
				},
				default: '',
				description: 'Id of the campaign that needs to be fetched',
			},
			{
				displayName: 'Lead Source',
				name: 'leadSource',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLeadSources',
				},
				default: '',
				description: 'Source from which the lead was obtained.',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the opportunity. Label is Contact Description. Limit: 32 KB.',
			},
			{
				displayName: 'Probability',
				name: 'probability',
				type: 'number',
				typeOptions: {
					numberPrecision: 1,
				},
				default: '',
				description: 'Percentage of estimated confidence in closing the opportunity',
			},
			{
				displayName: 'Pricebook2 Id',
				name: 'pricebook2Id',
				type: 'string',
				default: '',
				description: 'ID of a related Pricebook2 object',
			},
			{
				displayName: 'Forecast Category Name',
				name: 'forecastCategoryName',
				type: 'string',
				default: '',
				description: 'It is implied, but not directly controlled, by the StageName field',
			},
		],
	},

/* -------------------------------------------------------------------------- */
/*                                  opportunity:get                                  */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
				operation: [
					'get',
				]
			},
		},
		description: 'Id of opportunity that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                  opportunity:delete                               */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Opportunity ID',
		name: 'opportunityId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
				],
				operation: [
					'delete',
				]
			},
		},
		description: 'Id of opportunity that needs to be fetched',
	},
/* -------------------------------------------------------------------------- */
/*                                 opportunity:getAll                                */
/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'opportunity',
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
					'opportunity',
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
					'opportunity',
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
