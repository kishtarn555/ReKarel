import { EditorView } from 'codemirror'
import { Compartment } from '@codemirror/state'
import bootstrap from 'bootstrap';
import { WorldRenderer, WRStyle } from '../worldRenderer';
import { WorldViewController, Gizmos } from "../worldViewController/worldViewController";
import { World } from '../../../js/karel';
import { ControllerState, KarelController } from '../KarelController';
import { GetOrCreateInstanceFactory } from 'bootstrap/js/dist/base-component';
import { freezeEditors, unfreezeEditors } from '../editor/editor';
import { ContextMenuData, DesktopContextMenu } from './contextMenu';
import { BeeperToolbar, EvaluateToolbar, KarelToolbar, WallToolbar } from './commonTypes';
import { CallStack, CallStackUI } from './callStack';
import { ConsoleTab, KarelConsole } from './console';
import { DefaultWRStyle } from '../KarelStyles';
import { ControlBar, ControlBarData } from './controlBar';
import { AppVars } from '../volatileMemo';
import { HistoryToolbar } from '../worldViewController/commit';


type FocusToolbar = {
    origin: JQuery,
    karel: JQuery,
    selector: JQuery,
    
}


type InputModeToolbar = {
    indicator: JQuery,
    alternate:JQuery,
    drag:JQuery
}

interface DesktopElements {
    desktopEditor: EditorView
    worldContainer: JQuery,
    worldCanvas: JQuery,
    gizmos: Gizmos,
    worldZoom: JQuery,
    lessZoom: JQuery,
    moreZoom: JQuery,
    controlBar: ControlBarData,
    toolbar: {
        inputMode: InputModeToolbar
        beepers: BeeperToolbar
        karel: KarelToolbar
        wall: WallToolbar
        focus: FocusToolbar
        history: HistoryToolbar
        evaluate: EvaluateToolbar
    },
    context: ContextMenuData,
    console: ConsoleTab,
    callStack: CallStackUI
};

class DesktopController {
    editor: EditorView;

    worldContainer: JQuery;
    worldCanvas: JQuery;
    worldZoom: JQuery;
    lessZoom: JQuery;
    moreZoom: JQuery;
    
    controlbar: ControlBar

    beeperBagInput: JQuery
    infiniteBeeperInput: JQuery

    delayInput: JQuery
    delayAdd: JQuery
    delayRemove: JQuery

    inputModeToolbar: InputModeToolbar;

    beeperToolbar: BeeperToolbar;
    karelToolbar: KarelToolbar;
    wallToolbar: WallToolbar;
    evaluateToolbar: EvaluateToolbar;

    focusToolbar: FocusToolbar;
    historyToolbar: HistoryToolbar;

    contextMenu: DesktopContextMenu

    worldController: WorldViewController;
    karelController: KarelController;

    console:KarelConsole
    callStack: CallStack

    private isControlInPlayMode: boolean
    
    constructor (elements: DesktopElements, karelController: KarelController) {
        this.editor = elements.desktopEditor;
        this.worldContainer = elements.worldContainer;
        this.worldCanvas = elements.worldCanvas;
        this.worldZoom = elements.worldZoom;
        this.lessZoom = elements.lessZoom;
        this.moreZoom = elements.moreZoom;

        this.beeperBagInput = elements.controlBar.beeperInput;
        this.infiniteBeeperInput = elements.controlBar.infiniteBeeperInput;

        this.delayInput = elements.controlBar.delayInput;
        this.delayAdd = elements.controlBar.delayAdd;
        this.delayRemove = elements.controlBar.delayRemove;

        this.inputModeToolbar = elements.toolbar.inputMode;
        this.beeperToolbar = elements.toolbar.beepers;
        this.karelToolbar = elements.toolbar.karel;
        this.wallToolbar = elements.toolbar.wall;
        this.evaluateToolbar = elements.toolbar.evaluate;

        this.focusToolbar = elements.toolbar.focus;
        this.historyToolbar = elements.toolbar.history;

        
        
        this.console =  new KarelConsole(elements.console);
        
        this.karelController = karelController;
        
        this.worldController = new WorldViewController(
            new WorldRenderer(
                (this.worldCanvas[0] as HTMLCanvasElement).getContext("2d"),
                DefaultWRStyle,
                1
            ),
            karelController,
            elements.worldContainer[0],
            elements.gizmos
        );
        this.contextMenu = new DesktopContextMenu(elements.context, elements.worldCanvas, this.worldController);
        this.karelController.RegisterStateChangeObserver(this.OnKarelControllerStateChange.bind(this));
        
        this.isControlInPlayMode = false;
        this.callStack = new CallStack(elements.callStack);
        this.controlbar = new ControlBar(elements.controlBar, this.worldController);

    }

