import Theme from '../constants/Theme';
import DataStructure from './data-structure';
import Edge from './edge';
import RelativePoint from './relative-point';
import TreeNode from './tree-node';

export default class Graph extends DataStructure {
	dataset = [];
	matrix = [];
	graph = {};
	weights = [];
	edgelist = [];
	unique_nodes = new Set();
	node_list = [];
	edges = [];
	radius = NaN;
	cell_size = NaN;
	grid_size = NaN;
	steps = 20;
	current_edge = 0;
	animation_frame_id = NaN;

	constructor() {
		super();
	}

	Parse(input_dataset) {
		this.dataset = input_dataset;
		switch (this.ui.currFormat.name) {
			case 'Adjacency List':
				this.AdjacencyList();
				break;
			case 'Adjacency Matrix':
				this.AdjacencyMatrix();
				break;
			default:
				console.error(`Unknown format: ${this.ui.currFormat.name}`);
				break;
		}

		let dim = Math.min(this.cs.canvas.width, this.cs.canvas.height);

		this.cell_size = dim / this.grid_size;
		this.radius = Math.min(this.maxRadius, this.cell_size * 0.25);
	}

	AdjacencyList() {
		this.edgelist = this.dataset.map((edge) => edge.slice(edge.length - 2));
		this.unique_nodes = new Set(this.edgelist.flat());
		this.node_list = Array.from(this.unique_nodes.values()).sort(
			(a, b) => a - b
		);
		this.grid_size = Math.ceil(Math.sqrt(this.unique_nodes.size));

		for (let i = 0; i < this.grid_size; i++) {
			this.matrix.push(
				this.node_list
					.slice(i * this.grid_size, i * this.grid_size + this.grid_size)
					.map((node) => new TreeNode(node))
			);
		}

		if (this.ui.currTab.options.toggles.Weighted) {
			for (let edge of this.dataset) {
				let key = edge[1] + '_' + edge[2];
				let key_reverse = edge[2] + '_' + edge[1];
				if (key in this.weights) {
					this.weights[key].push(edge[0]);
				} else if (key_reverse in this.weights) {
					this.weights[key_reverse].push(edge[0]);
				} else {
					this.weights[key] = [edge[0]];
				}
			}
		}
	}

	AdjacencyMatrix() {
		this.node_list = Array.from(Array(this.dataset.length).keys()).map(
			(n) => n + 1
		);
		this.unique_nodes = new Set(this.node_list);

		this.grid_size = Math.ceil(Math.sqrt(this.unique_nodes.size));

		for (let row = 0; row < this.dataset.length; row++) {
			for (let col = row + 1; col < this.dataset.length; col++) {
				if (this.dataset[row][col] != 0) {
					let edge = [row + 1, col + 1];
					this.edgelist.push(edge);
					if (this.ui.currTab.options.toggles.Weighted) {
						let key = edge[0] + '_' + edge[1];
						let key_reverse = edge[1] + '_' + edge[0];
						if (key in this.weights) {
							this.weights[key].push(this.dataset[row][col]);
						} else if (key_reverse in this.weights) {
							this.weights[key_reverse].push(this.dataset[row][col]);
						} else {
							this.weights[key] = [this.dataset[row][col]];
						}
					}
				}
			}
		}

		for (let i = 0; i < this.grid_size; i++) {
			this.matrix.push(
				this.node_list
					.slice(i * this.grid_size, i * this.grid_size + this.grid_size)
					.map((node) => new TreeNode(node))
			);
		}
	}

	Plot() {
		this.anime.Cancel();
		this.ClearCanvas();
		this.Draw();
	}

	Draw() {
		this.DrawNodes();
		this.PlotEdges();
		this.DrawEdges();
	}

