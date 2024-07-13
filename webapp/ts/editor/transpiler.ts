import { java2pascalParser } from "../../../js/java2pascal";
import { pascal2javaParser } from "../../../js/pascal2java";
import { KarelConsole } from "../desktop/console";
import { SetText } from "./editor";
import { getEditors } from "./editorsInstances";


export function editorJava2pascal() {
    const editor = getEditors()[0]

    const source = editor.state.doc.toString();
    try {
        const response=java2pascalParser(source)
        console.log(response)
        SetText(editor,`${response}`);
    } catch (e) {
        KarelConsole.GetInstance().SendMessageToConsole("Para cambiar el lenguaje, el código debe compilar", "danger")
    }

}
export function editorPascal2Java() {
    const editor = getEditors()[0]

    const source = editor.state.doc.toString();
    try {
        const response=pascal2javaParser(source)
        console.log(response)
        SetText(editor,`${response}`);
    } catch (e) {
        KarelConsole.GetInstance().SendMessageToConsole("Para cambiar el lenguaje, el código debe compilar", "danger")
        console.log(e)
    }
}