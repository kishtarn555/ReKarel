import { WorldRenderer } from "./worldRenderer";
import { KarelController } from "./KarelController";
import { World } from "../../js/karel";

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
    },
    HorizontalScrollElement: JQuery,
    VerticalScrollElement: JQuery,
}

class WorldViewController {
    renderer: WorldRenderer
    container: HTMLElement
    gizmos: Gizmos
    scale: number;
    state: {
        cursorX: number,
        cursorY: number,
    }
    selection: CellSelection;
    private lock: boolean;
    private karelController : KarelController;


    constructor(renderer: WorldRenderer, karelController: KarelController, container: HTMLElement,  gizmos: Gizmos) {
        this.renderer = renderer;
        this.container = container;
        this.lock = false;
        this.karelController = karelController;
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


        this.karelController.RegisterResetObserver(this.OnReset.bind(this));
        this.karelController.RegisterNewWorldObserver(this.OnNewWorld.bind(this));
        this.karelController.RegisterStepController(this.onStep.bind(this));
    }

    Lock() {
        this.lock = true;
    }

    UnLock() {
        this.lock = false;
    }



    
    GetBeepersInBag(): number {
        return this.karelController.world.bagBuzzers;
    }

    SetBeepersInBag(ammount : number) {
        this.karelController.world.setBagBuzzers(ammount);
    }

    
    CheckUpdate() {
        if (this.karelController.world.dirty) {
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
        if (
            r > this.karelController.world.h ||
            c > this.karelController.world.w ||
            r < 1 ||
            c < 1

        ) {
            return;
        }

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

        if (r < 1 || c < 1 || r > this.karelController.world.h || c > this.karelController.world.w) {
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
        this.UpdateScrollElements();   
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


    }

    SetKarelOnSelection(direction: "north" | "east" | "west" | "south" = "north") {
        if (this.lock) return;
        this.karelController.world.move(this.selection.r, this.selection.c);
        switch (direction) {
            case "north":
                this.karelController.world.rotate('NORTE');
                break;
            case "east":
                this.karelController.world.rotate('ESTE');
                break;
            case "south":
                this.karelController.world.rotate('SUR');
                break;
            case "west":
                this.karelController.world.rotate('OESTE');
                break;
        }
        this.Update();

    }

    ChangeBeepers(delta: number) {
        if (this.lock) return;
        if (delta === 0) {
            return;
        }
        let buzzers = this.karelController.world.buzzers(this.selection.r, this.selection.c);
        if (buzzers < 0 && delta < 0) {
            //Do nothing
            return;
        }
        buzzers += delta;
        if (buzzers < 0) {
            buzzers = 0;
        }
        this.karelController.world.setBuzzers(
            this.selection.r,
            this.selection.c,
            buzzers
        );
        this.Update();
    }

    SetBeepers(ammount: number) {
        if (this.lock) return;
        if (this.karelController.world.buzzers(this.selection.r, this.selection.c) === ammount) {
            return;
        }
        this.karelController.world.setBuzzers(this.selection.r, this.selection.c, ammount);
        this.Update();
    }

    ToggleKarelPosition() {
        if (this.lock) return;
        this.karelController.world.move(this.selection.r, this.selection.c);
        this.karelController.world.rotate();
        this.Update();
    }

    FocusOrigin() {
        this.container.scrollLeft = 0;
        this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;       
    }

    FocusKarel() {
        let r = this.karelController.world.i;
        let c = this.karelController.world.j;

        this.FocusTo(r, c);
    }
    
    FocusSelection() {
        let r = this.selection.r - 1;
        let c = this.selection.c - 1;

        this.FocusTo(r, c);
    }

    TrackFocusToKarel () {

        let origin = this.renderer.origin;
        let rows = this.renderer.GetRowCount("floor");
        let cols = this.renderer.GetColCount("floor");

        
        if (rows*cols === 0) {
            this.FocusKarel();
            return;
        }

        if (
            origin.c <= this.karelController.world.j 
            &&  this.karelController.world.j < origin.c + cols
            && origin.f <= this.karelController.world.i
            &&  this.karelController.world.i < origin.f + rows
        ) {
            //Karel is already on focus.
            return;
        }

        let tr = origin.f;
        let tc = origin.c;

        if (this.karelController.world.i < tr) {
            tr = this.karelController.world.i;
        } else if (this.karelController.world.i >= tr + rows ) {
            tr = this.karelController.world.i -  rows + 1;
        }

        if (this.karelController.world.j < tc) {
            tc = this.karelController.world.j;
        } else if (this.karelController.world.j >= tc + cols ) {
            tc = this.karelController.world.j -  cols + 1;
        }

        this.FocusTo(tr,tc);
    }

    FocusTo(r: number, c: number) {

        
        let left = (c-1 + 0.1) / (this.karelController.world.w - this.renderer.GetColCount("floor") + 1);
        left = left < 0 ? 0 : left;
        left = left > 1 ? 1 : left;
        let top = (r-1 + 0.01) / (this.karelController.world.h - this.renderer.GetRowCount("floor") + 1);
        top = top < 0 ? 0 : top;
        top = top > 1 ? 1 : top;

        // let la =0, lb = 1;
        // let ta =0, tb = 1;
        // let left = (la+lb)/2.0;
        // let top = (ta+tb)/2.0;
        // for (let iter = 0; iter < 60; iter++) {
        //     let lm = (la+lb)/2.0;
        //     let tm = (ta+tb)/2.0;
        //     this.ChangeOriginFromScroll( lm, tm);
        //     if (this.renderer.origin.c < c) {
        //         la = lm;
        //     } else if (this.renderer.origin.c > c) {
        //         lb = lm;

        //     } else {
        //         left = lm;
        //         la=lb=lm;
        //     }


        //     if (this.renderer.origin.f < r) {
        //         ta = tm;
        //     } else if (this.renderer.origin.f > r) {
        //         tb = tm;
        //     } else {
        //         top = tm;
        //         ta=tb=tm;
        //     }
        // }

        this.renderer.origin = {
            c:c,
            f:r,
        }
        // this.lockScroll=true;
        this.container.scrollLeft = left * (this.container.scrollWidth - this.container.clientWidth);        
        this.container.scrollTop = (1 - top) * (this.container.scrollHeight - this.container.clientHeight);       
        // this.Update();        
        // this.UpdateWaffle(); 
    }

    ToggleWall(which: "north" | "east" | "west" | "south" | "outer") {
        if (this.lock) return;
        switch (which) {
            case "north":
                for (let i = 0; i < this.selection.rows; i++) {
                    let r = this.selection.r + i * this.selection.dr;
                    let c = Math.min(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    this.karelController.world.toggleWall(r, c, 1);
                }
                break;
            case "south":
                for (let i = 0; i < this.selection.rows; i++) {
                    let r = this.selection.r + i * this.selection.dr;
                    let c = Math.max(
                        this.selection.c,
                        this.selection.c + (this.selection.cols - 1) * this.selection.dc
                    );
                    this.karelController.world.toggleWall(r, c, 3);
                }
                break;
            case "west":
                for (let i = 0; i < this.selection.cols; i++) {
                    let r = Math.min(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let c = this.selection.c + i * this.selection.dc;
                    this.karelController.world.toggleWall(r, c, 0);
                }
                break;
            case "east":
                for (let i = 0; i < this.selection.cols; i++) {
                    let r = Math.max(
                        this.selection.r,
                        this.selection.r + (this.selection.rows - 1) * this.selection.dr
                    );
                    let c = this.selection.c + i * this.selection.dc;
                    this.karelController.world.toggleWall(r, c, 2);
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
                    this.karelController.world.toggleWall(rmin, c, 2);
                    this.karelController.world.toggleWall(rmax, c, 0);
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
                    this.karelController.world.toggleWall(r, cmin, 1);
                    this.karelController.world.toggleWall(r, cmax, 3);
                }
                break;
        }
        this.Update();
    }

    ChangeOriginFromScroll(left:number, top:number) {
        let worldWidth = this.karelController.world.w;
        let worldHeight = this.karelController.world.h;

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
    }

    UpdateScroll(left: number, top: number): void {
        this.ChangeOriginFromScroll(left, top);
        this.Update();
        this.UpdateWaffle();
    }

    Update() {
        this.karelController.world.dirty=false;
        this.renderer.Draw(this.karelController.world);
    }

   

    UpdateScrollElements() {
        let c = this.renderer.CellSize;
        let h = this.karelController.world.h * this.scale*c;
        let w = this.karelController.world.w * this.scale*c;
        this.gizmos.HorizontalScrollElement.css("width", `${w}px`);
        this.gizmos.VerticalScrollElement.css("height", `${h}px`);
        
    }

    private onStep(caller:KarelController, state) {
        this.Update();
    }

    private OnReset(caller: KarelController) {
        this.Update();
    }

    private OnNewWorld(caller: KarelController, world:World) {
        this.Select(1,1,1,1); 
        this.Update();
        this.FocusOrigin();
        this.UpdateScrollElements();

    }

}

export { WorldViewController, Gizmos };