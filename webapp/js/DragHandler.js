window.App = window.App || {};

App.DragHandler = class DragHandler {
    constructor(svg, renderer) {
        this.svg = svg;
        this.renderer = renderer;
        this.selected = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this._bind();
    }

    _bind() {
        this.svg.addEventListener("mousedown", (e) => this._onDown(e));
        this.svg.addEventListener("mousemove", (e) => this._onMove(e));
        this.svg.addEventListener("mouseup", () => this.selected = null);
        this.svg.addEventListener("mouseleave", () => this.selected = null);
    }

    _onDown(e) {
        if (!e.target.__rootNode) return;
        this.selected = e.target.__rootNode;
        const { x, y } = this.selected.getAnchor();
        this.offsetX = e.offsetX - x;
        this.offsetY = e.offsetY - y;
    }

    _onMove(e) {
        if (!this.selected) return;
        this.selected.applyDrag(e.offsetX - this.offsetX, e.offsetY - this.offsetY);
        this.renderer.render();
    }
};
