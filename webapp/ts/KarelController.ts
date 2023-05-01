import { World, compile, detectLanguage } from "../../js/karel";
import { WorldController } from "./worldController";
import { EditorView } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state"
import { DesktopController } from "./desktop-ui";
import { ERRORCODES } from "./common-ui";

type messageType = "info"|"success"|"error";
type MessageCallback = (message:string, type:messageType)=>void;
type ControllerState = "unstarted"| "running" | "finished";
type StateChangeCallback = (caller:KarelController, newState:ControllerState)=>void;
class KarelController {
    world: World;
    desktopController: WorldController;
    running: boolean;
    mainEditor: EditorView;
    private onMessage: MessageCallback[];
    private onStateChange: StateChangeCallback[];
    private state : ControllerState;
    private endedOnError:boolean;
    private autoStepInterval:number;
    private drawFrameRequest : number;
    private autoStepping: boolean;

    constructor(world: World, mainEditor: EditorView) {
        this.world = world;
        this.running = false;
        this.mainEditor = mainEditor;
        this.onMessage = [];
        this.onStateChange = [];
        this.state = "unstarted";
        this.endedOnError = false;
        this.autoStepInterval = 0;
        this.drawFrameRequest = 0;
        this.autoStepping = false;
    }
    
    SetDesktopController(desktopController: WorldController) {
        this.desktopController = desktopController;
        this.desktopController.SetWorld(this.world);
    }

    Compile() {
        let code = this.mainEditor.state.doc.toString();
        // let language: string = detectLanguage(code);
        let response = null;
        try {
            response = compile(code);
            //TODO: expand message            
            this.SendMessage("Programa compilado correctamente", "info");
        } catch (e) {
            //TODO: Expand error
            this.SendMessage("Error de compilacion", "error");
        }
        
        return response;
    }

    // FIXME This is code from karel.js that I'm not even sure if it's ever executed by the web app.
    validatorCallbacks(message) {
        console.log("validator said this: ", message);
    }
    
    IsAutoStepping(): boolean {
        return this.autoStepping;
    }

    GetState(): ControllerState {
        return this.state;
    }

    Reset() {        
        this.endedOnError = false;
        this.running = false;
        this.ChangeState("unstarted");
        this.desktopController.Reset();
    }

    StartRun(): boolean {        
        this.endedOnError = false;
        let compiled = this.Compile();
        if (compiled == null) {
            return false;
        }
        this.Reset();
        let runtime = this.desktopController.GetRuntime();        
        runtime.load(compiled);
        // FIXME: We skip validators, they seem useless, but I'm unsure
        
        runtime.start();
        this.running = true;
        this.ChangeState("running");
        return true;        
    }

    HighlightCurrentLine() {
        let runtime= this.desktopController.GetRuntime();
        if (runtime.state.line >= 0) {          
            
            let codeLine = this
                .mainEditor
                .state
                .doc
                .line(
                    runtime.state.line+1
                );
            this.mainEditor.dispatch({
                selection:{
                    anchor: codeLine.from,
                    head: codeLine.from
                }                
            });
        }
      }

    Step() {
        if (this.state === "finished") {
            //Ignore if the code already finished running
            return;
        }
        if (!this.running) {
            if (!this.StartRun()) {
                // Code Failed
                return;
            }
        }
        
        let runtime = this.desktopController.GetRuntime();
        runtime.step();
        this.HighlightCurrentLine();
        this.desktopController.CheckUpdate();

        if (!runtime.state.running) {            
            this.EndMessage();
            this.ChangeState("finished");
        }

    }

    StartAutoStep(delay:number) {        
        this.StopAutoStep(); //Avoid thread leak
        if (this.state === "finished") {
            return;
        }
        this.autoStepping = true;
        if (!this.running) {
            if (!this.StartRun()) {
                //Code Failed
                return;
            }
        }
        this.autoStepInterval = setInterval(
            ()=>{
                if (!this.running) {
                    this.StopAutoStep();
                    return;
                }
                this.Step();

            }, 
            delay
        );
        this.drawFrameRequest = requestAnimationFrame(this.FrameDraw.bind(this));
    }

    ChangeAutoStepDelay(delay:number) {
        if (!this.IsAutoStepping()) {
            return;
        }
        this.StartAutoStep(delay);
    }

    StopAutoStep() {
        this.autoStepping = false;
        if (this.autoStepInterval !== 0) {
            clearInterval(this.autoStepInterval);
            this.autoStepInterval = 0;
        }
        if (this.drawFrameRequest !== 0) {
            cancelAnimationFrame(this.drawFrameRequest);
            this.drawFrameRequest = 0;
        }
    }

    private FrameDraw() {
        this.desktopController.CheckUpdate();
        this.drawFrameRequest = requestAnimationFrame(this.FrameDraw.bind(this));
        
    }

    EndedOnError() {
        return this.endedOnError;
    }
    RunTillEnd() {
        if (this.state === "finished") {
            return;
        }
        if (!this.running) {
            if (!this.StartRun()) {
                return;
            }
        }

        let runtime = this.desktopController.GetRuntime();
        runtime.disableStackEvents= true; // FIXME: This should only be done when no breakpoints
        while (runtime.step());
        runtime.disableStackEvents= false; // FIXME: This should only be done when no breakpoints
        this.desktopController.CheckUpdate();
        this.EndMessage();
        this.ChangeState("finished");
    }

    RegisterMessageCallback(callback: MessageCallback) {
        this.onMessage.push(callback);
    }

    RegisterStateChangeObserver(callback: StateChangeCallback) {
        this.onStateChange.push(callback);
    }

    private SendMessage(message: string, type: messageType) {
        this.onMessage.forEach((callback) => callback(message, type));
    }

    private NotifyStateChange() {
        this.onStateChange.forEach((callback) => callback(this, this.state));
    }

    
    private ChangeState(nextState: ControllerState) {
        this.state = nextState;
        this.NotifyStateChange();
    }

    private EndMessage() {
        let runtime = this.desktopController.GetRuntime();
        if (runtime.state.error) {
            this.SendMessage(ERRORCODES[runtime.state.error], "error");            
            this.endedOnError = true;
            return;
        }
        this.SendMessage("Ejecucion terminada exitosamente!", "success");
    }
}

export {KarelController, ControllerState};