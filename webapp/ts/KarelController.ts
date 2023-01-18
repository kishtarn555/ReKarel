import { World, compile, detectLanguage } from "../../js/karel";
import { WorldController } from "./worldController";
import { EditorView } from "codemirror";

class KarelController {
    world: World;
    desktopController: WorldController;
    running: boolean;
    mainEditor: EditorView;

    constructor(world: World, desktopController: WorldController, mainEditor: EditorView) {
        this.world = world;
        this.desktopController = desktopController;
        this.desktopController.SetWorld(world);
        this.running = false;
        this.mainEditor = mainEditor;
    }

    Compile() {
        let code = this.mainEditor.state.doc.toString();
        // let language: string = detectLanguage(code);
        return compile(code);        
    }

    // FIXME This is code from karel.js that I'm not even sure if it's ever executed by the web app.
    validatorCallbacks(message) {
        console.log("validator said this: ", message);
      }


    StartRun(): boolean {
        let compiled = this.Compile();
        if (compiled == null) {
            return false;
        }
        this.desktopController.Reset();
        let runtime = this.desktopController.GetRuntime();        
        runtime.load(compiled);
        // FIXME: We skip validators, they seem useless, but I'm unsure
        
        runtime.start();
        this.running = true;
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

    }
}

export {KarelController};