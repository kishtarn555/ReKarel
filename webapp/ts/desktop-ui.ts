import { EditorView } from 'codemirror'
import { Compartment } from '@codemirror/state'
import bootstrap from 'bootstrap';
import { WorldRenderer, WRStyle, DefaultWRStyle } from './worldRenderer';
import { WorldController, Gizmos } from "./worldController";
import { World } from '../../js/karel';
import { KarelController } from './KarelController';
import { GetOrCreateInstanceFactory } from 'bootstrap/js/dist/base-component';

type BeeperToolbar= {
    addOne: JQuery,
    removeOne: JQuery,
    ammount: JQuery,
    infinite: JQuery,
    clear: JQuery,    
}
type KarelToolbar= {
    north: JQuery,
    east: JQuery,
    south: JQuery,
    west: JQuery,
}


type WallToolbar= {
    north: JQuery,
    east: JQuery,
    south: JQuery,
    west: JQuery,
    outside: JQuery,
}

type FocusToolbar = {
    origin: JQuery,
    karel: JQuery,
    selector: JQuery,
    
}
interface DesktopElements {
    worldContainer: JQuery,
    worldCanvas: JQuery,
    gizmos: Gizmos,
    worldZoom: JQuery,
    toolbar: {
        beepers: BeeperToolbar
        karel: KarelToolbar
        wall: WallToolbar
        focus: FocusToolbar
    }
    context: {
        toggler: JQuery,
        container: JQuery
        beepers: BeeperToolbar,
        karel: KarelToolbar,
        wall: WallToolbar
    }
};

class DesktopController {
    worldContainer: JQuery;
    worldCanvas: JQuery;
    worldZoom: JQuery;
    
    beeperToolbar: BeeperToolbar;
    karelToolbar: KarelToolbar;
    wallToolbar: WallToolbar;

    focusToolbar: FocusToolbar;

    contextToggler: JQuery;
    contextContainer: JQuery
    contextBeepers: BeeperToolbar;
    contextKarel: KarelToolbar;
    contextWall: WallToolbar;

    worldController: WorldController;
    karelController: KarelController;
    
    constructor (elements: DesktopElements, karelController: KarelController) {
        this.worldContainer = elements.worldContainer;
        this.worldCanvas = elements.worldCanvas;
        this.worldZoom = elements.worldZoom;

        this.beeperToolbar = elements.toolbar.beepers;
        this.karelToolbar = elements.toolbar.karel;
        this.wallToolbar = elements.toolbar.wall;

        this.focusToolbar = elements.toolbar.focus;

        this.contextToggler = elements.context.toggler;
        this.contextContainer = elements.context.container;
        this.contextBeepers = elements.context.beepers;
        this.contextKarel = elements.context.karel;        
        this.contextWall = elements.context.wall;

        this.karelController = karelController;
        this.worldController = new WorldController(
            new WorldRenderer(
                (this.worldCanvas[0] as HTMLCanvasElement).getContext("2d"),
                DefaultWRStyle,
                window.devicePixelRatio
            ),
            elements.worldContainer[0],
            karelController.world,
            elements.gizmos
        );
        this.karelController.SetDesktopController(this.worldController);
    }

    Init() {
        $(window).on("resize", this.ResizeCanvas.bind(this));
        $(window).on("keydown", this.HotKeys.bind(this));

        this.worldContainer.on("scroll", this.calculateScroll.bind(this));
        this.worldCanvas.on(
            "mouseup",
            this.worldController.ClickUp.bind(this.worldController)
        );
        this.worldCanvas.on(
            "mousemove",
            this.worldController.TrackMouse.bind(this.worldController)
        );
        

        this.worldZoom.on("change", ()=> {
            let scale = parseFloat(String(this.worldZoom.val()));
            this.worldController.SetScale(scale);
        });

        this.ConnectToolbar();        
        this.ConnectContextMenu();
        
        this.ResizeCanvas();
        this.worldController.FocusOrigin();
    }

