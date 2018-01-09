'use strict';

class Queue {
	constructor() {
		this._items = [null];
		this._start = 0;
		this._end = 0;
		this._count = 0;
	}

	get count() {
		return this._count;
	}

	enqueue(value) {
		if (this._count === this._items.length) {
			this._adjust();
		}

		this.uncheckedEnqueue(value);
	}

	tryDequeue() {
		return this._count === 0 ?
			null :
			this.uncheckedDequeue();
	}

	dequeue() {
		if (this._count === 0) {
			throw new Error('queue empty');
		}

		return this.uncheckedDequeue();
	}

	uncheckedEnqueue(value) {
		this._items[this._end] = value;

		if (++this._end === this._items.length) {
			this._end = 0;
		}

		this._count++;
	}

	uncheckedDequeue() {
		const result = this._items[this._start];
		this._items[this._start] = null;

		if (++this._start === this._items.length) {
			this._start = 0;
		}

		this._count--;
		return result;
	}

	_adjust() {
		const initialCapacity = this._items.length;
		const newCapacity = Math.ceil(1.5 * initialCapacity);
		const offset = newCapacity - initialCapacity;
		const start = this._start;

		while (this._items.length < newCapacity) {
			this._items.push(null);
		}

		for (let i = initialCapacity - 1; i >= start; i--) {
			this._items[i + offset] = this._items[i];
			this._items[i] = null;
		}

		this._start += offset;
	}
}

module.exports = Queue;
