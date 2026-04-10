// TikZ application layer — uses the graphics framework via VirtualComponent
const t = Tikz;
const mapper = new Tikz.Mapper(80);

const ast = t.picture({},
    t.fill({ color: "lightblue" },  t.coord(0, 0), t.rectangle(t.coord(0, 0), t.coord(3, 2))),
    t.draw({ color: "red" },        t.coord(0, 0), t.coord(3, 2)),
    t.fill({ color: "orange" },     t.coord(1.5, 1), t.circle({ radius: 0.5 })),
    t.node({ x: 0.2, y: 2.2 },     "TikZ diagram")
);

// Bridge: TikZ AST → graphics framework via VirtualComponent's dataSource
App.tikzView = new App.VirtualComponent({
    x: 400, y: 300,
    dataSource: () => mapper.map(ast)
});

App.components.push(App.tikzView);
