import {tags} from "@lezer/highlight"
import {HighlightStyle} from "@codemirror/language"


export const classicHighlight = HighlightStyle.define([
    {tag: tags.atom, color: "rgb(6, 150, 14)"},
    {tag: tags.keyword, color: "rgb(147, 15, 128)"},
    {tag: tags.number, color: "rgb(147, 15, 128)"},
    {tag: tags.operator, color: "rgb(104, 118, 135)"},
    {tag: tags.operator, color: "rgb(104, 118, 135)"},
    {tag: tags.blockComment, color: "rgb(104, 118, 135)", fontStyle:"italic"},
    {tag: tags.comment, color: "rgb(104, 118, 135)", fontStyle:"italic"},
  ])