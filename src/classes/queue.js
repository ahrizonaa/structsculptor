import Theme from '../constants/Theme';
import DataStructure from './data-structure';
import RelativePoint from './relative-point';

class QueueBox {
	points;
	curr = 0;
	val;
	enqueue;
	dequeue;
	shift;
	constructor(
		points = [],
		val = '',
		enqueue = true,
		dequeue = false,
		shift = false
	) {
		this.points = points;
		this.val = val;
		this.enqueue = enqueue;
		this.dequeue = dequeue;
		this.shift = shift;
	}

	set(op) {
		this.enqueue = op == 'enqueue';
		this.dequeue = op == 'dequeue';
		this.shift = op == 'shift';
	}
}

export default class Queue extends DataStructure {
	datasetCache;
	dataset;
	queueWidth = 100;
	queueHeight;
	boxWidth = 40;
	boxHeight = 90;
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
		this.queueWidth = this.cs.canvas.width - 100;
		this.queueHeight = 100;
	}

	Plot() {
		this.ClearCanvas();
		this.Draw();
	}

	Draw() {
		this.DrawQueue();
		this.DrawBoxes();
		this.AnimateStackPush.bind(this);
		this.AnimateStackPush();
	}

	DrawQueue() {
		let x = this.cs.canvas.width - this.queueWidth - 50;
		let y = this.cs.canvas.height / 2 - this.queueHeight / 2;
		this.cs.ctx.strokeStyle = '#CCC';

		this.cs.ctx.beginPath();
		this.cs.ctx.moveTo(x, y);
		this.cs.ctx.lineTo(x + this.queueWidth, y);
		this.cs.ctx.moveTo(x, y + 100);
		this.cs.ctx.lineTo(x + this.queueWidth, y + 100);
		this.cs.ctx.stroke();
		this.cs.ctx.closePath();
	}

	DrawBoxes() {
		for (let i = 0; i < this.dataset.length; i++) {
			let x = 52.5 + i * (this.boxWidth + 2.5);
			let y = this.cs.canvas.height / 2 - 45;

			let p0 = new RelativePoint(
				this.cs.canvas.width - 5 - this.boxWidth,
				y,
				this.cs.canvas.width,
				this.cs.canvas.height
			);
			let p1 = new RelativePoint(
				x,
				y,
				this.cs.canvas.width,
				this.cs.canvas.height
			);

			let points = this.math.SegmentLine(p0, p1, 25);

			let box = new QueueBox(points, this.dataset[i]);

			this.EnqueueAnimation(box);
		}
	}

	Enqueue() {
		if (this.anime.IsActive()) {
			return;
		}
		if (this.dataset == undefined) {
			this.dataset = [1];
			this.ui.currInput = JSON.stringify(this.dataset);
			this.ui.validate();
			this.ui.draw();
		} else if (this.dataset.length <= 4) {
			this.dataset.push(this.dataset.length + 1);
			this.ui.currInput = JSON.stringify(this.dataset);
			this.ui.validate();

			let i = this.dataset.length - 1;

			let x = 52.5 + i * (this.boxWidth + 2.5);
			let y = this.cs.canvas.height / 2 - 45;

			let p0 = new RelativePoint(
				this.cs.canvas.width - 5 - this.boxWidth,
				y,
				this.cs.canvas.width,
				this.cs.canvas.height
			);

			let p1 = new RelativePoint(
				x,
				y,
				this.cs.canvas.width,
				this.cs.canvas.height
			);

			let points = this.math.SegmentLine(p0, p1, 25);

			let box = new QueueBox(points, this.dataset[i]);
			box.set('enqueue');

			this.EnqueueAnimation(box);
		}
	}

	Dequeue() {
		if (this.dataset == undefined || this.dataset.length == 0) {
			return;
		}
		if (this.anime.IsActive()) {
			return;
		}
		let y = this.cs.canvas.height / 2 - 45;
		let box = this.boxes.shift();

		let p0 = new RelativePoint(
			10,
			y,
			this.cs.canvas.width,
			this.cs.canvas.height
		);
		let p1 = new RelativePoint(
			box.points[box.points.length - 1].x,
			box.points[box.points.length - 1].y,
			this.cs.canvas.width,
			this.cs.canvas.height
		);

		let points = this.math.SegmentLine(p1, p0, 25);

		this.dataset.shift();
		this.ui.currInput = JSON.stringify(this.dataset);
		this.ui.validate();

		box.points = points;
		box.curr = 0;
		box.set('dequeue');

		this.EnqueueAnimation(box);

		this.QueueShift();
	}

	QueueShift() {
		for (let i = 0; i < this.dataset.length; i++) {
			let x0 = 2.5 + i * (this.boxWidth + 2.5) + 50;
			let y = this.cs.canvas.height / 2 - 45;
			let p0 = new RelativePoint(
				x0,
				y,
				this.cs.canvas.width,
				this.cs.canvas.height
			);

			let p1 = this.boxes[i].points[this.boxes[i].points.length - 1];

			let points = this.math.SegmentLine(p1, p0, (i + 1) * 5);

			this.boxes[i].points = points;
			this.boxes[i].curr = 0;
			this.boxes[i].set('shift');
			this.EnqueueAnimation(this.boxes[i]);
		}
	}

	EnqueueAnimation(box) {
		if (!this.anime.enabled) {
			this.cs.ctx.fillStyle = Theme.NodeColor;
			this.cs.ctx.fillRect(
				box.points[box.points.length - 1].x - 1,
				box.points[box.points.length - 1].y - 1,
				this.boxWidth,
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
			if (box.enqueue) {
				this.boxes.push(box);
			}

			if (box.enqueue || box.shift) {
				this.cs.ctx.beginPath();
				this.cs.ctx.fillStyle = this.nodeFontColor;
				this.cs.ctx.font = `${this.nodeFontSize} ${this.nodeFontFamily}`;
				this.cs.ctx.textAlign = 'center';
				this.cs.ctx.fillText(
					box.val,
					box.points[box.points.length - 1].x + this.boxWidth / 2 - 2,
					box.points[box.points.length - 1].y + this.boxHeight / 2 + 3
				);
				this.cs.ctx.closePath();
			} else if (box.dequeue) {
				this.cs.ctx.clearRect(
					box.points[box.curr - 1].x - 1,
					box.points[box.curr - 1].y - 1,
					this.boxWidth + 2,
					this.boxHeight + 2
				);
			} else if (box.shift) {
			}

			if (this.animationQueue.length) {
				let next = this.animationQueue.shift();
				this.anime.Request(this.AnimateStackPush.bind(this, next));
			}
		}
	}

	VariantChanged(togglename) {}
}
