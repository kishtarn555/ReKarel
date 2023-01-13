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
        };
        this.state = {
            cursorX: 0,
            cursorY: 0,
        }
        this.gizmos = gizmos;
    }

    Select(r: number, c: number, rowCount: number, colCount:number) {
        this.selection = {
            r: r,
            c: c,
            rows: rowCount,
            cols: colCount,
        };
        this.UpdateWaffle();
    }    

    UpdateWaffle() {
        let coords= this.renderer.CellToPoint(this.selection.r, this.selection.c);
        let selectionBox = this.gizmos.selectionBox.main;
        selectionBox.style.top= `${coords.y}px`
        selectionBox.style.left= `${coords.x}px`
    }

    TrackMouse(e: MouseEvent) {
        let canvas = this.renderer.canvasContext.canvas;
        let boundingBox =canvas.getBoundingClientRect();
        let x = (e.clientX - boundingBox.left) * canvas.width / boundingBox.width;
        let y = (e.clientY - boundingBox.top)* canvas.height / boundingBox.height;
        this.state.cursorX= x /  window.devicePixelRatio;
        this.state.cursorY= y /  window.devicePixelRatio;
    }

    ClickUp(e: MouseEvent) {
        let cell = this.renderer.PointToCell(this.state.cursorX, this.state.cursorY);
        if (cell.r < 0) {
            return;
        }
        this.Select(cell.r, cell.c, 1, 1);
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
        if (delta===0) {
            return;
        }
        let buzzers = this.world.buzzers(this.selection.r, this.selection.c);
        if (buzzers < 0 && delta < 0) {
            //Do nothing
            return;
        }
        buzzers+=delta;
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
        if (this.world.buzzers(this.selection.r, this.selection.c)===ammount) {
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
        let r = Math.max(1,this.world.i-2);
        let c = Math.max(1, this.world.j-2);

        this.FocusTo(r,c);
    }

    FocusTo(r: number, c: number) {
        

        let left = c/(this.world.w - this.renderer.GetColCount("floor") + 1) ;
        left = left < 0 ? 0 :left;
        left = left > 1 ? 1 :left;
        let top = r/(this.world.h - this.renderer.GetRowCount("floor") + 1);        
        top = top < 0 ? 0 :top;
        top = top > 1 ? 1 :top;

        this.container.scrollLeft = left * (this.container.scrollWidth - this.container.clientWidth);
        this.container.scrollTop = (1-top) * (this.container.scrollHeight - this.container.clientHeight);
    }

    ToggleWall(which: "north" | "east" | "west" | "south" | "outher") {
        for ()
    }

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.world.w;
        let worldHeight = this.world.h;

        this.renderer.origin = {
            f: Math.floor(
                1+ Math.max(
                    0, 
                    (worldHeight-this.renderer.GetRowCount("floor") + 1)*top
                )
            ),
            c: Math.floor(
                1+ Math.max(
                    0,
                    (worldWidth-this.renderer.GetColCount("floor") + 1)*left
                )
                ),
        }
        this.Update();
        this.UpdateWaffle();
    }

    Update() {
        this.renderer.Draw(this.world);
    }
}

export {WorldController};