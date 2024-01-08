export default class BTreeNode {
	val;
	point;
	r;
	left;
	right;
	leftnodes = 0;
	rightnodes = 0;

	constructor(val = null) {
		this.val = val;
	}
}