	DrawNodes() {
		for (let row = 0; row < this.matrix.length; row++) {
			for (let col = 0; col < this.matrix[row].length; col++) {
				let offset_x = Math.floor(Math.random() * (10 - -10 + 1) + -10);
				let offset_y = Math.floor(Math.random() * (10 - -10 + 1) + -10);
				let xr = this.cell_size * row + this.cell_size / 2 + offset_x;
				let yr = this.cell_size * col + this.cell_size / 2 + offset_y;

				if (yr - this.radius <= 0) {
					yr = this.radius;
				}

				this.matrix[row][col].point = new RelativePoint(
					xr,
					yr,
					this.cs.canvas.width,
					this.cs.canvas.height
				);
				this.matrix[row][col].r = this.radius;
				this.graph[this.matrix[row][col].val] = this.matrix[row][col];

				this.cs.ctx.beginPath();
				this.cs.ctx.fillStyle = this.nodeColor;
				this.cs.ctx.arc(xr, yr, this.radius, 0, 2 * Math.PI);
				this.cs.ctx.fill();
				this.cs.ctx.closePath();

				this.cs.ctx.beginPath();
				this.cs.ctx.fillStyle = this.nodeFontColor;
				this.cs.ctx.font = `${this.nodeFontSize} ${this.nodeFontFamily}`;
				this.cs.ctx.textAlign = 'center';
				this.cs.ctx.fillText(String(this.matrix[row][col].val), xr, yr + 3);
				this.cs.ctx.closePath();
			}
		}
	}

	PlotEdges() {
		for (let [from, to] of this.edgelist) {
			let node1 = this.graph[from];
			let node2 = this.graph[to];
			let key_to = from + '_' + to;
			let key_from = to + '_' + from;

			if (
				this.ui.currTab.options.toggles.Weighted &&
				this.weights[key_to].length == 0 &&
				this.weights[key_from].length == 0
			) {
				continue;
			}

			let dist_ratio = this.math.DistanceRatio(
				this.radius,
				node1.point,
				node2.point
			);

			let pr1_edge = this.math.FindPointOnLine(
				node1.point,
				node2.point,
				dist_ratio
			);
			let pr2_edge = this.math.FindPointOnLine(
				node2.point,
				node1.point,
				dist_ratio
			);

			if (this.anime.enabled) {
				this.edges.push(
					Edge.bind(this)(this.math.SegmentLine(pr1_edge, pr2_edge, this.steps))
				);
			} else {
				this.cs.ctx.beginPath();
				this.cs.ctx.strokeStyle = this.edgeColor;
				this.cs.ctx.moveTo(pr1_edge.x, pr1_edge.y);
				this.cs.ctx.lineTo(pr2_edge.x, pr2_edge.y);
				this.cs.ctx.stroke();
				if (this.ui.currTab.options.toggles.Directed) {
					this.PlotArrowHead(pr2_edge, pr1_edge);
				}
			}

			if (this.ui.currTab.options.toggles.Weighted) {
				this.PlotEdgeLabel(node1, node2, key_from, key_to);
			}
		}
	}

	PlotEdgeLabel(node1, node2, key_from, key_to) {
		let mid_point = this.math.Midpoint(node1.point, node2.point);

		let edge_label = this.FormatEdgeLabel(key_to, key_from);

		let slope = this.math.RelativeSlope(node1.point, node2.point);

		let [label_x_offset, label_y_offset] = this.CalculateLabelOffsets(
			slope,
			edge_label
		);

		this.cs.ctx.beginPath();
		this.cs.ctx.fillStyle = '#CCCCCC';
		this.cs.ctx.font = '10px monospace';
		this.cs.ctx.textAlign = 'center';
		this.cs.ctx.fillText(
			edge_label,
			mid_point.x + label_x_offset,
			mid_point.y + label_y_offset
		);
		this.cs.ctx.closePath();
	}

	FormatEdgeLabel(key_to, key_from) {
		let text = '';
		if (this.weights[key_to] || this.weights[key_from]) {
			if (this.weights[key_to].length) {
				text = this.weights[key_to].sort((a, b) => a - b).join(', ');
			} else if (this.weights[key_from].length) {
				text = this.weights[key_from].sort((a, b) => b - a).join(',');
			}
			this.weights[key_to] = [];
			this.weights[key_from] = [];
		}
		return text;
	}

	CalculateLabelOffsets(slope, edge_label) {
		let text_x_offset = 0;
		let text_y_offset = 0;
		if (slope < 0.5) {
			// vertical
			text_x_offset = edge_label.length > 1 ? -(edge_label.length + 10) : -6;
		} else if (slope > 0.5 && slope < 1.5) {
			// diagonal
			text_x_offset = edge_label.length > 1 ? -(edge_label.length + 10) : -6;
		} else if (slope > 3) {
			// horizontal
			text_y_offset = -3;
		}

		return [text_x_offset, text_y_offset];
	}

