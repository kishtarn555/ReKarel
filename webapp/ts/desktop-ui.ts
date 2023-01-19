import { EditorView } from 'codemirror'
import { Compartment } from '@codemirror/state'
import bootstrap from 'bootstrap';
import { WorldRenderer, WRStyle, DefaultWRStyle } from './worldRenderer';
import { WorldController, Gizmos } from "./worldController";
import { World } from '../../js/karel';
import { KarelController } from './KarelController';

type BeeperToolbar= {
    addOne: JQuery,
    removeOne: JQuery,
    ammount: JQuery,
    infinite: JQuery,
    clear: JQuery,    
}
interface DesktopElements {
    worldContainer: JQuery,
    worldCanvas: JQuery,
    gizmos: Gizmos,
    worldZoom: JQuery,
    toolbar: {
        beepers: BeeperToolbar
    }
    context: {
        toggler: JQuery,
        container: JQuery
        beepers: BeeperToolbar,
    }
};

class DesktopController {
    worldContainer: JQuery;
    worldCanvas: JQuery;
    worldZoom: JQuery;

    contextToggler: JQuery;
    contextContainer: JQuery
    contextBeepers: BeeperToolbar;

    worldController: WorldController;
    karelController: KarelController;
    beeperToolbar: BeeperToolbar;
    
