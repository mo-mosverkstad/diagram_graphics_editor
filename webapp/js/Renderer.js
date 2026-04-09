window.App = window.App || {};

App.Renderer = class Renderer {
    constructor(svg, components) {
        this.svg = svg;
        this.components = components;
    }

    render() {
        this.svg.innerHTML = "";
        this.components.forEach(shape => {
            const result = shape.render({ x: 0, y: 0 });
            const els = Array.isArray(result) ? result : [result];
            els.forEach(el => {
                this._tagRoot(el, shape);
                this.svg.appendChild(el);
            });
        });
    }

    _tagRoot(el, rootShape) {
        el.__rootNode = rootShape;
        if (el.children) {
            for (const child of el.children) {
                this._tagRoot(child, rootShape);
            }
        }
    }
};
