import RelativePoint from './relative-point';

export default class CartesianPoint {
	x;
	y;
	w;
	h;
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	static FromRelative(x, y, w, h) {
		if (!w || !h) {
			console.error(
				'Cannot convert Relative coordinate to Cartesian coordinate without plane dimensions'
			);
			return undefined;
		}
		let xe = (w / 2 - x) * -1;
		let ye = h / 2 - y;
		return new CartesianPoint(xe, ye, w, h);
	}
	static FromRelativePoint(p) {
		let xe = p.w / 2 + p.x;
		let ye = p.h / 2 - p.y;
		return new CartesianPoint(xe, ye, p.w, p.h);
	}

	ToRelative() {
		if (!this.w || !this.h) {
			console.error(
				'Cannot convert Cartesian coordinate to Relative coordinate without plane dimensions'
			);
			return undefined;
		}
		let xr = this.w / 2 + this.x;
		let yr = this.h / 2 - this.y;
		return new RelativePoint(xr, yr, this.w, this.h);
	}
}
