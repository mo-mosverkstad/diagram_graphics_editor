window.App = window.App || {};

class Group extends App.Shape {
    constructor({ children = [], ...rest } = {}) {
        super(rest);
        this.children = children;
    }

    render(offset) {
        const childOffset = { x: offset.x + this.x, y: offset.y + this.y };
        const els = this.children.flatMap(child => {
            const el = child.render(childOffset);
            return Array.isArray(el) ? el : [el];
        });
        return App.SvgHelper.createGroup(els, null);
    }
}

class Table extends App.Shape {
    constructor({ rows = 1, cols = 1, cellWidth = 50, cellHeight = 50, gap = 0, children = [], ...rest } = {}) {
        super(rest);
        this.rows = rows;
        this.cols = cols;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gap = gap;
        this.children = children;
    }

    render(offset) {
        const baseX = offset.x + this.x;
        const baseY = offset.y + this.y;
        const els = [];
        let index = 0;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (!this.children[index]) continue;
                const child = this.children[index++];
                child.applyContainer(this.cellWidth, this.cellHeight);
                const cellOffset = {
                    x: baseX + c * (this.cellWidth + this.gap),
                    y: baseY + r * (this.cellHeight + this.gap)
                };
                const el = child.render(cellOffset);
                els.push(...(Array.isArray(el) ? el : [el]));
            }
        }
        return App.SvgHelper.createGroup(els, null);
    }
}

App.Group = Group;
App.Table = Table;
