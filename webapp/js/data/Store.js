window.App = window.App || {};

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
