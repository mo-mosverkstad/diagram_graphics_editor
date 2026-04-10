window.App = window.App || {};

App.Rect = class Rect extends App.Shape {
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
};
