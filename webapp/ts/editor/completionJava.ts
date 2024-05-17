import {syntaxTree} from "@codemirror/language"
import {CompletionContext} from "@codemirror/autocomplete"
import { SyntaxNode } from "@lezer/common";

const conditions = [
  "frontIsClear", "leftIsClear", "rightIsClear", 
  "frontIsBlocked", "leftIsBlocked", "rightIsBlocked",
  "nextToABeeper", "notNextToABeeper", 
  "facingNorth", "facingSouth", "facingEast", "facingWest",
  "notFacingNorth", "notFacingSouth", "notFacingEast", "notFacingWest",
].map(tag => ({label: tag, type: "keyword"}))


function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
              return "[Circular]";
          }
          seen.add(value);
      }
      return value;
  });
}

function searchFirst(node: SyntaxNode, depth:number):string {

  if (depth <=0) return "none";
  if (node.name ==="WhileHeader") return "Boolean";

  if (!node.parent)
    return null;
  return searchFirst(node.parent, depth-1);
}

export function completeKarelJava(context: CompletionContext) {
  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
  console.log(safeStringify(nodeBefore.type));
  console.log(safeStringify(nodeBefore.parent.type));
  let word = context.matchBefore(/\w*/)
  let textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
  console.log(textBefore);
  console.log(word);
  if (searchFirst(nodeBefore, 3) === "Boolean") {
    
    console.log("returning Boolean")
      return {
      from: word.from,
      options: conditions,
    }
  }
  return null
}