    private ConnectToolbar() {        
        this.beeperToolbar.addOne.on("click", ()=>this.worldController.ChangeBeepers(1));
        this.beeperToolbar.removeOne.on("click", ()=>this.worldController.ChangeBeepers(-1));        
        this.beeperToolbar.infinite.on("click", ()=>this.worldController.SetBeepers(-1));
        this.beeperToolbar.clear.on("click", ()=>this.worldController.SetBeepers(0));

        this.karelToolbar.north.on("click", ()=>this.worldController.SetKarelOnSelection("north"));
        this.karelToolbar.east.on("click", ()=>this.worldController.SetKarelOnSelection("east"));
        this.karelToolbar.south.on("click", ()=>this.worldController.SetKarelOnSelection("south"));
        this.karelToolbar.west.on("click", ()=>this.worldController.SetKarelOnSelection("west"));
        
        this.wallToolbar.north.on("click", ()=>this.worldController.ToggleWall("north"));
        this.wallToolbar.east.on("click", ()=>this.worldController.ToggleWall("east"));
        this.wallToolbar.south.on("click", ()=>this.worldController.ToggleWall("south"));
        this.wallToolbar.west.on("click", ()=>this.worldController.ToggleWall("west"));
        this.wallToolbar.outside.on("click", ()=>this.worldController.ToggleWall("outer"));

        this.focusToolbar.karel.on("click", ()=>this.worldController.FocusKarel());
        this.focusToolbar.origin.on("click", ()=>this.worldController.FocusOrigin());
        this.focusToolbar.selector.on("click", ()=>this.worldController.FocusSelection());
    }

    

    private ConnectContextMenu() {
        this.worldCanvas.on("contextmenu", (e)=>{
            const dropmenu =new bootstrap.Dropdown(this.contextToggler[0]);
            dropmenu.hide();
            this.contextContainer[0].style.setProperty("top", `${e.pageY}px`);
            this.contextContainer[0].style.setProperty("left", `${e.pageX}px`);      
            this.ToggleContextMenu();
            e.preventDefault();
        })
        const ContextAction = (target: JQuery, method:()=> void) => {
            target.on(
                "click",
                (()=> {
                    this.ToggleContextMenu();
                    method();
                }).bind(this)
            );
        }
        ContextAction(this.contextBeepers.addOne, ()=>this.worldController.ChangeBeepers(1));
        ContextAction(this.contextBeepers.removeOne, ()=>this.worldController.ChangeBeepers(-1));        
        ContextAction(this.contextBeepers.infinite, ()=>this.worldController.SetBeepers(-1));
        ContextAction(this.contextBeepers.clear, ()=>this.worldController.SetBeepers(0));

        
        ContextAction(this.contextKarel.north, ()=>this.worldController.SetKarelOnSelection("north"));
        ContextAction(this.contextKarel.east, ()=>this.worldController.SetKarelOnSelection("east"));
        ContextAction(this.contextKarel.south, ()=>this.worldController.SetKarelOnSelection("south"));
        ContextAction(this.contextKarel.west, ()=>this.worldController.SetKarelOnSelection("west"));
        
        ContextAction(this.contextWall.north, ()=>this.worldController.ToggleWall("north"));
        ContextAction(this.contextWall.east, ()=>this.worldController.ToggleWall("east"));
        ContextAction(this.contextWall.south, ()=>this.worldController.ToggleWall("south"));
        ContextAction(this.contextWall.west, ()=>this.worldController.ToggleWall("west"));
        ContextAction(this.contextWall.outside, ()=>this.worldController.ToggleWall("outer"));

    }

    private ToggleContextMenu() {
        const dropmenu = new bootstrap.Dropdown(this.contextToggler[0]);
        if (this.contextToggler.attr("aria-expanded")==="false") {
            dropmenu.show();
        } else {
            dropmenu.hide();
        }
    }

