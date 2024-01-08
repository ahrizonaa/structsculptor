import { Tabs } from '../constants/Tabs';
import { Graph } from '../classes/graph';
import { Tree } from '../classes/tree';
import { Stack } from '../classes/stack';
import { Queue } from '../classes/queue';
import { LinkedList } from '../classes/linkedlist';
import { Theme } from '../constants/Theme';

import fontColorContrast from 'better-font-color-contrast';

class UserInteractionService {
	tabs = Tabs;
	currTab = this.tabs[0];
	currFormat = this.currTab.options.formats[0];
	currInput = '';
	autoRefreshDisabled = true;
	refreshDisabled = false;
	currError = '';
	currDS;
	hasDrawing = false;

	constructor() {
		this.tabChanged();
	}

	parse(str) {
		return JSON.parse(str, function (k, v) {
			return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
		});
	}

	tabChanged() {
		if (this.currDS) {
			this.currDS.ClearCanvas();
		}
		switch (this.currTab.title) {
			case 'Graph':
				this.currDS = new Graph(this);
				break;
			case 'Tree':
				this.currDS = new Tree(this);
				break;
			case 'Stack':
				this.currDS = new Stack(this);
				break;
			case 'Queue':
				this.currDS = new Queue(this);
				break;
			case 'LinkedList':
				this.currDS = new LinkedList(this);
				break;
			default:
				break;
		}
		if (this.validate()) {
			this.draw();
		}
	}

	draw() {
		let input = this.parse(this.currInput);
		if (input) {
			this.hasDrawing = true;
			this.currDS.Parse(input);
			this.currDS.Plot();
		}
	}

	formatChanged() {
		this.refresh();
	}

	variantChanged(togglename) {
		this.currDS.VariantChanged(togglename);
		this.refresh();
	}

	operationClicked(operation) {
		if (operation == 'Push') {
			this.currDS.Push();
		} else if (operation == 'Pop') {
			this.currDS.Pop();
		} else if (operation == 'Enqueue') {
			this.currDS.Enqueue();
		} else if (operation == 'Dequeue') {
			this.currDS.Dequeue();
		}
	}

	exampleClicked(example) {
		this.currInput = JSON.stringify(example.dataset);

		for (let option of Object.keys(example.options)) {
			this.currTab.options.toggles[option] = example.options[option];
		}
		this.currFormat = example.format;

		this.refresh();
	}

	colorChanged(color, name) {
		if (name == 'Node') {
			Theme.NodeColor = color;
			Theme.NodeFontColor = fontColorContrast(Theme.NodeColor);
		} else if (name == 'Edge') {
			Theme.EdgeColor = color;
		} else if (name == 'BG') {
			Theme.BackgroundColor = color;
			Theme.ChangeBackground(color);
		}
		this.refresh();
	}

	refresh() {
		if (this.validate()) {
			this.currError = '';
			this.tabChanged();
		} else {
		}
	}

	validate() {
		let result = this.validator.isValid(this);

		if (result === true) {
			this.currError = '';
			return true;
		} else {
			this.currError = result;
			return false;
		}
	}
}

const UI = new UserInteractionService();

export default UI;
