window.Tikz = window.Tikz || {};

Tikz.Mapper = class Mapper {
    constructor(scale = 40) {
        this.scale = scale;
    }

    map(ast) {
        if (ast.type === "picture") return ast.children.flatMap(c => this.map(c));
        const handler = this["_" + ast.type];
        if (!handler) return [];
        const result = handler.call(this, ast);
        return Array.isArray(result) ? result : [result];
    }

    _isNode(obj) { return obj && typeof obj.type === "string" && "opts" in obj; }

    _draw(node) {
        const color = node.opts.color || "black";
        const width = node.opts.lineWidth || 1;
        const last = node.children[node.children.length - 1];

        if (this._isNode(last) && last.type === "circle") {
            const c = node.children[0];
            return new App.Circle({ x: c.x * this.scale, y: c.y * this.scale,
                radius: (last.opts.radius || 1) * this.scale, fill: "none" });
        }
        if (this._isNode(last) && last.type === "ellipse") {
            const c = node.children[0];
            return new App.Ellipse({ x: c.x * this.scale, y: c.y * this.scale,
                rx: (last.opts.xRadius || 1) * this.scale, ry: (last.opts.yRadius || 1) * this.scale, fill: "none" });
        }
        if (this._isNode(last) && last.type === "rectangle") {
            const f = last.opts.from, t = last.opts.to;
            return new App.Rect({
                x: Math.min(f.x, t.x) * this.scale, y: Math.min(f.y, t.y) * this.scale,
                width: Math.abs(t.x - f.x) * this.scale, height: Math.abs(t.y - f.y) * this.scale, fill: "none" });
        }

        const coords = node.children.filter(c => !this._isNode(c));
        if (coords.length === 2) {
            return new App.Line({
                x1: coords[0].x * this.scale, y1: coords[0].y * this.scale,
                x2: coords[1].x * this.scale, y2: coords[1].y * this.scale,
                stroke: color, strokeWidth: width });
        }
        if (coords.length > 2) {
            return new App.Polyline({
                points: coords.map(c => ({ x: c.x * this.scale, y: c.y * this.scale })),
                stroke: color, strokeWidth: width });
        }
        return [];
    }

    _fill(node) {
        const color = node.opts.color || "black";
        const last = node.children[node.children.length - 1];

        if (this._isNode(last) && last.type === "circle") {
            const c = node.children[0];
            return new App.Circle({ x: c.x * this.scale, y: c.y * this.scale,
                radius: (last.opts.radius || 1) * this.scale, fill: color });
        }
        if (this._isNode(last) && last.type === "rectangle") {
            const f = last.opts.from, t = last.opts.to;
            return new App.Rect({
                x: Math.min(f.x, t.x) * this.scale, y: Math.min(f.y, t.y) * this.scale,
                width: Math.abs(t.x - f.x) * this.scale, height: Math.abs(t.y - f.y) * this.scale, fill: color });
        }

        const coords = node.children.filter(c => !this._isNode(c));
        if (coords.length >= 3) {
            return new App.Polygon({
                points: coords.map(c => ({ x: c.x * this.scale, y: c.y * this.scale })), fill: color });
        }
        return [];
    }

    _filldraw(node) { return this._fill(node); }

    _node(node) {
        return new App.TextShape({
            x: (node.opts.x || 0) * this.scale, y: (node.opts.y || 0) * this.scale,
            text: node.opts.text || "", fill: node.opts.color || "black", alignmentBaseline: "hanging" });
    }
};
