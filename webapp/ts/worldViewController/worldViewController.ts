import { WorldRenderer } from "../worldRenderer";
import { KarelController } from "../KarelController";
import { World } from "../../../js/karel";
import { SelectionBox, SelectionWaffle } from "./waffle";
import { CellSelection, SelectionState } from "./selection";
import { CellPair } from "../cellPair";
import { karel } from "../../../js";
import { GetCurrentSetting } from "../settings";


type Gizmos = {
    selectionBox: SelectionBox,
    HorizontalScrollElement: JQuery,
    VerticalScrollElement: JQuery,
}

type MouseState = {
    cursorX: number,
    cursorY: number,
    cellPair: CellPair,
}

type ClickMode = "normal" | "alternate"

type PinchData = {
    pointers: PointerEvent[]
    prevDiff:number
    startZoom:number
}

class WorldViewController {
    renderer: WorldRenderer
    container: HTMLElement
    gizmos: Gizmos
    scale: number;
    state: MouseState
    selection: CellSelection;
    private lock: boolean;
    private karelController : KarelController;
    private waffle: SelectionWaffle
    private clickMode: ClickMode
    private pinch: PinchData

    constructor(renderer: WorldRenderer, karelController: KarelController, container: HTMLElement,  gizmos: Gizmos) {
        this.renderer = renderer;
        this.container = container;
        this.lock = false;
        this.karelController = karelController;
        this.selection = new CellSelection()
        this.selection.SetData({
            r: 1,
            c: 1,
            rows: 1,
            cols: 1,
            dr: 1,
            dc: 1,
            state:"normal"
        });
        this.state = {
            cursorX: 0,
            cursorY: 0,
            cellPair: {r:0, c:0}
        }
        this.gizmos = gizmos;
        this.scale = 1;


        this.karelController.RegisterResetObserver(this.OnReset.bind(this));
        this.karelController.RegisterNewWorldObserver(this.OnNewWorld.bind(this));
        this.karelController.RegisterStepController(this.onStep.bind(this));

        this.waffle = new SelectionWaffle(gizmos.selectionBox);
        this.clickMode = "normal";
        this.pinch = {
            pointers: [],
            prevDiff: -1,
            startZoom : 1
        }
    }

