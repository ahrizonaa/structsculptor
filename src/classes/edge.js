export default function* Edge(arr) {
	let edge = arr;
	let first = arr[0];
	let last = arr[arr.length - 1];

	for (let curr = 0; curr < edge.length - 1; curr++) {
		let data = {
			curr: edge[curr],
			next: edge[curr + 1]
		};
		yield data;
	}

	let end = {
		first: first,
		last: last,
		done: true
	};

	return end;
}
