window.App = window.App || {};

class Shape {
    constructor({ x = 0, y = 0, fill = "black", wrapWidth = false, wrapHeight = false } = {}) {
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.wrapWidth = wrapWidth;
        this.wrapHeight = wrapHeight;
    }

    applyContainer(containerW, containerH) {
        if (this.wrapWidth) this.width = containerW;
        if (this.wrapHeight) this.height = containerH;
    }

    accept(visitor, offset) { throw new Error("Not implemented"); }
    getSize() { return { width: 0, height: 0 }; }
    getAnchor() { return { x: this.x, y: this.y }; }
    applyDrag(newX, newY) { this.x = newX; this.y = newY; }
    hitTest(px, py) { return false; }

    static _ptSegDist(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const lenSq = dx * dx + dy * dy;
        let t = lenSq ? ((px - x1) * dx + (py - y1) * dy) / lenSq : 0;
        t = Math.max(0, Math.min(1, t));
        const cx = x1 + t * dx, cy = y1 + t * dy;
        return Math.hypot(px - cx, py - cy);
    }

    static _ptInPolygon(px, py, points) {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;
            if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi)
                inside = !inside;
        }
        return inside;
    }
}

App.Shape = Shape;
