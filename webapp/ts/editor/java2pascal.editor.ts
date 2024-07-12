import { java2pascalParser } from "../../../js/java2pascal";
import { SetText } from "./editor";
import { getEditors } from "./editorsInstances";


export function editorJava2pascal() {
    const editor = getEditors()[0]

    const source = editor.state.doc.toString();
    const response=java2pascalParser(source)
    console.log(response)

    SetText(editor,`${response}`);
}