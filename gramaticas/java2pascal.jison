/* Karel-java */

%lex
%%

\s+                             {/* ignore */}
\/\/[^\n]*			{/* ignore */}
\/\*(?:[^*]|\*(?!\/))*\*\/	{/* ignore */}
"class"				{ return 'CLASS'; }
"program"		        { return 'PROG'; }
"define"			{ return 'DEF'; }
"void"				{ return 'DEF'; }
"return"      { return 'RET'; }
"turnoff"                       { return 'HALT'; }
"turnleft"	                { return 'LEFT'; }
"move" 		                { return 'FORWARD'; }
"pickbeeper"	                { return 'PICKBUZZER'; }
"putbeeper"                     { return 'LEAVEBUZZER'; }
"while"                         { return 'WHILE'; }
"iterate"                       { return 'REPEAT'; }
"pred" 		                { return 'DEC'; }
"succ"          	        { return 'INC'; }
"iszero" 	                { return 'IFZ'; }
"frontIsClear"                  { return 'IFNFWALL'; }
"frontIsBlocked"                { return 'IFFWALL'; }
"leftIsClear"	                { return 'IFNLWALL'; }
"leftIsBlocked"                 { return 'IFLWALL'; }
"rightIsClear"                  { return 'IFNRWALL'; }
"rightIsBlocked"                { return 'IFRWALL'; }
"nextToABeeper"                 { return 'IFWBUZZER'; }
"notNextToABeeper"   	        { return 'IFNWBUZZER'; }
"anyBeepersInBeeperBag" 	{ return 'IFBBUZZER'; }
"noBeepersInBeeperBag"		{ return 'IFNBBUZZER'; }
"facingNorth"		        { return 'IFN'; }
"facingSouth"	                { return 'IFS'; }
"facingEast"		        { return 'IFE'; }
"facingWest"	                { return 'IFW'; }
"notFacingNorth"	        { return 'IFNN'; }
"notFacingSouth"	        { return 'IFNS'; }
"notFacingEast"		        { return 'IFNE'; }
"notFacingWest"		        { return 'IFNW'; }
"else"                          { return 'ELSE'; }
"if"                            { return 'IF'; }
"!"                             { return 'NOT'; }
"||"                            { return 'OR'; }
"&&"                            { return 'AND'; }
"&"				{ return 'AND'; }
"("                             { return '('; }
")"                             { return ')'; }
"{"                             { return 'BEGIN'; }
"}"                             { return 'END'; }
";"                             { return ';'; }
[0-9]+                          { return 'NUM'; }
[a-zA-Z][a-zA-Z0-9_]*           { return 'VAR'; }
<<EOF>>                         { return 'EOF'; }
/lex

%nonassoc XIF
%nonassoc ELSE

%{
function validate(function_list, program, yy) {
	let functions = {};
	let prototypes = {};

    let code = "";
    let indent = 0;

    function addline(line) {
        if (code!=="") code+="\n"
        for (let ii =0; ii < indent; ii++) code+="\t";
        code+=line;
    }
    function processLines(array) {
        for (let i = 0; i < array.length; i++) {
            let semicolon = true;
            if (i+1 < array.length) {
                if (array[i+1][0] ==="sino") semicolon=false;
            }

            if (array[i].length > 1) {
                semicolon = false;
            }
            if (array[i][0] === "inicio") {
                semicolon=false;
                addline("inicio");
                indent++;
            } else if (array[i][0]==="fin") {
                indent--;
                addline("fin");
            } else {
                if (i !== 0 && array[i-1].length > 1) indent++;
                addline(array[i][0])
                
                if (i !== 0 && array[i-1].length > 1) indent--;
            }
            if (semicolon) {
                code+=";";
            }
        }
    }

    addline("iniciar-programa")
    indent++;
    const builtin = ["turnoff", "move", "return", "putbeeper", "pickbeeper", "turnleft"];

	for (let i = 0; i < function_list.length; i++) {
        functions[function_list[i][0]]="true";
        let inner = function_list[i][1];
        for (let j = 0; j < inner.length; j++) {
            if (inner[j].length > 1) continue;
             const tokenMatch = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(inner[j][0]);
            
            if (tokenMatch) {
                const token = tokenMatch[0];
                
                if (builtin.includes(token)) {
                    continue;
                }

                if (functions[token]) continue;
                prototypes[token] = true;

            }

        }
        
	}
    for (let i = 0; i < function_list.length; i++) {
        if (prototypes[function_list[i][0]]) {
            addline(`define-prototipo-instruccion ${function_list[i][0]}`);
            if (function_list[i].length === 3) {
                code+=`(${function_list[i][2]})`;//This function accepts parameters

            }
            code+=";"
        }        
	}
    code+="\n";
    
    for (let i = 0; i < function_list.length; i++) {
        addline(`define-nueva-instruccion ${function_list[i][0]}`);
        if (function_list[i].length === 3) {
            code+=`(${function_list[i][2]})`;//This function accepts parameters
        }
        code+=" como";
        processLines(function_list[i][1]);
        code+="\n";              
	}

    

    
    
    addline("inicia-ejecucion");
    indent++;
    processLines(program);
    indent--;
    addline("termina-ejecucion");
    indent--;
    addline("finalizar-programa")
    
	return code;
}
%}