    constructor (elements: DesktopElements, karelController: KarelController) {
        this.worldContainer = elements.worldContainer;
        this.worldCanvas = elements.worldCanvas;
        this.worldZoom = elements.worldZoom;

        this.beeperToolbar = elements.toolbar.beepers;

        this.contextToggler = elements.context.toggler;
        this.contextContainer = elements.context.container;
        this.contextBeepers = elements.context.beepers;

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
        this.worldCanvas.on("contextmenu", (e)=>{
            const dropmenu =new bootstrap.Dropdown(this.contextToggler[0]);
            dropmenu.hide();
            this.contextContainer[0].style.setProperty("top", `${e.pageY}px`);
            this.contextContainer[0].style.setProperty("left", `${e.pageX}px`);      
            ToggleConextMenu();
            e.preventDefault();
        })

        this.worldZoom.on("change", ()=> {
            let scale = parseFloat(String(this.worldZoom.val()));
            this.worldController.SetScale(scale);
        });

        this.beeperToolbar.addOne.on("click", ()=>this.worldController.ChangeBeepers(1));
        this.beeperToolbar.removeOne.on("click", ()=>this.worldController.ChangeBeepers(-1));
        
        this.beeperToolbar.infinite.on("click", ()=>this.worldController.SetBeepers(-1));
        this.beeperToolbar.clear.on("click", ()=>this.worldController.SetBeepers(0));

        
        this.ResizeCanvas();
        this.worldController.FocusOrigin();
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


let renderer: WorldRenderer = undefined;
let controller: WorldController = undefined;

function scrollCanvas() {
    let left = 
        ($("#worldContainer")[0].scrollWidth-$("#worldContainer")[0].clientWidth)!==0?
            $("#worldContainer").scrollLeft() 
            / ($("#worldContainer")[0].scrollWidth-$("#worldContainer")[0].clientWidth)
            :1;
    let top =
        ($("#worldContainer")[0].scrollHeight-$("#worldContainer")[0].clientHeight)!==0?
            1-$("#worldContainer").scrollTop() 
            / ($("#worldContainer")[0].scrollHeight-$("#worldContainer")[0].clientHeight)
            :1;
    controller.UpdateScroll(left, top);
}

function ResizeDesktopCanvas() {    
    $("#worldCanvas")[0].style.width= `${$("#worldContainer")[0].clientWidth}px`;    
    $("#worldCanvas")[0].style.height= `${$("#worldContainer")[0].clientHeight}px`;
    let scale = window.devicePixelRatio;
    $("#worldCanvas").attr(
        "width", Math.floor($("#worldContainer")[0].clientWidth * scale)
    );    
    $("#worldCanvas").attr(
        "height", Math.floor($("#worldContainer")[0].clientHeight * scale)
    );

    controller.Update();        
    scrollCanvas();
}

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


function ToggleConextMenu() {
    // $("#contextMenuToggler")[0].click();
    let toggler = $("#contextMenuToggler");
    const dumb =new bootstrap.Dropdown(toggler[0]);
    if (toggler.attr("aria-expanded")==="false") {
        dumb.show();
    } else {
        dumb.hide();
    }
   
}
//TODO: Add support for states
const lightWRStyle : WRStyle = {
    disabled: '#4f4f4f',
    exportCellBackground: '#f5f7a8',
    karelColor: '#3E6AC1',
    gridBackgroundColor: '#f8f9fA',
    gridBorderColor: '#c4c4c4',
    gutterBackgroundColor: '#e6e6e6',
    gutterColor: "#444444",
    beeperBackgroundColor: "#0ADB23",    
    beeperColor: "#000000"
}
function GetDesktopUIHelper(world: World) {
    renderer = new WorldRenderer(
        ($("#worldCanvas")[0] as HTMLCanvasElement).getContext("2d"),
        lightWRStyle,
        window.devicePixelRatio  
    );
    controller = new WorldController(
        renderer,
        $("#worldContainer")[0] ,
        world,
        {
            selectionBox: {
                main: $("#desktopBoxSelect")[0],
                bottom: $("#desktopBoxSelect [name='bottom']")[0],
                top: $("#desktopBoxSelect [name='top']")[0],
                left: $("#desktopBoxSelect [name='left']")[0],
                right: $("#desktopBoxSelect [name='right']")[0],
            }
        }
    );
    $("#worldCanvas").on("contextmenu", (e) => {
        const dumb =new bootstrap.Dropdown($("#contextMenuToggler")[0]);
        dumb.hide();
        $("#contextMenuDiv")[0].style.setProperty("top", `${e.pageY}px`);
        $("#contextMenuDiv")[0].style.setProperty("left", `${e.pageX}px`);      
        ToggleConextMenu();
        e.preventDefault();
    });

    $("#zoomDekstop").on("change", ()=> {
        let scale = parseFloat(String($("#zoomDekstop").val()));
        controller.SetScale(scale);
    })

    
    $("#worldContainer").on("scroll", scrollCanvas);
    $(window).on("resize", () => {        
        ResizeDesktopCanvas();
    });
    controller.FocusOrigin();


    $("#worldCanvas").on("mouseup", controller.ClickUp.bind(controller)); 
    $("#worldCanvas").on("mousemove", controller.TrackMouse.bind(controller));
    
    $("#desktopGoHome").on("click", ()=>controller.FocusOrigin());
    $("#desktopGoKarel").on("click", ()=>controller.FocusKarel());
    
    $("#desktopKarelNorth").on("click", ()=>controller.SetKarelOnSelection("north"));
    $("#desktopKarelEast").on("click", ()=>controller.SetKarelOnSelection("east"));
    $("#desktopKarelSouth").on("click", ()=>controller.SetKarelOnSelection("south"));
    $("#desktopKarelWest").on("click", ()=>controller.SetKarelOnSelection("west"));
    
    $("#desktopAddBeeper").on("click", ()=>controller.ChangeBeepers(1));
    $("#desktopDecrementBeeper").on("click", ()=>controller.ChangeBeepers(-1));
    $("#desktopRemoveAll").on("click", ()=>controller.SetBeepers(0));
    
    $("#desktopNorthWall").on("click", ()=>controller.ToggleWall("north"));
    $("#desktopEastWall").on("click", ()=>controller.ToggleWall("east"));
    $("#desktopSouthWall").on("click", ()=>controller.ToggleWall("south"));
    $("#desktopWestWall").on("click", ()=>controller.ToggleWall("west"));
    $("#desktopOuterWall").on("click", ()=>controller.ToggleWall("outer"));

    $("#contextKarelNorth").on("click", ()=>{
        ToggleConextMenu();
        controller.SetKarelOnSelection("north");
    });
    $("#contextKarelEast").on("click", ()=>{        
        ToggleConextMenu();
        controller.SetKarelOnSelection("east");
    });
    $("#contextKarelSouth").on("click", ()=>{        
        ToggleConextMenu();
        controller.SetKarelOnSelection("south");
    });
    $("#contextKarelWest").on("click", ()=>{        
        ToggleConextMenu();
        controller.SetKarelOnSelection("west");
    });
    $("#contextAddBeeper").on("click", ()=>{
        ToggleConextMenu();
        controller.ChangeBeepers(1);
    });
    $("#contextDecrementBeeper").on("click", ()=>{
        ToggleConextMenu();
        controller.ChangeBeepers(-1);
    });
    $("#contextRemoveAll").on("click", ()=>{
        ToggleConextMenu();
        controller.SetBeepers(0);
    });

    
    $("#contextNorthWall").on("click", ()=>{
        ToggleConextMenu();
        controller.ToggleWall("north");
    });
    $("#contextEastWall").on("click", ()=>{
        ToggleConextMenu();
        controller.ToggleWall("east");
    });
    $("#contextSouthWall").on("click", ()=>{
        ToggleConextMenu();
        controller.ToggleWall("south");
    });
    $("#contextWestWall").on("click", ()=>{
        ToggleConextMenu();
        controller.ToggleWall("west");
    });
    $("#contextOuterWall").on("click", ()=>{
        ToggleConextMenu();
        controller.ToggleWall("outer");
    });

    

    return {
        toggleInfinityBeepers : toggleInfinityBeepers,
        renderer: renderer,
        controller: controller,
        ResizeDesktopCanvas: ResizeDesktopCanvas

    };
}

function DesktopKeyDown(e: JQuery.KeyDownEvent) {
    let tag = e.target.tagName.toLowerCase();
    if (document.activeElement.getAttribute("role")=="textbox" || tag=="input") {
        return;
    }

    let hotkeys = new Map<number, ()=>void>([
        [71,()=>{controller.ToggleKarelPosition();}],
        [82,()=>{controller.SetBeepers(0);}],
        [81,()=>{controller.ChangeBeepers(-1);}],
        [69,()=>{controller.ChangeBeepers(1);}],
        [48,()=>{controller.SetBeepers(0);}],
        [49,()=>{controller.SetBeepers(1);}],
        [50,()=>{controller.SetBeepers(2);}],
        [51,()=>{controller.SetBeepers(3);}],
        [52,()=>{controller.SetBeepers(4);}],
        [53,()=>{controller.SetBeepers(5);}],
        [54,()=>{controller.SetBeepers(6);}],
        [55,()=>{controller.SetBeepers(7);}],
        [56,()=>{controller.SetBeepers(8);}],
        [57,()=>{controller.SetBeepers(9);}],
        [87,()=>{controller.ToggleWall("north");}],
        [68,()=>{controller.ToggleWall("east");}],
        [83,()=>{controller.ToggleWall("south");}],
        [65,()=>{controller.ToggleWall("west");}],
        [37,()=>{controller.MoveSelection(0,-1);}],
        [38,()=>{controller.MoveSelection(1, 0);}],
        [39,()=>{controller.MoveSelection(0, 1);}],
        [40,()=>{controller.MoveSelection(-1, 0);}],
        
    ]);
    if (hotkeys.has(e.which) === false) {
        return;
    }     
     
    if (e.shiftKey) {
        let dummy: MouseEvent = new MouseEvent("", {
            clientX: e.clientX,
            clientY: e.clientY,
        });
        controller.ClickUp(dummy);
    }
    hotkeys.get(e.which)();
    e.preventDefault();
}


export {GetDesktopUIHelper, DesktopKeyDown, ResizeDesktopCanvas, DesktopController};