window.App = window.App || {};

App.Group = class Group extends App.Shape {
    constructor({ children = [], fill = "none", stroke = null, strokeWidth = 1, ...rest } = {}) {
        super({ ...rest, fill });
        this.children = children;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    _computeSize() {
        let w = 0, h = 0;
        for (const child of this.children) {
            const s = child.getSize();
            w = Math.max(w, s.width);
            h = Math.max(h, s.height);
        }
        if (this.wrapWidth) this.width = w;
        if (this.wrapHeight) this.height = h;
        this._boundsW = w;
        this._boundsH = h;
    }

    accept(visitor, offset) { return visitor.visitGroup(this, offset); }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || this._boundsW || 0), height: this.y + (this.height || this._boundsH || 0) };
    }

    hitTest(px, py) {
        const s = this.getSize();
        return px >= this.x && px <= s.width && py >= this.y && py <= s.height;
    }
};
