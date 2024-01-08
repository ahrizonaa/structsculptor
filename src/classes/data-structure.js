import Theme from '../services/ThemeService';
import Maths from '../services/MathService';
import Anime from '../services/AnimeService';
import CS from '../services/CanvasService';
import UI from '../services/UserInteractionService';

export default class DataStructure {
	ui;
	math;
	anime;
	cs;
	canvasBgColor = '#31313100';
	maxCellSize = 50;
	maxRadius = 50;
	minRadius = 11;
	edgeColor = Theme.EdgeColor;
	nodeColor = Theme.NodeColor;
	nodeFontSize = Theme.NodeFontSize;
	nodeFontFamily = Theme.NodeFontFamily;
	nodeFontColor = Theme.NodeFontColor;

	constructor() {
		this.math = Maths;
		this.anime = Anime;
		this.cs = CS;
		this.ui = UI;
	}

	ClearCanvas() {
		this.cs.ClearCanvas();
	}
}