%%

program
  : CLASS PROG BEGIN def_list PROG '(' ')' block END EOF
    { return validate($def_list, $block.slice(1, -1), yy); }
  | CLASS PROG BEGIN PROG '(' ')' block END EOF
    { return validate([], $block.slice(1, -1), yy); }
  ;

block
  : BEGIN expr_list END
    { $$ = [["inicio"]].concat( $expr_list).concat([["fin"]]); }
  ;

def_list
  : def_list def
    { $$ = $def_list.concat($def); }
  | def
    { $$ = $def; }
  ;

def
  : DEF var '(' ')' block
    { 
       $$ = [[$var, $block]]
       }
  | DEF var '(' var ')' block
    { $$ = [[$2, $block, $4]] }
  ;


expr_list
  : expr_list expr
    { $$ = $expr_list.concat($expr); }
  | expr
    { $$ = $expr; }
  ;

expr
  : FORWARD '(' ')' ';'
    { $$ = [['avanza']]; }
  | LEFT '(' ')' ';'
    { $$ = [['gira-izquierda']]; }
  | PICKBUZZER '(' ')' ';'
    { $$ = [['coge-zumbador']]; }
  | LEAVEBUZZER '(' ')' ';'
    { $$ = [['deja-zumbador']]; }
  | HALT '(' ')' ';'
    { $$ = [['apagate']]; }
  | RET '(' ')' ';'
    { $$ = [['sal-de-instruccion']]; }
  | call ';'
    { $$ = $call; }
  | cond
    { $$ = $cond; }
  | loop
    { $$ = $loop; }
  | repeat
    { $$ = $repeat; }
  | block
    { $$ = $block; }
  | ';'
    { $$ = []; }
  ;

call
  : var '(' ')'
    
   { $$=[[ $var ]]}
  | var '(' integer ')'
    { 
      $$ = [[ `${$var}(${$integer})` ]]
    }
  ;

cond
  : IF '(' term ')' expr %prec XIF
    { $$ = [[`si ${$term} entonces`, "n"]].concat($expr) }
  | IF '(' term ')' expr ELSE expr
    { $$ = [[`si ${$term} entonces`, "n"]].concat($expr).concat([['sino', "n"]]).concat($7); }
  ;

loop
  : WHILE '(' term ')' expr
    { $$ = [[`mientras ${$term} hacer`, "n"]].concat($expr);}
  ;

repeat
  : REPEAT '(' integer ')' expr
    { $$ = [[`repetir ${$integer} veces`,"n"]].concat($expr) }
  ;

term
  : term OR and_term
    { $$ = $term + " o " + $and_term; }
  | and_term
    { $$ = $and_term; }
  ;

and_term
  : and_term AND not_term
    { $$ = $and_term + " y "+$not_term ; }
  | not_term
    { $$ = $not_term; }
  ;

not_term
  : NOT clause
    { $$ = "no "+$clause; }
  | clause
    { $$ = $clause; }
  ;

clause
  : IFZ '(' integer ')'
    { $$ = "si-es-cero("+$integer+")"; }
  | bool_fun
    { $$ = $bool_fun; }
  | bool_fun '(' ')'
    { $$ = $bool_fun; }
  | '(' term ')'
    { $$ = "("+$term+")"; }
  ;

bool_fun
  : IFNFWALL
    { $$ = "frente-libre"; }
  | IFFWALL
    { $$ = "frente-bloqueado"; }
  | IFNLWALL
    { $$ = "izquierda-libre"; }
  | IFLWALL
    { $$ = "izquierda-bloqueada"; }
  | IFNRWALL
    { $$ = "derecha-libre"; }
  | IFRWALL
    { $$ = "derecha-bloqueada"; }
  | IFWBUZZER
    { $$ = "junto-a-zumbador"; }
  | IFNWBUZZER
    { $$ = "no-junto-a-zumbador"; }
  | IFBBUZZER
    { $$ = "algun-zumbador-en-la-mochila"; }
  | IFNBBUZZER
    { $$ = "ningun-zumbador-en-la-mochila"; }
  | IFW
    { $$ = "orientado-al-oeste"; }
  | IFN
    { $$ = "orientado-al-norte"; }
  | IFE
    { $$ = "orientado-al-este"; }
  | IFS
    { $$ = "orientado-al-sur"; }
  | IFNW
    { $$ = "no-orientado-al-oeste"; }
  | IFNN
    { $$ = "no-orientado-al-norte"; }
  | IFNE
    { $$ = "no-orientado-al-este"; }
  | IFNS
    { $$ = "no-orientado-al-sur"; }
  ;

integer
  : var
    { $$ = yytext; }
  | NUM
    { $$ = yytext; }
  | INC '(' integer ')'
    { $$ = `sucede(${$integer})`; }
  | DEC	 '(' integer ')'
    { $$ = `precede(${$integer})`; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

