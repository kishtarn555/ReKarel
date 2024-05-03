import { World, compile, detectLanguage } from "../../js/karel";
import { WorldController } from "./worldController";
import { EditorView } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state"
import { DesktopController } from "./desktop-ui";
import { ERRORCODES } from "./common-ui";
import { breakpointState, setLanguage } from "./editor";

type messageType = "info"|"success"|"error"|"raw";
type MessageCallback = (message:string, type:messageType)=>void;
type ControllerState = "unstarted"| "running" | "finished" | "paused";
type StateChangeCallback = (caller:KarelController, newState:ControllerState)=>void;
type StepCallback = (caller:KarelController, newState:ControllerState)=>void;
class KarelController {
    world: World;
    desktopController: WorldController;
    running: boolean;
    mainEditor: EditorView;
    private onMessage: MessageCallback[];
    private onStateChange: StateChangeCallback[];
    private onStep: StepCallback[];
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
        this.onStep = [];
        this.state = "unstarted";
        this.endedOnError = false;
        this.autoStepInterval = 0;
        this.autoStepping = false;
    }
    
    SetDesktopController(desktopController: WorldController) {
        this.desktopController = desktopController;
        this.desktopController.SetWorld(this.world);
        
        this.OnStackChanges();
    }

    Compile() {
        let code = this.mainEditor.state.doc.toString();
        // let language: string = detectLanguage(code);
        let language = detectLanguage(code) as "java" | "pascal" | "ruby" | "none";
            
        if (language === "java" || language === "pascal") {
            setLanguage(this.mainEditor, language);
        }
        let response = null;
        try {
            response = compile(code);
            //TODO: expand message            
            this.SendMessage("Programa compilado correctamente", "info");
        } catch (e) {            
            //TODO: Expand error
            this.SendMessage(decodeError(e, language), "error");
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
        this.SendMessage("<hr>", "raw");
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

    Pause() {
        if (this.state !== "running") return;
        this.StopAutoStep();
        this.ChangeState("paused")
    }

    CheckForBreakPointOnCurrentLine():boolean {
        let runtime= this.desktopController.GetRuntime();
        if (runtime.state.line >= 0) {          
            
            let codeLine = this
                .mainEditor
                .state
                .doc
                .line(
                    runtime.state.line+1
                );
                codeLine.from
                let breakpoints = this.mainEditor.state.field(breakpointState)
                let hasBreakpoint = false
                breakpoints.between(codeLine.from,codeLine.from, () => {hasBreakpoint = true})
                if (hasBreakpoint) {                    
                    this.BreakPointMessage(codeLine.number);
                }
                return hasBreakpoint;
        }
        return false;
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
                },
                scrollIntoView: true,             
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
        this.desktopController.TrackFocusToKarel();
        this.desktopController.CheckUpdate();

        if (!runtime.state.running) {            
            this.EndMessage();
            this.ChangeState("finished");
        }
        if (this.CheckForBreakPointOnCurrentLine()) {
            this.Pause();
            this.NotifyStep();
            return;
        }

        this.NotifyStep();

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
        if (this.state !== "running") {
            this.ChangeState("running");
        }
        this.autoStepInterval = setInterval(
            ()=>{
                if (!this.running) {
                    this.StopAutoStep();
                    return;
                }
                this.Step();
                this.desktopController.CheckUpdate();
            }, 
            delay
        );
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
        while ( runtime.step() && !this.CheckForBreakPointOnCurrentLine());
        runtime.disableStackEvents= false; // FIXME: This should only be done when no breakpoints
        this.desktopController.CheckUpdate();
        this.HighlightCurrentLine();

        if (!runtime.state.running) {
            this.EndMessage();
            this.ChangeState("finished");
        } else {
            this.Pause();
        }
        this.desktopController.TrackFocusToKarel();
    }

    RegisterMessageCallback(callback: MessageCallback) {
        this.onMessage.push(callback);
    }

    RegisterStateChangeObserver(callback: StateChangeCallback) {
        this.onStateChange.push(callback);
    }

    RegisterStepController(callback: StepCallback) {
        this.onStep.push(callback);
    }

    private SendMessage(message: string, type: messageType) {
        this.onMessage.forEach((callback) => callback(message, type));
    }

    private NotifyStateChange() {
        this.onStateChange.forEach((callback) => callback(this, this.state));
    }
    private NotifyStep() {
        this.onStep.forEach((callback) => callback(this, this.state));
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

    private BreakPointMessage(line:number) {
        this.SendMessage(`🔴 ${line}) Breakpoint `, "info");
    }


    private OnStackChanges() {
        //FIXME: Don't hardcode the id. #pilaTab
        let runtime = this.desktopController.GetRuntime();
        // @ts-ignore
        runtime.addEventListener('call', function (evt) {   
            $('#pilaTab').prepend(
              '<div class="well well-small">' +
                evt.function +
                '(' +
                evt.param +
                ') Línea <span class="badge badge-info">' +
                (evt.line + 1) +
                '</span></div>',
            );
          });
          // @ts-ignore
          runtime.addEventListener('return', function (evt) {
            var arreglo = $('#pilaTab > div:first-child').remove();
          });
          // @ts-ignore
          runtime.addEventListener('start', function (evt) {
            var arreglo = $('#pilaTab > div:first-child').remove();
          });
    }
}
const ERROR_TOKENS = {
    pascal: {
      BEGINPROG: '"iniciar-programa"',
      BEGINEXEC: '"inicia-ejecución"',
      ENDEXEC: '"termina-ejecución"',
      ENDPROG: '"finalizar-programa"',
      DEF: '"define-nueva-instrucción"',
      PROTO: '"define-prototipo-instrucción"',
      RET: '"sal-de-instrucción"',
      AS: '"como"',
      HALT: '"apágate"',
      LEFT: '"gira-izquierda"',
      FORWARD: '"avanza"',
      PICKBUZZER: '"coge-zumbador"',
      LEAVEBUZZER: '"deja-zumbador"',
      BEGIN: '"inicio"',
      END: '"fin"',
      THEN: '"entonces"',
      WHILE: '"mientras"',
      DO: '"hacer"',
      REPEAT: '"repetir"',
      TIMES: '"veces"',
      DEC: '"precede"',
      INC: '"sucede"',
      IFZ: '"si-es-cero"',
      IFNFWALL: '"frente-libre"',
      IFFWALL: '"frente-bloqueado"',
      IFNLWALL: '"izquierda-libre"',
      IFLWALL: '"izquierda-bloqueada"',
      IFNRWALL: '"derecha-libre"',
      IFRWALL: '"derecha-bloqueada"',
      IFWBUZZER: '"junto-a-zumbador"',
      IFNWBUZZER: '"no-junto-a-zumbador"',
      IFBBUZZER: '"algún-zumbador-en-la-mochila"',
      IFNBBUZZER: '"ningún-zumbador-en-la-mochila"',
      IFN: '"orientado-al-norte"',
      IFS: '"orientado-al-sur"',
      IFE: '"orientado-al-este"',
      IFW: '"orientado-al-oeste"',
      IFNN: '"no-orientado-al-norte"',
      IFNS: '"no-orientado-al-sur"',
      IFNE: '"no-orientado-al-este"',
      IFNW: '"no-orientado-al-oeste"',
      ELSE: '"si-no"',
      IF: '"si"',
      NOT: '"no"',
      OR: '"o"',
      AND: '"y"',
      '(': '"("',
      ')': '")"',
      ';': '";"',
      NUM: 'un número',
      VAR: 'un nombre',
      EOF: 'el final del programa',
    },
    java: {
      CLASS: '"class"',
      PROG: '"program"',
      DEF: '"define"',
      RET: '"return"',
      HALT: '"turnoff"',
      LEFT: '"turnleft"',
      FORWARD: '"move"',
      PICKBUZZER: '"pickbeeper"',
      LEAVEBUZZER: '"putbeeper"',
      WHILE: '"while"',
      REPEAT: '"iterate"',
      DEC: '"pred"',
      INC: '"succ"',
      IFZ: '"iszero"',
      IFNFWALL: '"frontIsClear"',
      IFFWALL: '"frontIsBlocked"',
      IFNLWALL: '"leftIsClear"',
      IFLWALL: '"leftIsBlocked"',
      IFNRWALL: '"rightIsClear"',
      IFRWALL: '"rightIsBlocked"',
      IFWBUZZER: '"nextToABeeper"',
      IFNWBUZZER: '"notNextToABeeper"',
      IFBBUZZER: '"anyBeepersInBeeperBag"',
      IFNBBUZZER: '"noBeepersInBeeperBag"',
      IFN: '"facingNorth"',
      IFS: '"facingSouth"',
      IFE: '"facingEast"',
      IFW: '"facingWest"',
      IFNN: '"notFacingNorth"',
      IFNS: '"notFacingSouth"',
      IFNE: '"notFacingEast"',
      IFNW: '"notFacingWest"',
      ELSE: '"else"',
      IF: '"if"',
      NOT: '"!"',
      OR: '"||"',
      AND: '"&&"',
      '(': '"("',
      ')': '")"',
      BEGIN: '"{"',
      END: '"}"',
      ';': '";"',
      NUM: 'un número',
      VAR: 'un nombre',
      EOF: 'el final del programa',
    },
  };

function decodeError(e, lan : "java"|"pascal"|"ruby"|"none") : string {
    if (lan === "ruby" || lan === "none") {
        return "Error de compilación, no se puede reconocer el lenguaje";
    }
    let status = e.hash;
    if (status == null) {
        return "Error de compilación";
    }
    let message = `Error de compilación en la línea ${status.line +1}`
    if (status.expected) {
        message += "\n<br>\n"
        let expectations = status.expected.map((x=>ERROR_TOKENS[lan][x.replace(/^'+/,"").replace(/'+$/,"") ]))        
        message += `Se encontró "${status.text}" cuando se esperaba ${ expectations.join(", ")}`
    }
    return message;
}


export {KarelController, ControllerState};