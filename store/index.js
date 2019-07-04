'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal = require('../internal');

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe,
    };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = internal.noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (internal.safe_not_equal(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach((s) => s[1]());
            subscribers.forEach((s) => s[0](value));
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = internal.noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || internal.noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 * @param {Stores} stores input stores
 * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
 * @param {*=}initial_value when used asynchronously
 */
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    const invalidators = [];
    const store = readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = internal.noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = internal.is_function(result) ? result : internal.noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            internal.run_all(invalidators);
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            internal.run_all(unsubscribers);
            cleanup();
        };
    });
    return {
        subscribe(run, invalidate = internal.noop) {
            invalidators.push(invalidate);
            const unsubscribe = store.subscribe(run, invalidate);
            return () => {
                const index = invalidators.indexOf(invalidate);
                if (index !== -1) {
                    invalidators.splice(index, 1);
                }
                unsubscribe();
            };
        }
    };
}
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 * @param store readable
 */
function get(store) {
    let value;
    store.subscribe((_) => value = _)();
    return value;
}

exports.readable = readable;
exports.writable = writable;
exports.derived = derived;
exports.get = get;
