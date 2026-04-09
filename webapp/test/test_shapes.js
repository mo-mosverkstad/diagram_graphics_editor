// --- Rect ---
T.suite("Rect");
(() => {
    const r = new App.Rect({ x: 10, y: 20, width: 100, height: 50, fill: "red" });
    T.eq("getSize", r.getSize(), { width: 110, height: 70 });
    T.eq("getAnchor", r.getAnchor(), { x: 10, y: 20 });

    const el = r.render({ x: 5, y: 5 });
    T.eq("render tag", el.tagName, "rect");
    T.eq("render x", el.getAttribute("x"), "15");
    T.eq("render fill", el.getAttribute("fill"), "red");

    r.applyDrag(30, 40);
    T.eq("applyDrag", r.getAnchor(), { x: 30, y: 40 });

    const r2 = new App.Rect({ width: 50, height: 50, wrapWidth: true });
    r2.applyContainer(200, 100);
    T.eq("wrapWidth", r2.width, 200);
})();

// --- Circle ---
T.suite("Circle");
(() => {
    const c = new App.Circle({ x: 10, y: 10, radius: 25, fill: "blue" });
    T.eq("getSize", c.getSize(), { width: 60, height: 60 });

    const el = c.render({ x: 0, y: 0 });
    T.eq("render tag", el.tagName, "circle");
    T.eq("render r", el.getAttribute("r"), "25");
})();

// --- Ellipse ---
T.suite("Ellipse");
(() => {
    const e = new App.Ellipse({ x: 5, y: 5, rx: 30, ry: 20 });
    T.eq("getSize", e.getSize(), { width: 65, height: 45 });

    const el = e.render({ x: 0, y: 0 });
    T.eq("render tag", el.tagName, "ellipse");
})();

// --- TextShape ---
T.suite("TextShape");
(() => {
    const t = new App.TextShape({ x: 0, y: 0, text: "Hi" });
    T.assert("getSize width > 0", t.getSize().width > 0);
    T.eq("getSize height", t.getSize().height, 16);

    const el = t.render({ x: 0, y: 0 });
    T.eq("render tag", el.tagName, "text");
    T.eq("render textContent", el.textContent, "Hi");
})();

// --- Line ---
T.suite("Line");
(() => {
    const l = new App.Line({ x1: 10, y1: 20, x2: 100, y2: 200 });
    T.eq("getAnchor", l.getAnchor(), { x: 10, y: 20 });
    T.eq("getSize", l.getSize(), { width: 100, height: 200 });

    l.applyDrag(20, 30);
    T.eq("applyDrag anchor", l.getAnchor(), { x: 20, y: 30 });
    T.eq("applyDrag x2 shifted", l.x2, 110);
})();

// --- Polygon ---
T.suite("Polygon");
(() => {
    const p = new App.Polygon({ points: [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 25, y: 50 }] });
    T.eq("getAnchor", p.getAnchor(), { x: 0, y: 0 });
    T.eq("getSize", p.getSize(), { width: 50, height: 50 });

    p.applyDrag(10, 10);
    T.eq("applyDrag first point", p.points[0], { x: 10, y: 10 });
})();

// --- Polyline ---
T.suite("Polyline");
(() => {
    const p = new App.Polyline({ points: [{ x: 0, y: 0 }, { x: 30, y: 40 }], stroke: "red" });
    T.eq("getSize", p.getSize(), { width: 30, height: 40 });
    T.eq("default fill", p.fill, "none");

    const el = p.render({ x: 0, y: 0 });
    T.eq("render tag", el.tagName, "polyline");
})();

// --- Shape base ---
T.suite("Shape base");
(() => {
    const s = new App.Shape();
    T.throws("render throws", () => s.render({ x: 0, y: 0 }));
    T.eq("default getSize", s.getSize(), { width: 0, height: 0 });
})();
