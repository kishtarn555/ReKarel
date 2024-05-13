import {tags} from "@lezer/highlight"
import {HighlightStyle} from "@codemirror/language"


export const classicHighlight = HighlightStyle.define([
    {tag: tags.keyword, color: "#fa0000"},
    {tag: tags.atom, color: "rgb(6, 150, 14)"},
    {tag: tags.keyword, color: "rgb(147, 15, 128)"},
  ])