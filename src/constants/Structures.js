import {
	AdjacencyList,
	AdjacencyMatrix,
	LinkedListArray,
	QueueArray,
	StackArray,
	TreeArray
} from 'src/app/constants/Formats';

const Structures = [
	{
		title: 'Graph',
		options: {
			formats: [AdjacencyList, AdjacencyMatrix],
			toggles: {
				Directed: false,
				Weighted: false
			}
		},
		examples: [
			{
				title: 'Connected Components',
				dataset: [
					[0, 1],
					[1, 2],
					[3, 4]
				],
				options: {
					Directed: false,
					Weighted: false
				},
				format: AdjacencyList
			},
			{
				title: 'Find the Town Judge',
				dataset: [
					[1, 3],
					[2, 3],
					[3, 1]
				],
				options: {
					Directed: true,
					Weighted: false
				},
				format: AdjacencyList
			},
			{
				title: 'If Path Exists',
				dataset: [
					[0, 1],
					[0, 2],
					[3, 5],
					[5, 4],
					[4, 3]
				],
				options: {
					Directed: false,
					Weighted: false
				},
				format: AdjacencyList
			}
		]
	},
	{
		title: 'Tree',
		options: {
			formats: [TreeArray],
			toggles: {
				BST: false,
				MaxHeap: false,
				MinHeap: false
			}
		},
		examples: [
			{
				title: 'Longest ZigZag Path',
				dataset: [
					1,
					null,
					1,
					1,
					1,
					null,
					null,
					1,
					1,
					null,
					1,
					null,
					null,
					null,
					1
				],
				options: {
					BST: false,
					MinHeap: false,
					MaxHeap: false
				},
				format: TreeArray
			},
			{
				title: 'Diameter of Binary Tree',
				dataset: [1, 2, 3, 4, 5],
				options: {
					BST: false,
					MinHeap: false,
					MaxHeap: false
				},
				format: TreeArray
			},
			{
				title: 'Symmetric Tree',
				dataset: [1, 2, 2, 3, 4, 4, 3],
				options: {
					BST: false,
					MinHeap: false,
					MaxHeap: false
				},
				format: TreeArray
			}
		]
	},
	{
		title: 'Stack',
		options: {
			formats: [StackArray],
			toggles: ['Push', 'Pop']
		},
		examples: []
	},
	{
		title: 'Queue',
		options: {
			formats: [QueueArray],
			toggles: ['Enqueue', 'Dequeue']
		},
		examples: []
	},
	{
		title: 'LinkedList',
		options: {
			formats: [LinkedListArray],
			toggles: {
				Doubly: false
			}
		},
		examples: [
			{
				title: 'Reverse Linked List',
				dataset: [1, 2, 3, 4, 5],
				options: {
					Doubly: false
				},
				format: LinkedListArray
			},
			{
				title: 'Middle of Linked List',
				dataset: [1, 2, 3, 4, 5, 6],
				options: {
					Doubly: false
				},
				format: LinkedListArray
			},
			{
				title: 'Delete Middle Node of Linked List',
				dataset: [1, 3, 4, 7, 1, 2, 6],
				options: {
					Doubly: false
				},
				format: LinkedListArray
			}
		]
	}
];

export default Structures;
