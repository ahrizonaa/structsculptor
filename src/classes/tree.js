import DataStructure from './data-structure';
import Edge from './edge';
import RelativePoint from './relative-point';
import BTreeNode from './btree-node';

export default class Tree extends DataStructure {
	datasetCache;
	dataset;
	gridWidth;
	gridHeight;
	depthZeroIndexed = 0;
	cellSize;
	steps = 20;
	radius;
	nodelist = [];
	edges = [];
	current_edge = 0;
	root;

	constructor() {
		super();
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

	Parse(input) {
		input = this.TrimNulls(input);
		this.datasetCache = input;
		this.dataset = input;

		this.root = this.ConstructTree(this.dataset);

		if (this.ui.currTab.options.toggles.BST) {
			this.root = this.ToBST([...input]);
		} else if (this.ui.currTab.options.toggles.MaxHeap) {
			this.root = this.ToHeap([...input], 'MAX');
		} else if (this.ui.currTab.options.toggles.MinHeap) {
			this.root = this.ToHeap([...input], 'MIN');
		}

		this.gridHeight = this.depthZeroIndexed + 1;
		this.gridWidth = Math.pow(2, this.depthZeroIndexed);
		this.cellSize = this.cs.canvas.width / this.gridWidth;

		this.radius = Math.max(
			Math.min(this.maxRadius, this.cellSize * 0.25),
			this.minRadius
		);
	}

	ConstructTree(input) {
		let i = 1;

		let root = new BTreeNode();

		if (input.length > 0) {
			root = new BTreeNode(input[0]);
		}

		while (i < input.length) {
			let next = input[i];
			this.AppendNode(next, root);
			i += 1;
		}

		return root;
	}

	ToBST(input) {
		this.CountSubtrees(this.root);

		let nulls;
		[input, nulls] = this.DisplaceNulls(input);

		input.sort((a, b) => a - b);

		let clone = new BTreeNode();
		this.CloneDFS(this.root, clone, [...input]);

		input = this.ReplaceNulls(input, nulls);

		return clone;
	}

	CloneDFS(root, clone, input) {
		clone.val = input[root.leftnodes];
		if (root.left === null) {
			clone.left = null;
		} else if (root.left) {
			clone.left = new BTreeNode();
			this.CloneDFS(root.left, clone.left, input.slice(0, root.leftnodes));
		}

		if (root.right === null) {
			clone.right = null;
		} else if (root.right) {
			clone.right = new BTreeNode();
			this.CloneDFS(root.right, clone.right, input.slice(root.leftnodes + 1));
		}
	}

	ToHeap(input, heap) {
		let nulls;
		[input, nulls] = this.DisplaceNulls(input);

		if (heap == 'MIN') {
			input.sort((a, b) => a - b);
		} else if (heap == 'MAX') {
			input.sort((a, b) => b - a);
		} else {
			input.sort((a, b) => a - b);
		}

		input = this.ReplaceNulls(input, nulls);

		return this.ConstructTree(input);
	}

	ReplaceNulls(input, nulls) {
		let j = 0;

		while (j < input.length && nulls.length) {
			if (j == nulls[0]) {
				input = input.slice(0, j).concat([null]).concat(input.slice(j));
				nulls.shift();
			}
			j += 1;
		}

		return input;
	}

	DisplaceNulls(input) {
		let nulls = [];

		input.forEach((n, i) => {
			if (n === null) nulls.push(i);
		});

		input = input.filter((n) => n != null);

		return [input, nulls];
	}

	CountSubtrees(node) {
		if (!node || node.val === null) {
			return 0;
		}

		if (!node.left && !node.right) {
			return 1;
		}

		let left = 0,
			right = 0;

		if (node.left) left = this.CountSubtrees(node.left);
		if (node.right) right = this.CountSubtrees(node.right);

		node.leftnodes = left;
		node.rightnodes = right;

		return left + 1 + right;
	}

	TrimNulls(input) {
		let i = 0;
		while (input[i] === null && i < input.length) {
			i += 1;
		}

		let j = input.length - 1;
		while (input[j] === null && j >= 0) {
			j--;
		}
		return input.slice(i, j + 1);
	}

	AppendNode(val, root) {
		let queue = [root];
		let depth = 0;
		while (queue.length) {
			let size = queue.length;
			for (let i = 0; i < size; i++) {
				let node = queue.shift();
				if (!node) {
					continue;
				}

				if (node.left === undefined) {
					if (val === null) node.left = null;
					else {
						node.left = new BTreeNode(val);
						this.depthZeroIndexed = Math.max(depth + 1, this.depthZeroIndexed);
					}
					return;
				}
				if (node.right === undefined) {
					if (val === null) node.right = null;
					else {
						node.right = new BTreeNode(val);
						this.depthZeroIndexed = Math.max(depth + 1, this.depthZeroIndexed);
					}
					return;
				}
				queue.push(node.left);
				queue.push(node.right);
			}
			depth += 1;
		}
	}

	DrawNodes() {
		let queue = [this.root];
		let depth = 0;
		while (queue.length && depth <= this.depthZeroIndexed) {
			let size = queue.length;
			for (let j = 0; j < size; j++) {
				let node = queue.shift();
				if (node == null) {
					this.nodelist.push(null);
					queue.push(null);
					queue.push(null);
				} else {
					queue.push(node.left);
					queue.push(node.right);

					// plot node
					// each x has to go halfway between its respective sector
					let cell = this.cs.canvas.width / Math.pow(2, depth);
					let start = j * cell;
					let half = start + cell / 2;
					let xr = half;
					let yr =
						this.cellSize / 2 +
						(this.cs.canvas.height / this.gridHeight) * depth;

					if (yr - this.radius <= 0) {
						yr = this.radius;
					}

					this.nodelist.push(
						new RelativePoint(
							xr,
							yr,
							this.cs.canvas.width,
							this.cs.canvas.height
						)
					);

					this.cs.ctx.beginPath();
					this.cs.ctx.fillStyle = this.nodeColor;
					this.cs.ctx.arc(xr, yr, this.radius, 0, 2 * Math.PI);
					this.cs.ctx.fill();
					this.cs.ctx.closePath();

					this.cs.ctx.beginPath();
					this.cs.ctx.fillStyle = this.nodeFontColor;
					this.cs.ctx.font = `${this.nodeFontSize} ${this.nodeFontFamily}`;
					this.cs.ctx.textAlign = 'center';
					this.cs.ctx.fillText(String(node.val), xr, yr + 3);
					this.cs.ctx.closePath();
				}
			}

			depth += 1;
		}
	}

	PlotEdges() {
		for (let i = 0; i < this.nodelist.length; i++) {
			if (this.nodelist[i] == null) {
				continue;
			}
			if (
				2 * i + 1 < this.nodelist.length &&
				this.nodelist[2 * i + 1] != null
			) {
				// draw left child edge
				let distRatio = this.math.DistanceRatio(
					this.radius,
					this.nodelist[i],
					this.nodelist[2 * i + 1]
				);

				let pr1_edge = this.math.FindPointOnLine(
					this.nodelist[i],
					this.nodelist[2 * i + 1],
					distRatio
				);
				let pr2_edge = this.math.FindPointOnLine(
					this.nodelist[2 * i + 1],
					this.nodelist[i],
					distRatio
				);

				if (this.anime.enabled) {
					this.edges.push(
						Edge.bind(this)(
							this.math.SegmentLine(pr1_edge, pr2_edge, this.steps)
						)
					);
				} else {
					this.cs.ctx.beginPath();
					this.cs.ctx.strokeStyle = this.edgeColor;
					this.cs.ctx.moveTo(pr1_edge.x, pr1_edge.y);
					this.cs.ctx.lineTo(pr2_edge.x, pr2_edge.y);
					this.cs.ctx.stroke();
				}
			}
			if (
				2 * i + 2 < this.nodelist.length &&
				this.nodelist[2 * i + 2] != null
			) {
				// draw right child edge
				let distRatio = this.math.DistanceRatio(
					this.radius,
					this.nodelist[i],
					this.nodelist[2 * i + 2]
				);

				let pr1_edge = this.math.FindPointOnLine(
					this.nodelist[i],
					this.nodelist[2 * i + 2],
					distRatio
				);
				let pr2_edge = this.math.FindPointOnLine(
					this.nodelist[2 * i + 2],
					this.nodelist[i],
					distRatio
				);

				if (this.anime.enabled) {
					this.edges.push(
						Edge.bind(this)(
							this.math.SegmentLine(pr1_edge, pr2_edge, this.steps)
						)
					);
				} else {
					this.cs.ctx.beginPath();
					this.cs.ctx.strokeStyle = this.edgeColor;
					this.cs.ctx.moveTo(pr1_edge.x, pr1_edge.y);
					this.cs.ctx.lineTo(pr2_edge.x, pr2_edge.y);
					this.cs.ctx.stroke();
				}
			}
		}
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
			this.anime.Cancel();
			this.cs.ctx.closePath();
			this.current_edge += 1;

			if (this.current_edge < this.edges.length) {
				this.anime.Request(this.DrawEdges.bind(this));
			}
			return;
		}
	}

	VariantChanged(togglename) {
		if (togglename == 'BST' && this.ui.currTab.options.toggles[togglename]) {
			this.ui.currTab.options.toggles.MaxHeap = false;
			this.ui.currTab.options.toggles.MinHeap = false;
		} else if (
			togglename == 'MaxHeap' &&
			this.ui.currTab.options.toggles[togglename]
		) {
			this.ui.currTab.options.toggles.BST = false;
			this.ui.currTab.options.toggles.MinHeap = false;
		} else if (
			togglename == 'MinHeap' &&
			this.ui.currTab.options.toggles[togglename]
		) {
			this.ui.currTab.options.toggles.BST = false;
			this.ui.currTab.options.toggles.MaxHeap = false;
		}
	}
}
