window.App = window.App || {};

App.SVG_NS = "http://www.w3.org/2000/svg";

App.SvgHelper = class {
    static createElement(tag, attrs) {
        const el = document.createElementNS(App.SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) {
            if (k === "textContent") el.textContent = v;
            else el.setAttribute(k, v);
        }
        return el;
    }

    static createGroup(elements, owner) {
        const g = document.createElementNS(App.SVG_NS, "g");
        elements.forEach(el => g.appendChild(el));
        g.__rootNode = owner;
        return g;
    }
};
