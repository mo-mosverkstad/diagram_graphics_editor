window.App = window.App || {};

App.defineLayout("Button", {
    params: { width: 70, height: 10, text: "Btn", fill: "lightgray" },
    body: [
        { type: "Rect", width: "$width", height: "$height", fill: "$fill"},
        { type: "TextShape", text: "$text", fill: "black", alignmentBaseline: "hanging" }
    ]
});

// External mutable data — Store wraps it so mutations auto-trigger render
App.shapeStore = null; // initialized in main.js after renderer exists
App._rawShapeData = [
    { type: "Rect", width: 80, height: 30, fill: "tomato" },
    { type: "Circle", radius: 15, fill: "dodgerblue" },
];

App.components = [
    new App.Circle({ x: 100, y: 100, radius: 40, fill: "blue" }),

    new App.Group({
        x: 200, y: 100,
        children: [
            new App.Rect({ width: 100, height: 50, fill: "green" }),
            new App.Circle({ x: 120, y: 25, radius: 20, fill: "orange" })
        ]
    }),

    new App.Table({
        x: 100, y: 250,
        // cellWidth: 80, cellHeight: 80, gap: 10,
        wrapColWidth: true, wrapColHeight: true, gap: 0,
        children: [
            [new App.Rect({ width: 60, height: 60, fill: "red" }), new App.Rect({ width: 60, height: 60, fill: "blue" }), new App.Circle({ radius: 25, fill: "orange" })],
            [new App.Circle({ radius: 25, fill: "purple" }), new App.Circle({ radius: 25, fill: "black" }), new App.Circle({ radius: 25, fill: "gray" })]
        ]
    }),

    new App.ReusableComponent({ template: "Button", x: 400, y: 100, text: "Drag me! More text more text.", wrapWidth: true}),
    new App.ReusableComponent({ template: "Button", x: 100, y: 100, text: "Drag me! Button", wrapWidth: true, wrapHeight: true}),
    new App.Line({ x1: 100, y1: 100, x2: 200, y2: 200 }),

    // VirtualComponent: reads from store - mutations auto-render
    new App.VirtualComponent({
        x: 500, y: 250, direction: "vertical",
        dataSource: () => App.shapeStore ? App.shapeStore.data : App._rawShapeData
    })
];
