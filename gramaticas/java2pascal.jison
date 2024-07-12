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
	var functions = {};
	var prototypes = {};

    var code = "";
    var indent = 0;

    function addline(line) {
        for (var ii =0; ii < indent; i++) code+="\t";
        code+=line+"\n";
    }

    addline("iniciar-programa")
    indent++;

	for (var i = 0; i < function_list.length; i++) {
        break;
		if (functions[function_list[i][0]]) {
			yy.parser.parseError("Function redefinition: " + function_list[i][0], {
				text: function_list[i][0],
				line: function_list[i][1][0][1],
        loc: function_list[i][3]
			});
		}

		functions[function_list[i][0]] = program.length;
		prototypes[function_list[i][0]] = function_list[i][2];
		program = program.concat(function_list[i][1]);
	}

	var current_line = 1;

	for (var i = 0; i < program.length; i++) {
		if (program[i][0] === "inicio") {
            addline("inicio");
            indent++;
        } 
	}
    indent--;
    addline("finalizar-programa")
    
	return code;
}
%}

%%

program
  : CLASS PROG BEGIN def_list PROG '(' ')' block END EOF
    { return validate($def_list, $PROG, yy); }
  | CLASS PROG BEGIN PROG '(' ')' block END EOF
    { return validate([], $PROG, yy); }
  ;

block
  : BEGIN expr_list END
    { $$ = [["inicio"], $expr_list ,["fin"]]; }
  ;

def_list
  : def_list def
    { $$ = $def_list.concat($def); }
  | def
    { $$ = $def; }
  ;

def
  : DEF line var '(' ')' block
    { 
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
      $$ = [[$var, $line.concat($block).concat([['RET']]), 1, @$]];
       }
  | DEF line var '(' var ')' block
    %{
      @$.first_line = @1.first_line;
      @$.first_column = @1.first_column;
      @$.last_line = @3.last_line;
      @$.last_column = @3.last_column;
    	var result = $line.concat($block).concat([['RET']]);
    	for (var i = 0; i < result.length; i++) {
    		if (result[i][0] == 'PARAM') {
    			if (result[i][1] == $5) {
    				result[i][1] = 0;
    			} else {
						yy.parser.parseError("Unknown variable: " + $5, {
							text: result[i][1],
							line: yylineno,
              loc:result[i][2]
						});
    			}
    		}
    	}
    	$$ = [[$var, result, 2,@$]];
    %}
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
    { $$ = ['coge-zumbador']; }
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
    
   [[ $var ]]
  | var '(' integer ')'
    { 
      $$ = [[ `${$var}(${$integer})` ]]
    }
  ;

cond
  : IF line '(' term ')' expr %prec XIF
    { $$ = [['IF',$term]].concat(expr) }
  | IF line '(' term ')' expr ELSE expr
    { $$ = [['IF',$term]].concat(expr).concat([['ELSE']]).concat($8); }
  ;

loop
  : WHILE line '(' term ')' expr
    { $$ = [['LOOP', $term]].concat($expr);}
  ;

repeat
  : REPEAT line '(' integer ')' expr
    { $$ = [['REPEAT', $integer]].concat(expr) }
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

