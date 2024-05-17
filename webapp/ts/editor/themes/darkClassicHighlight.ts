import { tags } from "@lezer/highlight"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { EditorTheme } from "./editorTheme"
import { EditorView } from "codemirror";


export const darkClassicHighlight: EditorTheme = {
  color: "var(--bs-body-color)",
  backgroundColor: "rgba(var(--bs-body-bg-rgb), var(--bs-bg-opacity))",
  extensions: [
    
    syntaxHighlighting(HighlightStyle.define([
      { tag: tags.atom, color: "rgb(6, 150, 14)" },
      { tag: tags.keyword, color: "#C586C0" },
      { tag: tags.number, color: "#569CD6" },
      { tag: tags.operator, color: "rgb(104, 118, 135)" },
      { tag: tags.blockComment, color: "#6A9949", fontStyle: "italic" },
      { tag: tags.comment, color: "#6A9949", fontStyle: "italic" },
      { tag: tags.constant(tags.variableName), color: "#9CDCFE" },
    ])),
    EditorView.theme({
      '&.cm-focused .cm-selectionBackground, ::selection' : {
        backgroundColor: "#4e4d48"
      }
    })
  ]
};
