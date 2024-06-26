import {EditorState} from "@codemirror/state"
import {defaultKeymap, historyKeymap, history} from "@codemirror/commands"
import {drawSelection, keymap, lineNumbers, highlightActiveLine, GutterMarker,gutter, Decoration, DecorationSet} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {undo, redo} from "@codemirror/commands"
import {EditorView} from "@codemirror/view"
import {Transaction, Annotation, Compartment, StateField, StateEffect, RangeSet, Extension} from "@codemirror/state"
import { kjava } from "./javaCodeMirror"
import { kpascal } from "./pascalCodeMirror"

import {defaultHighlightStyle, syntaxHighlighting, foldGutter, bracketMatching, indentUnit} from "@codemirror/language"
import { closeBrackets, autocompletion } from "@codemirror/autocomplete"
import { darkClassicHighlight } from "./themes/darkClassicHighlight"
import { classicHighlight } from "./themes/classicHighlight"
import {HighlightStyle} from "@codemirror/language"

let language = new Compartment, tabSize = new Compartment
let theme = new Compartment
let readOnly = new Compartment

const breakpointEffect = StateEffect.define<{pos:number, on:boolean}>({
  map:(val, mapping)=> ({pos:mapping.mapPos(val.pos), on:val.on})
});
const breakpointMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("🔴") }
}

export const breakpointState = StateField.define<RangeSet<GutterMarker>>({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on)
          set = set.update({add: [breakpointMarker.range(e.value.pos)]})
        else
          set = set.update({filter: from => from != e.value.pos})
      }
    }
    return set
  }
});

function toggleBreakpoint(view: EditorView, pos: number) {
  let breakpoints = view.state.field(breakpointState)
  let hasBreakpoint = false
  breakpoints.between(pos, pos, () => {hasBreakpoint = true})
  view.dispatch({
    effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  })
}
const breakpointGutter = [
  breakpointState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line.from)
        return true
      }
    }
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "2px",
      cursor: "default",
      fontSize: "var(--editor-font-size)"
    }
  })
]



const parseErrorState = StateEffect.define<{from: number, to: number}>({
  map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
})

const underlineMark = Decoration.mark({class: "cm-underline"})

const parseErrorField =  StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(underlines, tr) {
    underlines = underlines.map(tr.changes)
    for (let e of tr.effects) if (e.is(parseErrorState)) {
      if (e.value.from === -1) {
        underlines = RangeSet.empty
      }else {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)]
        })
      }
    }
    return underlines
  },
  provide: f => EditorView.decorations.from(f)
})
const underlineTheme = EditorView.baseTheme({
  ".cm-underline": { textDecoration: "underline 3px red" }
})

export function underlineError(view: EditorView, line:number, from:number, to:number) {
  console.log(line, from, to);
  let real_from = view.state.doc.line(line).from + from;
  let real_to = view.state.doc.line(line).from + to;
  let effects:StateEffect<unknown>[] =  [parseErrorState.of({from:real_from, to:real_to})]


  if (!view.state.field(parseErrorField, false))
    effects.push(StateEffect.appendConfig.of([parseErrorField,
                                              underlineTheme]))
  view.dispatch({effects})
  return true
}


export function clearUnderlineError(view: EditorView) {
  let effects:StateEffect<unknown>[] =  [parseErrorState.of({from:-1, to:-1})]


  if (!view.state.field(parseErrorField, false))
    effects.push(StateEffect.appendConfig.of([parseErrorField,
                                              underlineTheme]))
  view.dispatch({effects})
  return true
}


function createEditors() : Array<EditorView> {
  let startState = EditorState.create({
    doc: "iniciar-programa\n\tinicia-ejecucion\n\t\t{ TODO poner codigo aqui }\n\t\tapagate;\n\ttermina-ejecucion\nfinalizar-programa",
    extensions: [
      language.of(kpascal()),
      theme.of(classicHighlight.extensions),
      syntaxHighlighting(defaultHighlightStyle, {fallback:true}),
      history(),
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

export {createEditors, freezeEditors, unfreezeEditors, setLanguage, SetText, SetEditorTheme}