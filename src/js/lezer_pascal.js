// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser, LocalTokenGroup} from "@lezer/lr"
const spec_Identifier = {__proto__:null,usa:144, rekarel:146, globales:148, "iniciar-programa":154, "define-nueva-instruccion":156, "define-condicion":158, "define-calculo":160, define:162, "define-nueva-instrucción":164, "define-condición":166, "define-cálculo":168, como:170, avanza:176, "gira-izquierda":178, "deja-zumbador":180, "coge-zumbador":182, apagate:184, o:194, u:196, y:198, e:200, no:202, "si-es-cero":208, "es-cero":210, "junto-a-zumbador":212, "no-junto-a-zumbador":214, "frente-libre":216, "izquierda-libre":218, "derecha-libre":220, "frente-bloqueado":222, "izquierda-bloqueada":224, "derecha-bloqueada":226, "orientado-al-norte":228, "orientado-al-sur":230, "orientado-al-este":232, "orientado-al-oeste":234, "no-orientado-al-norte":236, "no-orientado-al-sur":238, "no-orientado-al-este":240, "no-orientado-al-oeste":242, "algun-zumbador-en-la-mochila":244, "ningun-zumbador-en-la-mochila":246, verdadero:248, falso:250, "zumbadores-del-piso":252, mochila:254, "fila-actual":256, "columna-actual":258, sucede:264, precede:266, mientras:270, hacer:272, repetir:274, veces:276, si:278, entonces:280, sino:282, "si-no":284, inicio:286, fin:292, continua:294, "continúa":296, rompe:298, regresa:300, "sal-de-instruccion":302, "define-prototipo-instruccion":304, "define-prototipo-calculo":306, "define-prototipo-condicion":308, "define-prototipo-instrucción":310, "define-prototipo-cálculo":312, "define-prototipo-condición":314, "inicia-ejecucion":316, "inicia-ejecución":318, "termina-ejecucion":320, "termina-ejecución":322, "finalizar-programa":324}
export const parser = LRParser.deserialize({
  version: 14,
  states: "3bO]QPOOPeOPOOOOQO'#Cd'#CdOmQPO'#CcOOQO'#Dh'#DhOxQPO'#CbOOQO'#Cg'#CgO!QQPOOO`QPOOP#ROQO'#C]P#aOSO'#C_POOO)C?b)C?bOOQO'#Cf'#CfO#oQPO,58}OOQO-E7f-E7fOOQO'#Ci'#CiO#tQPO'#ChOOQO'#Da'#DaO#yQPO'#D`OOQO'#Di'#DiO!QQPOOOOQO'#Dc'#DcO$OQPO'#DbO%YQPOOPOOO'#Df'#DfP%_OQO,58wPOOO,58w,58wPOOO'#Dg'#DgP%mOSO,58yPOOO,58y,58yO%{QPO1G.iO&WQPO,59SO&`QPO,59zOOQO-E7g-E7gOOQO'#Ck'#CkO&hQPO'#EVOOQO'#EV'#EVOOQO'#C|'#C|O(OQPO'#C{OOQO'#DQ'#DQO(OQPO'#DPOOQO'#DT'#DTO(OQPO'#DSOOQO'#Fc'#FcOOQO'#Fb'#FbO*UQPO,59|O*aQPO'#DWOOQO'#DZ'#DZOOQO'#D['#D[OOQO'#D^'#D^O+hQPO'#D]OOQO'#EU'#EUOOQO'#DX'#DXOOQO'#De'#DeQOQPOOPOOO-E7d-E7dPOOO1G.c1G.cPOOO-E7e-E7ePOOO1G.e1G.eO,}QPO7+$TOOQO'#Cj'#CjO-SQPO1G.nO.TQPO1G.nOOQO1G/f1G/fO.TQPO1G/fO(OQPO,5:wOOQO'#Cs'#CsOOQO'#Cu'#CuO.YQPO'#CtOOQO'#Cv'#CvOOQO'#Cw'#CwOOQO'#Cy'#CyOOQO'#Cz'#CzO._QPO'#FTOOQO'#FS'#FSOOQO'#Eg'#EgO.dQPO'#EgO1XQPO'#C}O(OQPO'#E_O(OQPO'#E_OOQO'#E_'#E_O1cQPO,59gO1hQPO'#CmO1uQPO,59kO1zQPO,59nO2PQPO,5;|OOQO'#Dd'#DdOOQO1G/h1G/hO2WQPO,59rO2`QPO,59wOOQO<<Go<<GoOOQO7+$Y7+$YO3uQPO7+$YOOQO'#D_'#D_O3}QPO7+%QO4VQPO'#ClO4_QPO1G0cO(OQPO,59`O(OQPO,5;oOOQO'#Cn'#CnOOQO'#Co'#CoOOQO'#E`'#E`O(OQPO,5:yO4dQPO,5:yO6YQPO,5:yOOQO'#DO'#DOO-SQPO1G/ROOQO'#DR'#DRO-SQPO1G/VOOQO'#DU'#DUO-SQPO1G/YOOQO1G1h1G1hOOQO1G/^1G/^OOQO'#DY'#DYO6aQPO,59yO6fQPO<<GtO6kQPO<<HlO(OQPO'#DjO6pQPO,59WOOQO7+%}7+%}O6xQPO1G.zO6}QPO1G1ZOOQO1G0e1G0eOOQO7+$m7+$mOOQO7+$q7+$qO7VQPO7+$tOOQO1G/e1G/eO-SQPOAN=`OOQOAN>WAN>WOOQO,5:U,5:UOOQO-E7h-E7hOOQO7+$f7+$fOOQO7+&u7+&uO8jQPO7+&uOOQO'#DV'#DVO-SQPO<<H`O8oQPOG22zO8tQPO<<JaOOQOAN=zAN=zOOQOLD(fLD(fOOQOAN?{AN?{",
  stateData: "8y~O!aOS!bPQ!fPQ~O!jQO!oUO~O!bXO!fYO~OX]O!k[O!l[O~O!jQO!oUX~O!p_O!q_O!r_O!s_O!t_O!u_O!v_O$^aO$_aO$`aO$aaO$baO$caO$deO$eeO~OQhO!chO!dhO!ejO~OSkO!gkO!hkO!imO~O!mnO~OXoO~OXpO~OXsO!zrO!{rO!|rO!}rO#OrO#{uO#}wO$PyO$T!UO$X!PO$Y!PO$Z!QO$[!RO$]!RO!n$VP$f$VP$g$VP~O$h!VO~OQhO!chO!dhO!e!YO~OSkO!gkO!hkO!i![O~OX!]O!k[O!l[O~O!w!^O#Q!`O~O!n!aO#Q!bO~O#Q!cO!n!yX$f!yX$g!yX$W!yX!p!yX!q!yX!r!yX!s!yX!t!yX!u!yX!v!yX$^!yX$_!yX$`!yX$a!yX$b!yX$c!yX$d!yX$e!yX$R!yX$S!yX~OX!nOl!lO#Q!qO#X!dO#[!eO#]!eO#^!gO#_!gO#`!gO#a!gO#b!gO#c!gO#d!gO#e!gO#f!gO#g!gO#h!gO#i!gO#j!gO#k!gO#l!gO#m!gO#n!gO#o!gO#p!hO#q!hO#r!hO#s!hO#t!hO#u!hO#x!iO#y!jO~O!n!wO$f!xO$g!xO~OXsO!zrO!{rO!|rO!}rO#OrO#{uO#}wO$PyO$T!UO$X!PO$Y!PO$Z!QO$[!RO$]!RO!n$VP$W$VP~O!n!PX$f!PX$g!PX$W!PX!p!PX!q!PX!r!PX!s!PX!t!PX!u!PX!v!PX$^!PX$_!PX$`!PX$a!PX$b!PX$c!PX$d!PX$e!PX$R!PX$S!PX~P(OO!n!|O~OXsO!zrO!{rO!|rO!}rO#OrO#{uO#}wO$PyO$T!UO$X!PO$Y!PO$Z!QO$[!RO$]!RO~OX#PO~O#Q#TO~O#Q#UO~O#Q!cOd#ZXe#ZXf#ZX#T#ZX#U#ZX#V#ZX#W#ZX#|#ZX$O#ZX$Q#ZX!n#ZX$f#ZX$g#ZX#Y#ZX#z#ZX$W#ZX!p#ZX!q#ZX!r#ZX!s#ZX!t#ZX!u#ZX!v#ZX$^#ZX$_#ZX$`#ZX$a#ZX$b#ZX$c#ZX$d#ZX$e#ZX$R#ZX$S#ZX~Od#XOe#XOf#XO#T#VO#U#VO#V#WO#W#WO~O#|qX$QqX~P0pO#|#]O~O$OaX#YaX#zaX~P0pO$O#_O~O$Q#aO~O$W$VP~P$OO!n!wO$W#eO~O!n!Pa$f!Pa$g!Pa$W!Pa!p!Pa!q!Pa!r!Pa!s!Pa!t!Pa!u!Pa!v!Pa$^!Pa$_!Pa$`!Pa$a!Pa$b!Pa$c!Pa$d!Pa$e!Pa$R!Pa$S!Pa~P0pO#Y#gO#z#fO~O#Y#hO#z#fO~O#z#iO#Y`X~O#Y#kO~O#|#Ra$O#Ra$Q#Ra!n#Ra$f#Ra$g#Ra#Y#Ra#z#Ra$W#Ra!p#Ra!q#Ra!r#Ra!s#Ra!t#Ra!u#Ra!v#Ra$^#Ra$_#Ra$`#Ra$a#Ra$b#Ra$c#Ra$d#Ra$e#Ra$R#Ra$S#Ra~P0pO#Y#nO~P0pOX#rO~O!w!^O~O!n#tO~O#z#iO#Y`a~O#Y#wO~O#Y#xO#z#yO~O$R#zO$S#zO!nvq$fvq$gvq$Wvq!pvq!qvq!rvq!svq!tvq!uvq!vvq$^vq$_vq$`vq$avq$bvq$cvq$dvq$evq~Ol#}O~O!n$PO~O#Y$QO~O",
  goto: ",h$WP$XP$XPP$[$_$cP$g$m$q$u$y%P%[%_%n%nPPP%u&S&a&S&SP&n&n&{'W'c'i&{'l'w&{'z(V(Y&{(](h&{&{&{(k(v$q(|)Q)U)Y)])`)f)l)r)xPPPPPPPPPPPPPPPPPPPPPPPPP*O&{PPPPP*gP+P+hPPPPPP+oPPPPPPPPPPPPPPPPPPPPPPPPPP&S+|PPPPPPPPPPPP,Z,aRZPRWOTSOTTROTQ]RR!]nTVOWTcVdT`VdQ!_oR#s#gctf!O!_!w#^#`#b#s#{R#S!cQ!uxQ#R!cQ#l#TQ#m#UR#u#iZ#X!o!t!{#Z#[g!pvxz!S!c!p!q#T#U#Y#ig!mvxz!S!c!p!q#T#U#Y#ig!fvxz!S!c!p!q#T#U#Y#ig!kvxz!S!c!p!q#T#U#Y#ic!Tf!O!_!w#^#`#b#s#{cvf!O!_!w#^#`#b#s#{Q!svR!vzR#^!scxf!O!_!w#^#`#b#s#{R#`!uczf!O!_!w#^#`#b#s#{R#b!vR#{#qc!Of!O!_!w#^#`#b#s#{R#d!zc!Sf!O!_!w#^#`#b#s#{Q#O!`R#Q!bTbVdTgVdTfVdR!y}R!WgQiXR!XiQlYR!ZlQTOR^TQdVRqdQ#j#RR#v#jU{f!O!wQ!}!_Q#o#^Q#p#`Q#q#bQ#|#sR$O#{btf!O!_!w#^#`#b#s#{g!mvxz!S!c!p!q#T#U#Y#iS!ovzY!tx!c#T#U#iQ!{!SQ#Z!pQ#[!qR#n#YZ#Y!o!t!{#Z#[g!rvxz!S!c!p!q#T#U#Y#ig!lvxz!S!c!p!q#T#U#Y#iQ}fR!z!OS|f!OR#c!w",
  nodeNames: "⚠ BlockComment Annotation BlockComment2 Annotation2 Script ImportList ImportStatement Import Identifier Modules StartProgram Function DefineType As BuiltIn CallParams NumericTerm Or And LTE LT COMP Not IFZ Ifzero BoolFunc Globals Number Succ Pred WhileStatement While BooleanTerm Do IterateStatement Iterate Times IfStatement If Then Else Block Begin End Continue Break ReturnStatement Return FunctionParams Prototype PrototipoType Execution StartExecution EndExecution EndProgram",
  maxTerm: 162,
  nodeProps: [
    ["closedBy", 43,"End"],
    ["openedBy", 44,"Begin"]
  ],
  skippedNodes: [0,1,2,3,4,56,57],
  repeatNodeCount: 5,
  tokenData: "%l~RiX^!ppq!pxy#eyz#r|}#w!O!P#|!Q![$R!]!^$Z!^!_$`!_!`$m!c!}$x#R#S$x#T#o$x#o#p%g#y#z!p$f$g!p%W%o$x%p&a$x&b&j$x#BY#BZ!p$IS$I_!p$I|$JO!p$JT$JU!p$KV$KW!p&FU&FV!p~!uY!a~X^!ppq!p#y#z!p$f$g!p#BY#BZ!p$IS$I_!p$I|$JO!p$JT$JU!p$KV$KW!p&FU&FV!p~#jP#Q~z{#m~#rO!f~~#wO#Y~~#|O#z~~$RO!m~~$WPl~!Q![$R~$`O!n~~$ePe~!_!`$h~$mOd~~$pP!_!`$s~$xOf~~$}WX~}!O$x!Q![$x!c!}$x#R#S$x#T#o$x%W%o$x%p&a$x&b&j$x~%lO!b~",
  tokenizers: [2, new LocalTokenGroup("r~RRYZ[!b!ca#q#rl~aO!d~~fQQ~!c!}a#T#oa~qO!e~~", 33, 65), new LocalTokenGroup("x~RRYZ[z{a!b!cl~aO!h~~dPyzg~lO!i~~qQS~!c!}l#T#ol~", 39, 69)],
  topRules: {"Script":[0,5]},
  specialized: [{term: 9, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 0
})
