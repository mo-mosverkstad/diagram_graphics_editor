window.App = window.App || {};

App.TextShape = class TextShape extends App.Shape {
    constructor({ text = "", alignmentBaseline = "auto", ...rest } = {}) {
        super(rest);
        this.text = text;
        this.alignmentBaseline = alignmentBaseline;
    }

    accept(visitor, offset) { return visitor.visitText(this, offset); }
    _measureWidth() { return this.text.length * 7.2; }
    getSize() { return { width: this.x + this._measureWidth(), height: this.y + 16 }; }

    hitTest(px, py) {
        const top = this.alignmentBaseline === "hanging" ? this.y : this.y - 16;
        return px >= this.x && px <= this.x + this._measureWidth() &&
               py >= top && py <= top + 16;
    }
};
