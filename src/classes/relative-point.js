import CartesianPoint from './cartesian-point';

export default class RelativePoint {
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

	static FromCartesian(x, y, w, h) {
		if (!w || !h) {
			console.error(
				'Cannot convert Euclidian coordiante to Relative coordiate without plane dimensions'
			);
		}
		let xr = w / 2 + x;
		let yr = h / 2 - y;
		return new RelativePoint(xr, yr, w, h);
	}
	static FromCartesianPoint(p) {
		let xr = p.w / 2 + p.x;
		let yr = p.h / 2 - p.y;
		return new RelativePoint(xr, yr, p.w, p.h);
	}

	ToCartesian() {
		if (!this.w || !this.h) {
			console.error(
				'Cannot convert Relative coordiante to Euclidian coordinate without plane dimensions'
			);
			return undefined;
		}
		let xe = (this.w / 2 - this.x) * -1;
		let ye = this.h / 2 - this.y;
		return new CartesianPoint(xe, ye, this.w, this.h);
	}
}
