'use strict';

const tap = require('tap');

const Queue = require('../');

class ReferenceQueue {
	constructor() {
		this.head = null;
		this.tail = null;
		this.count = 0;
	}

	enqueue(value) {
		const newTail = {next: null, value: value};

		if (this.head === null) {
			this.head = this.tail = newTail;
		} else {
			this.tail.next = newTail;
			this.tail = newTail;
		}

		this.count++;
	}

	tryDequeue() {
		if (this.head === null) {
			return null;
		}

		const result = this.head.value;
		this.head = this.head.next;

		if (this.head === null) {
			this.tail = null;
		}

		this.count--;
		return result;
	}
}

const HEX = '0123456789abcdef';
const hex2 = n =>
	HEX[n >> 4] + HEX[n & 0xf];

tap.test('sequences of 27 operations', t => {
	for (let high = 0; high < 0x8000000; high += 0x100000) {
		t.test('starting with 0x' + hex2(high >> 20), t => {
			sequences: for (let low = 0; low < 0x100000; low++) {
				const sequence = high | low;
				const testQueue = new Queue();
				const referenceQueue = new ReferenceQueue();
				let n = 1;

				testQueue.enqueue(0);
				referenceQueue.enqueue(0);

				for (let bit = 0; bit < 27; bit++) {
					if ((sequence & (1 << bit)) === 0) {
						testQueue.enqueue(n);
						referenceQueue.enqueue(n);
						n++;
					} else {
						if (testQueue.tryDequeue() !== referenceQueue.tryDequeue() || testQueue.count !== referenceQueue.count) {
							t.fail(sequence);
							break sequences;
						}
					}
				}
			}

			t.end();
		});
	}

	t.end();
});

tap.test('complete fill/empty up to 10000', t => {
	const queue = new Queue();

	counts: for (let count = 1; count <= 10000; count++) {
		for (let i = 0; i < count; i++) {
			queue.enqueue(i);
		}

		for (let i = 0; i < count; i++) {
			if (queue.dequeue() !== i) {
				t.fail('fill/empty ' + count + ' at ' + i);
				break counts;
			}
		}
	}

	t.end();
});

tap.test('capacities grow by a factor of 1.5', t => {
	const queue = new Queue();

	for (let i = 0; i < 8; i++) {
		queue.enqueue(1);
	}

	t.is(queue._items.length, 8);

	for (let i = 0; i < 7; i++) {
		queue.dequeue();
	}

	for (let i = 0; i < 8; i++) {
		queue.enqueue(i);
	}

	t.is(queue._items.length, 12);
	t.end();
});

tap.test('tryDequeue', t => {
	t.test('returns null on an empty queue', t => {
		const empty = new Queue();
		t.is(empty.count, 0);
		t.is(empty.tryDequeue(), null);
		t.is(empty.count, 0);
		t.end();
	});

	t.test('dequeues on a non-empty queue', t => {
		const nonEmpty = new Queue();
		nonEmpty.enqueue(1);
		t.is(nonEmpty.count, 1);
		t.is(nonEmpty.tryDequeue(), 1);
		t.is(nonEmpty.count, 0);
		t.end();
	});

	t.end();
});

tap.test('dequeue', t => {
	t.test('throws on an empty queue', t => {
		const empty = new Queue();
		t.is(empty.count, 0);
		t.throws(() => {
			t.is(empty.dequeue(), null);
		}, {constructor: Error, message: 'queue empty'});
		t.is(empty.count, 0);
		t.end();
	});

	t.test('dequeues on a non-empty queue', t => {
		const nonEmpty = new Queue();
		nonEmpty.enqueue(1);
		t.is(nonEmpty.count, 1);
		t.is(nonEmpty.dequeue(), 1);
		t.is(nonEmpty.count, 0);
		t.end();
	});

	t.end();
});
