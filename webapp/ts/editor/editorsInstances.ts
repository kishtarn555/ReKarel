import { EditorView } from "codemirror";
import { createEditors } from "./editor";

let editors = createEditors();
console.log("!");



export function getEditors() {
    return editors;
}

