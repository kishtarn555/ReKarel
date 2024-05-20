
import { tags } from "@lezer/highlight"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { EditorTheme } from "./editorTheme"
import { EditorView } from "codemirror";


export const DarkCodeTheme: EditorTheme = {
    color: "#9CDCFE",
    backgroundColor: "#1F1F1F",
    gutterBackgroundColor: "#1F1F1F",
    gutterColor: "#6e7681",
    extensions: [
      
      syntaxHighlighting(HighlightStyle.define([
        { tag: tags.atom, color: "#DCDCAA" },
        { tag: tags.className, color: "#4EC9B0" },
        { tag: tags.keyword, color: "#C586C0" },
        { tag: tags.controlKeyword, color: "#C586C0" },
        { tag: tags.definitionKeyword, color: "#569CD6" },
        { tag: tags.number, color: "#b5cea8" },
        { tag: tags.operator, color: "#efefef" },
        { tag: tags.brace, color: "#FFD700" },
        { tag: tags.blockComment, color: "#6A9955", fontStyle: "italic" },
        { tag: tags.comment, color: "#6A9955", fontStyle: "italic" },
        { tag: tags.constant(tags.variableName), color: "#DCDCAA" },
      ])),
      EditorView.theme({
        '&.cm-focused .cm-selectionBackground, ::selection' : {
          backgroundColor: "#b3c6c7"
        }
      })
    ]
  };



  