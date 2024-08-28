import {EditorView, Decoration, DecorationSet, ViewPlugin,  ViewUpdate} from "@codemirror/view"
import {Transaction, Annotation, Compartment, StateField, StateEffect, RangeSet, Extension, Facet, RangeSetBuilder } from "@codemirror/state"

let highlightedLine = new Compartment

const karelLineTheme = EditorView.baseTheme({
    ".cm-karelLine.cm-activeLine": {backgroundColor: "rgba(255, 255, 0, 0.5)"}, //TODO: Edit this based on the theme
    ".cm-karelLine": {backgroundColor: "#22872a44"}, //TODO: Edit this based on the theme
  
  })
  
  const karelLineFacet = Facet.define<number, number>({
    combine: values => values.length ? Math.min(...values) : -1
  })
  
  export function highlightKarelActiveLine(): Extension {
    return [
      karelLineTheme,
      highlightedLine.of(karelLineFacet.of(-1)),
      lineHighlighting
    ]
  }
  
  const lineHighlight = Decoration.line({
    attributes: {class: "cm-karelLine"}
  })
  
  function lineHighlightDeco(view: EditorView) {
    let pos = view.state.facet(karelLineFacet)
    let builder = new RangeSetBuilder<Decoration>()
    if (pos!==-1) {
        let line = view.state.doc.line(pos)
        builder.add(line.from, line.from, lineHighlight)
      }
    return builder.finish()
  }
  
  const lineHighlighting = ViewPlugin.fromClass(class {
    decorations: DecorationSet
  
    constructor(view: EditorView) {
      this.decorations = lineHighlightDeco(view)
    }
  
    update(update: ViewUpdate) {
      if (update.startState.facet(karelLineFacet) != update.state.facet(karelLineFacet))
        this.decorations = lineHighlightDeco(update.view)
    }
  }, {
    decorations: v => v.decorations
  })
  
  
  export function HighlightKarelLine(editor:EditorView, line:number) {
    editor.dispatch({
      effects: highlightedLine.reconfigure(karelLineFacet.of(line))
    })
  }

