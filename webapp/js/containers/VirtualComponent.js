window.App = window.App || {};

App.VirtualComponent = class VirtualComponent extends App.Shape {
    /**
     * @param {Object} opts
     * @param {Function} opts.dataSource - Returns an array of Shape instances.
     * @param {string} [opts.direction="stack"] - "stack" (overlay) or "vertical"
     */
    constructor({ dataSource, direction = "stack", fill = "none", stroke = null, strokeWidth = 1, ...rest } = {}) {
        super({ ...rest, fill });
        this.dataSource = dataSource;
        this.direction = direction;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    _computeSize(children) {
        children = children || this.dataSource();
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
