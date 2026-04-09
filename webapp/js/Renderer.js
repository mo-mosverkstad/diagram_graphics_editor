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

App.CanvasRenderer = class CanvasRenderer {
    constructor(canvas, components) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.components = components;
        this.visitor = new App.CanvasRenderVisitor(this.ctx);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const shape of this.components) {
            shape.accept(this.visitor, { x: 0, y: 0 });
        }
    }

    findShapeAt(e) {
        const px = e.offsetX, py = e.offsetY;
        for (let i = this.components.length - 1; i >= 0; i--) {
            if (this.components[i].hitTest(px, py)) return this.components[i];
        }
        return null;
    }
};
