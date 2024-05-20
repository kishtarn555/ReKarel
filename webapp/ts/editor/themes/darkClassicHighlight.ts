import { tags } from "@lezer/highlight"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { EditorTheme } from "./editorTheme"
import { EditorView } from "codemirror";


export const darkClassicHighlight: EditorTheme = {
  color: "var(--bs-body-color)",
  backgroundColor: "rgba(var(--bs-body-bg-rgb), var(--bs-bg-opacity))",
  gutterBackgroundColor: "var(--bs-secondary-bg)",
  gutterColor: "var(--bs-emphasis-color)",
  extensions: [
    
    syntaxHighlighting(HighlightStyle.define([
      { tag: tags.atom, color: "#93bf74" },
      { tag: tags.keyword, color: "#C586C0" },
      { tag: tags.brace, color: "#94a4cb" },
      { tag: tags.number, color: "#569CD6" },
      { tag: tags.operator, color: "#77a1d5" },
      { tag: tags.blockComment, color: "#a0b6b6", fontStyle: "italic" },
      { tag: tags.comment, color: "#a0b6b6", fontStyle: "italic" },
      { tag: tags.constant(tags.variableName), color: "#9CDCFE" },
    ])),
    EditorView.theme({
      '&.cm-focused .cm-selectionBackground, ::selection' : {
        backgroundColor: "#4e4d48"
      }
    })
  ]
};
