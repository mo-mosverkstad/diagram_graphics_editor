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

    render(offset) { throw new Error("Not implemented"); }
    getSize() { return { width: 0, height: 0 }; }
    getAnchor() { return { x: this.x, y: this.y }; }
    applyDrag(newX, newY) { this.x = newX; this.y = newY; }
}

class Rect extends Shape {
    constructor({ width = 0, height = 0, ...rest } = {}) {
        super(rest);
        this.width = width;
        this.height = height;
    }

    render(offset) {
        return App.SvgHelper.createElement("rect", {
            x: offset.x + this.x, y: offset.y + this.y,
            width: this.width, height: this.height, fill: this.fill
        });
    }

    getSize() { return { width: this.x + this.width, height: this.y + this.height }; }
}

class Circle extends Shape {
    constructor({ radius = 0, ...rest } = {}) {
        super(rest);
        this.radius = radius;
    }

    render(offset) {
        return App.SvgHelper.createElement("circle", {
            cx: offset.x + this.x, cy: offset.y + this.y, r: this.radius, fill: this.fill
        });
    }

    getSize() { return { width: this.x + this.radius * 2, height: this.y + this.radius * 2 }; }
}

class Ellipse extends Shape {
    constructor({ rx = 0, ry = 0, ...rest } = {}) {
        super(rest);
        this.rx = rx;
        this.ry = ry;
    }

    render(offset) {
        return App.SvgHelper.createElement("ellipse", {
            cx: offset.x + this.x, cy: offset.y + this.y, rx: this.rx, ry: this.ry, fill: this.fill
        });
    }

    getSize() { return { width: this.x + this.rx * 2, height: this.y + this.ry * 2 }; }
}

class TextShape extends Shape {
    constructor({ text = "", alignmentBaseline = "auto", ...rest } = {}) {
        super(rest);
        this.text = text;
        this.alignmentBaseline = alignmentBaseline;
    }

    render(offset) {
        return App.SvgHelper.createElement("text", {
            x: offset.x + this.x, y: offset.y + this.y, fill: this.fill,
            "alignment-baseline": this.alignmentBaseline,
            textContent: this.text
        });
    }

    _measureWidth() {
        return this.text.length * 7.2;
    }

    getSize() { return { width: this.x + this._measureWidth(), height: this.y + 16 }; }
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

    render(offset) {
        return App.SvgHelper.createElement("line", {
            x1: this.x1 + offset.x, y1: this.y1 + offset.y,
            x2: this.x2 + offset.x, y2: this.y2 + offset.y,
            stroke: this.stroke, "stroke-width": this.strokeWidth
        });
    }

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

    render(offset) {
        const pts = this.points.map(p => `${p.x + offset.x},${p.y + offset.y}`).join(" ");
        return App.SvgHelper.createElement("polygon", { points: pts, fill: this.fill });
    }

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

    render(offset) {
        const pts = this.points.map(p => `${p.x + offset.x},${p.y + offset.y}`).join(" ");
        return App.SvgHelper.createElement("polyline", {
            points: pts, stroke: this.stroke,
            "stroke-width": this.strokeWidth, fill: this.fill
        });
    }

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
