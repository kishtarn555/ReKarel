import { EditorView } from 'codemirror'
import { Compartment } from '@codemirror/state'
import bootstrap from 'bootstrap';
import { WorldRenderer, WRStyle, DefaultWRStyle } from '../worldRenderer';
import { WorldViewController, Gizmos } from "../worldViewController/worldViewController";
import { World } from '../../../js/karel';
import { ControllerState, KarelController } from '../KarelController';
import { GetOrCreateInstanceFactory } from 'bootstrap/js/dist/base-component';
import { freezeEditors, unfreezeEditors } from '../editor';
import { ContextMenuData, DesktopContextMenu } from './contextMenu';
import { BeeperToolbar, KarelToolbar, WallToolbar } from './commonTypes';
import { CallStack, CallStackUI } from './callStack';


type FocusToolbar = {
    origin: JQuery,
    karel: JQuery,
    selector: JQuery,
    
}

type ExecutionToolbar = {
    reset: JQuery,
    compile: JQuery,
    run: JQuery,
    step: JQuery,
    future: JQuery,
}

type ConsoleTab = {
    console:JQuery,
    clear: JQuery
}

interface DesktopElements {
    desktopEditor: EditorView
    worldContainer: JQuery,
    worldCanvas: JQuery,
    gizmos: Gizmos,
    worldZoom: JQuery,
    controlBar: {
        execution: ExecutionToolbar,
        beeperInput: JQuery,
        infiniteBeeperInput: JQuery,
        delayInput: JQuery,
    },
    toolbar: {
        beepers: BeeperToolbar
        karel: KarelToolbar
        wall: WallToolbar
        focus: FocusToolbar
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
    
    executionReset : JQuery;
    executionCompile : JQuery;
    executionRun : JQuery;
    executionStep : JQuery;
    executionEnd : JQuery;

    beeperBagInput: JQuery
    infiniteBeeperInput: JQuery

    delayInput: JQuery

    beeperToolbar: BeeperToolbar;
    karelToolbar: KarelToolbar;
    wallToolbar: WallToolbar;

    focusToolbar: FocusToolbar;

    contextToggler: JQuery;
    contextContainer: JQuery
    contextBeepers: BeeperToolbar;
    contextKarel: KarelToolbar;
    contextWall: WallToolbar;

    contextMenu: DesktopContextMenu

    worldController: WorldViewController;
    karelController: KarelController;

    consoleTab: ConsoleTab;
    callStack: CallStack

    private isControlInPlayMode: boolean
    
    constructor (elements: DesktopElements, karelController: KarelController) {
        this.editor = elements.desktopEditor;
        this.worldContainer = elements.worldContainer;
        this.worldCanvas = elements.worldCanvas;
        this.worldZoom = elements.worldZoom;

        this.executionReset = elements.controlBar.execution.reset;
        this.executionCompile = elements.controlBar.execution.compile;
        this.executionRun = elements.controlBar.execution.run;
        this.executionStep = elements.controlBar.execution.step;
        this.executionEnd = elements.controlBar.execution.future;

        this.beeperBagInput = elements.controlBar.beeperInput;
        this.infiniteBeeperInput = elements.controlBar.infiniteBeeperInput;

        this.delayInput = elements.controlBar.delayInput;

        this.beeperToolbar = elements.toolbar.beepers;
        this.karelToolbar = elements.toolbar.karel;
        this.wallToolbar = elements.toolbar.wall;

        this.focusToolbar = elements.toolbar.focus;

        // this.contextToggler = elements.context.toggler;
        // this.contextContainer = elements.context.container;
        // this.contextBeepers = elements.context.beepers;
        // this.contextKarel = elements.context.karel;        
        // this.contextWall = elements.context.wall;

        
        this.consoleTab = elements.console;
        
        this.karelController = karelController;
        
        this.worldController = new WorldViewController(
            new WorldRenderer(
                (this.worldCanvas[0] as HTMLCanvasElement).getContext("2d"),
                DefaultWRStyle,
                window.devicePixelRatio
            ),
            karelController,
            elements.worldContainer[0],
            elements.gizmos
        );
        this.contextMenu = new DesktopContextMenu(elements.context, elements.worldCanvas, this.worldController);
        this.karelController.RegisterStateChangeObserver(this.OnKarelControllerStateChange.bind(this));

        this.isControlInPlayMode = false;
        this.callStack = new CallStack(elements.callStack);

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
        this.worldCanvas.on(
            "mousedown",
            this.worldController.ClickDown.bind(this.worldController)
        );
        

        this.worldZoom.on("change", ()=> {
            let scale = parseFloat(String(this.worldZoom.val()));
            this.worldController.SetScale(scale);
        });

        this.ConnectExecutionButtonGroup();

        this.ConnectToolbar();        
        
        this.ResizeCanvas();
        this.worldController.FocusOrigin();
        this.ConnectConsole();
    }


    private ConnectExecutionButtonGroup() {
        this.executionCompile.on("click", ()=>this.karelController.Compile());
        this.executionReset.on("click", ()=>this.ResetExecution());
        this.executionStep.on("click", ()=>this.Step());
        this.executionEnd.on("click", ()=> this.RunTillEnd());
        this.executionRun.on("click", ()=> {
            if (!this.isControlInPlayMode) {
                this.AutoStep();
            } else {
                this.PauseStep();
            }            
        });
        this.delayInput.on("change", () => {
            let delay:number = parseInt(this.delayInput.val() as string);
            this.karelController.ChangeAutoStepDelay(delay);
        });
        this.beeperBagInput.on("change", () => this.OnBeeperInputChange());
        this.infiniteBeeperInput.on("click", () => this.ToggleInfiniteBeepers());
        this.karelController.RegisterStepController((_ctr, _state)=> {this.UpdateBeeperBag()})
    }
    
    private UpdateBeeperBag() {
        const amount = this.worldController.GetBeepersInBag()
        
        this.beeperBagInput.val(amount);
        if (amount === -1) {
            this.ActivateInfiniteBeepers();
        } else {
            this.DeactivateInfiniteBeepers();
        }
    }

    private ActivateInfiniteBeepers() {
        this.beeperBagInput.hide();
        this.infiniteBeeperInput.removeClass("btn-light");
        this.infiniteBeeperInput.addClass("btn-info");
    }

    
    private DeactivateInfiniteBeepers() {
        this.beeperBagInput.show();
        this.infiniteBeeperInput.removeClass("btn-info");
        this.infiniteBeeperInput.addClass("btn-light");
    }


    private ToggleInfiniteBeepers() {
        if (this.worldController.GetBeepersInBag() !== -1) {
            this.ActivateInfiniteBeepers();
            this.worldController.SetBeepersInBag(-1);
        } else {
            this.DeactivateInfiniteBeepers();
            this.worldController.SetBeepersInBag(0);
            this.UpdateBeeperBag();

        }
    }
    
    private OnBeeperInputChange() {
        if (this.karelController.GetState() !== "unstarted") {
            return;
        }
        let beeperAmmount = parseInt(this.beeperBagInput.val() as string);
        this.worldController.SetBeepersInBag(beeperAmmount);
    }

    private ResetExecution() {
        this.karelController.Reset();
        this.UpdateBeeperBag();
    }
    
    private AutoStep() {
        let delay:number = parseInt(this.delayInput.val() as string);
        this.karelController.StartAutoStep(delay);
        this.SetPlayMode();
    }
    
    private PauseStep() {
        this.karelController.Pause();
    }

    private RunTillEnd() {
        this.karelController.RunTillEnd();        
        this.UpdateBeeperBag();
    }
    private Step() {
        this.karelController.Step();
        this.UpdateBeeperBag();
    }

    private DisableControlBar() {
        this.executionCompile.attr("disabled", "");
        this.executionRun.attr("disabled", "");
        this.executionStep.attr("disabled", "");
        this.executionEnd.attr("disabled", "");
        this.beeperBagInput.attr("disabled", "");
        this.infiniteBeeperInput.attr("disabled", "");
    }

    
    private EnableControlBar() {
        this.executionCompile.removeAttr("disabled");
        this.executionRun.removeAttr("disabled");
        this.executionStep.removeAttr("disabled");
        this.executionEnd.removeAttr("disabled");
        this.beeperBagInput.removeAttr("disabled");
        this.infiniteBeeperInput.removeAttr("disabled");

        
        this.executionRun.html('<i class="bi bi-play-fill"></i>');
    }

    private SetPlayMode() {
        this.isControlInPlayMode = true;

        this.executionCompile.attr("disabled", "");
        this.executionStep.attr("disabled", "");
        this.executionEnd.attr("disabled", "");
        this.beeperBagInput.attr("disabled", "");
        this.infiniteBeeperInput.attr("disabled", "");

        
        this.executionRun.html('<i class="bi bi-pause-fill"></i>');
    }

    
    private SetPauseMode() {
        this.isControlInPlayMode = false;

        this.executionCompile.attr("disabled", "");
        this.beeperBagInput.attr("disabled", "");
        this.infiniteBeeperInput.attr("disabled", "");

        this.executionStep.removeAttr("disabled");
        this.executionEnd.removeAttr("disabled");
        this.executionRun.removeAttr("disabled");
        
        this.executionRun.html('<i class="bi bi-play-fill"></i>');
    }

    private OnKarelControllerStateChange(sender: KarelController, state: ControllerState) {
        if (state === "running") {            
            freezeEditors(this.editor);
            this.SetPauseMode();
            this.worldController.Lock();
        }
        if (state === "finished") {
            this.isControlInPlayMode = false;
            this.DisableControlBar();
            if (this.karelController.EndedOnError()) {
                this.worldController.ErrorMode();
            }
            freezeEditors(this.editor);
            
            this.worldController.Lock();

        } else if (state === "unstarted") {            
            this.isControlInPlayMode = false;

            this.EnableControlBar();
            unfreezeEditors(this.editor);
            this.worldController.UnLock();

            this.worldController.NormalMode();
            this.UpdateBeeperBag();
        } else if (state === "paused") {
            this.SetPauseMode();
        }
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


    private ConnectConsole() {        
        this.karelController.RegisterMessageCallback(this.ConsoleMessage.bind(this));
        this.consoleTab.clear.on("click", ()=> this.ClearConsole());
    }

    
    private ToggleContextMenu() {
        const dropmenu = new bootstrap.Dropdown(this.contextToggler[0]);
        if (this.contextToggler.attr("aria-expanded")==="false") {
            dropmenu.show();
        } else {
            dropmenu.hide();
        }
    }

    private ClearConsole() {
        this.consoleTab.console.empty();
    } 

    private SendMessageToConsole(message: string, style:string) {
        if (style !== "raw") {
            const currentDate = new Date();
            const hour = currentDate.getHours() % 12 || 12;
            const minute = currentDate.getMinutes();
            const second = currentDate.getSeconds();
            const amOrPm = currentDate.getHours() < 12 ? "AM" : "PM";
            
            const html = `<div style="text-wrap: wrap;"><span class="text-${style}">[${hour}:${minute}:${second} ${amOrPm}]</span> ${message}</div>`;
            this.consoleTab.console.prepend(html);
            return;
        }
        const html = `<div>${message}</div>`;
        this.consoleTab.console.prepend(html);
    }

    public ConsoleMessage(message: string, type:"info"|"success"|"error"|"raw" = "info") {
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
            case "raw":
                style="raw";
                break;
        }        
        this.SendMessageToConsole(message, style);
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
            [88,()=>{this.worldController.ToggleWall("outer");}],
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
        // this.worldController.RecalculateScale();

        this.worldController.Update();        
        this.calculateScroll();
    }
    
}


export {DesktopController};