window.App = window.App || {};

App.Polygon = class Polygon extends App.Shape {
    constructor({ points = [], ...rest } = {}) {
        super(rest);
        this.points = points;
    }

    accept(visitor, offset) { return visitor.visitPolygon(this, offset); }
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
        return this.points.length >= 3 && App.Shape._ptInPolygon(px, py, this.points);
    }
};
