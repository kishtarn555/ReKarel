import {HighlightStyle} from "@codemirror/language"
import { EditorView } from "codemirror"
import { SetEditorHighlight } from "../editor";

export type EditorTheme = {
    highlight:HighlightStyle,
    color:string,
    backgroundColor:string
} 




export function applyTheme(theme:EditorTheme) {
    SetEditorHighlight(theme.highlight);
    const root = $(":root")[0];
    root.style.setProperty("--editor-color", theme.color);
    root.style.setProperty("--editor-background-color", theme.backgroundColor);
}
