// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser, LocalTokenGroup} from "@lezer/lr"
const spec_Identifier = {__proto__:null,usa:144, rekarel:146, globales:148, "iniciar-programa":154, "define-nueva-instruccion":156, "define-condicion":158, "define-calculo":160, define:162, "define-nueva-instrucción":164, "define-condición":166, "define-cálculo":168, como:170, avanza:176, "gira-izquierda":178, "deja-zumbador":180, "coge-zumbador":182, apagate:184, o:194, u:196, y:198, e:200, no:202, "si-es-cero":208, "es-cero":210, "junto-a-zumbador":212, "no-junto-a-zumbador":214, "frente-libre":216, "izquierda-libre":218, "derecha-libre":220, "frente-bloqueado":222, "izquierda-bloqueada":224, "derecha-bloqueada":226, "orientado-al-norte":228, "orientado-al-sur":230, "orientado-al-este":232, "orientado-al-oeste":234, "no-orientado-al-norte":236, "no-orientado-al-sur":238, "no-orientado-al-este":240, "no-orientado-al-oeste":242, "algun-zumbador-en-la-mochila":244, "ningun-zumbador-en-la-mochila":246, verdadero:248, falso:250, "zumbadores-del-piso":252, mochila:254, sucede:260, precede:262, mientras:266, hacer:268, repetir:270, veces:272, si:274, entonces:276, sino:278, "si-no":280, inicio:282, fin:288, continua:290, "continúa":292, rompe:294, regresa:296, "sal-de-instruccion":298, "define-prototipo-instruccion":300, "define-prototipo-calculo":302, "define-prototipo-condicion":304, "define-prototipo-instrucción":306, "define-prototipo-cálculo":308, "define-prototipo-condición":310, "inicia-ejecucion":312, "inicia-ejecución":314, "termina-ejecucion":316, "termina-ejecución":318, "finalizar-programa":320}
export const parser = LRParser.deserialize({
  version: 14,
  states: "3bO]QPOOPeOPOOOOQO'#Cd'#CdOmQPO'#CcOOQO'#Dh'#DhOxQPO'#CbOOQO'#Cg'#CgO!QQPOOO`QPOOP#ROQO'#C]P#aOSO'#C_POOO)C?b)C?bOOQO'#Cf'#CfO#oQPO,58}OOQO-E7f-E7fOOQO'#Ci'#CiO#tQPO'#ChOOQO'#Da'#DaO#yQPO'#D`OOQO'#Di'#DiO!QQPOOOOQO'#Dc'#DcO$OQPO'#DbO%YQPOOPOOO'#Df'#DfP%_OQO,58wPOOO,58w,58wPOOO'#Dg'#DgP%mOSO,58yPOOO,58y,58yO%{QPO1G.iO&WQPO,59SO&`QPO,59zOOQO-E7g-E7gOOQO'#Ck'#CkO&hQPO'#EVOOQO'#EV'#EVOOQO'#C|'#C|O(OQPO'#C{OOQO'#DQ'#DQO(OQPO'#DPOOQO'#DT'#DTO(OQPO'#DSOOQO'#Fa'#FaOOQO'#F`'#F`O*OQPO,59|O*ZQPO'#DWOOQO'#DZ'#DZOOQO'#D['#D[OOQO'#D^'#D^O+bQPO'#D]OOQO'#EU'#EUOOQO'#DX'#DXOOQO'#De'#DeQOQPOOPOOO-E7d-E7dPOOO1G.c1G.cPOOO-E7e-E7ePOOO1G.e1G.eO,wQPO7+$TOOQO'#Cj'#CjO,|QPO1G.nO-}QPO1G.nOOQO1G/f1G/fO-}QPO1G/fO(OQPO,5:wOOQO'#Cs'#CsOOQO'#Cu'#CuO.SQPO'#CtOOQO'#Cv'#CvOOQO'#Cw'#CwOOQO'#Cy'#CyOOQO'#Cz'#CzO.XQPO'#FROOQO'#FQ'#FQOOQO'#Eg'#EgO.^QPO'#EgO1RQPO'#C}O(OQPO'#E_O(OQPO'#E_OOQO'#E_'#E_O1]QPO,59gO1bQPO'#CmO1oQPO,59kO1tQPO,59nO1yQPO,5;zOOQO'#Dd'#DdOOQO1G/h1G/hO2QQPO,59rO2YQPO,59wOOQO<<Go<<GoOOQO7+$Y7+$YO3oQPO7+$YOOQO'#D_'#D_O3wQPO7+%QO4PQPO'#ClO4XQPO1G0cO(OQPO,59`O(OQPO,5;mOOQO'#Cn'#CnOOQO'#Co'#CoOOQO'#E`'#E`O(OQPO,5:yO4^QPO,5:yO6SQPO,5:yOOQO'#DO'#DOO,|QPO1G/ROOQO'#DR'#DRO,|QPO1G/VOOQO'#DU'#DUO,|QPO1G/YOOQO1G1f1G1fOOQO1G/^1G/^OOQO'#DY'#DYO6ZQPO,59yO6`QPO<<GtO6eQPO<<HlO(OQPO'#DjO6jQPO,59WOOQO7+%}7+%}O6rQPO1G.zO6wQPO1G1XOOQO1G0e1G0eOOQO7+$m7+$mOOQO7+$q7+$qO7PQPO7+$tOOQO1G/e1G/eO,|QPOAN=`OOQOAN>WAN>WOOQO,5:U,5:UOOQO-E7h-E7hOOQO7+$f7+$fOOQO7+&s7+&sO8dQPO7+&sOOQO'#DV'#DVO,|QPO<<H`O8iQPOG22zO8nQPO<<J_OOQOAN=zAN=zOOQOLD(fLD(fOOQOAN?yAN?y",
  stateData: "8s~O!aOS!bPQ!fPQ~O!jQO!oUO~O!bXO!fYO~OX]O!k[O!l[O~O!jQO!oUX~O!p_O!q_O!r_O!s_O!t_O!u_O!v_O$[aO$]aO$^aO$_aO$`aO$aaO$beO$ceO~OQhO!chO!dhO!ejO~OSkO!gkO!hkO!imO~O!mnO~OXoO~OXpO~OXsO!zrO!{rO!|rO!}rO#OrO#yuO#{wO#}yO$R!UO$V!PO$W!PO$X!QO$Y!RO$Z!RO!n$TP$d$TP$e$TP~O$f!VO~OQhO!chO!dhO!e!YO~OSkO!gkO!hkO!i![O~OX!]O!k[O!l[O~O!w!^O#Q!`O~O!n!aO#Q!bO~O#Q!cO!n!yX$d!yX$e!yX$U!yX!p!yX!q!yX!r!yX!s!yX!t!yX!u!yX!v!yX$[!yX$]!yX$^!yX$_!yX$`!yX$a!yX$b!yX$c!yX$P!yX$Q!yX~OX!nOl!lO#Q!qO#X!dO#[!eO#]!eO#^!gO#_!gO#`!gO#a!gO#b!gO#c!gO#d!gO#e!gO#f!gO#g!gO#h!gO#i!gO#j!gO#k!gO#l!gO#m!gO#n!gO#o!gO#p!hO#q!hO#r!hO#s!hO#v!iO#w!jO~O!n!wO$d!xO$e!xO~OXsO!zrO!{rO!|rO!}rO#OrO#yuO#{wO#}yO$R!UO$V!PO$W!PO$X!QO$Y!RO$Z!RO!n$TP$U$TP~O!n!PX$d!PX$e!PX$U!PX!p!PX!q!PX!r!PX!s!PX!t!PX!u!PX!v!PX$[!PX$]!PX$^!PX$_!PX$`!PX$a!PX$b!PX$c!PX$P!PX$Q!PX~P(OO!n!|O~OXsO!zrO!{rO!|rO!}rO#OrO#yuO#{wO#}yO$R!UO$V!PO$W!PO$X!QO$Y!RO$Z!RO~OX#PO~O#Q#TO~O#Q#UO~O#Q!cOd#ZXe#ZXf#ZX#T#ZX#U#ZX#V#ZX#W#ZX#z#ZX#|#ZX$O#ZX!n#ZX$d#ZX$e#ZX#Y#ZX#x#ZX$U#ZX!p#ZX!q#ZX!r#ZX!s#ZX!t#ZX!u#ZX!v#ZX$[#ZX$]#ZX$^#ZX$_#ZX$`#ZX$a#ZX$b#ZX$c#ZX$P#ZX$Q#ZX~Od#XOe#XOf#XO#T#VO#U#VO#V#WO#W#WO~O#zqX$OqX~P0jO#z#]O~O#|aX#YaX#xaX~P0jO#|#_O~O$O#aO~O$U$TP~P$OO!n!wO$U#eO~O!n!Pa$d!Pa$e!Pa$U!Pa!p!Pa!q!Pa!r!Pa!s!Pa!t!Pa!u!Pa!v!Pa$[!Pa$]!Pa$^!Pa$_!Pa$`!Pa$a!Pa$b!Pa$c!Pa$P!Pa$Q!Pa~P0jO#Y#gO#x#fO~O#Y#hO#x#fO~O#x#iO#Y`X~O#Y#kO~O#z#Ra#|#Ra$O#Ra!n#Ra$d#Ra$e#Ra#Y#Ra#x#Ra$U#Ra!p#Ra!q#Ra!r#Ra!s#Ra!t#Ra!u#Ra!v#Ra$[#Ra$]#Ra$^#Ra$_#Ra$`#Ra$a#Ra$b#Ra$c#Ra$P#Ra$Q#Ra~P0jO#Y#nO~P0jOX#rO~O!w!^O~O!n#tO~O#x#iO#Y`a~O#Y#wO~O#Y#xO#x#yO~O$P#zO$Q#zO!nvq$dvq$evq$Uvq!pvq!qvq!rvq!svq!tvq!uvq!vvq$[vq$]vq$^vq$_vq$`vq$avq$bvq$cvq~Ol#}O~O!n$PO~O#Y$QO~O",
  goto: ",f$UP$VP$VPP$Y$]$aP$e$k$o$s$w$}%Y%]%l%lPPP%s&Q&_&Q&QP&l&l&y'U'a'g&y'j'u&y'x(T(W&y(Z(f&y&y&y(i(t$o(z)O)S)W)Z)^)d)j)p)vPPPPPPPPPPPPPPPPPPPPPPPPP)|&yPPPPP*eP*}+fPPPPPP+mPPPPPPPPPPPPPPPPPPPPPPPP&Q+zPPPPPPPPPPPP,X,_RZPRWOTSOTTROTQ]RR!]nTVOWTcVdT`VdQ!_oR#s#gctf!O!_!w#^#`#b#s#{R#S!cQ!uxQ#R!cQ#l#TQ#m#UR#u#iZ#X!o!t!{#Z#[g!pvxz!S!c!p!q#T#U#Y#ig!mvxz!S!c!p!q#T#U#Y#ig!fvxz!S!c!p!q#T#U#Y#ig!kvxz!S!c!p!q#T#U#Y#ic!Tf!O!_!w#^#`#b#s#{cvf!O!_!w#^#`#b#s#{Q!svR!vzR#^!scxf!O!_!w#^#`#b#s#{R#`!uczf!O!_!w#^#`#b#s#{R#b!vR#{#qc!Of!O!_!w#^#`#b#s#{R#d!zc!Sf!O!_!w#^#`#b#s#{Q#O!`R#Q!bTbVdTgVdTfVdR!y}R!WgQiXR!XiQlYR!ZlQTOR^TQdVRqdQ#j#RR#v#jU{f!O!wQ!}!_Q#o#^Q#p#`Q#q#bQ#|#sR$O#{btf!O!_!w#^#`#b#s#{g!mvxz!S!c!p!q#T#U#Y#iS!ovzY!tx!c#T#U#iQ!{!SQ#Z!pQ#[!qR#n#YZ#Y!o!t!{#Z#[g!rvxz!S!c!p!q#T#U#Y#ig!lvxz!S!c!p!q#T#U#Y#iQ}fR!z!OS|f!OR#c!w",
  nodeNames: "⚠ BlockComment Annotation BlockComment2 Annotation2 Script ImportList ImportStatement Import Identifier Modules StartProgram Function DefineType As BuiltIn CallParams NumericTerm Or And LTE LT COMP Not IFZ Ifzero BoolFunc Globals Number Succ Pred WhileStatement While BooleanTerm Do IterateStatement Iterate Times IfStatement If Then Else Block Begin End Continue Break ReturnStatement Return FunctionParams Prototype PrototipoType Execution StartExecution EndExecution EndProgram",
  maxTerm: 160,
  nodeProps: [
    ["closedBy", 43,"End"],
    ["openedBy", 44,"Begin"]
  ],
  skippedNodes: [0,1,2,3,4,56,57],
  repeatNodeCount: 5,
  tokenData: "%l~RiX^!ppq!pxy#eyz#r|}#w!O!P#|!Q![$R!]!^$Z!^!_$`!_!`$m!c!}$x#R#S$x#T#o$x#o#p%g#y#z!p$f$g!p%W%o$x%p&a$x&b&j$x#BY#BZ!p$IS$I_!p$I|$JO!p$JT$JU!p$KV$KW!p&FU&FV!p~!uY!a~X^!ppq!p#y#z!p$f$g!p#BY#BZ!p$IS$I_!p$I|$JO!p$JT$JU!p$KV$KW!p&FU&FV!p~#jP#Q~z{#m~#rO!f~~#wO#Y~~#|O#x~~$RO!m~~$WPl~!Q![$R~$`O!n~~$ePe~!_!`$h~$mOd~~$pP!_!`$s~$xOf~~$}WX~}!O$x!Q![$x!c!}$x#R#S$x#T#o$x%W%o$x%p&a$x&b&j$x~%lO!b~",
  tokenizers: [2, new LocalTokenGroup("r~RRYZ[!b!ca#q#rl~aO!d~~fQQ~!c!}a#T#oa~qO!e~~", 33, 65), new LocalTokenGroup("x~RRYZ[z{a!b!cl~aO!h~~dPyzg~lO!i~~qQS~!c!}l#T#ol~", 39, 69)],
  topRules: {"Script":[0,5]},
  specialized: [{term: 9, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 0
})
