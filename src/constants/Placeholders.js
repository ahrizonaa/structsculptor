const t = '\xA0\xA0\xA0\xA0';
const n = '\x0A';
const d0 = '\u2080';
const d1 = '\u2081';
const d2 = '\u2082';
const nsub = '\u2099';
const msub = '\u208B';

const GraphListUnWeighted = `N x 2 array of node, neighbor${n + n}e.g.,${n}[${
	n + t
}[1, 2]${n + t}[2, 3]${n + t}[4, 2]${n}]`;

const GraphListWeighted = `N x 3 array of weight, node, neighbor${
	n + n
}e.g.,${n}[${n + t}[2, 1, 2]${n + t}[4, 2, 3]${n + t}[1, 4, 2]${n}]`;

const GraphMatrixUnWeighted = `N x N matrix where matrix[row][col] defines edge between row and col${
	n + n
}e.g.,${n}[${n + t}[0, 1, 0, 1]${n + t}[0, 1, 1, 0]${n + t}[1, 0, 0, 0]${n}]`;

const GraphMatrixWeighted = '';

const TreeArr = `1D array where elements are sorted in level order traversal d${d0},d${d1},d${d1},d${d2},d${d2},d${d2},d${d2}${
	n + n
}e.g.,${n + n}[0, 1, 1, 2, 2, 2, 2]`;

const StackArr = `1D array of length n where i${d0} is the stack bottom and i${
	nsub + msub + d1
} is the stack top${n + n}e.g.,${n + n}[6, 5, 4, 3 ,2, 1]`;

const QueueArr = `1D array of length n where i${d0} is the queue front and i${
	nsub + msub + d1
} is the queue back${n + n}e.g.,${n + n}[1, 2, 3, 4, 5, 6]`;

const LinkedListArr = `1D array of length n where i${d0} is the list head and i${
	nsub + msub + d1
} is the list tail${n + n}e.g.,${n + n}[0, 2, 4, 6, 8, 10]`;

export {
	GraphListUnWeighted,
	GraphListWeighted,
	GraphMatrixUnWeighted,
	GraphMatrixWeighted,
	TreeArr,
	StackArr,
	QueueArr,
	LinkedListArr
};
