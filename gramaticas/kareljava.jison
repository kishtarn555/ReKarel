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

	for (var i = 0; i < function_list.length; i++) {
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
		if (program[i][0] == 'LINE') {
			current_line = program[i][1];
		} else if (program[i][0] == 'CALL') {
			if (!functions[program[i][1]] || !prototypes[program[i][1]]) {
				yy.parser.parseError("Undefined function: " + program[i][1], {
					text: program[i][1],
					line: current_line,
          loc: program[i][3]
				});
			} else if (prototypes[program[i][1]] != program[i][2]) {
				yy.parser.parseError("Function parameter mismatch: " + program[i][1], {
					text: program[i][1],
					line: current_line,
          loc: program[i][4],
          parameters: program[i][2],
				});
			}

			program[i][2] = program[i][1];
			program[i][1] = functions[program[i][1]];
      // Remove loc data which is only for error parsing
      program[i].pop();
      program[i].pop(); 
		} else if (program[i][0] == 'PARAM') {
      if (program[i][1] != 0) {
        yy.parser.parseError("Unknown variable: " + program[i][1], {
          text: program[i][1],
          line: current_line,
          loc: program[i][2]
        });
      } else {
        program[i].pop();
      }
		}
	}

	return program;
}
%}

%%

program
  : CLASS PROG BEGIN def_list PROG '(' ')' block END EOF
    { return validate($def_list, $block.concat([['LINE', yylineno], ['HALT']]), yy); }
  | CLASS PROG BEGIN PROG '(' ')' block END EOF
    { return validate([], $block.concat([['LINE', yylineno], ['HALT']]), yy); }
  ;

block
  : BEGIN expr_list END
    { $$ = $expr_list; }
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
    { $$ = [['LINE', yylineno], ['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT'], ['EZ', 'WALL'], ['FORWARD']]; }
  | LEFT '(' ')' ';'
    { $$ = [['LINE', yylineno], ['LEFT']]; }
  | PICKBUZZER '(' ')' ';'
    { $$ = [['LINE', yylineno], ['WORLDBUZZERS'], ['EZ', 'WORLDUNDERFLOW'], ['PICKBUZZER']]; }
  | LEAVEBUZZER '(' ')' ';'
    { $$ = [['LINE', yylineno], ['BAGBUZZERS'], ['EZ', 'BAGUNDERFLOW'], ['LEAVEBUZZER']]; }
  | HALT '(' ')' ';'
    { $$ = [['LINE', yylineno], ['HALT']]; }
  | RET '(' ')' ';'
    { $$ = [['LINE', yylineno], ['RET']]; }
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
    
    %{ 
      
      var loc = {
        first_line: @2.first_line,
        first_column: @2.first_column,
        last_line: @3.last_line,
        last_column: @3.last_column,
      };
      $$ = [['LINE', yylineno], ['LOAD', 0], ['CALL', $var, 1, @1, loc], ['LINE', yylineno]]; 
    %}
  | var '(' integer ')'
    { 
      @$.first_column = @1.first_column;
      @$.first_line = @1.first_line;
      @$.last_column = @4.last_column;
      @$.last_line = @4.last_line;
      ;
      $$ = [['LINE', yylineno]].concat($integer).concat([['CALL', $var, 2, @1, @3], ['LINE', yylineno]]); 
    }
  ;

cond
  : IF line '(' term ')' expr %prec XIF
    { $$ = $line.concat($term).concat([['JZ', $expr.length]]).concat($expr); }
  | IF line '(' term ')' expr ELSE expr
    { $$ = $line.concat($term).concat([['JZ', 1 + $6.length]]).concat($6).concat([['JMP', $8.length]]).concat($8); }
  ;

loop
  : WHILE line '(' term ')' expr
    { $$ = $line.concat($term).concat([['JZ', 1 + $expr.length]]).concat($expr).concat([['JMP', -1 -($term.length + $expr.length + 2)]]); }
  ;

repeat
  : REPEAT line '(' integer ')' expr
    { $$ = $line.concat($integer).concat([['DUP'], ['LOAD', 0], ['EQ'], ['NOT'], ['JZ', $expr.length + 2]]).concat($expr).concat([['DEC'], ['JMP', -1 -($expr.length + 6)], ['POP']]); }
  ;

term
  : term OR and_term
    { $$ = $term.concat($and_term).concat([['OR']]); }
  | and_term
    { $$ = $and_term; }
  ;

and_term
  : and_term AND not_term
    { $$ = $and_term.concat($not_term).concat([['AND']]); }
  | not_term
    { $$ = $not_term; }
  ;

not_term
  : NOT clause
    { $$ = $clause.concat([['NOT']]); }
  | clause
    { $$ = $clause; }
  ;

clause
  : IFZ '(' integer ')'
    { $$ = $integer.concat([['NOT']]); }
  | bool_fun
    { $$ = $bool_fun; }
  | bool_fun '(' ')'
    { $$ = $bool_fun; }
  | '(' term ')'
    { $$ = $term; }
  ;

bool_fun
  : IFNFWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND'], ['NOT']]; }
  | IFFWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['MASK'], ['AND']]; }
  | IFNLWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND'], ['NOT']]; }
  | IFLWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTL'], ['MASK'], ['AND']]; }
  | IFNRWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND'], ['NOT']]; }
  | IFRWALL
    { $$ = [['WORLDWALLS'], ['ORIENTATION'], ['ROTR'], ['MASK'], ['AND']]; }
  | IFWBUZZER
    { $$ = [['WORLDBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNWBUZZER
    { $$ = [['WORLDBUZZERS'], ['NOT']]; }
  | IFBBUZZER
    { $$ = [['BAGBUZZERS'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNBBUZZER
    { $$ = [['BAGBUZZERS'], ['NOT']]; }
  | IFW
    { $$ = [['ORIENTATION'], ['LOAD', 0], ['EQ']]; }
  | IFN
    { $$ = [['ORIENTATION'], ['LOAD', 1], ['EQ']]; }
  | IFE
    { $$ = [['ORIENTATION'], ['LOAD', 2], ['EQ']]; }
  | IFS
    { $$ = [['ORIENTATION'], ['LOAD', 3], ['EQ']]; }
  | IFNW
    { $$ = [['ORIENTATION'], ['LOAD', 0], ['EQ'], ['NOT']]; }
  | IFNN
    { $$ = [['ORIENTATION'], ['LOAD', 1], ['EQ'], ['NOT']]; }
  | IFNE
    { $$ = [['ORIENTATION'], ['LOAD', 2], ['EQ'], ['NOT']]; }
  | IFNS
    { $$ = [['ORIENTATION'], ['LOAD', 3], ['EQ'], ['NOT']]; }
  ;

integer
  : var
    { $$ = [['PARAM', $var, @1]]; }
  | NUM
    { $$ = [['LOAD', parseInt(yytext)]]; }
  | INC '(' integer ')'
    { $$ = $integer.concat([['INC']]); }
  | DEC	 '(' integer ')'
    { $$ = $integer.concat([['DEC']]); }
  ;

var
  : VAR
    { $$ = yytext; }
  ;

line
  :
    { $$ = [['LINE', yylineno]]; }
  ;