    Init() {
        $(window).on("resize", this.ResizeCanvas.bind(this));
        $(window).on("focus", this.ResizeCanvas.bind(this));
        $(window).on("keydown", this.HotKeys.bind(this));

        this.worldContainer.on("scroll", this.calculateScroll.bind(this));
        $("body").on(
            "mouseup",
            this.worldController.ClickUp.bind(this.worldController)
        );
        this.worldCanvas.on(
            "mousemove",
            this.worldController.TrackMouse.bind(this.worldController)
        );
        this.worldCanvas.on(
            "mousedown",
            this.worldController.ClickDown.bind(this.worldController)
        );
        this.worldCanvas.on(
            "touchstart",
            this.SetAlternativeInput.bind(this)
        );
        

        const zooms = ["0.5", "0.75", "1", "1.5", "2.0", "2.5", "4"]
        this.worldZoom.on("change", ()=> {
            let scale = parseFloat(String(this.worldZoom.val()));
            this.worldController.SetScale(scale);
        });
        this.lessZoom.on("click", ()=> {
            let val = String(this.worldZoom.val());
            let nzoom = zooms.indexOf(val)-1;
            if (nzoom < 0)nzoom=0;
            this.worldZoom.val( zooms[nzoom]).trigger('change');;
        });
        this.moreZoom.on("click", ()=> {
            let val = String(this.worldZoom.val());
            let nzoom = zooms.indexOf(val)+1;
            if (nzoom >= zooms.length)nzoom=zooms.length-1;
            this.worldZoom.val( zooms[nzoom]).trigger('change');;
        });

        this.controlbar.Init();

        this.ConnectToolbar();        
        
        this.ResizeCanvas();
        this.worldController.FocusOrigin();
        this.ConnectConsole();
    }

    private OnKarelControllerStateChange(sender: KarelController, state: ControllerState) {
        if (state === "running") {            
            freezeEditors(this.editor);
            this.worldController.Lock();
        }
        if (state === "finished") {
            if (this.karelController.EndedOnError()) {
                this.worldController.ErrorMode();
            }
            freezeEditors(this.editor);
            this.worldController.Lock();

        } else if (state === "unstarted") {  
            unfreezeEditors(this.editor);
            this.worldController.UnLock();
            this.worldController.NormalMode();
        } 
    }

    private ConnectToolbar() {      
        this.inputModeToolbar.alternate.on("click", ()=>this.SetAlternativeInput());
        this.inputModeToolbar.drag.on("click", ()=>this.SetDragInput());
        
        this.beeperToolbar.addOne.on("click", ()=>this.worldController.ChangeBeepers(1));
        this.beeperToolbar.removeOne.on("click", ()=>this.worldController.ChangeBeepers(-1));        
        this.beeperToolbar.infinite.on("click", ()=>this.worldController.SetBeepers(-1));
        this.beeperToolbar.clear.on("click", ()=>this.worldController.SetBeepers(0));
        this.beeperToolbar.random.on("click", ()=>this.worldController.SetRandomBeepers(AppVars.randomBeeperMinimum, AppVars.randomBeeperMaximum));

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

        this.evaluateToolbar.evaluate.on("click", ()=> this.worldController.SetCellEvaluation(true));
        this.evaluateToolbar.ignore.on("click", ()=> this.worldController.SetCellEvaluation(false));


        
        this.historyToolbar.undo.on("click", ()=>this.worldController.Undo());
        this.historyToolbar.redo.on("click", ()=>this.worldController.Redo());
    }

    private SetAlternativeInput() {
        this.inputModeToolbar.indicator.removeClass("bi-mouse2")
        this.inputModeToolbar.indicator.addClass("bi-hand-index-thumb")
        this.worldController.SetClickMode("alternate");
    }  

    private SetDragInput() {
        this.inputModeToolbar.indicator.removeClass("bi-hand-index-thumb")
        this.inputModeToolbar.indicator.addClass("bi-mouse2")
        this.worldController.SetClickMode("normal");
    }    

    private ConnectConsole() {        
        this.karelController.RegisterMessageCallback(this.ConsoleMessage.bind(this));
    }
    

    public ConsoleMessage(message: string, type:"info"|"success"|"error"|"raw"|"warning" = "info") {
        let style="info";
        switch (type) {
            case "info":
                style = "info";
                break;
            case "success":
                style = "success";
                break;
            case  "error":
                style="danger";
                break;
            case  "warning":
                style="warning";
                break;
            case "raw":
                style="raw";
                break;
        }        
        this.console.SendMessageToConsole(message, style);
    }

    

