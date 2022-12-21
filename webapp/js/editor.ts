import {EditorView, basicSetup} from "codemirror"

let editor = new EditorView({
  extensions: [basicSetup],
  parent: document.querySelector("#splitter-left-top-pane")
})