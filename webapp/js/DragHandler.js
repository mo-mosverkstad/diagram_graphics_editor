window.App = window.App || {};

App.DragHandler = class DragHandler {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.selected = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this._bind();
    }

    _bind() {
        this.el.addEventListener("mousedown", (e) => this._onDown(e));
        this.el.addEventListener("mousemove", (e) => this._onMove(e));
        this.el.addEventListener("mouseup", () => this.selected = null);
        this.el.addEventListener("mouseleave", () => this.selected = null);
    }

    _onDown(e) {
        const shape = this.renderer.findShapeAt(e);
        if (!shape) return;
        this.selected = shape;
        const { x, y } = shape.getAnchor();
        this.offsetX = e.offsetX - x;
        this.offsetY = e.offsetY - y;
    }

    _onMove(e) {
        if (!this.selected) return;
        this.selected.applyDrag(e.offsetX - this.offsetX, e.offsetY - this.offsetY);
        this.renderer.render();
    }
};
