import Theme from '../constants/Theme';
import DataStructure from './data-structure';
import RelativePoint from './relative-point';

class StackBox {
	points;
	curr = 0;
	val;
	push;
	constructor(points = [], val = '', push = true) {
		this.points = points;
		this.val = val;
		this.push = push;
	}
}

export default class Stack extends DataStructure {
	datasetCache;
	dataset;
	stackWidth = 100;
	stackHeight;
	boxWidth = 90;
	boxHeight = 40;
	beizerSpeed = 0.05;
	edges = [];
	current_edge = 0;
	maxHeight = 50;
	prev = new RelativePoint(0, 0, 0, 0);
	animationQueue = [];
	boxes = [];

	constructor() {
		super();
	}

	Parse(input) {
		this.dataset = input.slice(0, 5);

		this.stackHeight = this.cs.canvas.height - 100;
	}

	Plot() {
		this.Draw();
	}

	Draw() {
		this.ClearCanvas();
		this.DrawStack();
		this.DrawBoxes();
		this.AnimateStackPush();
	}

	DrawStack() {
		let x = this.cs.canvas.width / 2 - 50;
		let y = 50;
		this.cs.ctx.strokeStyle = '#AAA';

		this.cs.ctx.beginPath();
		this.cs.ctx.moveTo(x, y);
		this.cs.ctx.lineTo(x, this.stackHeight + 50);
		this.cs.ctx.moveTo(x, this.stackHeight + 50);
		this.cs.ctx.lineTo(x + this.stackWidth, this.stackHeight + 50);
		this.cs.ctx.moveTo(x + this.stackWidth, this.stackHeight + 50);
		this.cs.ctx.lineTo(x + this.stackWidth, 50);
		this.cs.ctx.stroke();
		this.cs.ctx.closePath();
	}

	DrawBoxes() {
		for (let i = 0; i < this.dataset.length; i++) {
			let x = this.cs.canvas.width / 2 - 45;
			let y = this.cs.canvas.height - (50 + (i + 1) * (this.boxHeight + 2));

			let p0 = { x: 10, y: 10 };
			let p1 = { x: this.cs.canvas.width / 2 - 45, y: 10 + (y - 10) / 4 };
			let p2 = { x: this.cs.canvas.width / 2 - 45, y: y - (y - 10) / 4 };
			let p3 = {
				x: this.cs.canvas.width / 2 - 45,
				y: this.cs.canvas.height - (50 + (i + 1) * (this.boxHeight + 4)) + 12
			};

			let points = [];

			for (var j = 0; j < 1; j += this.beizerSpeed) {
				var p = this.Bezier(j, p0, p1, p2, p3);
				points.push(
					new RelativePoint(
						p.x,
						p.y,
						this.cs.canvas.width,
						this.cs.canvas.height
					)
				);
			}

			let box = new StackBox(points, this.dataset[i]);

			this.EnqueueAnimation(box);
		}
	}

	Push() {
		if (this.dataset == null || this.dataset == undefined) {
			this.dataset = [1];
			this.ui.currInput = JSON.stringify(this.dataset);
			this.ui.validate();
			this.ui.draw();
		} else if (this.dataset.length <= 4) {
			this.dataset.push(this.dataset.length + 1);
			this.ui.currInput = JSON.stringify(this.dataset);
			this.ui.validate();

			let i = this.dataset.length - 1;

			let y = this.cs.canvas.height - (50 + (i + 1) * (this.boxHeight + 2));

			let p0 = { x: 10, y: 10 };
			let p1 = { x: this.cs.canvas.width / 2 - 45, y: 10 + (y - 10) / 4 };
			let p2 = { x: this.cs.canvas.width / 2 - 45, y: y - (y - 10) / 4 };
			let p3 = {
				x: this.cs.canvas.width / 2 - 45,
				y: this.cs.canvas.height - (50 + (i + 1) * (this.boxHeight + 4)) + 12
			};

			let points = [];

			for (var j = 0; j < 1; j += this.beizerSpeed) {
				var p = this.Bezier(j, p0, p1, p2, p3);
				points.push(
					new RelativePoint(
						p.x,
						p.y,
						this.cs.canvas.width,
						this.cs.canvas.height
					)
				);
			}

			let box = new StackBox(
				points,
				this.dataset[this.dataset.length - 1],
				true
			);

			this.EnqueueAnimation(box);
		}
	}

