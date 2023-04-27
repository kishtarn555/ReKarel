import { WorldRenderer } from "./worldRenderer";
import { World } from "../../js/karel";
import { karel } from "../../js";
import { redoDepth } from "@codemirror/history";
import { Collapse } from "bootstrap";

type CellSelection = {
    r: number,
    c: number,
    rows: number,
    cols: number,
    dr: number,
    dc: number,
}

type Gizmos = {
    selectionBox: {
        main: HTMLElement,
        left: HTMLElement,
        right: HTMLElement,
        top: HTMLElement,
        bottom: HTMLElement,
    }
}

class WorldController {
    renderer: WorldRenderer
    container: HTMLElement
    gizmos: Gizmos
    world: World;
    scale: number;
    state: {
        cursorX: number,
        cursorY: number,
    }
    selection: CellSelection


    constructor(renderer: WorldRenderer, container: HTMLElement, world: World, gizmos: Gizmos) {
        this.renderer = renderer;
        this.container = container;
        this.world = world;
        this.selection = {
            r: 1,
            c: 1,
            rows: 1,
            cols: 1,
            dr: 1,
            dc: 1,
        };
        this.state = {
            cursorX: 0,
            cursorY: 0,
        }
        this.gizmos = gizmos;
        this.scale = 1;
    }

    Reset() {
        this.world.reset();
        this.Update();
    }

    GetRuntime() {
        return this.world.runtime;
    }

    
    GetBeepersInBag(): number {
        return this.world.bagBuzzers;
    }

    SetWorld(world: World) {
        this.world = world;
        this.Update();
        this.Select(1,1,1,1);    
    }

    CheckUpdate() {
        if (this.world.dirty) {
            this.Update();
        }
    }

    ErrorMode() {
        this.renderer.ErrorMode();
        this.Update();
    }

    NormalMode() {
        this.renderer.NormalMode();
        this.Update();
    }

    Select(r: number, c: number, r2: number, c2: number) {
        this.selection = {
            r: r,
            c: c,
            rows: Math.abs(r - r2) + 1,
            cols: Math.abs(c - c2) + 1,
            dr: r <= r2 ? 1 : -1,
            dc: c <= c2 ? 1 : -1,
        };
        this.UpdateWaffle();
    }

    MoveSelection(dr: number, dc: number) {
        let r = this.selection.r+dr;
        let c =this.selection.c+dc;

        if (r < 1 || c < 1 || r > this.world.h || c > this.world.w) {
                return;
        }
        this.Select(
            this.selection.r+dr,
            this.selection.c+dc,
            this.selection.r+dr,
            this.selection.c+dc,
        );
    }

    UpdateWaffle() {
        let coords = this.renderer.CellToPoint(this.selection.r, this.selection.c);
        let selectionBox = this.gizmos.selectionBox.main;
        selectionBox.style.top = `${coords.y / window.devicePixelRatio}px`
        selectionBox.style.left = `${coords.x / window.devicePixelRatio}px`
    }

    SetScale(scale: number) {
        this.renderer.scale = scale * window.devicePixelRatio;
        this.scale = scale;
        //FIXME, this should be in update waffle
        this.gizmos.selectionBox.bottom.style.maxWidth = `${this.renderer.CellSize * scale}px`;
        this.gizmos.selectionBox.bottom.style.minWidth = `${this.renderer.CellSize * scale}px`;
        
        this.gizmos.selectionBox.top.style.maxWidth = `${this.renderer.CellSize * scale}px`;
        this.gizmos.selectionBox.top.style.minWidth = `${this.renderer.CellSize * scale}px`;
        
        this.gizmos.selectionBox.left.style.maxHeight = `${this.renderer.CellSize * scale}px`;
        this.gizmos.selectionBox.left.style.minHeight = `${this.renderer.CellSize * scale}px`;
        
        this.gizmos.selectionBox.right.style.maxHeight = `${this.renderer.CellSize * scale}px`;
        this.gizmos.selectionBox.right.style.minHeight = `${this.renderer.CellSize * scale}px`;

        this.gizmos.selectionBox.bottom.style.top = `${this.renderer.CellSize * scale}px`;
        this.gizmos.selectionBox.right.style.left = `${this.renderer.CellSize * scale}px`;


        this.UpdateWaffle();
        this.Update();        
    }

    TrackMouse(e: MouseEvent) {
        let canvas = this.renderer.canvasContext.canvas;
        let boundingBox = canvas.getBoundingClientRect();
        let x = (e.clientX - boundingBox.left) * canvas.width / boundingBox.width;
        let y = (e.clientY - boundingBox.top) * canvas.height / boundingBox.height;
        this.state.cursorX = x / this.renderer.scale;
        this.state.cursorY = y / this.renderer.scale;
    }

