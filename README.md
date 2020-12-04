A queue backed by an array. Like [double-ended-queue][], but single-ended.


## API

- `new Queue()`

    Creates an empty queue.

- `queue.count`

    The number of items in the queue.

- `queue.enqueue(value)`

    Adds a value to the end of the queue. Constant amortized time.

- `queue.dequeue()`

    Removes a value from the beginning of the queue and returns it. Throws an error if the queue is empty. Constant time.

- `queue.tryDequeue()`

    Like `dequeue()`, but returns `null` instead of throwing an error if the queue is empty.


  [double-ended-queue]: https://www.npmjs.com/package/double-ended-queue
