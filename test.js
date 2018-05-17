'use strict';

const assert = require('assert');
const test = require('@charmander/test')(module);

const Queue = require('./');

const OPERATIONS = 20;

test(`sequences of ${OPERATIONS} operations`, () => {
	for (let sequence = 0; sequence < 1 << OPERATIONS; sequence++) {
		const testQueue = new Queue();
		let left = 0;
		let right = 0;

		for (let bit = 0; bit < OPERATIONS; bit++) {
			if ((sequence & (1 << bit)) === 0) {
				testQueue.enqueue(right);
				right++;
			} else {
				let expected;

				if (left === right) {
					expected = null;
				} else {
					expected = left;
					left++;
				}

				assert.strictEqual(testQueue.tryDequeue(), expected);
			}

			assert.strictEqual(testQueue.count, right - left);
		}
	}
});

test('complete fill/empty up to 10000', () => {
	const queue = new Queue();

	for (let count = 1; count <= 10000; count++) {
		for (let i = 0; i < count; i++) {
			queue.enqueue(i);
		}

		for (let i = 0; i < count; i++) {
			assert.strictEqual(queue.dequeue(), i);
		}
	}
});

test('complete fill/empty of 5 million', () => {
	const queue = new Queue();
	const count = 5000000;

	for (let i = 0; i < count; i++) {
		queue.enqueue(i);
	}

	for (let i = 0; i < count; i++) {
		assert.strictEqual(queue.dequeue(), i);
	}
});

test('capacities grow by a factor of 1.5', () => {
	const queue = new Queue();

	for (let i = 0; i < 8; i++) {
		queue.enqueue(1);
	}

	assert.strictEqual(queue._items.length, 8);

	for (let i = 0; i < 7; i++) {
		queue.dequeue();
	}

	for (let i = 0; i < 8; i++) {
		queue.enqueue(i);
	}

	assert.strictEqual(queue._items.length, 12);
});

test('tryDequeue › returns null on an empty queue', () => {
	const empty = new Queue();
	assert.strictEqual(empty.count, 0);
	assert.strictEqual(empty.tryDequeue(), null);
	assert.strictEqual(empty.count, 0);
});

test('tryDequeue › dequeues on a non-empty queue', () => {
	const nonEmpty = new Queue();
	nonEmpty.enqueue(1);
	assert.strictEqual(nonEmpty.count, 1);
	assert.strictEqual(nonEmpty.tryDequeue(), 1);
	assert.strictEqual(nonEmpty.count, 0);
});

test('dequeue › throws on an empty queue', () => {
	const empty = new Queue();
	assert.strictEqual(empty.count, 0);
	assert.throws(() => {
		empty.dequeue();
	}, /^Error: queue empty$/);
	assert.strictEqual(empty.count, 0);
});

test('dequeue › dequeues on a non-empty queue', () => {
	const nonEmpty = new Queue();
	nonEmpty.enqueue(1);
	assert.strictEqual(nonEmpty.count, 1);
	assert.strictEqual(nonEmpty.dequeue(), 1);
	assert.strictEqual(nonEmpty.count, 0);
});
