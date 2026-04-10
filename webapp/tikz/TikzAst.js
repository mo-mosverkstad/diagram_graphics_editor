window.Tikz = window.Tikz || {};

Tikz.Node = class Node {
    constructor(type, opts = {}, children = []) {
        this.type = type;
        this.opts = opts;
        this.children = children;
    }
};

Tikz.picture = (opts, ...children) => new Tikz.Node("picture", opts, children);
Tikz.draw = (opts, ...coords) => new Tikz.Node("draw", opts, coords);
Tikz.fill = (opts, ...coords) => new Tikz.Node("fill", opts, coords);
Tikz.filldraw = (opts, ...coords) => new Tikz.Node("filldraw", opts, coords);
Tikz.node = (opts, text) => new Tikz.Node("node", { ...opts, text });
Tikz.coord = (x, y) => ({ x, y });
Tikz.circle = (opts) => new Tikz.Node("circle", opts);
Tikz.ellipse = (opts) => new Tikz.Node("ellipse", opts);
Tikz.rectangle = (from, to) => new Tikz.Node("rectangle", { from, to });
