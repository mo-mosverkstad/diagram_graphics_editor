window.App = window.App || {};

App.Polyline = class Polyline extends App.Shape {
    constructor({ points = [], stroke = "black", strokeWidth = 1, ...rest } = {}) {
        super({ ...rest, fill: rest.fill ?? "none" });
        this.points = points;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
    }

    accept(visitor, offset) { return visitor.visitPolyline(this, offset); }
    getAnchor() { return this.points[0] ?? { x: 0, y: 0 }; }

    applyDrag(newX, newY) {
        const dx = newX - this.points[0].x, dy = newY - this.points[0].y;
        this.points = this.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
    }

    getSize() {
        return {
            width: Math.max(...this.points.map(p => p.x)),
            height: Math.max(...this.points.map(p => p.y))
        };
    }

    hitTest(px, py) {
        const tol = Math.max(this.strokeWidth, 5);
        for (let i = 0; i < this.points.length - 1; i++) {
            if (App.Shape._ptSegDist(px, py, this.points[i].x, this.points[i].y,
                this.points[i + 1].x, this.points[i + 1].y) <= tol) return true;
        }
        return false;
    }
};
