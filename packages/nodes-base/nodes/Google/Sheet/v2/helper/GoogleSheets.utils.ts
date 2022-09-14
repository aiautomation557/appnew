import { RangeDetectionOptions, ROW_NUMBER, SheetRangeData } from './GoogleSheets.types';

// Used to extract the ID from the URL
export function getSpreadsheetId(resourceType: string, value: string): string {
	if (resourceType === 'byUrl') {
		const regex = /([-\w]{25,})/;
		const parts = value.match(regex);
		if (parts == null || parts.length < 2) {
			return '';
		} else {
			return parts[0];
		}
	}
	// If it is byID or byList we can just return
	return value;
}

// Convert number to Sheets / Excel column name
export function getColumnName(colNumber: number): string {
	const baseChar = 'A'.charCodeAt(0);
	let letters = '';
	do {
		colNumber -= 1;
		letters = String.fromCharCode(baseChar + (colNumber % 26)) + letters;
		colNumber = (colNumber / 26) >> 0;
	} while (colNumber > 0);

	return letters;
}

// Convert Column Name to Number (A = 1, B = 2, AA = 27)
export function getColumnNumber(colPosition: string): number {
	let colNum = 0;
	for (let i = 0; i < colPosition.length; i++) {
		colNum *= 26;
		colNum += colPosition[i].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
	}
	return colNum;
}

// Hex to RGB
export function hexToRgb(hex: string) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, (m, r, g, b) => {
		return r + r + g + g + b + b;
	});

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	if (result) {
		return {
			red: parseInt(result[1], 16),
			green: parseInt(result[2], 16),
			blue: parseInt(result[3], 16),
		};
	} else {
		return null;
	}
}

export function addRowNumber(data: SheetRangeData) {
	if (data.length === 0) return data;
	const sheetData = data.map((row, i) => [i + 1, ...row]);
	sheetData[0][0] = ROW_NUMBER;
	return sheetData;
}

export function trimToFirstEmptyRow(data: SheetRangeData, includesRowNumber = true) {
	const baseLength = includesRowNumber ? 1 : 0;
	const emtyRowIndex = data.findIndex((row) => row.length === baseLength);
	if (emtyRowIndex === -1) {
		return data;
	}
	return data.slice(0, emtyRowIndex);
}

export function trimLeadingEmptyRows(
	data: SheetRangeData,
	includesRowNumber = true,
	rowNumbersColumnName = 'row_number',
) {
	const baseLength = includesRowNumber ? 1 : 0;
	const firstNotEmptyRowIndex = data.findIndex((row) => row.length > baseLength);

	let returnData = [...data];
	if (firstNotEmptyRowIndex === -1) {
		return returnData;
	} else {
		returnData = returnData.slice(firstNotEmptyRowIndex);
	}
	if (includesRowNumber) {
		returnData[0][0] = rowNumbersColumnName;
	}
	return returnData;
}

export function trimLeadingEmptyColumns(data: SheetRangeData, includesRowNumber = true) {
	const firstColumnIndex = includesRowNumber ? 1 : 0;
	const returnData = [...data];
	const longestRow = data.reduce((a, b) => (a.length > b.length ? a : b), []).length;
	for (let columnIndex = 1; columnIndex < longestRow; columnIndex++) {
		for (const row of returnData) {
			if (row[firstColumnIndex] || typeof row[firstColumnIndex] === 'number') {
				return returnData;
			}
		}
		returnData.forEach((row) => row.splice(firstColumnIndex, 1));
	}
	return returnData;
}

export function prepareSheetData(
	data: SheetRangeData,
	options: RangeDetectionOptions,
	addRowNumbersToData = true,
) {
	let returnData = [...(data || [])];

	let headerRow = 0;
	let firstDataRow = 1;

	if (addRowNumbersToData) {
		returnData = addRowNumber(returnData);
	}

	if (options.rangeDefinition === 'detectAutomatically') {
		returnData = trimLeadingEmptyRows(returnData, addRowNumbersToData);
		returnData = trimLeadingEmptyColumns(returnData, addRowNumbersToData);
	}

	if (
		options.readRowsUntil === 'firstEmptyRow' &&
		options.rangeDefinition === 'detectAutomatically'
	) {
		returnData = trimToFirstEmptyRow(returnData, addRowNumbersToData);
	}

	if (options.rangeDefinition === 'specifyRange') {
		headerRow = parseInt(options.headerRow as string, 10) - 1;
		firstDataRow = parseInt(options.firstDataRow as string, 10) - 1;
	}

	return { data: returnData, headerRow, firstDataRow };
}

export function getRangeString(sheetName: string, options: RangeDetectionOptions) {
	if (options.rangeDefinition === 'specifyRange') {
		return options.range ? `${sheetName}!${options.range as string}` : `${sheetName}!A:F`;
	}
	return sheetName;
}