	Pop() {
		if (this.dataset.length == 0) {
			return;
		}
		let i = this.dataset.length - 1;
		let y = this.cs.canvas.height - (50 + (i + 1) * (this.boxHeight + 2));

		let box = this.boxes.pop();

		let p0 = { x: this.cs.canvas.width - 10, y: 10 };
		let p1 = { x: this.cs.canvas.width / 2 + 45, y: 10 + (y - 10) / 4 };
		let p2 = { x: this.cs.canvas.width / 2 + 45, y: y - (y - 10) / 4 };
		let p3 = {
			x: box.points[box.points.length - 1].x,
			y: box.points[box.points.length - 1].y
		};

		let points = [];

		for (var j = 0; j < 1; j += this.beizerSpeed) {
			var p = this.Bezier(j, p3, p2, p1, p0);
			points.push(
				new RelativePoint(p.x, p.y, this.cs.canvas.width, this.cs.canvas.height)
			);
		}

		this.dataset.pop();

		this.ui.currInput = JSON.stringify(this.dataset);
		this.ui.validate();

		box.points = points;
		box.curr = 0;
		box.push = false;

		this.EnqueueAnimation(box);
	}

	EnqueueAnimation(box) {
		if (!this.anime.enabled) {
			this.cs.ctx.fillStyle = Theme.NodeColor;
			this.cs.ctx.fillRect(
				box.points[box.points.length - 1].x - 1,
				box.points[box.points.length - 1].y - 1,
				this.boxWidth + 2,
				this.boxHeight
			);

			this.cs.ctx.fillStyle = this.nodeFontColor;
			this.cs.ctx.font = `${this.nodeFontSize} ${this.nodeFontFamily}`;
			this.cs.ctx.textAlign = 'center';
			this.cs.ctx.fillText(
				box.val,
				box.points[box.points.length - 1].x + this.boxWidth / 2 - 2,
				box.points[box.points.length - 1].y + this.boxHeight / 2 + 3
			);

			return;
		}

		this.animationQueue.push(box);

		if (this.anime.IsInactive()) {
			this.anime.Request(
				this.AnimateStackPush.bind(this, this.animationQueue.shift())
			);
		}
	}
	AnimateStackPush(box = null) {
		if (!box) {
			return;
		}
		if (box.curr < box.points.length) {
			this.cs.ctx.beginPath();

			if (box.curr > 0) {
				this.cs.ctx.clearRect(
					box.points[box.curr - 1].x - 1,
					box.points[box.curr - 1].y - 1,
					this.boxWidth + 2,
					this.boxHeight + 2
				);
			}

			let x = this.cs.canvas.width / 2 - 50;
			let y = 50;
			this.cs.ctx.strokeStyle = '#CCC';

			this.cs.ctx.beginPath();
			this.cs.ctx.moveTo(x, y);
			this.cs.ctx.lineTo(x, this.stackHeight + 50);
			this.cs.ctx.moveTo(x + 100, y);
			this.cs.ctx.lineTo(x + 100, this.stackHeight + 50);
			this.cs.ctx.stroke();

			this.cs.ctx.fillStyle = Theme.NodeColor;
			this.cs.ctx.fillRect(
				box.points[box.curr].x,
				box.points[box.curr].y,
				this.boxWidth,
				this.boxHeight
			);

			this.cs.ctx.closePath();

			box.curr += 1;

			this.anime.Request(this.AnimateStackPush.bind(this, box));
		} else {
			this.anime.Cancel();
			if (box.push) this.boxes.push(box);

			if (box.push) {
				this.cs.ctx.fillStyle = 'black';
				this.cs.ctx.font = '10px monospace';
				this.cs.ctx.textAlign = 'center';
				this.cs.ctx.fillText(
					box.val,
					box.points[box.points.length - 1].x + this.boxWidth / 2 - 2,
					box.points[box.points.length - 1].y + this.boxHeight / 2 + 3
				);
			} else if (!box.push) {
				// this.cs.ctx.fillStyle = this.canvasBgColor;
				this.cs.ctx.clearRect(
					box.points[box.curr - 1].x - 1,
					box.points[box.curr - 1].y - 1,
					this.boxWidth + 2,
					this.boxHeight + 2
				);
			}

			if (this.animationQueue.length) {
				let next = this.animationQueue.shift();
				this.anime.Request(this.AnimateStackPush.bind(this, next));
			}
		}
	}

	Bezier(t, p0, p1, p2, p3) {
		var cX = 3 * (p1.x - p0.x),
			bX = 3 * (p2.x - p1.x) - cX,
			aX = p3.x - p0.x - cX - bX;

		var cY = 3 * (p1.y - p0.y),
			bY = 3 * (p2.y - p1.y) - cY,
			aY = p3.y - p0.y - cY - bY;

		var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
		var y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

		return { x: x, y: y };
	}

	VariantChanged(togglename) {}
}
