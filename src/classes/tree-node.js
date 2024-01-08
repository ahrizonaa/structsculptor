export default class TreeNode {
	val;
	point;
	r;
	neighbors;

	constructor(val) {
		this.val = val;
		this.point = null;
		this.r = NaN;
		this.neighbors = [];
	}
}
