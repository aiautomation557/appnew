import { ExpressionParser } from 'n8n-workflow';

export const isExpression = (expr: string) => expr.startsWith('=');

export const isTestableExpression = (expr: string) => {
	return ExpressionParser.splitExpression(expr).every((c) => {
		if (c.type === 'text') {
			return true;
		}

		console.log(expr, c, /\$secrets(\.[a-zA-Z0-9_]+)+$/.test(c.text.trim()));
		return /\$secrets(\.[a-zA-Z0-9_]+)+$/.test(c.text.trim());
	});
};
