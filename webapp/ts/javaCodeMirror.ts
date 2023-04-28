import { parser as javaparser } from "../js/lezer_java";
import {LanguageSupport} from "@codemirror/language"


import {foldNodeProp, foldInside, indentNodeProp} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"
import {LRLanguage} from "@codemirror/language"

let javaWithContext = javaparser.configure({
    props: [
        styleTags({
            Class: t.keyword,
            Program: t.className,
            Comment: t.comment,
            obr: t.bracket,
            cbr: t.bracket,
            Identifier: t.variableName,
            Number: t.integer

        }),
        indentNodeProp.add({
            Block: context => context.column(context.node.parent.from) + context.unit,
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
      {label: "define", type: "keyword"},
      {label: "move", type: "function"},
      {label: "turnleft", type: "function"},
      {label: "putbeeper", type: "function"},
    ])
  })

  function kjava() {
    return new LanguageSupport(javaLanguage , [javaCompletion])
  }
  export { javaLanguage, javaCompletion, kjava}