    private HotKeys(e: JQuery.KeyDownEvent) {
        let tag = e.target.tagName.toLowerCase();
        if (document.activeElement.getAttribute("role")=="textbox" || tag=="input") {
            return;
        }
        const overrideShift = new Set<number>([37, 38, 39, 40]);
        type keyMod = "yes" | "no" | "optional";
        type hotkeyMod = {shift:keyMod, ctrl: keyMod};
        const basic:hotkeyMod = {shift:"optional", ctrl:"no"};
        const ctrl:hotkeyMod = {shift:"no", ctrl:"yes"};
        const shift:hotkeyMod = {shift:"yes", ctrl:"no"};

        let hotkeys = new Map<number, [hotkeyMod,()=>void][]>([
            [71,[[basic, ()=>{this.worldController.ToggleKarelPosition(true);}]]],
            [80,[[basic,()=>{this.worldController.ToggleKarelPosition(false);}]]],
            [82,[[basic,()=>{
                if (e.altKey)
                    (new bootstrap.Modal("#randomBeepersModal")).show()
                else
                    this.worldController.SetRandomBeepers(AppVars.randomBeeperMinimum,AppVars.randomBeeperMaximum);                
                }]]
            ],
            [81,[[basic,()=>{this.worldController.ChangeBeepers(-1);}]]],
            [69,[[basic, ()=>{this.worldController.ChangeBeepers(1);}]]],
            [48,[[basic, ()=>{this.worldController.SetBeepers(0);}]]],
            [49,[[basic, ()=>{this.worldController.SetBeepers(1);}]]],
            [50,[[basic, ()=>{this.worldController.SetBeepers(2);}]]],
            [51,[[basic, ()=>{this.worldController.SetBeepers(3);}]]],
            [52,[[basic, ()=>{this.worldController.SetBeepers(4);}]]],
            [53,[[basic, ()=>{this.worldController.SetBeepers(5);}]]],
            [54,[[basic, ()=>{this.worldController.SetBeepers(6);}]]],
            [55,[[basic, ()=>{this.worldController.SetBeepers(7);}]]],
            [56,[[basic, ()=>{this.worldController.SetBeepers(8);}]]],
            [57,[[basic, ()=>{this.worldController.SetBeepers(9);}]]],
            [67,[[basic, ()=>{$("#desktopSetAmmount").trigger("click")}]]], // FIXME
            [87,[[basic, ()=>{this.worldController.ToggleWall("north");}]]],
            [68,[[basic, ()=>{this.worldController.ToggleWall("east");}]]],
            [83,[[basic, ()=>{this.worldController.ToggleWall("south");}]]],
            [65,[[basic, ()=>{this.worldController.ToggleWall("west");}]]],
            [88,[[basic, ()=>{this.worldController.ToggleWall("outer");}]]],
            [37,[[basic, ()=>{this.worldController.MoveSelection(0,-1, e.shiftKey);}]] ],
            [38,[[basic, ()=>{this.worldController.MoveSelection(1, 0, e.shiftKey);}]]],
            [39,[[basic, ()=>{this.worldController.MoveSelection(0, 1, e.shiftKey);}]]],
            [40,[[basic, ()=>{this.worldController.MoveSelection(-1, 0, e.shiftKey);}]]],
            [84,[[basic, ()=>{this.worldController.SetBeepers(-1);}]]],
            [86,[[basic, ()=>{this.worldController.SetCellEvaluation(false);}]]],
            [8, [[basic, ()=>{this.worldController.RemoveEverything();}]]],
            [46,[[basic, ()=>{this.worldController.RemoveEverything();}]]],
            [89,[[ctrl, ()=>{this.worldController.Redo();}]]],
            [90,[
                [ctrl, ()=>{this.worldController.Undo();}],
                [basic, ()=>{this.worldController.SetCellEvaluation(true);}]
            ]],
            
        ]);
        if (hotkeys.has(e.which) === false) {
            return;
        }     
        
        if (e.shiftKey && !overrideShift.has(e.which)) {

            let dummy: MouseEvent = new MouseEvent("", {
                clientX: e.clientX,
                clientY: e.clientY
            });
            this.worldController.ClickDown(dummy);
            this.worldController.ClickUp(dummy);
        }
        const options = hotkeys.get(e.which)
        for (let option of options) {
            if (option[0].ctrl === "yes" && !e.ctrlKey) continue;
            if (option[0].ctrl === "no" && e.ctrlKey) continue;

            
            if (option[0].shift === "yes" && !e.shiftKey) continue;
            if (option[0].shift === "no" && e.shiftKey) continue;
            option[1]();
            e.preventDefault();
            break;
        }
    }

    private calculateScroll() {
        let left = 0, top=1;
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
        // this.worldController.RecalculateScale();

        this.worldController.Update();        
        this.calculateScroll();
    }
    
}


export {DesktopController};