window.App = window.App || {};

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === "textContent") el.textContent = v;
        else el.setAttribute(k, v);
    }
    return el;
}

function svgGroup(elements) {
    const g = document.createElementNS(SVG_NS, "g");
    elements.forEach(el => g.appendChild(el));
    return g;
}

App.SvgRenderVisitor = class SvgRenderVisitor extends App.RenderVisitor {
    visitRect(shape, offset) {
        return svgEl("rect", {
            x: offset.x + shape.x, y: offset.y + shape.y,
            width: shape.width, height: shape.height, fill: shape.fill
        });
    }

    visitCircle(shape, offset) {
        return svgEl("circle", {
            cx: offset.x + shape.x, cy: offset.y + shape.y,
            r: shape.radius, fill: shape.fill
        });
    }

    visitEllipse(shape, offset) {
        return svgEl("ellipse", {
            cx: offset.x + shape.x, cy: offset.y + shape.y,
            rx: shape.rx, ry: shape.ry, fill: shape.fill
        });
    }

    visitText(shape, offset) {
        return svgEl("text", {
            x: offset.x + shape.x, y: offset.y + shape.y,
            fill: shape.fill, "alignment-baseline": shape.alignmentBaseline,
            textContent: shape.text
        });
    }

    visitLine(shape, offset) {
        return svgEl("line", {
            x1: shape.x1 + offset.x, y1: shape.y1 + offset.y,
            x2: shape.x2 + offset.x, y2: shape.y2 + offset.y,
            stroke: shape.stroke, "stroke-width": shape.strokeWidth
        });
    }

    visitPolygon(shape, offset) {
        const pts = shape.points.map(p => `${p.x + offset.x},${p.y + offset.y}`).join(" ");
        return svgEl("polygon", { points: pts, fill: shape.fill });
    }

    visitPolyline(shape, offset) {
        const pts = shape.points.map(p => `${p.x + offset.x},${p.y + offset.y}`).join(" ");
        return svgEl("polyline", {
            points: pts, stroke: shape.stroke,
            "stroke-width": shape.strokeWidth, fill: shape.fill
        });
    }

    _svgContainerBg(container, offset) {
        if (!this._hasBackground(container)) return null;
        const b = this._getBounds(container, offset);
        const attrs = { x: b.x, y: b.y, width: b.w, height: b.h, fill: "none" };
        if (container.fill && container.fill !== "none") attrs.fill = container.fill;
        if (container.stroke) {
            attrs.stroke = container.stroke;
            attrs["stroke-width"] = container.strokeWidth;
        }
        return svgEl("rect", attrs);
    }

    visitGroup(group, offset) {
        group._computeSize();
        const childOffset = { x: offset.x + group.x, y: offset.y + group.y };
        const els = [];
        const bg = this._svgContainerBg(group, offset);
        if (bg) els.push(bg);
        for (const child of group.children) {
            const el = child.accept(this, childOffset);
            els.push(...(Array.isArray(el) ? el : [el]));
        }
        return svgGroup(els);
    }

    visitTable(table, offset) {
        table._computeSize();
        const baseX = offset.x + table.x;
        const baseY = offset.y + table.y;
        const els = [];
        const bg = this._svgContainerBg(table, offset);
        if (bg) els.push(bg);
        let cy = 0;

        for (let r = 0; r < table.rows; r++) {
            let cx = 0;
            for (let c = 0; c < (table.children[r]?.length || 0); c++) {
                const child = table.children[r][c];
                if (child) {
                    child.applyContainer(table.colWidths[c], table.rowHeights[r]);
                    const el = child.accept(this, { x: baseX + cx, y: baseY + cy });
                    els.push(...(Array.isArray(el) ? el : [el]));
                }
                cx += table.colWidths[c] + table.gap;
            }
            cy += table.rowHeights[r] + table.gap;
        }
        return svgGroup(els);
    }

    visitReusableComponent(comp, offset) {
        const layout = App._layouts[comp.template];
        const children = comp._buildChildren();
        comp._computeSize(children);

        if (comp.wrapWidth || comp.wrapHeight) {
            for (const child of children) {
                if (comp.wrapWidth && child.width !== undefined) child.width = comp.width;
                if (comp.wrapHeight && child.height !== undefined) child.height = comp.height;
            }
        }

        const baseOffset = { x: offset.x + comp.x, y: offset.y + comp.y };
        const els = [];
        const bg = this._svgContainerBg(comp, offset);
        if (bg) els.push(bg);
        let cursorY = 0;

        for (const child of children) {
            const childOffset = { x: baseOffset.x, y: baseOffset.y + cursorY };
            const el = child.accept(this, childOffset);
            els.push(...(Array.isArray(el) ? el : [el]));
            if (layout.direction === "vertical") {
                cursorY += child.getSize().height;
            }
        }
        return svgGroup(els);
    }

    visitVirtualComponent(comp, offset) {
        const children = comp._computeSize();
        const baseOffset = { x: offset.x + comp.x, y: offset.y + comp.y };
        const els = [];
        const bg = this._svgContainerBg(comp, offset);
        if (bg) els.push(bg);
        let cursorY = 0;
        for (const child of children) {
            const el = child.accept(this, { x: baseOffset.x, y: baseOffset.y + cursorY });
            els.push(...(Array.isArray(el) ? el : [el]));
            if (comp.direction === "vertical") cursorY += child.getSize().height;
        }
        return svgGroup(els);
    }
};
