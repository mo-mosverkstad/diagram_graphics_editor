window.App = window.App || {};

App.RenderVisitor = class RenderVisitor {
    visitRect(shape, offset) { throw new Error("Not implemented"); }
    visitCircle(shape, offset) { throw new Error("Not implemented"); }
    visitEllipse(shape, offset) { throw new Error("Not implemented"); }
    visitText(shape, offset) { throw new Error("Not implemented"); }
    visitLine(shape, offset) { throw new Error("Not implemented"); }
    visitPolygon(shape, offset) { throw new Error("Not implemented"); }
    visitPolyline(shape, offset) { throw new Error("Not implemented"); }
    visitGroup(group, offset) { throw new Error("Not implemented"); }
    visitTable(table, offset) { throw new Error("Not implemented"); }
    visitReusableComponent(comp, offset) { throw new Error("Not implemented"); }
    visitVirtualComponent(comp, offset) { throw new Error("Not implemented"); }
};
