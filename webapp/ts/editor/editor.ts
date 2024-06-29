import {EditorState} from "@codemirror/state"
import {defaultKeymap, historyKeymap, history} from "@codemirror/commands"
import {drawSelection, keymap, lineNumbers, highlightActiveLine} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {undo, redo} from "@codemirror/commands"
import {EditorView} from "@codemirror/view"
import {Transaction, Annotation, Compartment, Extension} from "@codemirror/state"
import { kjava } from "./javaCodeMirror"
import { kpascal } from "./pascalCodeMirror"

import {defaultHighlightStyle, syntaxHighlighting, foldGutter, bracketMatching, indentUnit} from "@codemirror/language"
import { closeBrackets } from "@codemirror/autocomplete"
import { classicHighlight } from "./themes/classicHighlight"
import { highlightKarelActiveLine } from "./editor.highlightLine"
import { breakpointGutter } from "./editor.breakpoint"

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
      history(),
      highlightKarelActiveLine(),
      breakpointGutter,
      drawSelection(),
      lineNumbers(),
      highlightActiveLine(),
      foldGutter(),
      bracketMatching(),
      // autocompletion(),
      closeBrackets(),
      indentUnit.of("\t"),
      readOnly.of(EditorState.readOnly.of(false)),      
      tabSize.of(EditorState.tabSize.of(4)),
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...historyKeymap,
      ])
    ]
  })
  let otherState = EditorState.create({
    doc: startState.doc,
    extensions: [
      drawSelection(),
      lineNumbers(),
      highlightActiveLine(),
      keymap.of([
        indentWithTab,
        ...defaultKeymap,
        {key: "Mod-z", run: () => undo(mainView)},
        {key: "Mod-y", mac: "Mod-Shift-z", run: () => redo(mainView)}
      ])
    ]
  })
  let syncAnnotation = Annotation.define<boolean>()
  
  function syncDispatch(tr: Transaction, view: EditorView, other: EditorView) {
    view.update([tr])
    if (!tr.changes.empty && !tr.annotation(syncAnnotation)) {
      let annotations: Annotation<any>[] = [syncAnnotation.of(true)]
      let userEvent = tr.annotation(Transaction.userEvent)
      if (userEvent) annotations.push(Transaction.userEvent.of(userEvent))
        other.dispatch({changes: tr.changes, annotations})
    }
  }
  let mainView = new EditorView({
    state: startState,
    parent: document.querySelector("#splitter-left-top-pane"),
    dispatch: tr => syncDispatch(tr, mainView, otherView)
  })
  
  let otherView = new EditorView({
    state: otherState,
    parent: document.querySelector("#phoneEditor"),
    dispatch: tr => syncDispatch(tr, otherView, mainView)
  })
  return [mainView, otherView]
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