    ClickUp(e: MouseEvent) {
        let cell = this.renderer.PointToCell(this.state.cursorX, this.state.cursorY);
        if (cell.r < 0) {
            return;
        }
        this.Select(cell.r, cell.c, cell.r, cell.c);
        console.log(this.selection.r, this.selection.c);


    }

    SetKarelOnSelection(direction: "north" | "east" | "west" | "south" = "north") {
        this.world.move(this.selection.r, this.selection.c);
        switch (direction) {
            case "north":
                this.world.rotate('NORTE');
                break;
            case "east":
                this.world.rotate('ESTE');
                break;
            case "south":
                this.world.rotate('SUR');
                break;
            case "west":
                this.world.rotate('OESTE');
                break;
        }
        this.Update();

    }

    ChangeBeepers(delta: number) {
        if (delta === 0) {
            return;
        }
        let buzzers = this.world.buzzers(this.selection.r, this.selection.c);
        if (buzzers < 0 && delta < 0) {
            //Do nothing
            return;
        }
        buzzers += delta;
        if (buzzers < 0) {
            buzzers = 0;
        }
        this.world.setBuzzers(
            this.selection.r,
            this.selection.c,
            buzzers
        );
        this.Update();
    }

    SetBeepers(ammount: number) {
        if (this.world.buzzers(this.selection.r, this.selection.c) === ammount) {
            return;
        }
        this.world.setBuzzers(this.selection.r, this.selection.c, ammount);
        this.Update();
    }

    ToggleKarelPosition() {
        this.world.move(this.selection.r, this.selection.c);
        this.world.rotate();
        this.Update();
    }

    FocusOrigin() {
        this.container.scrollLeft = 0;
        this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;
    }

    FocusKarel() {
        let r = Math.max(1, this.world.i - 2);
        let c = Math.max(1, this.world.j - 2);

        this.FocusTo(r, c);
    }
    
    FocusSelection() {
        let r = Math.max(1, this.selection.r - 2);
        let c = Math.max(1, this.selection.c - 2);

        this.FocusTo(r, c);
    }

    FocusTo(r: number, c: number) {


        let left = c / (this.world.w - this.renderer.GetColCount("floor") + 1);
        left = left < 0 ? 0 : left;
        left = left > 1 ? 1 : left;
        let top = r / (this.world.h - this.renderer.GetRowCount("floor") + 1);
        top = top < 0 ? 0 : top;
        top = top > 1 ? 1 : top;

        this.container.scrollLeft = left * (this.container.scrollWidth - this.container.clientWidth);
        this.container.scrollTop = (1 - top) * (this.container.scrollHeight - this.container.clientHeight);
    }

    ToggleWall(which: "north" | "east" | "west" | "south" | "outer") {
        switch (which) {
            case "north":
                for (let i = 0; i < this.selection.rows; i++) {
                    let r = this.selection.r + i * this.selection.dr;
                    let c = Math.min(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    this.world.toggleWall(r, c, 1);
                }
                break;
            case "south":
                for (let i = 0; i < this.selection.rows; i++) {
                    let r = this.selection.r + i * this.selection.dr;
                    let c = Math.max(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    this.world.toggleWall(r, c, 3);
                }
                break;
            case "west":
                for (let i = 0; i < this.selection.cols; i++) {
                    let r = Math.min(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let c = this.selection.c + i * this.selection.dc;
                    this.world.toggleWall(r, c, 0);
                }
                break;
            case "east":
                for (let i = 0; i < this.selection.cols; i++) {
                    let r = Math.max(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let c = this.selection.c + i * this.selection.dc;
                    this.world.toggleWall(r, c, 2);
                }
                break;
            case "outer":
                for (let i = 0; i < this.selection.cols; i++) {
                    let rmin = Math.min(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let rmax = Math.max(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let c = this.selection.c + i * this.selection.dc;
                    this.world.toggleWall(rmin, c, 2);
                    this.world.toggleWall(rmax, c, 0);
                }
                for (let i = 0; i < this.selection.rows; i++) {
                    let r = this.selection.r + i * this.selection.dr;
                    let cmin = Math.min(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    let cmax = Math.max(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    this.world.toggleWall(r, cmin, 1);
                    this.world.toggleWall(r, cmax, 3);
                }
                break;
        }
        this.Update();
    }

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.world.w;
        let worldHeight = this.world.h;

        this.renderer.origin = {
            f: Math.floor(
                1 + Math.max(
                    0,
                    (worldHeight - this.renderer.GetRowCount("floor") + 1) * top
                )
            ),
            c: Math.floor(
                1 + Math.max(
                    0,
                    (worldWidth - this.renderer.GetColCount("floor") + 1) * left
                )
            ),
        }
        this.Update();
        this.UpdateWaffle();
    }

    Update() {
        this.world.dirty=false;
        this.renderer.Draw(this.world);
    }
}

export { WorldController, Gizmos };