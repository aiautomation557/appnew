import { BasePage } from "../base";
import { INodeTypeDescription } from '../../packages/workflow';

export class NodeCreator extends BasePage {
	url = '/workflow/new';
	getters = {
		plusButton: () => cy.getByTestId('node-creation-plus'),
		canvasAddButton: () => cy.getByTestId('canvas-add-button'),
		searchBar: () => cy.getByTestId('search-bar'),
		getCreatorItem: (label: string) => this.getters.creatorItem().contains(label).parents('[data-test-id="item-iterator-item"]'),
		getNthCreatorItem: (n: number) => this.getters.creatorItem().eq(n),
		nodeCreator: () => cy.getByTestId('node-creator'),
		nodeCreatorTabs: () => cy.getByTestId('node-creator-type-selector'),
		selectedTab: () => this.getters.nodeCreatorTabs().find('.is-active'),
		categorizedItems: () => cy.getByTestId('categorized-items'),
		creatorItem: () => cy.getByTestId('item-iterator-item'),
		noResults: () => cy.getByTestId('categorized-no-results'),
		activeSubcategory: () => cy.getByTestId('categorized-items-subcategory'),
	};
	actions = {
		openNodeCreator: () => {
			this.getters.plusButton().click();
			this.getters.nodeCreator().should('be.visible')
		},
		selectNthNode: (n: number) => {
			this.getters.getNthCreatorItem(n).click();
		},
		categorizeNodes: (nodes: INodeTypeDescription[]) => {
			const categorizedNodes = nodes.reduce((acc, node) => {
				const categories = (node?.codex?.categories || []).map((category: string) => category.trim());

				categories.forEach((category: {[key: string]: INodeTypeDescription[]}) => {
					// Node creator should show only the latest version of a node
					const newerVersion = nodes.find((n: INodeTypeDescription) => n.name === node.name && (n.version > node.version || Array.isArray(n.version)));

					if (acc[category] === undefined) {
						acc[category] = [];
					}
					acc[category].push(newerVersion ?? node);
				});
				return acc;
			}, {})

			return categorizedNodes;
		}
	};
}
