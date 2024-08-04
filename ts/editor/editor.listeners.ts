import { EditorView } from "codemirror";
import { KarelController } from "../KarelController";
import { getEditors } from "./editorsInstances";
import { HighlightKarelLine } from "./editor.highlightLine";



export function RegisterHighlightListeners() {
    const editor = getEditors()[0];
    const controller = KarelController.GetInstance();
    controller.RegisterStepController((_, state)=> {
        const line = controller.GetRuntime().state.line + 1;
        const codeLine = editor.state.doc.line(line)
        HighlightKarelLine(editor, line);
        editor.dispatch({     
            effects:EditorView.scrollIntoView(codeLine.from)
        });
    })
    controller.RegisterResetObserver((_)=> {
        HighlightKarelLine(editor, -1);
    })
  }