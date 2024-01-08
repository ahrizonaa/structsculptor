import { RelativePoint } from '../classes/relative-point';

class MathService {
	SegmentLine = (from, to, segments) => {
		let vertices = [];
		let dx = to.x - from.x;
		let dy = to.y - from.y;
		for (let step = 0; step < segments + 1; step++) {
			vertices.push(
				new RelativePoint(
					from.x + (dx * step) / segments,
					from.y + (dy * step) / segments,
					from.w,
					from.h
				)
			);
		}
		return vertices;
	};
	RelativeSlope = (p1, p2) => {
		return Math.abs((p2.x - p1.x) / (p2.y - p1.y));
	};

	CartesianSlope = (p1, p2) => {
		return (p2.y - p1.y) / (p2.x - p1.x);
	};

	DistanceRatio = (distance, p1, p2) => {
		return (
			distance / Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
		);
	};

	FindPointOnLine = (from, to, dist_ratio) => {
		let x = (1 - dist_ratio) * from.x + dist_ratio * to.x;
		let y = (1 - dist_ratio) * from.y + dist_ratio * to.y;
		return new RelativePoint(x, y, from.w, from.h);
	};

	Midpoint = (p1, p2) => {
		return new RelativePoint((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, p1.w, p1.h);
	};

	RelativeDirection = (slope) => {
		if (slope < 0.5) {
			// vertical
			return 'vertical';
		} else if (slope > 0.5 && slope < 1.5) {
			// diagonal
			return 'diagonal';
		} else if (slope > 3) {
			// horizontal
			return 'horizontal';
		}

		return 'unknown';
	};

	HexToRgb = (hex) => {
		const r = parseInt(hex.substring(1, 3), 16);
		const g = parseInt(hex.substring(3, 5), 16);
		const b = parseInt(hex.substring(5, 7), 16);
		return [r, g, b];
	};
}

const Maths = new MathService();
export default Maths;
