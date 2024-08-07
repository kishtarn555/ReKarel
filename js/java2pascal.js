/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var java2pascal = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,8],$V1=[5,15],$V2=[1,13],$V3=[1,19],$V4=[1,26],$V5=[1,37],$V6=[1,27],$V7=[1,28],$V8=[1,29],$V9=[1,30],$Va=[1,31],$Vb=[1,39],$Vc=[1,40],$Vd=[1,41],$Ve=[6,11,18,19,20,21,22,23,24,30,33,34,64],$Vf=[6,11,18,19,20,21,22,23,24,30,32,33,34,64],$Vg=[1,70],$Vh=[1,71],$Vi=[1,72],$Vj=[1,80],$Vk=[1,76],$Vl=[1,78],$Vm=[1,81],$Vn=[1,82],$Vo=[1,83],$Vp=[1,84],$Vq=[1,85],$Vr=[1,86],$Vs=[1,87],$Vt=[1,88],$Vu=[1,89],$Vv=[1,90],$Vw=[1,91],$Vx=[1,92],$Vy=[1,93],$Vz=[1,94],$VA=[1,95],$VB=[1,96],$VC=[1,97],$VD=[1,98],$VE=[1,111],$VF=[9,35],$VG=[1,112],$VH=[9,35,37],$VI=[8,9,35,37];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"program":3,"CLASS":4,"PROG":5,"BEGIN":6,"def_list":7,"(":8,")":9,"block":10,"END":11,"EOF":12,"expr_list":13,"def":14,"DEF":15,"var":16,"expr":17,"FORWARD":18,";":19,"LEFT":20,"PICKBUZZER":21,"LEAVEBUZZER":22,"HALT":23,"RET":24,"call":25,"cond":26,"loop":27,"repeat":28,"integer":29,"IF":30,"term":31,"ELSE":32,"WHILE":33,"REPEAT":34,"OR":35,"and_term":36,"AND":37,"not_term":38,"NOT":39,"clause":40,"IFZ":41,"bool_fun":42,"IFNFWALL":43,"IFFWALL":44,"IFNLWALL":45,"IFLWALL":46,"IFNRWALL":47,"IFRWALL":48,"IFWBUZZER":49,"IFNWBUZZER":50,"IFBBUZZER":51,"IFNBBUZZER":52,"IFW":53,"IFN":54,"IFE":55,"IFS":56,"IFNW":57,"IFNN":58,"IFNE":59,"IFNS":60,"NUM":61,"INC":62,"DEC":63,"VAR":64,"$accept":0,"$end":1},
terminals_: {2:"error",4:"CLASS",5:"PROG",6:"BEGIN",8:"(",9:")",11:"END",12:"EOF",15:"DEF",18:"FORWARD",19:";",20:"LEFT",21:"PICKBUZZER",22:"LEAVEBUZZER",23:"HALT",24:"RET",30:"IF",32:"ELSE",33:"WHILE",34:"REPEAT",35:"OR",37:"AND",39:"NOT",41:"IFZ",43:"IFNFWALL",44:"IFFWALL",45:"IFNLWALL",46:"IFLWALL",47:"IFNRWALL",48:"IFRWALL",49:"IFWBUZZER",50:"IFNWBUZZER",51:"IFBBUZZER",52:"IFNBBUZZER",53:"IFW",54:"IFN",55:"IFE",56:"IFS",57:"IFNW",58:"IFNN",59:"IFNE",60:"IFNS",61:"NUM",62:"INC",63:"DEC",64:"VAR"},
productions_: [0,[3,10],[3,9],[10,3],[7,2],[7,1],[14,5],[14,6],[13,2],[13,1],[17,4],[17,4],[17,4],[17,4],[17,4],[17,4],[17,2],[17,1],[17,1],[17,1],[17,1],[17,1],[25,3],[25,4],[26,5],[26,7],[27,5],[28,5],[31,3],[31,1],[36,3],[36,1],[38,2],[38,1],[40,4],[40,1],[40,3],[40,3],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[42,1],[29,1],[29,1],[29,4],[29,4],[16,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return validate($$[$0-6], $$[$0-2].slice(1, -1), yy); 
break;
case 2:
 return validate([], $$[$0-2].slice(1, -1), yy); 
break;
case 3:
 this.$ = [["inicio"]].concat( $$[$0-1]).concat([["fin"]]); 
break;
case 4: case 8:
 this.$ = $$[$0-1].concat($$[$0]); 
break;
case 5: case 9: case 17: case 18: case 19: case 20: case 29: case 31: case 33: case 35:
 this.$ = $$[$0]; 
break;
case 6:
 
       this.$ = [[$$[$0-3], $$[$0]]]
       
break;
case 7:
 this.$ = [[$$[$0-4], $$[$0], $$[$0-2]]] 
break;
case 10:
 this.$ = [['avanza']]; 
break;
case 11:
 this.$ = [['gira-izquierda']]; 
break;
case 12:
 this.$ = [['coge-zumbador']]; 
break;
case 13:
 this.$ = [['deja-zumbador']]; 
break;
case 14:
 this.$ = [['apagate']]; 
break;
case 15:
 this.$ = [['sal-de-instruccion']]; 
break;
case 16:
 this.$ = $$[$0-1]; 
break;
case 21:
 this.$ = []; 
break;
case 22:
 this.$=[[ $$[$0-2] ]]
break;
case 23:
 
      this.$ = [[ `${$$[$0-3]}(${$$[$0-1]})` ]]
    
break;
case 24:
 this.$ = [[`si ${$$[$0-2]} entonces`, "n"]].concat($$[$0]) 
break;
case 25:
 this.$ = [[`si ${$$[$0-4]} entonces`, "n"]].concat($$[$0-2]).concat([['sino', "n"]]).concat($$[$0]); 
break;
case 26:
 this.$ = [[`mientras ${$$[$0-2]} hacer`, "n"]].concat($$[$0]);
break;
case 27:
 this.$ = [[`repetir ${$$[$0-2]} veces`,"n"]].concat($$[$0]) 
break;
case 28:
 this.$ = $$[$0-2] + " o " + $$[$0]; 
break;
case 30:
 this.$ = $$[$0-2] + " y "+$$[$0] ; 
break;
case 32:
 this.$ = "no "+$$[$0]; 
break;
case 34:
 this.$ = "si-es-cero("+$$[$0-1]+")"; 
break;
case 36:
 this.$ = $$[$0-2]; 
break;
case 37:
 this.$ = "("+$$[$0-1]+")"; 
break;
case 38:
 this.$ = "frente-libre"; 
break;
case 39:
 this.$ = "frente-bloqueado"; 
break;
case 40:
 this.$ = "izquierda-libre"; 
break;
case 41:
 this.$ = "izquierda-bloqueada"; 
break;
case 42:
 this.$ = "derecha-libre"; 
break;
case 43:
 this.$ = "derecha-bloqueada"; 
break;
case 44:
 this.$ = "junto-a-zumbador"; 
break;
case 45:
 this.$ = "no-junto-a-zumbador"; 
break;
case 46:
 this.$ = "algun-zumbador-en-la-mochila"; 
break;
case 47:
 this.$ = "ningun-zumbador-en-la-mochila"; 
break;
case 48:
 this.$ = "orientado-al-oeste"; 
break;
case 49:
 this.$ = "orientado-al-norte"; 
break;
case 50:
 this.$ = "orientado-al-este"; 
break;
case 51:
 this.$ = "orientado-al-sur"; 
break;
case 52:
 this.$ = "no-orientado-al-oeste"; 
break;
case 53:
 this.$ = "no-orientado-al-norte"; 
break;
case 54:
 this.$ = "no-orientado-al-este"; 
break;
case 55:
 this.$ = "no-orientado-al-sur"; 
break;
case 56: case 57: case 60:
 this.$ = yytext; 
break;
case 58:
 this.$ = `sucede(${$$[$0-1]})`; 
break;
case 59:
 this.$ = `precede(${$$[$0-1]})`; 
break;
}
},
table: [{3:1,4:[1,2]},{1:[3]},{5:[1,3]},{6:[1,4]},{5:[1,6],7:5,14:7,15:$V0},{5:[1,9],14:10,15:$V0},{8:[1,11]},o($V1,[2,5]),{16:12,64:$V2},{8:[1,14]},o($V1,[2,4]),{9:[1,15]},{8:[1,16]},o([8,9],[2,60]),{9:[1,17]},{6:$V3,10:18},{9:[1,20],16:21,64:$V2},{6:$V3,10:22},{11:[1,23]},{6:$V3,10:36,13:24,16:38,17:25,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},{6:$V3,10:42},{9:[1,43]},{11:[1,44]},{12:[1,45]},{6:$V3,10:36,11:[1,46],16:38,17:47,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},o($Ve,[2,9]),{8:[1,48]},{8:[1,49]},{8:[1,50]},{8:[1,51]},{8:[1,52]},{8:[1,53]},{19:[1,54]},o($Vf,[2,17]),o($Vf,[2,18]),o($Vf,[2,19]),o($Vf,[2,20]),o($Vf,[2,21]),{8:[1,55]},{8:[1,56]},{8:[1,57]},{8:[1,58]},o($V1,[2,6]),{6:$V3,10:59},{12:[1,60]},{1:[2,2]},o([5,6,11,15,18,19,20,21,22,23,24,30,32,33,34,64],[2,3]),o($Ve,[2,8]),{9:[1,61]},{9:[1,62]},{9:[1,63]},{9:[1,64]},{9:[1,65]},{9:[1,66]},o($Vf,[2,16]),{9:[1,67],16:69,29:68,61:$Vg,62:$Vh,63:$Vi,64:$V2},{8:$Vj,31:73,36:74,38:75,39:$Vk,40:77,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},{8:$Vj,31:99,36:74,38:75,39:$Vk,40:77,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},{16:69,29:100,61:$Vg,62:$Vh,63:$Vi,64:$V2},o($V1,[2,7]),{1:[2,1]},{19:[1,101]},{19:[1,102]},{19:[1,103]},{19:[1,104]},{19:[1,105]},{19:[1,106]},{19:[2,22]},{9:[1,107]},{9:[2,56]},{9:[2,57]},{8:[1,108]},{8:[1,109]},{9:[1,110],35:$VE},o($VF,[2,29],{37:$VG}),o($VH,[2,31]),{8:$Vj,40:113,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},o($VH,[2,33]),{8:[1,114]},o($VH,[2,35],{8:[1,115]}),{8:$Vj,31:116,36:74,38:75,39:$Vk,40:77,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},o($VI,[2,38]),o($VI,[2,39]),o($VI,[2,40]),o($VI,[2,41]),o($VI,[2,42]),o($VI,[2,43]),o($VI,[2,44]),o($VI,[2,45]),o($VI,[2,46]),o($VI,[2,47]),o($VI,[2,48]),o($VI,[2,49]),o($VI,[2,50]),o($VI,[2,51]),o($VI,[2,52]),o($VI,[2,53]),o($VI,[2,54]),o($VI,[2,55]),{9:[1,117],35:$VE},{9:[1,118]},o($Vf,[2,10]),o($Vf,[2,11]),o($Vf,[2,12]),o($Vf,[2,13]),o($Vf,[2,14]),o($Vf,[2,15]),{19:[2,23]},{16:69,29:119,61:$Vg,62:$Vh,63:$Vi,64:$V2},{16:69,29:120,61:$Vg,62:$Vh,63:$Vi,64:$V2},{6:$V3,10:36,16:38,17:121,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},{8:$Vj,36:122,38:75,39:$Vk,40:77,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},{8:$Vj,38:123,39:$Vk,40:77,41:$Vl,42:79,43:$Vm,44:$Vn,45:$Vo,46:$Vp,47:$Vq,48:$Vr,49:$Vs,50:$Vt,51:$Vu,52:$Vv,53:$Vw,54:$Vx,55:$Vy,56:$Vz,57:$VA,58:$VB,59:$VC,60:$VD},o($VH,[2,32]),{16:69,29:124,61:$Vg,62:$Vh,63:$Vi,64:$V2},{9:[1,125]},{9:[1,126],35:$VE},{6:$V3,10:36,16:38,17:127,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},{6:$V3,10:36,16:38,17:128,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},{9:[1,129]},{9:[1,130]},o($Ve,[2,24],{32:[1,131]}),o($VF,[2,28],{37:$VG}),o($VH,[2,30]),{9:[1,132]},o($VH,[2,36]),o($VH,[2,37]),o($Vf,[2,26]),o($Vf,[2,27]),{9:[2,58]},{9:[2,59]},{6:$V3,10:36,16:38,17:133,18:$V4,19:$V5,20:$V6,21:$V7,22:$V8,23:$V9,24:$Va,25:32,26:33,27:34,28:35,30:$Vb,33:$Vc,34:$Vd,64:$V2},o($VH,[2,34]),o($Vf,[2,25])],
defaultActions: {45:[2,2],60:[2,1],67:[2,22],69:[2,56],70:[2,57],107:[2,23],129:[2,58],130:[2,59]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    // _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: lexer.yylloc, // Implement fix: https://github.com/zaach/jison/pull/356
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

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
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* ignore */
break;
case 1:/* ignore */
break;
case 2:/* ignore */
break;
case 3: return 4; 
break;
case 4: return 5; 
break;
case 5: return 15; 
break;
case 6: return 15; 
break;
case 7: return 24; 
break;
case 8: return 23; 
break;
case 9: return 20; 
break;
case 10: return 18; 
break;
case 11: return 21; 
break;
case 12: return 22; 
break;
case 13: return 33; 
break;
case 14: return 34; 
break;
case 15: return 63; 
break;
case 16: return 62; 
break;
case 17: return 41; 
break;
case 18: return 43; 
break;
case 19: return 44; 
break;
case 20: return 45; 
break;
case 21: return 46; 
break;
case 22: return 47; 
break;
case 23: return 48; 
break;
case 24: return 49; 
break;
case 25: return 50; 
break;
case 26: return 51; 
break;
case 27: return 52; 
break;
case 28: return 54; 
break;
case 29: return 56; 
break;
case 30: return 55; 
break;
case 31: return 53; 
break;
case 32: return 58; 
break;
case 33: return 60; 
break;
case 34: return 59; 
break;
case 35: return 57; 
break;
case 36: return 32; 
break;
case 37: return 30; 
break;
case 38: return 39; 
break;
case 39: return 35; 
break;
case 40: return 37; 
break;
case 41: return 37; 
break;
case 42: return 8; 
break;
case 43: return 9; 
break;
case 44: return 6; 
break;
case 45: return 11; 
break;
case 46: return 19; 
break;
case 47: return 61; 
break;
case 48: return 64; 
break;
case 49: return 12; 
break;
}
},
rules: [/^(?:\s+)/,/^(?:\/\/[^\n]*)/,/^(?:\/\*(?:[^*]|\*(?!\/))*\*\/)/,/^(?:class\b)/,/^(?:program\b)/,/^(?:define\b)/,/^(?:void\b)/,/^(?:return\b)/,/^(?:turnoff\b)/,/^(?:turnleft\b)/,/^(?:move\b)/,/^(?:pickbeeper\b)/,/^(?:putbeeper\b)/,/^(?:while\b)/,/^(?:iterate\b)/,/^(?:pred\b)/,/^(?:succ\b)/,/^(?:iszero\b)/,/^(?:frontIsClear\b)/,/^(?:frontIsBlocked\b)/,/^(?:leftIsClear\b)/,/^(?:leftIsBlocked\b)/,/^(?:rightIsClear\b)/,/^(?:rightIsBlocked\b)/,/^(?:nextToABeeper\b)/,/^(?:notNextToABeeper\b)/,/^(?:anyBeepersInBeeperBag\b)/,/^(?:noBeepersInBeeperBag\b)/,/^(?:facingNorth\b)/,/^(?:facingSouth\b)/,/^(?:facingEast\b)/,/^(?:facingWest\b)/,/^(?:notFacingNorth\b)/,/^(?:notFacingSouth\b)/,/^(?:notFacingEast\b)/,/^(?:notFacingWest\b)/,/^(?:else\b)/,/^(?:if\b)/,/^(?:!)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:;)/,/^(?:[0-9]+)/,/^(?:[a-zA-Z][a-zA-Z0-9_]*)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = java2pascal;
exports.Parser = java2pascal.Parser;
exports.parse = function () { return java2pascal.parse.apply(java2pascal, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
function java2pascalParser () {
    return java2pascal.parse.apply(java2pascal, arguments);
}
export {java2pascal, java2pascalParser}