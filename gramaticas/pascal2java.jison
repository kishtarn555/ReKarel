/* Karel-pascal */

%lex
%options case-insensitive
%options flex
%%

\s+                                         {/* ignore */}
\{[^}]*\}                                   {/* ignore */}
\(\*(?:[^*]|\*(?!\)))*\*\)                  {/* ignore */}
"iniciar-programa"                          { return 'BEGINPROG'; }
"inicia-ejecucion"                          { return 'BEGINEXEC'; }
"inicia-ejecución"                          { return 'BEGINEXEC'; }
"termina-ejecucion"                         { return 'ENDEXEC'; }
"termina-ejecución"                         { return 'ENDEXEC'; }
"finalizar-programa"                        { return 'ENDPROG'; }
"define-nueva-instruccion"                  { return 'DEF'; }
"define-nueva-instrucción"                  { return 'DEF'; }
"define-prototipo-instruccion"              { return 'PROTO'; }
"define-prototipo-instrucción"              { return 'PROTO'; }
"sal-de-instruccion"                        { return 'RET'; }
"sal-de-instrucción"                        { return 'RET'; }
"como"                                      { return 'AS'; }
"apagate"                                   { return 'HALT'; }
"apágate"                                   { return 'HALT'; }
"gira-izquierda"                            { return 'LEFT'; }
"avanza"                                    { return 'FORWARD'; }
"coge-zumbador"                             { return 'PICKBUZZER'; }
"deja-zumbador"                             { return 'LEAVEBUZZER'; }
"inicio"                                    { return 'BEGIN'; }
"fin"                                       { return 'END'; }
"entonces"                                  { return 'THEN'; }
"mientras"                                  { return 'WHILE'; }
"hacer"                                     { return 'DO'; }
"repetir"                                   { return 'REPEAT'; }
"veces"                                     { return 'TIMES'; }
"precede"                                   { return 'DEC'; }
"sucede"                                    { return 'INC'; }
"si-es-cero"                                { return 'IFZ'; }
"frente-libre"                              { return 'IFNFWALL'; }
"frente-bloqueado"                          { return 'IFFWALL'; }
"izquierda-libre"                           { return 'IFNLWALL'; }
"izquierda-bloqueada"                       { return 'IFLWALL'; }
"derecha-libre"                             { return 'IFNRWALL'; }
"derecha-bloqueada"                         { return 'IFRWALL'; }
"junto-a-zumbador"                          { return 'IFWBUZZER'; }
"no-junto-a-zumbador"                       { return 'IFNWBUZZER'; }
"algun-zumbador-en-la-mochila"              { return 'IFBBUZZER'; }
"algún-zumbador-en-la-mochila"              { return 'IFBBUZZER'; }
"ningun-zumbador-en-la-mochila"             { return 'IFNBBUZZER'; }
"ningún-zumbador-en-la-mochila"             { return 'IFNBBUZZER'; }
"orientado-al-norte"                        { return 'IFN'; }
"orientado-al-sur"                          { return 'IFS'; }
"orientado-al-este"                         { return 'IFE'; }
"orientado-al-oeste"                        { return 'IFW'; }
"no-orientado-al-norte"                     { return 'IFNN'; }
"no-orientado-al-sur"                       { return 'IFNS'; }
"no-orientado-al-este"                      { return 'IFNE'; }
"no-orientado-al-oeste"                     { return 'IFNW'; }
"sino"                                      { return 'ELSE'; }
"si-no"                                     { return 'ELSE'; }
"si"                                        { return 'IF'; }
"no"                                        { return 'NOT'; }
"o"                                         { return 'OR'; }
"u"                                         { return 'OR'; }
"y"                                         { return 'AND'; }
"e"                                         { return 'AND'; }
"("                                         { return '('; }
")"                                         { return ')'; }
";"                                         { return ';'; }
[0-9]+                                      { return 'NUM'; }
[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_-]*   { return 'VAR'; }
<<EOF>>                                     { return 'EOF'; }
/lex

%nonassoc XIF
%nonassoc ELSE

%{
function validate(function_list, program, yy) {

  let code = "";
  let indent = 0;

  function addline(line, addLB = true) {
      if (addLB) {
        if (code!=="") code+="\n"        
        for (let ii =0; ii < indent; ii++) code+="\t";
      } else {
        code+=" ";
      }
      code+=line;
  }
  function processLines(array) {
      for (let i = 0; i < array.length; i++) {
          if (array[i][0]==="BEGIN") {
            addline("{", false);
            indent++;
          } else if (array[i][0]==="END") {
            indent--;
            addline("}");            
          } else {
            if (i !== 0 && array[i-1].length > 1) {
              indent++;
            }
            addline(array[i][0]);
            
            if (i !== 0 && array[i-1].length > 1) {
              indent--;
            }
          }
      }
  }
  addline("class program {");
  indent++;
    
    for (let i = 0; i < function_list.length; i++) {
        addline(`define ${function_list[i][0]}`);
          console.log(function_list[i])
        if (function_list[i][1][0][0] !== "BEGIN") {
          addline("{", false);
          indent++;
        }
        processLines(function_list[i][1]);
        if (function_list[i][1][0][0] !== "BEGIN") {
          indent--;
          addline("}");
        }
        code+="\n";              
	}

    

    
    
    addline("program() {");
    indent++;
    processLines(program);
    indent--;
    addline("}");
    indent--;
    addline("}")
    
	return code;
}
%}

