window.App = window.App || {};

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
