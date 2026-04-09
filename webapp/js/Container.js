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
    constructor({ cellWidth = 50, cellHeight = 50, gap = 0, children = [[]], ...rest } = {}) {
        super(rest);
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.gap = gap;
        this.children = children;
    }

    get rows() { return this.children.length; }
    get cols() { return Math.max(...this.children.map(r => r.length), 0); }

    _computeSize() {
        const flat = this.children.flat();
        if (this.wrapWidth) {
            let maxW = 0;
            for (const child of flat) maxW = Math.max(maxW, child.getSize().width);
            this.cellWidth = maxW;
            this.width = this.cols * this.cellWidth + (this.cols - 1) * this.gap;
        }
        if (this.wrapHeight) {
            let maxH = 0;
            for (const child of flat) maxH = Math.max(maxH, child.getSize().height);
            this.cellHeight = maxH;
            this.height = this.rows * this.cellHeight + (this.rows - 1) * this.gap;
        }
    }

    render(offset) {
        this._computeSize();
        const baseX = offset.x + this.x;
        const baseY = offset.y + this.y;
        const els = [];

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < (this.children[r]?.length || 0); c++) {
                const child = this.children[r][c];
                if (!child) continue;
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

    getSize() {
        this._computeSize();
        const w = this.width || (this.cols * this.cellWidth + (this.cols - 1) * this.gap);
        const h = this.height || (this.rows * this.cellHeight + (this.rows - 1) * this.gap);
        return { width: this.x + w, height: this.y + h };
    }
}

App.Group = Group;
App.Table = Table;
