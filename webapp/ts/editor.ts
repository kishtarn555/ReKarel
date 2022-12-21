import {EditorView, basicSetup} from "codemirror"

function createEditors() {
  return new EditorView({
    extensions: [basicSetup],
    parent: document.querySelector("#splitter-left-top-pane")
  })
}


export {createEditors}