    private HotKeys(e: JQuery.KeyDownEvent) {
        let tag = e.target.tagName.toLowerCase();
        if (document.activeElement.getAttribute("role")=="textbox" || tag=="input") {
            return;
        }

        let hotkeys = new Map<number, ()=>void>([
            [71,()=>{this.worldController.ToggleKarelPosition();}],
            [82,()=>{this.worldController.SetBeepers(0);}],
            [81,()=>{this.worldController.ChangeBeepers(-1);}],
            [69,()=>{this.worldController.ChangeBeepers(1);}],
            [48,()=>{this.worldController.SetBeepers(0);}],
            [49,()=>{this.worldController.SetBeepers(1);}],
            [50,()=>{this.worldController.SetBeepers(2);}],
            [51,()=>{this.worldController.SetBeepers(3);}],
            [52,()=>{this.worldController.SetBeepers(4);}],
            [53,()=>{this.worldController.SetBeepers(5);}],
            [54,()=>{this.worldController.SetBeepers(6);}],
            [55,()=>{this.worldController.SetBeepers(7);}],
            [56,()=>{this.worldController.SetBeepers(8);}],
            [57,()=>{this.worldController.SetBeepers(9);}],
            [87,()=>{this.worldController.ToggleWall("north");}],
            [68,()=>{this.worldController.ToggleWall("east");}],
            [83,()=>{this.worldController.ToggleWall("south");}],
            [65,()=>{this.worldController.ToggleWall("west");}],
            [37,()=>{this.worldController.MoveSelection(0,-1);}],
            [38,()=>{this.worldController.MoveSelection(1, 0);}],
            [39,()=>{this.worldController.MoveSelection(0, 1);}],
            [40,()=>{this.worldController.MoveSelection(-1, 0);}],
            [84,()=>{this.worldController.SetBeepers(-1);}],
            
        ]);
        if (hotkeys.has(e.which) === false) {
            return;
        }     
        
        if (e.shiftKey) {
            let dummy: MouseEvent = new MouseEvent("", {
                clientX: e.clientX,
                clientY: e.clientY,
            });
            this.worldController.ClickUp(dummy);
        }
        hotkeys.get(e.which)();
        e.preventDefault();
    }

    private calculateScroll() {
        let left = 1, top=1;
        const container = this.worldContainer[0];
        if (container.scrollWidth !== container.clientWidth) {
            left = container.scrollLeft / (container.scrollWidth - container.clientWidth);
        }
        if(container.scrollHeight !== container.clientHeight) {
            top = 
                1 - container.scrollTop
                / (container.scrollHeight - container.clientHeight);
        }
        this.worldController.UpdateScroll(left, top);
    }

    public ResizeCanvas() {
        this.worldCanvas[0].style.width = `${this.worldContainer[0].clientWidth}px`;    
        this.worldCanvas[0].style.height = `${this.worldContainer[0].clientHeight}px`;
        let scale = window.devicePixelRatio;
        this.worldCanvas.attr(
            "width", Math.floor(this.worldContainer[0].clientWidth * scale)
        );    
        this.worldCanvas.attr(
            "height", Math.floor(this.worldContainer[0].clientHeight * scale)
        );

        this.worldController.Update();        
        this.calculateScroll();
    }
    
}


//=================================== TO BE DELETED FROM HERE DOWNWARDS ===================================





function toggleInfinityBeepers () {
    if ($("#beeperBag").attr("hidden")!== undefined) { 
        $("#beeperBag").removeAttr("hidden");
        $("#beeperBag").val("0");
        $("#infiniteBeepersBtn").removeClass("btn-info");
        
        $("#infiniteBeepersBtn").addClass("btn-light");            
    } else {
        $("#beeperBag").attr("hidden", "");
        $("#beeperBag").val("-1");
        $("#infiniteBeepersBtn").removeClass("btn-light");            
        $("#infiniteBeepersBtn").addClass("btn-info");
    }
}





export {DesktopController};