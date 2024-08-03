import {EditorState} from "@codemirror/state"
import {defaultKeymap, historyKeymap, history} from "@codemirror/commands"
import {drawSelection, keymap, lineNumbers, highlightActiveLine, rectangularSelection, crosshairCursor} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {undo, redo} from "@codemirror/commands"
import {EditorView} from "@codemirror/view"
import {Transaction, Annotation, Compartment, Extension} from "@codemirror/state"
import { kjava } from "./javaCodeMirror"
import { kpascal } from "./pascalCodeMirror"

import {defaultHighlightStyle, syntaxHighlighting, foldGutter, bracketMatching, indentUnit, indentOnInput} from "@codemirror/language"
import { closeBrackets } from "@codemirror/autocomplete"
import { classicHighlight } from "./themes/classicHighlight"
import { highlightKarelActiveLine } from "./editor.highlightLine"
import { breakpointGutter } from "./editor.breakpoint"
import {searchKeymap, highlightSelectionMatches} from "@codemirror/search"


let language = new Compartment, tabSize = new Compartment
let theme = new Compartment
let readOnly = new Compartment




function createEditors() : Array<EditorView> {
  let startState = EditorState.create({
    doc: "iniciar-programa\n\tinicia-ejecucion\n\t\t{ TODO poner codigo aqui }\n\t\tapagate;\n\ttermina-ejecucion\nfinalizar-programa",
    extensions: [
      language.of(kpascal()),
      theme.of(classicHighlight.extensions),
      syntaxHighlighting(defaultHighlightStyle, {fallback:true}),
      breakpointGutter,
      highlightKarelActiveLine(),
      
      history(),
      drawSelection(),
      lineNumbers(),
      highlightActiveLine(),
      foldGutter(),
      bracketMatching(),
      // autocompletion(),
      rectangularSelection(),
      crosshairCursor(),
      closeBrackets(),
      indentOnInput(),
      highlightSelectionMatches(),
      indentUnit.of("\t"),
      readOnly.of(EditorState.readOnly.of(false)),      
      tabSize.of(EditorState.tabSize.of(4)),
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
        ...searchKeymap,
      ])
    ]
  })
  let mainView = new EditorView({
    state: startState,
    parent: document.querySelector("#splitter-left-top-pane"),
  })
  
  return [mainView]
}


function freezeEditors(editor : EditorView) {
  editor.dispatch({
    effects: readOnly.reconfigure(EditorState.readOnly.of(true))
  });
}

function unfreezeEditors(editor : EditorView) {
  editor.dispatch({
    effects: readOnly.reconfigure(EditorState.readOnly.of(false))
  });
}

function setLanguage(editor:EditorView, lan:"java"|"pascal") {
  if (lan === "java") {
    editor.dispatch({
      effects: language.reconfigure(kjava())
    })
  } else {
    
    editor.dispatch({
      effects: language.reconfigure(kpascal())
    })
  }
}


function SetText(editor: EditorView, message:string) {
  let transaction = editor.state.update({
      changes: {
          from: 0,
          to: editor.state.doc.length,
          insert:message
      }
  })
  editor.dispatch(transaction);
}


function SetEditorTheme (extension:Extension, editor:EditorView) {
  try {
  editor.dispatch({
    effects:theme.reconfigure(extension)
  });
  } catch {
    console.log("ERROR loading extension");
  }
  
}


function SelectLine(editor:EditorView, line:number, column:number=0, shouldFocus:boolean=true) {
  const docLine = editor.state.doc.line(line);
  const jumpTo = docLine.from +column;
  editor.dispatch({
    selection: {
      anchor: jumpTo, 
      head: jumpTo
      
    },
    scrollIntoView:true
  });
  if (shouldFocus) {
    editor.focus();
  }



}

export {createEditors, freezeEditors, unfreezeEditors, setLanguage, SetText, SetEditorTheme, SelectLine}