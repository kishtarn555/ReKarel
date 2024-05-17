// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
const spec_Identifier = {__proto__:null,move:78, turnleft:80, putbeeper:82, pickbeeper:84, turnoff:86, while:88, iszero:94, nextToABeeper:96, notNextToABeeper:98, frontIsClear:100, leftIsClear:102, rightIsClear:104, frontIsBlocked:106, leftIsBlocked:108, rightIsBlocked:110, facingNorth:112, facingSouth:114, facingEast:116, facingWest:118, notFacingNorth:120, notFacingSouth:122, notFacingEast:124, notFacingWest:126, anyBeepersInBeeperBag:128, noBeepersInBeeperBag:130, iterate:142, if:146, else:148}
export const parser = LRParser.deserialize({
  version: 14,
  states: "+|OYQPOOO_QPOOOOQO'#C`'#C`OdQPOOOOQO'#Cb'#CbOiQPO'#CaQOQPOOOqQQO'#CcOOQO'#Cw'#CwOiQPO'#DOOOQO'#Cv'#CvOvQPO'#DzOOQO'#DO'#DOO{QPO,58{O!QQPO,58}OOQO-E6u-E6uOOQO,59j,59jO!VQPO,5:fOOQO'#Cu'#CuOOQO1G.g1G.gO![QQO1G.iOdQPO1G0QOdQPO7+$TO!dQPO7+$TO#ZQQO'#CfOOQO7+%l7+%lOOQO<<Go<<GoOdQPO<<GoOOQO'#Ch'#ChO#bQPO'#DSOOQO'#Ck'#CkO#gQPO'#CjOOQO'#Cr'#CrOOQO'#Cs'#CsO#lQPO'#DvOOQO'#DR'#DROOQO'#Cx'#CxO#qQQO'#CgO{QPO,59QO#xQPO'#DtO!iQQO'#DROOQOAN=ZAN=ZO#}QPO,59nO$VQQO,59UO$VQQO,5:bOOQO-E6v-E6vOOQO1G.l1G.lO%jQPO,5:`OOQO,59m,59mOOQO1G/Y1G/YO%oQPO1G/YOOQO'#Cm'#CmOOQO'#Cn'#CnOOQO'#D['#D[O%tQPO'#D[O$VQQO'#D[OOQO'#Cq'#CqOOQO'#DZ'#DZO&SQPO1G.pO$VQQO'#DZO&_QPO'#ClO&dQPO1G/|O&oQPO1G/zOOQO7+$t7+$tO&tQPO,59vO&yQPO,59vOOQO'#Co'#CoOOQO'#Cp'#CpOOQO'#Dp'#DpO$VQQO,59uOOQO7+$[7+$[O'UQPO,59uO'aQPO,59WO!iQQO7+%hO!iQQO7+%fOOQO1G/b1G/bOOQO1G/a1G/aO'fQPO1G.rO'kQQO<<ISOOQO<<IQ<<IQOOQO7+$^7+$^OOQO'#Ct'#CtO!iQQOAN>nOOQOG24YG24Y",
  stateData: "(c~OoOSPOS~ORPO~OpQO~OqSO~OWVOpYO~OX^O~OsaO~O!mbO~OsdO~OteO~OXgOtfO~OtkO~OXmOqSOwlOxlOylOzlO{lO|nO!ipO!kqO~O!mZP~P!iOszO~Os{O~Os|O~O!mZX~P!iOs!PO~O]!SOt!RO~Os!XO!P!TO!Q!UO!R!UO!S!UO!T!UO!U!UO!V!UO!W!UO!X!UO!Y!UO!Z!UO![!UO!]!UO!^!UO!_!UO!`!UO!a!UO!b!UO!c!UO!g!YO~O]!`O~Ot!aO~Os!bOt!OX!e!OX!f!OX~Ot!hO!e!dO!f!eO~Os!jO~Ot!kO!e!dO!f!eO~Ot!lO~Ot!mO~Ot!mO!e!dO!f!eO~O!e!dO!f!eOt}a~O]!oO~Ot!rO~O!l!sOX!jyq!jyw!jyx!jyy!jyz!jy{!jy|!jy!i!jy!k!jy!m!jy~O",
  goto: "'U!oPPPP!p!s!v#UPP#Y#k#nP#v$O$W$_$f$m$m$s$z%S%[%_%e%i%oPPPPP%uPP%x&YPPPPPP&b&qPPPPPPPPPPPPPPPPPPP&xPPP&YP&YPPP'ORRPRURQTRchefhkux!k!l!tTWTXQieQjf[shux!k!l!tRykRvh]mhux!k!l!t]xhux!k!l!t]ohux!k!l!tZ!V{|!X!]!gZ!^{|!X!]!gZ!W{|!X!]!gX!f![!_!c!iZ!]{|!X!]!g]whux!k!l!t]rhux!k!l!tR!t!pQc]R!OvTZTXQXTR_XQuhR}uR]TSthuQ!QxQ!p!kQ!q!lR!u!t]shux!k!l!tQ![{Q!_|Q!c!XQ!i!]R!n!gZ!Z{|!X!]!gX!g![!_!c!iQ[TR`X",
  nodeNames: "⚠ Comment Script Class ProgramClass ScriptBlock Start Function Define Identifier Block InnerBlock BuiltIn Number WhileHeader While IFZ Ifzero BoolFunc Or And Not Iterate If Else End ProgramMain",
  maxTerm: 76,
  nodeProps: [
    ["closedBy", 6,"End"],
    ["openedBy", 25,"Start"]
  ],
  skippedNodes: [0,1],
  repeatNodeCount: 2,
  tokenData: "/|~RlX^!ypq!yqr#nvw#sxy$Oyz$T!P!Q$Y!Q![$w!c!}%P#T#V%P#V#W%b#W#X'r#X#d%P#d#e*n#e#j%P#j#k.O#k#o%P#o#p/g#p#q/l#q#r/w#y#z!y$f$g!y#BY#BZ!y$IS$I_!y$I|$JO!y$JT$JU!y$KV$KW!y&FU&FV!y~#OYo~X^!ypq!y#y#z!y$f$g!y#BY#BZ!y$IS$I_!y$I|$JO!y$JT$JU!y$KV$KW!y&FU&FV!y~#sO!g~~#vPvw#y~$OO!f~~$TOs~~$YOt~~$]P!P!Q$`~$eSP~OY$`Z;'S$`;'S;=`$q<%lO$`~$tP;=`<%l$`~$|P]~!Q![$wQ%USXQ!Q![%P!c!}%P#R#S%P#T#o%PR%gUXQ!Q![%P!c!}%P#R#S%P#T#`%P#`#a%y#a#o%PR&OTXQ!Q![%P!c!}%P#R#S%P#T#U&_#U#o%PR&dUXQ!Q![%P!c!}%P#R#S%P#T#g%P#g#h&v#h#o%PR&{UXQ!Q![%P!c!}%P#R#S%P#T#g%P#g#h'_#h#o%PR'fSRPXQ!Q![%P!c!}%P#R#S%P#T#o%PR'wUXQ!Q![%P!c!}%P#R#S%P#T#X%P#X#Y(Z#Y#o%PR(`UXQ!Q![%P!c!}%P#R#S%P#T#Y%P#Y#Z(r#Z#o%PR(wUXQ!Q![%P!c!}%P#R#S%P#T#]%P#]#^)Z#^#o%PR)`UXQ!Q![%P!c!}%P#R#S%P#T#b%P#b#c)r#c#o%PR)wUXQ!Q![%P!c!}%P#R#S%P#T#X%P#X#Y*Z#Y#o%PR*bSWPXQ!Q![%P!c!}%P#R#S%P#T#o%PR*sUXQ!Q![%P!c!}%P#R#S%P#T#f%P#f#g+V#g#o%PR+[UXQ!Q![%P!c!}%P#R#S%P#T#c%P#c#d+n#d#o%PR+sUXQ!Q![%P!c!}%P#R#S%P#T#Z%P#Z#[,V#[#o%PR,[UXQ!Q![%P!c!}%P#R#S%P#T#f%P#f#g,n#g#o%PR,sTXQ!Q![%P!c!}%P#R#S%P#T#U-S#U#o%PR-XUXQ!Q![%P!c!}%P#R#S%P#T#a%P#a#b-k#b#o%PR-rSXQpP!Q![%P!c!}%P#R#S%P#T#o%PR.TUXQ!Q![%P!c!}%P#R#S%P#T#c%P#c#d.g#d#o%PR.lUXQ!Q![%P!c!}%P#R#S%P#T#]%P#]#^/O#^#o%PR/TUXQ!Q![%P!c!}%P#R#S%P#T#W%P#W#X*Z#X#o%P~/lOq~~/oP#p#q/r~/wO!e~~/|O!m~",
  tokenizers: [0, 1],
  topRules: {"Script":[0,2]},
  specialized: [{term: 9, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 0
})
