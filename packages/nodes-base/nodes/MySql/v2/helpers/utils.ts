import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { deepCopy } from 'n8n-workflow';

export function copyInputItems(items: INodeExecutionData[], properties: string[]): IDataObject[] {
	// Prepare the data to insert and copy it to be returned
	let newItem: IDataObject;
	return items.map((item) => {
		newItem = {};
		for (const property of properties) {
			if (item.json[property] === undefined) {
				newItem[property] = null;
			} else {
				newItem[property] = deepCopy(item.json[property]);
			}
		}
		return newItem;
	});
}

export const prepareQueryAndReplacements = (query: string, replacements: string[]) => {
	// in UI for replacements we use syntax identical to Postgres Query Replacement, but we need to convert it to mysql2 replacement syntax
	let newQuery: string = query;
	const newValues: string[] = [];

	const regex = /\$(\d+)(?::name)?/g;
	const matches = query.match(regex) || [];

	for (const match of matches) {
		if (match.includes(':name')) {
			const matchIndex = Number(match.replace('$', '').replace(':name', '')) - 1;
			newQuery = newQuery.replace(match, `\`${replacements[matchIndex]}\``);
		} else {
			const matchIndex = Number(match.replace('$', '')) - 1;
			newQuery = newQuery.replace(match, '?');
			newValues.push(replacements[matchIndex]);
		}
	}

	return { newQuery, newValues };
};