	DrawEdges() {
		if (!this.anime.enabled || this.anime.cancelling) return;
		let res = this.edges[this.current_edge].next();

		if (res.done == false) {
			let { curr, next } = res.value;
			this.anime.Request(this.DrawEdges.bind(this));

			this.cs.ctx.beginPath();
			this.cs.ctx.strokeStyle = this.edgeColor;
			this.cs.ctx.moveTo(curr.x, curr.y);
			this.cs.ctx.lineTo(next.x, next.y);
			this.cs.ctx.stroke();
		} else if (res.done == true) {
			let { first, last } = res.value;
			this.anime.Cancel();
			this.cs.ctx.closePath();
			this.current_edge += 1;

			if (this.ui.currTab.options.toggles.Directed) {
				this.PlotArrowHead(last, first);
			}

			if (this.current_edge < this.edges.length) {
				this.anime.Request(this.DrawEdges.bind(this));
			}
			return;
		}
	}

	PlotArrowHead(last, first) {
		let centerPoint = last.ToCartesian();

		let a = 30;

		let slope = this.math.CartesianSlope(
			first.ToCartesian(),
			last.ToCartesian()
		);

		let xt1 =
			centerPoint.x +
			Theme.ArrowheadSize * Math.cos(Math.atan(slope) - a * (Math.PI / 180));
		let yt1 =
			centerPoint.y +
			Theme.ArrowheadSize * Math.sin(Math.atan(slope) - a * (Math.PI / 180));

		let targetPoint1 = RelativePoint.FromCartesian(xt1, yt1, last.w, last.h);

		let xt2 =
			centerPoint.x +
			Theme.ArrowheadSize * Math.cos(Math.atan(slope) + a * (Math.PI / 180));
		let yt2 =
			centerPoint.y +
			Theme.ArrowheadSize * Math.sin(Math.atan(slope) + a * (Math.PI / 180));

		let targetPoint2 = RelativePoint.FromCartesian(xt2, yt2, last.w, last.h);

		let distRatio = this.math.DistanceRatio(
			Theme.ArrowheadSize,
			last,
			targetPoint1
		);

		let pr1_edge = this.math.FindPointOnLine(last, targetPoint1, distRatio);

		let pr2_edge = this.math.FindPointOnLine(last, targetPoint2, distRatio);

		let vx = centerPoint.x - pr1_edge.ToCartesian().x;
		let vy = centerPoint.y - pr1_edge.ToCartesian().y;
		let len = Math.sqrt(vx * vx + vy * vy);
		let cx = (vx / len) * Theme.ArrowheadSize + centerPoint.x;
		let cy = (vy / len) * Theme.ArrowheadSize + centerPoint.y;

		let vx2 = centerPoint.x - pr2_edge.ToCartesian().x;
		let vy2 = centerPoint.y - pr2_edge.ToCartesian().y;
		let len2 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
		let cx2 = (vx2 / len2) * Theme.ArrowheadSize + centerPoint.x;
		let cy2 = (vy2 / len2) * Theme.ArrowheadSize + centerPoint.y;
		let cr1 = RelativePoint.FromCartesian(
			cx,
			cy,
			this.cs.canvas.width,
			this.cs.canvas.height
		);
		let cr2 = RelativePoint.FromCartesian(
			cx2,
			cy2,
			this.cs.canvas.width,
			this.cs.canvas.height
		);

		let dp1 = null,
			dp2 = null;

		if (last.y - first.y > 0) {
			//downwards
			if (Math.min(cr1.y, cr2.y) < Math.min(pr1_edge.y, pr2_edge.y)) {
				dp1 = cr1;
				dp2 = cr2;
			} else {
				dp1 = pr1_edge;
				dp2 = pr2_edge;
			}
		} else if (last.y - first.y < 0) {
			// upwards
			if (Math.max(cr1.y, cr2.y) > Math.max(pr1_edge.y, pr2_edge.y)) {
				dp1 = cr1;
				dp2 = cr2;
			} else {
				dp1 = pr1_edge;
				dp2 = pr2_edge;
			}
		}

		this.cs.ctx.beginPath();
		this.cs.ctx.strokeStyle = this.edgeColor;
		this.cs.ctx.moveTo(last.x, last.y);
		this.cs.ctx.lineTo(dp1.x, dp1.y);
		this.cs.ctx.stroke();
		this.cs.ctx.closePath();

		this.cs.ctx.beginPath();
		this.cs.ctx.strokeStyle = this.edgeColor;
		this.cs.ctx.moveTo(last.x, last.y);
		this.cs.ctx.lineTo(dp2.x, dp2.y);
		this.cs.ctx.stroke();
	}

	VariantChanged(togglename) {
		// nothing to do for graph
	}
}
