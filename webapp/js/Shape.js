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
}

class Rect extends Shape {
    constructor({ width = 0, height = 0, ...rest } = {}) {
        super(rest);
        this.width = width;
        this.height = height;
    }

    accept(visitor, offset) { return visitor.visitRect(this, offset); }
    getSize() { return { width: this.x + this.width, height: this.y + this.height }; }

    hitTest(px, py) {
        return px >= this.x && px <= this.x + this.width &&
               py >= this.y && py <= this.y + this.height;
    }
}

class Circle extends Shape {
    constructor({ radius = 0, ...rest } = {}) {
        super(rest);
        this.radius = radius;
    }

    accept(visitor, offset) { return visitor.visitCircle(this, offset); }
    getSize() { return { width: this.x + this.radius * 2, height: this.y + this.radius * 2 }; }

    hitTest(px, py) {
        const dx = px - this.x, dy = py - this.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }
}

class Ellipse extends Shape {
    constructor({ rx = 0, ry = 0, ...rest } = {}) {
        super(rest);
        this.rx = rx;
        this.ry = ry;
    }

    accept(visitor, offset) { return visitor.visitEllipse(this, offset); }
    getSize() { return { width: this.x + this.rx * 2, height: this.y + this.ry * 2 }; }

    hitTest(px, py) {
        const dx = (px - this.x) / this.rx, dy = (py - this.y) / this.ry;
        return dx * dx + dy * dy <= 1;
    }
}

class TextShape extends Shape {
    constructor({ text = "", alignmentBaseline = "auto", ...rest } = {}) {
        super(rest);
        this.text = text;
        this.alignmentBaseline = alignmentBaseline;
    }

    accept(visitor, offset) { return visitor.visitText(this, offset); }
    _measureWidth() { return this.text.length * 7.2; }
    getSize() { return { width: this.x + this._measureWidth(), height: this.y + 16 }; }

    hitTest(px, py) {
        return px >= this.x && px <= this.x + this._measureWidth() &&
               py >= this.y - 16 && py <= this.y;
    }
}

class Line extends Shape {
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
}

class Polygon extends Shape {
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
}

class Polyline extends Shape {
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
}

App.Shape = Shape;
App.Rect = Rect;
App.Circle = Circle;
App.Ellipse = Ellipse;
App.TextShape = TextShape;
App.Line = Line;
App.Polygon = Polygon;
App.Polyline = Polyline;
