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
        this._boundsW = w;
        this._boundsH = h;
    }

    accept(visitor, offset) { return visitor.visitGroup(this, offset); }

    getSize() {
        this._computeSize();
        return { width: this.x + (this.width || this._boundsW || 0), height: this.y + (this.height || this._boundsH || 0) };
    }

    hitTest(px, py) {
        const s = this.getSize();
        return px >= this.x && px <= s.width && py >= this.y && py <= s.height;
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

    accept(visitor, offset) { return visitor.visitTable(this, offset); }

    getSize() {
        this._computeSize();
        const w = this.colWidths.reduce((a, b) => a + b, 0) + (this.cols - 1) * this.gap;
        const h = this.rowHeights.reduce((a, b) => a + b, 0) + (this.rows - 1) * this.gap;
        return { width: this.x + w, height: this.y + h };
    }

    hitTest(px, py) {
        const s = this.getSize();
        return px >= this.x && px <= s.width && py >= this.y && py <= s.height;
    }
}

App.Group = Group;
App.Table = Table;
