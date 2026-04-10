window.App = window.App || {};

/**
 * A minimal reactive store using Proxy.
 * Wraps a plain array so that any mutation (push, splice, index set, etc.)
 * automatically schedules a render on the next microtask.
 *
 * Usage:
 *   const store = new App.Store([...], () => renderer.render());
 *   store.data.push({ type: "Rect", width: 50, height: 50, fill: "red" });
 *   // render happens automatically — no manual call needed
 */
App.Store = class Store {
    constructor(initial, onChanged) {
        this._onChanged = onChanged;
        this._pending = false;
        this.data = this._wrap(initial);
    }

    _scheduleRender() {
        if (this._pending) return;
        this._pending = true;
        queueMicrotask(() => {
            this._pending = false;
            this._onChanged();
        });
    }

    _wrap(arr) {
        return new Proxy(arr, {
            set: (target, prop, value) => {
                target[prop] = value;
                if (prop !== "length") this._scheduleRender();
                return true;
            },
            deleteProperty: (target, prop) => {
                delete target[prop];
                this._scheduleRender();
                return true;
            }
        });
    }
};
