window.App = window.App || {};

App._layouts = {};

App.defineLayout = function(name, { params = {}, body = [], direction = "stack" }) {
    App._layouts[name] = { params, body, direction };
};

App.ReusableComponent = class ReusableComponent extends App.Shape {
    constructor({ template, ...overrides }) {
        super(overrides);
        this.template = template;
        this.overrides = overrides;
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

    _computeSize() {
        const layout = App._layouts[this.template];
        const children = this._buildChildren();
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
    }

    render(offset) {
        const layout = App._layouts[this.template];
        const children = this._buildChildren();
        this._computeSize();

        const baseOffset = { x: offset.x + this.x, y: offset.y + this.y };
        const els = [];
        let cursorY = 0;

        for (const child of children) {
            const childOffset = { x: baseOffset.x, y: baseOffset.y + cursorY };
            const el = child.render(childOffset);
            els.push(...(Array.isArray(el) ? el : [el]));
            if (layout.direction === "vertical") {
                cursorY += child.getSize().height;
            }
        }
        return App.SvgHelper.createGroup(els, null);
    }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || 0), height: this.y + (this.height || 0) };
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
