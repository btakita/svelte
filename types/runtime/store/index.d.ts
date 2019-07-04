/** Callback to inform of a value updates. */
declare type Subscriber<T> = (value: T) => void;
/** Unsubscribes from value updates. */
declare type Unsubscriber = () => void;
/** Callback to update a value. */
declare type Updater<T> = (value: T) => T;
/** Cleanup logic callback. */
declare type Invalidator<T> = (value?: T) => void;
/** Start and stop notification callbacks. */
declare type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;
/** Readable interface for subscribing. */
export interface Readable<T> {
    /**
     * Subscribe on value changes.
     * @param run subscription callback
     * @param invalidate cleanup callback
     */
    subscribe(run: Subscriber<T>, invalidate?: Invalidator<T>): Unsubscriber;
}
/** Writable interface for both updating and subscribing. */
export interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     * @param value to set
     */
    set(value: T): void;
    /**
     * Update value using callback and inform subscribers.
     * @param updater callback
     */
    update(updater: Updater<T>): void;
}
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
export declare function readable<T>(value: T, start: StartStopNotifier<T>): Readable<T>;
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
export declare function writable<T>(value: T, start?: StartStopNotifier<T>): Writable<T>;
/** One or more `Readable`s. */
declare type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>];
/** One or more values from `Readable` stores. */
declare type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 * @param {Stores} stores input stores
 * @param {function(Stores=, function(*)=):*}fn function callback that aggregates the values
 * @param {*=}initial_value when used asynchronously
 */
export declare function derived<T, S extends Stores>(stores: S, fn: (values: StoresValues<S>, set?: Subscriber<T>) => T | Unsubscriber | void, initial_value?: T): Readable<T>;
/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 * @param store readable
 */
export declare function get<T>(store: Readable<T>): T;
export {};