%%

program
  : BEGINPROG def_list BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { return validate($def_list, $expr_list, yy); }
  | BEGINPROG BEGINEXEC expr_list ENDEXEC ENDPROG EOF
    { return validate([], $expr_list, yy); }
  ;

def_list
  : def_list def ';'
    { $$ = $def_list.concat($def); }
  | def ';'
    { $$ = $def; }
  ;

def
  : PROTO line var
    { $$ = [];/*Ignore prototypes*/ }
  | PROTO line var '(' var ')'
    { $$ = [];/*Ignore prototypes*/ }
  | DEF line var AS expr
    { $$ = [[`${$var.toLowerCase()} ()`, $expr]] }
  | DEF line var '(' var ')' AS expr
    { $$=[[`${$3.toLowerCase()} (${$5})`, $expr]] }
  ;


expr_list
  : expr_list ';' genexpr
    { $$ = $expr_list.concat($genexpr); }
  | genexpr
    { $$ = $genexpr; }
  ;

genexpr
  : expr
    { $$ = $expr; }
  |
    { $$ = []; }
  ;

expr
  : FORWARD
    { $$ = [['move();']]; }
  | LEFT
    { $$ = [['turnleft();']]; }
  | PICKBUZZER
    { $$ = [['pickbeeper();']]; }
  | LEAVEBUZZER
    { $$ = [['putbeeper();']]; }
  | HALT
    { $$ = [['turnoff();']]; }
  | RET
    { $$ = [['return()']]; }
  | call
    { $$ = $call; }
  | cond
    { $$ = $cond; }
  | loop
    { $$ = $loop; }
  | repeat
    { $$ = $repeat; }
  | BEGIN expr_list END
    { $$ = [["BEGIN"]].concat($expr_list).concat([["END"]]); }
  ;

call
  : var
    { $$ = [[`${$var}();`]]; }
  | var '(' integer ')'
    { $$ = [[`${$var}(${$integer});`]]; }
  ;

cond
  : IF line term THEN expr %prec XIF
    { $$ = [[`if (${$term})`, 'n']].concat($expr) }
  | IF line term THEN expr ELSE expr
    { $$ = [[`if (${$term})`, 'n']].concat($5).concat([["else", 'n']].concat($7)) }
  ;

loop
  : WHILE line term DO expr
    { $$ = [[`while (${$term})`, 'n']].concat($expr) }
  ;

repeat
  : REPEAT line integer TIMES expr
    { $$ =  [[`iterate (${$integer})`, 'n']].concat($expr) }
  ;

term
  : term OR and_term
    { $$ = `${$term} || ${$and_term}` }
  | and_term
    { $$ = $and_term; }
  ;

and_term
  : and_term AND not_term
    { $$ = `${$and_term} && ${$not_term}`; }
  | not_term
    { $$ = $not_term; }
  ;

not_term
  : NOT clause
    { $$ =`!${$clause}`; }
  | clause
    { $$ = $clause; }
  ;

clause
  : IFZ '(' integer ')'
    { $$ = `iszero(${$integer})`; }
  | bool_fun
    { $$ = $bool_fun; }
  | '(' term ')'
    { $$ = `(${$term})`; }
  ;

bool_fun
  : IFNFWALL
    { $$ = "frontIsClear"; }
  | IFFWALL
    { $$ = "frontIsBlocked"; }
  | IFNLWALL
    { $$ = "leftIsClear"; }
  | IFLWALL
    { $$ = "leftIsBlocked"; }
  | IFNRWALL
    { $$ = "rightIsClear"; }
  | IFRWALL
    { $$ = "rightIsBlocked"; }
  | IFWBUZZER
    { $$ = "nextToABeeper"; }
  | IFNWBUZZER
    { $$ = "notNextToABeeper"; }
  | IFBBUZZER
    { $$ = "anyBeepersInBeeperBag"; }
  | IFNBBUZZER
    { $$ = "noBeepersInBeeperBag"; }
  | IFW
    { $$ = "facingWest"; }
  | IFN
    { $$ = "facingNorth"; }
  | IFE
    { $$ = "facingEast"; }
  | IFS
    { $$ = "facingSouth"; }
  | IFNW
    { $$ = "notFacingWest"; }
  | IFNN
    { $$ = "notFacingNorth"; }
  | IFNE
    { $$ = "notFacingEast"; }
  | IFNS
    { $$ = "notFacingSouth"; }
  ;

integer
  : var
    { $$ = $var.toLowerCase(); }
  | NUM
    { $$ = yytext; }
  | INC '(' integer ')'
    { $$ = `succ(${$integer})`; }
  | DEC	 '(' integer ')'
    { $$ = `pred(${$integer})`; }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

line
  :
    { $$ = [['LINE', yylineno]]; }
  ;
