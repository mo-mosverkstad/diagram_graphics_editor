window.App = window.App || {};

App.CanvasRenderVisitor = class CanvasRenderVisitor extends App.RenderVisitor {
    constructor(ctx) {
        super();
        this.ctx = ctx;
    }

    visitRect(shape, offset) {
        this.ctx.fillStyle = shape.fill;
        this.ctx.fillRect(offset.x + shape.x, offset.y + shape.y, shape.width, shape.height);
    }

    visitCircle(shape, offset) {
        this.ctx.beginPath();
        this.ctx.arc(offset.x + shape.x, offset.y + shape.y, shape.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = shape.fill;
        this.ctx.fill();
    }

    visitEllipse(shape, offset) {
        this.ctx.beginPath();
        this.ctx.ellipse(offset.x + shape.x, offset.y + shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = shape.fill;
        this.ctx.fill();
    }

    visitText(shape, offset) {
        this.ctx.fillStyle = shape.fill;
        this.ctx.textBaseline = shape.alignmentBaseline === "hanging" ? "hanging" : "alphabetic";
        this.ctx.font = "16px sans-serif";
        this.ctx.fillText(shape.text, offset.x + shape.x, offset.y + shape.y);
    }

    visitLine(shape, offset) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1 + offset.x, shape.y1 + offset.y);
        this.ctx.lineTo(shape.x2 + offset.x, shape.y2 + offset.y);
        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.stroke();
    }

    visitPolygon(shape, offset) {
        if (!shape.points.length) return;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x + offset.x, shape.points[0].y + offset.y);
        for (let i = 1; i < shape.points.length; i++)
            this.ctx.lineTo(shape.points[i].x + offset.x, shape.points[i].y + offset.y);
        this.ctx.closePath();
        this.ctx.fillStyle = shape.fill;
        this.ctx.fill();
    }

    visitPolyline(shape, offset) {
        if (!shape.points.length) return;
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x + offset.x, shape.points[0].y + offset.y);
        for (let i = 1; i < shape.points.length; i++)
            this.ctx.lineTo(shape.points[i].x + offset.x, shape.points[i].y + offset.y);
        this.ctx.strokeStyle = shape.stroke;
        this.ctx.lineWidth = shape.strokeWidth;
        this.ctx.stroke();
    }

    _drawContainerBg(container, offset) {
        if (!this._hasBackground(container)) return;
        const b = this._getBounds(container, offset);
        if (container.fill && container.fill !== "none") {
            this.ctx.fillStyle = container.fill;
            this.ctx.fillRect(b.x, b.y, b.w, b.h);
        }
        if (container.stroke) {
            this.ctx.strokeStyle = container.stroke;
            this.ctx.lineWidth = container.strokeWidth;
            this.ctx.strokeRect(b.x, b.y, b.w, b.h);
        }
    }

    visitGroup(group, offset) {
        group._computeSize();
        this._drawContainerBg(group, offset);
        const childOffset = { x: offset.x + group.x, y: offset.y + group.y };
        for (const child of group.children) child.accept(this, childOffset);
    }

    visitTable(table, offset) {
        table._computeSize();
        this._drawContainerBg(table, offset);
        const baseX = offset.x + table.x;
        const baseY = offset.y + table.y;
        let cy = 0;

        for (let r = 0; r < table.rows; r++) {
            let cx = 0;
            for (let c = 0; c < (table.children[r]?.length || 0); c++) {
                const child = table.children[r][c];
                if (child) {
                    child.applyContainer(table.colWidths[c], table.rowHeights[r]);
                    child.accept(this, { x: baseX + cx, y: baseY + cy });
                }
                cx += table.colWidths[c] + table.gap;
            }
            cy += table.rowHeights[r] + table.gap;
        }
    }

    visitReusableComponent(comp, offset) {
        const layout = App._layouts[comp.template];
        const children = comp._buildChildren();
        comp._computeSize(children);
        this._drawContainerBg(comp, offset);

        if (comp.wrapWidth || comp.wrapHeight) {
            for (const child of children) {
                if (comp.wrapWidth && child.width !== undefined) child.width = comp.width;
                if (comp.wrapHeight && child.height !== undefined) child.height = comp.height;
            }
        }

        const baseOffset = { x: offset.x + comp.x, y: offset.y + comp.y };
        let cursorY = 0;

        for (const child of children) {
            child.accept(this, { x: baseOffset.x, y: baseOffset.y + cursorY });
            if (layout.direction === "vertical") {
                cursorY += child.getSize().height;
            }
        }
    }

    visitVirtualComponent(comp, offset) {
        const children = comp._computeSize();
        this._drawContainerBg(comp, offset);
        const baseOffset = { x: offset.x + comp.x, y: offset.y + comp.y };
        let cursorY = 0;
        for (const child of children) {
            child.accept(this, { x: baseOffset.x, y: baseOffset.y + cursorY });
            if (comp.direction === "vertical") cursorY += child.getSize().height;
        }
    }
};
