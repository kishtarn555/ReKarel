import { parser as javaparser } from "../../js/lezer_java";
import {LanguageSupport} from "@codemirror/language"


import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"
import {LRLanguage, continuedIndent} from "@codemirror/language"

let javaWithContext = javaparser.configure({
    props: [
        styleTags({
            Class: t.keyword,
            Define: t.definitionKeyword,
            ProgramClass: t.className,
            ProgramMain: t.definitionKeyword,
            Comment: t.comment,
            BlockComment: t.blockComment,
            obr: t.bracket,
            cbr: t.bracket,
            Identifier: t.variableName,
            Number: t.integer,
            While: t.controlKeyword,
            If: t.controlKeyword,
            Else: t.controlKeyword,
            Iterate: t.controlKeyword,
            BoolFunc: t.atom,
            Ifzero: t.atom,
            And: t.operator,
            Or: t.operator,
            Not: t.operator,
            BuiltIn: t.constant(t.variableName),
            Start: t.brace,
            End: t.brace,

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
import { BuiltIn } from "../../js/lezer_java.terms";
import { completeKarelJava } from "./completionJava";

  const javaCompletion = javaLanguage.data.of({
    autocomplete: completeKarelJava
  })

  function kjava() {
    return new LanguageSupport(javaLanguage , [javaCompletion])
  }
  export { javaLanguage, javaCompletion, kjava}
