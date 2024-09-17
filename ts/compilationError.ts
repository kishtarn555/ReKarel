

function jumpable(line:number, column:number | null) {
    let c = column;
    if (column == null) {
        c=0;
    }
    const onclick = `karel.MoveEditorCursorToLine(${line}, ${c})`
    return `<a class="text-decoration-underline" href="#" title="Haz clic para ir al error" onclick="${onclick}">línea ${line}</a>`;
}

const ERROR_TOKENS = {
    pascal: {
      BEGINPROG: '"iniciar-programa"',
      BEGINEXEC: '"inicia-ejecución"',
      ENDEXEC: '"termina-ejecución"',
      ENDPROG: '"finalizar-programa"',
      DEF: '"define-nueva-instrucción"',
      PROTO: '"define-prototipo-instrucción"',
      RET: '"sal-de-instrucción"',
      AS: '"como"',
      HALT: '"apágate"',
      LEFT: '"gira-izquierda"',
      FORWARD: '"avanza"',
      PICKBUZZER: '"coge-zumbador"',
      LEAVEBUZZER: '"deja-zumbador"',
      BEGIN: '"inicio"',
      END: '"fin"',
      THEN: '"entonces"',
      WHILE: '"mientras"',
      DO: '"hacer"',
      REPEAT: '"repetir"',
      TIMES: '"veces"',
      DEC: '"precede"',
      INC: '"sucede"',
      IFZ: '"si-es-cero"',
      IFNFWALL: '"frente-libre"',
      IFFWALL: '"frente-bloqueado"',
      IFNLWALL: '"izquierda-libre"',
      IFLWALL: '"izquierda-bloqueada"',
      IFNRWALL: '"derecha-libre"',
      IFRWALL: '"derecha-bloqueada"',
      IFWBUZZER: '"junto-a-zumbador"',
      IFNWBUZZER: '"no-junto-a-zumbador"',
      IFBBUZZER: '"algún-zumbador-en-la-mochila"',
      IFNBBUZZER: '"ningún-zumbador-en-la-mochila"',
      IFN: '"orientado-al-norte"',
      IFS: '"orientado-al-sur"',
      IFE: '"orientado-al-este"',
      IFW: '"orientado-al-oeste"',
      IFNN: '"no-orientado-al-norte"',
      IFNS: '"no-orientado-al-sur"',
      IFNE: '"no-orientado-al-este"',
      IFNW: '"no-orientado-al-oeste"',
      ELSE: '"si-no"',
      IF: '"si"',
      NOT: '"no"',
      OR: '"o"',
      AND: '"y"',
      '(': '"("',
      ')': '")"',
      ';': '";"',
      NUM: 'un número',
      VAR: 'un nombre',
      EOF: 'el final del programa',
    },
    java: {
      CLASS: '"class"',
      PROG: '"program"',
      DEF: '"define"',
      RET: '"return"',
      HALT: '"turnoff"',
      LEFT: '"turnleft"',
      FORWARD: '"move"',
      PICKBUZZER: '"pickbeeper"',
      LEAVEBUZZER: '"putbeeper"',
      WHILE: '"while"',
      REPEAT: '"iterate"',
      DEC: '"pred"',
      INC: '"succ"',
      IFZ: '"iszero"',
      IFNFWALL: '"frontIsClear"',
      IFFWALL: '"frontIsBlocked"',
      IFNLWALL: '"leftIsClear"',
      IFLWALL: '"leftIsBlocked"',
      IFNRWALL: '"rightIsClear"',
      IFRWALL: '"rightIsBlocked"',
      IFWBUZZER: '"nextToABeeper"',
      IFNWBUZZER: '"notNextToABeeper"',
      IFBBUZZER: '"anyBeepersInBeeperBag"',
      IFNBBUZZER: '"noBeepersInBeeperBag"',
      IFN: '"facingNorth"',
      IFS: '"facingSouth"',
      IFE: '"facingEast"',
      IFW: '"facingWest"',
      IFNN: '"notFacingNorth"',
      IFNS: '"notFacingSouth"',
      IFNE: '"notFacingEast"',
      IFNW: '"notFacingWest"',
      ELSE: '"else"',
      IF: '"if"',
      NOT: '"!"',
      OR: '"||"',
      AND: '"&&"',
      '(': '"("',
      ')': '")"',
      BEGIN: '"{"',
      END: '"}"',
      ';': '";"',
      NUM: 'un número',
      VAR: 'un nombre',
      EOF: 'el final del programa',
    },
  };


export function decodeError(e, lan : "java"|"pascal"|"ruby"|"none") : string {
    if (lan === "ruby" || lan === "none") {
        return "Error de compilación, no se puede reconocer el lenguaje";
    }
    let status = e.hash;
    console.log(JSON.stringify(e))
    console.log(e)
    if (status == null) {
        return "Error de compilación";
    }
    let message = `Error de compilación en  la ${jumpable(status.line+1,status.loc?.first_column )}\n<br>\n<div class="card"><div class="card-body">`
    if (status.expected) {        
        let expectations = status.expected.map((x=>ERROR_TOKENS[lan][x.replace(/^'+/,"").replace(/'+$/,"") ]))        
        message += `Se encontró "${status.text}" cuando se esperaba ${ expectations.join(", ")}`
    } else {
        let errorString = `${e}`;
        if (errorString.includes("Undefined function")) {
            message += `La función <b>${status.text}</b> no esta definida`;
        } else if (errorString.includes("Unrecognized text")) {
            message += `Se encontro un token ilegal`;
        } else if (errorString.includes("Function redefinition")) {
            message += `La función <b>${status.text}</b> ya fue definida previamente`;
        } else if (errorString.includes("Prototype redefinition")) {
            message += `El prototipo <b>${status.text}</b> ya fue definido previamente`;
        } else if (errorString.includes("Unknown variable")) {
            message += `El parámetro <b>${status.text}</b> no está definido`;
        } else if (errorString.includes("Function parameter mismatch")) {
            if (status.parameters=== 2) {
                message += `La función <b>${status.text}</b> no acepta parámetro `;
            } else {
                message += `La función <b>${status.text}</b> esperaba un parámetro `;
            }
        } else if (errorString.includes("Prototype parameter mismatch")) {
            message += `La función <b>${status.text}</b> tiene un número distinto de parámetros que su prototipo `;
        } else {
            message += "Error desconocido"
        }
    }
    message+="</div></div>"
    return message;
}