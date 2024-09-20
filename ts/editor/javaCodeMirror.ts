import { parser as javaparser } from "../../webapp/js/lezer_java";
import {LanguageSupport} from "@codemirror/language"


import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"
import {LRLanguage, delimitedIndent, continuedIndent} from "@codemirror/language"

let javaWithContext = javaparser.configure({
    props: [
        styleTags({
            Class: t.keyword,
            DefineType: t.definitionKeyword,
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
            Succ: t.operator,
            Pred: t.operator,
            Continue: t.controlKeyword,
            Break: t.controlKeyword,
            Return: t.controlKeyword,

        }),
        indentNodeProp.add({
          Script: (_)=>0,
          Block: delimitedIndent({closing: "}"}),
          ScriptBlock: delimitedIndent({closing: "}"}),
          WhileStatement:continuedIndent ({except: /^\s*\{/ }),
          IterateStatement:continuedIndent ({except: /^\s*\{/ }),
          IfStatement:continuedIndent ({except: /^\s*(\{|else\b)/ }),

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
      commentTokens: {
        line: "//", block: {
        open:"/*", close:"*/"}
      },
      indentOnInput: /^\s*(\{|\})\b$/

    }
  })


import { completeKarelJava } from "./completionJava";
import { Continue } from "../../webapp/js/lezer_java.terms";

  const javaCompletion = javaLanguage.data.of({
    autocomplete: completeKarelJava
  })

  function kjava() {
    return new LanguageSupport(javaLanguage , [javaCompletion])
  }
  export { javaLanguage, javaCompletion, kjava}
