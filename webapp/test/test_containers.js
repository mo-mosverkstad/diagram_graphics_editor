// --- Group (no wrap) ---
T.suite("Group (no wrap)");
(() => {
    const g = new App.Group({
        x: 10, y: 10,
        children: [
            new App.Rect({ width: 50, height: 30 }),
            new App.Rect({ x: 20, width: 40, height: 60 })
        ]
    });
    const size = g.getSize();
    T.eq("getSize without wrap returns offset only", size, { width: 10, height: 10 });

    const el = g.render({ x: 0, y: 0 });
    T.eq("render is group", el.tagName, "g");
    T.eq("render child count", el.children.length, 2);
})();

// --- Group (with wrap) ---
T.suite("Group (with wrap)");
(() => {
    const g = new App.Group({
        x: 10, y: 10, wrapWidth: true, wrapHeight: true,
        children: [
            new App.Rect({ width: 50, height: 30 }),
            new App.Rect({ x: 20, width: 40, height: 60 })
        ]
    });
    const size = g.getSize();
    T.eq("getSize width", size.width, 70);  // 10 + max(50, 60)
    T.eq("getSize height", size.height, 70); // 10 + max(30, 60)
})();

// --- Table ---
T.suite("Table");
(() => {
    const t = new App.Table({
        x: 0, y: 0, cellWidth: 50, cellHeight: 50, gap: 0,
        children: [
            [new App.Rect({ width: 50, height: 50, fill: "red" }), new App.Rect({ width: 50, height: 50, fill: "blue" })],
            [new App.Rect({ width: 50, height: 50, fill: "green" })]
        ]
    });
    T.eq("rows", t.rows, 2);
    T.eq("cols", t.cols, 2);

    const size = t.getSize();
    T.eq("getSize width", size.width, 100);
    T.eq("getSize height", size.height, 100);

    const el = t.render({ x: 0, y: 0 });
    T.eq("render is group", el.tagName, "g");
})();

T.suite("Table wrapColWidth");
(() => {
    const t = new App.Table({
        wrapColWidth: true, cellWidth: 10, cellHeight: 10, gap: 0,
        children: [
            [new App.Rect({ width: 80, height: 10 }), new App.Rect({ width: 30, height: 10 })],
            [new App.Rect({ width: 50, height: 10 }), new App.Rect({ width: 60, height: 10 })]
        ]
    });
    const size = t.getSize();
    T.eq("col0 uses max width 80", size.width, 140); // 80 + 60
})();

// --- ReusableComponent ---
T.suite("ReusableComponent");
(() => {
    App.defineLayout("TestBox", {
        params: { w: 100, h: 50, color: "gray" },
        body: [
            { type: "Rect", width: "$w", height: "$h", fill: "$color" }
        ]
    });

    const rc = new App.ReusableComponent({ template: "TestBox", x: 10, y: 10, w: 200, h: 80, color: "red" });
    const el = rc.render({ x: 0, y: 0 });
    T.eq("render is group", el.tagName, "g");

    const rect = el.children[0];
    T.eq("child is rect", rect.tagName, "rect");
    T.eq("param override width", rect.getAttribute("width"), "200");
    T.eq("param override fill", rect.getAttribute("fill"), "red");
})();

T.suite("ReusableComponent unknown template");
(() => {
    const rc = new App.ReusableComponent({ template: "NonExistent" });
    T.throws("throws on missing template", () => rc.render({ x: 0, y: 0 }));
})();

// --- Renderer ---
T.suite("Renderer");
(() => {
    const svg = document.getElementById("mySVG");
    const shapes = [new App.Rect({ width: 50, height: 50, fill: "red" })];
    const renderer = new App.Renderer(svg, shapes);
    renderer.render();
    T.assert("svg has children after render", svg.children.length > 0);
    T.eq("child tagged with rootNode", svg.children[0].__rootNode, shapes[0]);
    svg.innerHTML = "";
})();
