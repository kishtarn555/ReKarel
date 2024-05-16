import { parser as javaparser } from "../../js/lezer_java";
import {LanguageSupport} from "@codemirror/language"


import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"
import {LRLanguage, continuedIndent} from "@codemirror/language"

let javaWithContext = javaparser.configure({
    props: [
        styleTags({
            Class: t.keyword,
            Define: t.keyword,
            ProgramClass: t.className,
            ProgramMain: t.function(t.variableName),
            Comment: t.comment,
            obr: t.bracket,
            cbr: t.bracket,
            Identifier: t.variableName,
            Number: t.integer,
            While: t.controlKeyword,
            If: t.controlKeyword,
            Else: t.controlKeyword,
            Iterate: t.controlKeyword,
            BoolFunc: t.atom,
            And: t.operator,
            Or: t.operator,
            Not: t.operator,

        }),
        indentNodeProp.add({
            Function: continuedIndent({}),
            Script: continuedIndent({}),
          }),           
        foldNodeProp.add({
            Block: foldInside
        })
    ]
}
)

const javaLanguage = LRLanguage.define({
    parser: javaWithContext,
    languageData: {
      commentTokens: {line: "//"}
    }
  })


  import {completeFromList} from "@codemirror/autocomplete"

  const javaCompletion = javaLanguage.data.of({
    autocomplete: completeFromList([
        {label: "class", type: "keyword"},
        {label: "program", type: "keyword"},
        {label: "define", type: "keyword"},
        {label: "void", type: "keyword"},
        {label: "return", type: "keyword"},
        {label: "if", type: "keyword"},
        {label: "else", type: "keyword"},
        {label: "iterate", type: "keyword"},
        {label: "while", type: "keyword"},
        {label: "succ", type: "function"},
        {label: "pred", type: "function"},
        {label: "move", type: "function"},
        {label: "turnleft", type: "function"},
        {label: "turnoff", type: "function"},
        {label: "putbeeper", type: "function"},
    ])
  })

  function kjava() {
    return new LanguageSupport(javaLanguage , [javaCompletion])
  }
  export { javaLanguage, javaCompletion, kjava}
