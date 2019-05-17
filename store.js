"use strict";
exports.__esModule = true;
var utils_1 = require("./internal/utils");
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
exports.readable = readable;
function writable(value, start) {
    if (start === void 0) { start = utils_1.noop; }
    var stop;
    var subscribers = [];
    function set(new_value) {
        if (utils_1.safe_not_equal(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach(function (s) { return s[1](); });
            subscribers.forEach(function (s) { return s[0](value); });
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate) {
        if (invalidate === void 0) { invalidate = utils_1.noop; }
        var subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || utils_1.noop;
        }
        run(value);
        return function () {
            var index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
            }
        };
    }
    return { set: set, update: update, subscribe: subscribe };
}
exports.writable = writable;
function derived(stores, fn, initial_value) {
    var single = !Array.isArray(stores);
    var stores_array = single
        ? [stores]
        : stores;
    var auto = fn.length < 2;
    return readable(initial_value, function (set) {
        var inited = false;
        var values = [];
        var pending = 0;
        var cleanup = utils_1.noop;
        var sync = function () {
            if (pending) {
                return;
            }
            cleanup();
            var result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = utils_1.is_function(result) ? result : utils_1.noop;
            }
        };
        var unsubscribers = stores_array.map(function (store, i) { return store.subscribe(function (value) {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, function () {
            pending |= (1 << i);
        }); });
        inited = true;
        sync();
        return function stop() {
            utils_1.run_all(unsubscribers);
            cleanup();
        };
    });
}
exports.derived = derived;
function get(store) {
    var value;
    store.subscribe(function (_) { return value = _; })();
    return value;
}
exports.get = get;
