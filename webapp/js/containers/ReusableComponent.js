window.App = window.App || {};

App._layouts = {};

App.defineLayout = function(name, { params = {}, body = [], direction = "stack" }) {
    App._layouts[name] = { params, body, direction };
};

App.ReusableComponent = class ReusableComponent extends App.Shape {
    constructor({ template, fill = "none", stroke = null, strokeWidth = 1, ...overrides }) {
        super({ ...overrides, fill });
        this.template = template;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.overrides = {};
        const shapeKeys = ["x", "y", "fill", "wrapWidth", "wrapHeight", "stroke", "strokeWidth"];
        for (const [k, v] of Object.entries(overrides)) {
            if (!shapeKeys.includes(k)) this.overrides[k] = v;
        }
    }

    _buildChildren() {
        const layout = App._layouts[this.template];
        if (!layout) throw new Error(`Layout "${this.template}" not defined`);
        const resolved = { ...layout.params, ...this.overrides };
        return layout.body.map(def => {
            const { type, ...rest } = this._resolveProps(def, resolved);
            return new App[type](rest);
        });
    }

    _computeSize(children) {
        const layout = App._layouts[this.template];
        children = children || this._buildChildren();
        let w = 0, h = 0;

        if (layout.direction === "vertical") {
            for (const child of children) {
                const s = child.getSize();
                w = Math.max(w, s.width);
                h += s.height;
            }
        } else {
            for (const child of children) {
                const s = child.getSize();
                w = Math.max(w, s.width);
                h = Math.max(h, s.height);
            }
        }
        if (this.wrapWidth) this.width = w;
        if (this.wrapHeight) this.height = h;
        this._boundsW = w;
        this._boundsH = h;
    }

    accept(visitor, offset) { return visitor.visitReusableComponent(this, offset); }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || this._boundsW || 0), height: this.y + (this.height || this._boundsH || 0) };
    }

    hitTest(px, py) {
        const s = this.getSize();
        return px >= this.x && px <= s.width && py >= this.y && py <= s.height;
    }

    _resolveProps(def, params) {
        const out = {};
        for (const [k, v] of Object.entries(def)) {
            out[k] = typeof v === "string" && v.startsWith("$")
                ? params[v.slice(1)] ?? v
                : v;
        }
        return out;
    }
};
