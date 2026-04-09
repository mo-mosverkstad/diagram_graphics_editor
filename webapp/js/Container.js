window.App = window.App || {};

class Group extends App.Shape {
    constructor({ children = [], ...rest } = {}) {
        super(rest);
        this.children = children;
    }

    _computeSize() {
        let w = 0, h = 0;
        for (const child of this.children) {
            const s = child.getSize();
            w = Math.max(w, s.width);
            h = Math.max(h, s.height);
        }
        if (this.wrapWidth) this.width = w;
        if (this.wrapHeight) this.height = h;
    }

    render(offset) {
        this._computeSize();
        const childOffset = { x: offset.x + this.x, y: offset.y + this.y };
        const els = this.children.flatMap(child => {
            const el = child.render(childOffset);
            return Array.isArray(el) ? el : [el];
        });
        return App.SvgHelper.createGroup(els, null);
    }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || 0), height: this.y + (this.height || 0) };
    }
}

class Table extends App.Shape {
    constructor({ cellWidth = 50, cellHeight = 50, gap = 0, wrapColWidth = false, wrapColHeight = false, children = [[]], ...rest } = {}) {
        super(rest);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gap = gap;
        this.wrapColWidth = wrapColWidth;
        this.wrapColHeight = wrapColHeight;
        this.children = children;
    }

    get rows() { return this.children.length; }
    get cols() { return Math.max(...this.children.map(r => r.length), 0); }

    _computeSize() {
        if (this.wrapColWidth) {
            this.colWidths = Array(this.cols).fill(this.cellWidth);
            for (const row of this.children)
                for (let c = 0; c < row.length; c++)
                    if (row[c]) this.colWidths[c] = Math.max(this.colWidths[c], row[c].getSize().width);
        } else if (this.wrapWidth) {
            let maxW = 0;
            for (const child of this.children.flat()) maxW = Math.max(maxW, child.getSize().width);
            this.colWidths = Array(this.cols).fill(Math.max(this.cellWidth, maxW));
        } else {
            this.colWidths = Array(this.cols).fill(this.cellWidth);
        }

        if (this.wrapColHeight) {
            this.rowHeights = Array(this.rows).fill(this.cellHeight);
            for (let r = 0; r < this.rows; r++)
                for (const child of this.children[r])
                    if (child) this.rowHeights[r] = Math.max(this.rowHeights[r], child.getSize().height);
        } else if (this.wrapHeight) {
            let maxH = 0;
            for (const child of this.children.flat()) maxH = Math.max(maxH, child.getSize().height);
            this.rowHeights = Array(this.rows).fill(Math.max(this.cellHeight, maxH));
        } else {
            this.rowHeights = Array(this.rows).fill(this.cellHeight);
        }
    }

    render(offset) {
        this._computeSize();
        const baseX = offset.x + this.x;
        const baseY = offset.y + this.y;
        const els = [];
        let cy = 0;

        for (let r = 0; r < this.rows; r++) {
            let cx = 0;
            for (let c = 0; c < (this.children[r]?.length || 0); c++) {
                const child = this.children[r][c];
                if (child) {
                    child.applyContainer(this.colWidths[c], this.rowHeights[r]);
                    const el = child.render({ x: baseX + cx, y: baseY + cy });
                    els.push(...(Array.isArray(el) ? el : [el]));
                }
                cx += this.colWidths[c] + this.gap;
            }
            cy += this.rowHeights[r] + this.gap;
        }
        return App.SvgHelper.createGroup(els, null);
    }

    getSize() {
        this._computeSize();
        const w = this.colWidths.reduce((a, b) => a + b, 0) + (this.cols - 1) * this.gap;
        const h = this.rowHeights.reduce((a, b) => a + b, 0) + (this.rows - 1) * this.gap;
        return { width: this.x + w, height: this.y + h };
    }
}

App.Group = Group;
App.Table = Table;
