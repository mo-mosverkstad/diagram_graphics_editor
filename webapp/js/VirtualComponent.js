window.App = window.App || {};

App.VirtualComponent = class VirtualComponent extends App.Shape {
    /**
     * @param {Object} opts
     * @param {Function} opts.dataSource - Returns an array of shape descriptors.
     *   Each descriptor: { type: "Rect", width: 60, fill: "red", ... }
     *   Optionally include a `key` field for stable identity across reorders.
     * @param {string} [opts.direction="stack"] - "stack" (overlay) or "vertical"
     */
    constructor({ dataSource, direction = "stack", ...rest } = {}) {
        super(rest);
        this.dataSource = dataSource;
        this.direction = direction;
        this._prevSnapshot = null; // cached descriptor array
        this._cache = null;        // cached materialized children
    }

    _reconcile() {
        const descriptors = this.dataSource();
        if (this._prevSnapshot && this._diffEqual(this._prevSnapshot, descriptors)) {
            return this._cache;
        }
        // Build a key→child map from previous cache for reuse
        const oldByKey = new Map();
        if (this._cache && this._prevSnapshot) {
            for (let i = 0; i < this._prevSnapshot.length; i++) {
                const key = this._prevSnapshot[i].key ?? i;
                oldByKey.set(key, { desc: this._prevSnapshot[i], child: this._cache[i] });
            }
        }
        const children = descriptors.map((desc, i) => {
            const key = desc.key ?? i;
            const old = oldByKey.get(key);
            if (old && this._shallowEqual(old.desc, desc)) return old.child;
            const { type, key: _k, ...props } = desc;
            return new App[type](props);
        });
        this._prevSnapshot = descriptors.map(d => ({ ...d }));
        this._cache = children;
        return children;
    }

    _diffEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!this._shallowEqual(a[i], b[i])) return false;
        }
        return true;
    }

    _shallowEqual(a, b) {
        const ka = Object.keys(a), kb = Object.keys(b);
        if (ka.length !== kb.length) return false;
        for (const k of ka) {
            if (a[k] !== b[k]) return false;
        }
        return true;
    }

    _computeSize(children) {
        children = children || this._reconcile();
        let w = 0, h = 0;
        for (const child of children) {
            const s = child.getSize();
            if (this.direction === "vertical") {
                w = Math.max(w, s.width);
                h += s.height;
            } else {
                w = Math.max(w, s.width);
                h = Math.max(h, s.height);
            }
        }
        if (this.wrapWidth) this.width = w;
        if (this.wrapHeight) this.height = h;
        this._boundsW = w;
        this._boundsH = h;
        return children;
    }

    accept(visitor, offset) { return visitor.visitVirtualComponent(this, offset); }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || this._boundsW || 0), height: this.y + (this.height || this._boundsH || 0) };
    }

    hitTest(px, py) {
        const s = this.getSize();
        return px >= this.x && px <= s.width && py >= this.y && py <= s.height;
    }
};
