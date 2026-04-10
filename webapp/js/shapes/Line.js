window.App = window.App || {};

App.Line = class Line extends App.Shape {
    constructor({ x1 = 0, y1 = 0, x2 = 0, y2 = 0, stroke = "black", strokeWidth = 1 } = {}) {
        super({ x: x1, y: y1 });
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    accept(visitor, offset) { return visitor.visitLine(this, offset); }
    getAnchor() { return { x: this.x1, y: this.y1 }; }

    applyDrag(newX, newY) {
        const dx = newX - this.x1, dy = newY - this.y1;
        this.x1 += dx; this.y1 += dy;
        this.x2 += dx; this.y2 += dy;
    }

    getSize() { return { width: Math.max(this.x1, this.x2), height: Math.max(this.y1, this.y2) }; }

    hitTest(px, py) {
        return App.Shape._ptSegDist(px, py, this.x1, this.y1, this.x2, this.y2) <= Math.max(this.strokeWidth, 5);
    }
};
