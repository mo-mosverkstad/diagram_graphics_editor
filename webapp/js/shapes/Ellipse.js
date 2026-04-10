window.App = window.App || {};

App.Ellipse = class Ellipse extends App.Shape {
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
};
