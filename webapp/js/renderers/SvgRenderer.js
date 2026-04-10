window.App = window.App || {};

App.SvgRenderer = class SvgRenderer {
    constructor(svg, components) {
        this.svg = svg;
        this.components = components;
        this.visitor = new App.SvgRenderVisitor();
    }

    render() {
        this.svg.innerHTML = "";
        for (const shape of this.components) {
            const result = shape.accept(this.visitor, { x: 0, y: 0 });
            const els = Array.isArray(result) ? result : [result];
            for (const el of els) {
                this._tagRoot(el, shape);
                this.svg.appendChild(el);
            }
        }
    }

    _tagRoot(el, rootShape) {
        el.__rootNode = rootShape;
        if (el.children) {
            for (const child of el.children) this._tagRoot(child, rootShape);
        }
    }

    findShapeAt(e) {
        return e.target?.__rootNode || null;
    }
};
