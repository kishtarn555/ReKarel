import { WorldRenderer } from "../worldRenderer";
import { CellSelection } from "./selection";

export type SelectionBox = {
    main: HTMLElement,
    left: HTMLElement,
    right: HTMLElement,
    top: HTMLElement,
    bottom: HTMLElement,
}

export class SelectionWaffle {
    box: SelectionBox

    constructor(box: SelectionBox) {
        this.box = box;
    }



    UpdateWaffle(selection: CellSelection, renderer: WorldRenderer) {

        let point = {
            r: selection.r,
            c: selection.c
        };

        let point2 = {
            r: selection.r + (selection.rows-1) * selection.dr, 
            c: selection.c + (selection.cols-1) * selection.dc
        };

        if (point2.r > point.r) {
            let r = point.r;
            point.r = point2.r;
            point2.r = r;
        }
        if (point2.c < point.c) {
            let c = point.c;
            point.c = point2.c;
            point2.c = c;
        }

        
        let coords = renderer.CellToPoint(point.r, point.c);
        let coords2 = renderer.CellToPoint(point2.r-1, point2.c+1);
        
        let selectionBox = this.box.main;
        selectionBox.style.top = `${coords.y / window.devicePixelRatio}px`
        selectionBox.style.left = `${coords.x / window.devicePixelRatio}px`
        const width = `${(coords2.x - coords.x)}px`
        const height = `${(coords2.y - coords.y)}px`

        // console.log(CellSize);
        
        // console.log('scale',renderer.scale);
        this.box.top.style.maxWidth = width;
        this.box.top.style.minWidth = width;

        this.box.bottom.style.maxWidth = width;
        this.box.bottom.style.minWidth = width;

        this.box.right.style.left = width;

        this.box.left.style.maxHeight = height;
        this.box.left.style.minHeight = height;

        this.box.right.style.maxHeight = height;
        this.box.right.style.minHeight = height;

        this.box.bottom.style.top = height;

    }
}