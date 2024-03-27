import { parser as pascalparser } from "../js/lezer_pascal";
import {LanguageSupport} from "@codemirror/language"


import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"
import {LRLanguage, continuedIndent} from "@codemirror/language"

let pascalWithContext = pascalparser.configure({
    props: [
        styleTags({
            StartProgram: t.keyword,
            EndProgram: t.keyword,
            StartExecution: t.keyword,
            EndExecution: t.keyword,
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
            Then: t.controlKeyword,
            Do: t.controlKeyword,
            Times: t.controlKeyword,

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

const pascalLanguage = LRLanguage.define({
    parser: pascalWithContext,
    languageData: {
      commentTokens: {line: "//"}
    }
  })


  import {completeFromList} from "@codemirror/autocomplete"

  const pascalCompletion = pascalLanguage.data.of({
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

  function kpascal() {
    return new LanguageSupport(pascalLanguage , [pascalCompletion])
  }
  export { pascalLanguage, pascalCompletion, kpascal}
