import { IExecuteFunctions } from 'n8n-core';

import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { PdfData, VerbosityLevel } from 'pdfdataextract';

export class ReadPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Read PDF',
		name: 'readPDF',
		icon: 'fa:file-pdf',
		group: ['input'],
		version: 1,
		description: 'Reads a PDF and extracts its content',
		defaults: {
			name: 'Read PDF',
			color: '#003355',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'readPDF',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				description: 'Name of the binary property from which to read the PDF file.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('readPDF');

		const returnData: INodeExecutionData[] = [];
		const length = items.length as unknown as number;
		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < length; itemIndex++) {

			try{

				item = items[itemIndex];
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex) as string;

				if (item.binary === undefined) {
					item.binary = {};
				}

				const binaryData = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
				const jsonResult = await PdfData.extract(binaryData, {
					password: credentials.password
				});
				returnData.push({
					binary: item.binary,
					json: {
						numpages : jsonResult.pages,
  					version: '2.10.377',
  					numrender: jsonResult.text.length,
  					fingerprint: jsonResult.fingerprint,
  					outline: jsonResult.outline,
  					permissions: jsonResult.permissions,
  					text: jsonResult.text.join('\n\n')
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({json:{ error: error.message }});
					continue;
				}
				throw error;
			}
		}
		return this.prepareOutputData(returnData);
	}

}
