'use strict';

const assert = require('assert');
const test = require('@charmander/test')(module);

const Queue = require('./');

const HEX = '0123456789abcdef';
const hex2 = n =>
	HEX[n >> 4] + HEX[n & 0xf];

for (let high = 0; high < 0x8000000; high += 0x100000) {
	test('sequences of 27 operations › starting with 0x' + hex2(high >> 20), () => {
		sequences: for (let low = 0; low < 0x100000; low++) {
			const sequence = high | low;
			const testQueue = new Queue();
			let left = 0;
			let right = 1;

			testQueue.enqueue(0);

			for (let bit = 0; bit < 27; bit++) {
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

					if (testQueue.tryDequeue() !== expected || testQueue.count !== right - left) {
						assert.fail(sequence);
						break sequences;
					}
				}
			}
		}
	});
}

test('complete fill/empty up to 10000', () => {
	const queue = new Queue();

	counts: for (let count = 1; count <= 10000; count++) {
		for (let i = 0; i < count; i++) {
			queue.enqueue(i);
		}

		for (let i = 0; i < count; i++) {
			if (queue.dequeue() !== i) {
				assert.fail('fill/empty ' + count + ' at ' + i);
				break counts;
			}
		}
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
