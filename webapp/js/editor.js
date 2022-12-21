"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codemirror_1 = require("codemirror");
let editor = new codemirror_1.EditorView({
    extensions: [codemirror_1.basicSetup],
    parent: document.querySelector("#splitter-left-top-pane")
});
//# sourceMappingURL=editor.js.map