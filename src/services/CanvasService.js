class CanvasService {
	canvas = undefined;
	ctx = undefined;

	intervalID;

	constructor() {
		this.intervalID = setInterval(() => {
			let result = document.getElementById('canvas-main');
			if (result && result.tagName == 'CANVAS') {
				clearInterval(this.intervalID);
				this.canvas = result;
				this.ctx = this.canvas.getContext('2d');
				let parent = document.querySelector('canvas-view.canvas-view');
				this.canvas.width = parent.offsetWidth;
				this.canvas.height = parent.offsetHeight;
			}
		}, 100);
	}

	ClearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

const CS = new CanvasService();

export default CS;
