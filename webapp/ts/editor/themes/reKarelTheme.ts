import { tags } from "@lezer/highlight"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { EditorTheme } from "./editorTheme"
import { EditorView } from "codemirror";


export const ReKarelHighlight: EditorTheme = {
    color: "#fafafa",
    backgroundColor: "var(--bs-dark)",
    extensions: [
      
      syntaxHighlighting(HighlightStyle.define([
        { tag: tags.atom, color: "#ffda6a" },
        { tag: tags.keyword, color: "#ea868f" },
        { tag: tags.controlKeyword, color: "#6ea8fe" },
        { tag: tags.definitionKeyword, color: "#6ea8fe" },
        { tag: tags.number, color: "#ffda6a" },
        { tag: tags.operator, color: "#77a1d5" },
        { tag: tags.blockComment, color: "#75b798", fontStyle: "italic" },
        { tag: tags.comment, color: "#75b798", fontStyle: "italic" },
        { tag: tags.constant(tags.variableName), color: "#6edff6" },
      ])),
      EditorView.theme({
        '&.cm-focused .cm-selectionBackground, ::selection' : {
          backgroundColor: "#4e4d48"
        }
      })
    ]
  };



  
export const LightReKarelHighlight: EditorTheme = {
    color: "#2e2e2e",
    backgroundColor: "var(--bs-light)",
    extensions: [
      
      syntaxHighlighting(HighlightStyle.define([
        { tag: tags.atom, color: "#ff9c07" },
        { tag: tags.keyword, color: "#c62e3d" },
        { tag: tags.controlKeyword, color: "#0d6efd " },
        { tag: tags.definitionKeyword, color: "#0d6efd " },
        { tag: tags.number, color: "#ff9c07" },
        { tag: tags.operator, color: "#77a1d5" },
        { tag: tags.blockComment, color: "#198754", fontStyle: "italic" },
        { tag: tags.comment, color: "#198754", fontStyle: "italic" },
        { tag: tags.constant(tags.variableName), color: "#24a7db" },
      ])),
      
    ]
  };