    SetClickMode(mode:ClickMode) {
        this.clickMode = mode;
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

    Select(r: number, c: number, r2: number, c2: number, state:SelectionState="normal") {
        if (
            r > this.karelController.world.h ||
            c > this.karelController.world.w ||
            r < 1 ||
            c < 1

        ) {
            return;
        }

        this.selection.SetData({
            r: r,
            c: c,
            rows: Math.abs(r - r2) + 1,
            cols: Math.abs(c - c2) + 1,
            dr: r <= r2 ? 1 : -1,
            dc: c <= c2 ? 1 : -1,
            state:state
        });
        this.UpdateGutter();
        this.UpdateWaffle();
    }

    GetCoords2() {
        return {
            r2:this.selection.r + (this.selection.rows-1)*this.selection.dr,
            c2:this.selection.c + (this.selection.cols-1)*this.selection.dc,
        }
    }

    MoveSelection(dr: number, dc: number, moveSecond =false) {
        let {r2,c2}=this.GetCoords2();
        let r = this.selection.r;
        let c = this.selection.c;
        if (moveSecond) {                    
            r2 += dr;
            c2 += dc;      
                          
        } else {
            r += dr;
            c += dc;
            r2=r;
            c2=c;
            
        }
        if (r < 1 || c < 1 || r > this.karelController.world.h || c > this.karelController.world.w) {
            return;
        }
        if (r2 < 1 || c2 < 1 || r2 > this.karelController.world.h || c2 > this.karelController.world.w) {
            return;
        }

        this.TrackFocus(r2,c2);
        this.Select(r, c, r2, c2);
    }

    UpdateWaffle() {
        this.waffle.UpdateWaffle(this.selection, this.renderer);
    }

    SetScale(scale: number) {
        this.renderer.scale = scale ;
        this.scale = scale;
        //FIXME, this should be in update waffle
        // this.gizmos.selectionBox.bottom.style.maxWidth = `${this.renderer.CellSize * scale}px`;
        // this.gizmos.selectionBox.bottom.style.minWidth = `${this.renderer.CellSize * scale}px`;
        
        // this.gizmos.selectionBox.top.style.maxWidth = `${this.renderer.CellSize * scale}px`;
        // this.gizmos.selectionBox.top.style.minWidth = `${this.renderer.CellSize * scale}px`;
        
        // this.gizmos.selectionBox.left.style.maxHeight = `${this.renderer.CellSize * scale}px`;
        // this.gizmos.selectionBox.left.style.minHeight = `${this.renderer.CellSize * scale}px`;
        
        // this.gizmos.selectionBox.right.style.maxHeight = `${this.renderer.CellSize * scale}px`;
        // this.gizmos.selectionBox.right.style.minHeight = `${this.renderer.CellSize * scale}px`;

        // this.gizmos.selectionBox.bottom.style.top = `${this.renderer.CellSize * scale}px`;
        // this.gizmos.selectionBox.right.style.left = `${this.renderer.CellSize * scale}px`;


        this.UpdateWaffle();
        this.Update();             
        this.UpdateScrollElements();   
        this.ReFocusCurrentElement();
    }

    RecalculateScale() {
        this.renderer.scale = this.scale;
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
        this.state.cellPair = this.renderer.PointToCell(this.state.cursorX, this.state.cursorY);

        if (this.selection.state === "selecting") {
            let cell = this.state.cellPair;
            this.ExtendSelection(cell.r, cell.c, "selecting");
        }

    }

    ExtendSelection(r:number, c:number, state:SelectionState="normal") {
        if (r < 0 || r > KarelController.GetInstance().world.h) return;
        if (c < 0 || c > KarelController.GetInstance().world.w) return;
        
        this.Select(this.selection.r, this.selection.c, r, c,state);
    }

    ClickUp(e: MouseEvent) {
        let cell = this.renderer.PointToCell(this.state.cursorX, this.state.cursorY);
        if (this.selection.state!=="selecting") return; 
        this.selection.state = "normal";
        if (this.clickMode === "normal") {
            this.ExtendSelection(cell.r, cell.c);
        } else {            
            this.Select(cell.r, cell.c, this.selection.r, this.selection.c);            
        }
    }

    ClickDown(e:MouseEvent) {
        e.preventDefault();
        if (this.clickMode === "normal") {
            let cell = this.renderer.PointToCell(this.state.cursorX, this.state.cursorY);
            if (cell.r < 0) {
                return;
            }
            if (e.shiftKey) {
                this.Select(this.selection.r, this.selection.c, cell.r, cell.c, "selecting");
            } else {
                this.Select(cell.r, cell.c, cell.r, cell.c, "selecting");
            }            
        } else {
            this.selection.state = "selecting";
        }
        $(":focus").blur();
        
    }

    PointerDown(e:PointerEvent) {
        this.pinch.pointers.push(e);        
    }
    PointerUp(e:PointerEvent) {
        const index = this.pinch.pointers.findIndex(
            (cachedEv) => cachedEv.pointerId === e.pointerId,
        );
        if (index !== -1)
            this.pinch.pointers.splice(index, 1);

        if (this.pinch.pointers.length < 2) {
            this.pinch.prevDiff = -1;
        }

    }
    PointerMove(e:PointerEvent) {

        const index = this.pinch.pointers.findIndex(
            (cachedEv) => cachedEv.pointerId === e.pointerId,
        );
        if (index !== -1)
            this.pinch.pointers[index] = e;
        // If two pointers are down, check for pinch gestures
        if (this.pinch.pointers.length === 2) {
            // Calculate the distance between the two pointers
            const curDiff = Math.abs(this.pinch.pointers[0].clientX - this.pinch.pointers[1].clientX);
            if (this.pinch.prevDiff > 0) {
                let delta = curDiff/this.pinch.prevDiff;
                if (0.9 < delta && delta < 1.1 ) delta=1;
                let newZoom = this.pinch.startZoom* delta;
                if (newZoom < 0.5) newZoom=0.5;
                if (newZoom > 4) newZoom=4;
                this.SetScale(newZoom);
            } else {
                this.pinch.prevDiff = curDiff;
                this.pinch.startZoom = this.scale;
            }
        }
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

        const history = KarelController.GetInstance().GetHistory();
        const op = history.StartOperation();
        
        let rmin = Math.min(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let rmax = Math.max(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let cmin = Math.min(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        let cmax = Math.max(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        for (let i =rmin; i<=rmax; i++) {
            for (let j=cmin; j <=cmax; j++) {
                const oriBuzzers = this.karelController.world.buzzers(i,j);
                let buzzers = this.karelController.world.buzzers(i,j);
                if (buzzers < 0 && delta < 0) {
                    //Do nothing
                    continue;
                }
                buzzers += delta;
                if (buzzers < 0) {
                    buzzers = 0;
                }
                this.karelController.world.setBuzzers(
                    i,
                    j,
                    buzzers
                );
                op.addCommit({
                    forward:()=> {
                        this.karelController.world.setBuzzers(
                            i,
                            j,
                            buzzers
                        );
                    },
                    backward: ()=> {
                        
                        this.karelController.world.setBuzzers(
                            i,
                            j,
                            oriBuzzers
                        );
                    }
                })
            }
        }
        history.EndOperation();
        this.Update();
    }

    SetRandomBeepers(minimum: number, maximum: number) {
        if (this.lock) return;
        const history = KarelController.GetInstance().GetHistory();
        const op = history.StartOperation();

        let rmin = Math.min(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let rmax = Math.max(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let cmin = Math.min(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        let cmax = Math.max(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        for (let i =rmin; i<=rmax; i++) {
            for (let j=cmin; j <=cmax; j++) {
                let amount = Math.round( Math.random()*(maximum-minimum)+minimum);
                const oriBuzzers = this.karelController.world.buzzers(i, j);
                if (oriBuzzers === amount) {
                    continue;
                }
                op.addCommit({
                    forward:()=>
                        this.karelController.world.setBuzzers(i, j, amount),
                    backward:()=>
                        this.karelController.world.setBuzzers(i, j, oriBuzzers),
                })
                this.karelController.world.setBuzzers(i, j, amount);
            }
        }
        history.EndOperation();
        this.Update();
    }

    SetBeepers(amount: number) {
        if (this.lock) return;
        const history = KarelController.GetInstance().GetHistory();
        const op = history.StartOperation();
        let rmin = Math.min(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let rmax = Math.max(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let cmin = Math.min(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        let cmax = Math.max(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        for (let i =rmin; i<=rmax; i++) {
            for (let j=cmin; j <=cmax; j++) {
                const oriBuzzers = this.karelController.world.buzzers(i, j);
                if (oriBuzzers === amount) {
                    continue;
                }
                op.addCommit({
                    forward: ()=>
                        this.karelController.world.setBuzzers(i, j, amount),
                    backward: ()=>
                        this.karelController.world.setBuzzers(i, j, oriBuzzers)
                })
                this.karelController.world.setBuzzers(i, j, amount);
            }
        }
        history.EndOperation();
        this.Update();
    }

    SetCellEvaluation(state:boolean) {
        const world = this.karelController.world;
        let rmin = Math.min(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let rmax = Math.max(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let cmin = Math.min(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        let cmax = Math.max(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        for (let i =rmin; i<=rmax; i++) {
            for (let j=cmin; j <=cmax; j++) {
                world.setDumpCell(i, j, state);
            }
        }
        this.Update();
    }

    ToggleKarelPosition(rotate:boolean = false) {
        if (this.lock) return;
        const history = KarelController.GetInstance().GetHistory();
        const op = history.StartOperation();        
        const world = this.karelController.world;
        if (world.start_i !==this.selection.r || world.start_j !==this.selection.c ) {
            const orI = world.start_i;
            const orJ = world.start_j;
            op.addCommit({
                forward:() => world.move(this.selection.r, this.selection.c),
                backward:() => world.move(orI, orJ),
            });
            world.move(this.selection.r, this.selection.c)
        }

        if (rotate) {
            function doRotation() {
                world.rotate(
                    ['OESTE', 'NORTE', 'ESTE', 'SUR'][
                    (world.orientation + 3)%4
                    ]
                );
            }
            op.addCommit({
                forward:()=>doRotation(),
                backward:()=>world.rotate()
            })

            doRotation();
        }
        history.EndOperation();
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

    ReFocusCurrentElement() {
        this.FocusTo(this.renderer.origin.f, this.renderer.origin.c)
    }

    TrackFocus(r:number, c:number) {
        let origin = this.renderer.origin;
        let rows = this.renderer.GetRowCount("floor");
        let cols = this.renderer.GetColCount("floor");

        
        if (rows*cols === 0) {
            this.FocusKarel();
            return;
        }

        if (
            origin.c <= c 
            &&  c < origin.c + cols
            && origin.f <= r
            &&  r < origin.f + rows
        ) {
            //Karel is already on focus.
            return;
        }

        let tr = origin.f;
        let tc = origin.c;

        if (r < tr) {
            tr = r;
        } else if (r >= tr + rows ) {
            tr = r -  rows + 1;
        }

        if (c < tc) {
            tc = c;
        } else if (c >= tc + cols ) {
            tc = c -  cols + 1;
        }

        this.FocusTo(tr,tc);
    }

    TrackFocusToKarel () {

        this.TrackFocus(this.karelController.world.i,this.karelController.world.j);
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

    ToggleWall(which: "north" | "east" | "west" | "south" | "outer", reversible:boolean = true) {
        if (this.lock) return;
        if (reversible) {
            const history = KarelController.GetInstance().GetHistory();
            const op = history.StartOperation();        
            const opSelection = this.selection.GetData();
            op.addCommit({
                forward: ()=>{ 
                    const prevSelection = this.selection.GetData();
                    this.selection.SetData(opSelection);
                    this.ToggleWall(which, false);
                    this.selection.SetData(prevSelection);
                },
                backward: ()=>{
                    
                    const prevSelection = this.selection.GetData();
                    this.selection.SetData(opSelection);
                    this.ToggleWall(which, false);
                    this.selection.SetData(prevSelection);
                },
            })
            history.EndOperation();
        }
        let r=this.selection.r,c=this.selection.c;
        switch (which) {
            case "north":
                r = Math.max(
                    this.selection.r,
                    this.selection.r + (this.selection.rows - 1) * this.selection.dr
                );
                for (let i = 0; i < this.selection.cols; i++) {
                    
                    c = this.selection.c + this.selection.dc * i;
                    this.karelController.world.toggleWall(r, c, 1);
                }
                break;
            case "south":
                r = Math.min(
                    this.selection.r,
                    this.selection.r + (this.selection.rows - 1) * this.selection.dr
                );
                for (let i = 0; i < this.selection.cols; i++) {
                    
                    c = this.selection.c + this.selection.dc * i;
                    this.karelController.world.toggleWall(r, c, 3);
                }
                break;
            case "west":
                c = Math.min(
                    this.selection.c,
                    this.selection.c + (this.selection.cols - 1) * this.selection.dc
                );
                for (let i = 0; i < this.selection.rows; i++) {
                    r = this.selection.r + i * this.selection.dr;
                    
                    this.karelController.world.toggleWall(r, c, 0);
                }
                break;
            case "east":
                c = Math.max(
                    this.selection.c,
                    this.selection.c + (this.selection.cols - 1) * this.selection.dc
                );
                for (let i = 0; i < this.selection.rows; i++) {
                    r = this.selection.r + i * this.selection.dr;
                    
                    this.karelController.world.toggleWall(r, c, 2);
                }
                break;
            case "outer":
                let rmin = Math.min(
                    this.selection.r,
                    this.selection.r + (this.selection.rows - 1) * this.selection.dr
                );
                let rmax = Math.max(
                    this.selection.r,
                    this.selection.r + (this.selection.rows - 1) * this.selection.dr
                );
                let cmin = Math.min(
                    this.selection.c,
                    this.selection.c + (this.selection.cols - 1) * this.selection.dc
                );
                let cmax = Math.max(
                    this.selection.c,
                    this.selection.c + (this.selection.cols - 1) * this.selection.dc
                );
                for (let i = 0; i < this.selection.cols; i++) {
                    
                    c = this.selection.c + i * this.selection.dc;
                    this.karelController.world.toggleWall(rmin, c, 3);
                    this.karelController.world.toggleWall(rmax, c, 1);
                }
                for (let i = 0; i < this.selection.rows; i++) {
                    r = this.selection.r + i * this.selection.dr;
                    
                    this.karelController.world.toggleWall(r, cmin, 0);
                    this.karelController.world.toggleWall(r, cmax, 2);
                }
                break;
        }
        this.Update();
    }

    Undo() {
        if (this.lock) return;
        const KC = KarelController.GetInstance();
        KC.GetHistory().Undo();
        this.Update();
    }

    Redo() {
        if (this.lock) return;
        const KC = KarelController.GetInstance();
        KC.GetHistory().Redo();
        this.Update();
    }

    RemoveEverything() {
        if (this.lock) return;
        
        const history = KarelController.GetInstance().GetHistory();
        const op = history.StartOperation();

        let rmin = Math.min(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let rmax = Math.max(this.selection.r, this.selection.r + (this.selection.rows - 1)*this.selection.dr);
        let cmin = Math.min(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        let cmax = Math.max(this.selection.c, this.selection.c + (this.selection.cols - 1)*this.selection.dc);
        const world = this.karelController.world;
        for (let i =rmin; i<=rmax; i++) {
            for (let j=cmin; j <=cmax; j++) {
                const oriBuzzers =  world.buzzers(i,j);
                const oriWalls =  world.walls(i,j);
                if (oriBuzzers!=0) {
                    world.setBuzzers(i, j, 0);
                    op.addCommit({
                        forward:()=>
                            world.setBuzzers(i, j, 0),
                        backward:()=> 
                            world.setBuzzers(i, j, oriBuzzers)                            
                    })
                }
                    
                world.setDumpCell(i, j, 0);
                world.setWallMask(i,j,0);
                const nextWalls = world.walls(i,j);
                if (nextWalls!== oriWalls) {
                    op.addCommit({
                        forward:()=>
                            world.setWallMask(i, j, 0),
                        backward:()=> 
                            world.setWallMask(i, j, oriWalls)                            
                    })
                }

            }
        }
        history.EndOperation();
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
        this.renderer.Draw(this.karelController.world, this.selection);
    }

    UpdateGutter() {
        this.renderer.DrawGutters(this.selection);
    }
   

    UpdateScrollElements() {
        let c = this.renderer.CellSize;
        let h = (this.karelController.world.h * this.scale*c + this.renderer.GutterSize) / window.devicePixelRatio;
        let w = (this.karelController.world.w * this.scale*c + this.renderer.GutterSize) / window.devicePixelRatio;
        this.gizmos.HorizontalScrollElement.css("width", `${w}px`);
        this.gizmos.VerticalScrollElement.css("height", `${h}px`);
        
    }

    private onStep(caller:KarelController, state) {
        this.TrackFocusToKarel();
        this.Update();
    }

    private OnReset(caller: KarelController) {
        this.Update();
        this.TrackFocusToKarel();
    }

    private OnNewWorld(caller: KarelController, world:World) {
        this.Select(1,1,1,1); 
        this.Update();
        this.FocusOrigin();
        this.UpdateScrollElements();

    }

}

export { WorldViewController, Gizmos };