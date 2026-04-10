window.App = window.App || {};

App.Circle = class Circle extends App.Shape {
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
};
