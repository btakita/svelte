declare type Subscriber<T> = (value: T) => void;
declare type Unsubscriber = () => void;
declare type Updater<T> = (value: T) => T;
declare type Invalidater<T> = (value?: T) => void;
declare type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;
export interface Readable<T> {
    subscribe(run: Subscriber<T>, invalidate?: Invalidater<T>): Unsubscriber;
}
export interface Writable<T> extends Readable<T> {
    set(value: T): void;
    update(updater: Updater<T>): void;
}
export declare function readable<T>(value: T, start: StartStopNotifier<T>): Readable<T>;
export declare function writable<T>(value: T, start?: StartStopNotifier<T>): Writable<T>;
declare type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>];
declare type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};
export declare function derived<T, S extends Stores>(stores: S, fn: (values: StoresValues<S>, set?: Subscriber<T>) => T | Unsubscriber | void, initial_value?: T): Readable<T>;
export declare function get<T>(store: Readable<T>): T;
export {};
