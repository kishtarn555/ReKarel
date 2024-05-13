// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
const spec_Identifier = {__proto__:null,"iniciar-programa":50, "inicia-ejecucion":52, mientras:66, "si-es-cero":72, "junto-a-zumbador":74, "no-junto-a-zumbador":76, "frente-libre":78, "izquierda-libre":80, "derecha-libre":82, "frente-bloqueado":84, "izquierda-bloqueada":86, "derecha-bloqueada":88, "orientado-al-norte":90, "orientado-al-sur":92, "orientado-al-este":94, "orientado-al-oeste":96, "no-orientado-al-norte":98, "no-orientado-al-sur":100, "no-orientado-al-este":102, "no-orientado-al-oeste":104, "algun-zumbador-en-la-mochila":106, "ningun-zumbador-en-la-mochila":108, o:112, y:114, hacer:116, repetir:120, veces:122, si:126, entonces:128, inicio:130, fin:132, "termina-ejecucion":136, "finalizar-programa":138}
export const parser = LRParser.deserialize({
  version: 14,
  states: "(jOVQPOOOOQO'#C^'#C^O[QPOOOOQO'#Ca'#CaOaQPO'#C`OrQPOOOwQPO'#CyOOQO'#Cc'#CcO!VQPO'#C|OOQO'#Ci'#CiOOQO'#Ck'#CkO!VQPO'#DlO#gQPO'#CmOOQO'#Cx'#CxOOQO'#Cw'#CwO#nQPO,58zO#vQPO'#DiOOQO'#Cn'#CnOOQO'#Cq'#CqQOQPOOO#{QPO,59eOOQO'#Ce'#CeOOQO'#DP'#DPO!VQPO'#DPOOQO'#DO'#DOO$QQPO,59hO$]QPO'#CdO$bQPO,5:WOOQO,59X,59XO$mQPO,59XOOQO'#Co'#CoO$uQPO,59cOOQO'#Cp'#CpOOQO1G.f1G.fO%SQPO,5:TO%XQPO1G/PO%^QPO,59kOOQO'#Cf'#CfOOQO'#Cg'#CgOOQO'#De'#DeO!VQPO,59jOOQO'#Ch'#ChOaQPO1G/SO%iQPO,59OOOQO'#Cl'#ClOaQPO1G/rOOQO1G.s1G.sOOQO1G.}1G.}OOQO'#Cj'#CjOaQPO1G/oOOQO7+$k7+$kOOQO1G/V1G/VOOQO1G/U1G/UOOQO7+$n7+$nO%nQPO1G.jOOQO7+%^7+%^OOQO7+%Z7+%ZOOQO7+$U7+$U",
  stateData: "%s~OhOS~OiPO~OjRO~ORUOqVO!^XO!aYO!caO~O!gbO~OndO!emX!fmX!dmX~OngOtjOueOveOweOxeOyeOzeO{eO|eO}eO!OeO!PeO!QeO!ReO!SeO!TeO!UeO!VeO!WeO~O!dnO~PaO!eoO!fpO~OUrO~OUsO~O!YuO!ZvO![yO~On{O~O!YuO!ZvO!b|O~O!dnO!eoO~O!eka!fka!dka~PaO!_!QO~Oo!SO~Oo!TO!YuO!ZvO~OU!WO~Oo!ZO~O",
  goto: "%U!aPP!bP!e!hP!k!s!s!y!y#O#R#Z#^#f#i#q#y$P$SPPPPP$V$]#iPP#iP$m$yPPPPPPPPPPPPPPPPPPP%PPPP#iPP#iRQORTQRSQ]WS[oz}!RXfWZgxVwiktRzi]`S[oz}!RR!Rr]ZS[oz}!RR}k]]S[oz}!R][S[oz}!RQl[R!OmRq_RcTQ_SRm[S^S[Q!PoQ!VzQ!X}R!Y!RQiWQkZQtgR!UxXhWZgxVxikt",
  nodeNames: "⚠ Script StartProgram Identifier Execution StartExecution Number While IFZ BoolFunc Or And Do Iterate Times If Then Block Begin End EndExecution EndProgram",
  maxTerm: 69,
  nodeProps: [
    ["closedBy", 18,"End"],
    ["openedBy", 19,"Begin"]
  ],
  skippedNodes: [0],
  repeatNodeCount: 0,
  tokenData: "$[~RdX^!apq!axy#Uyz#Z!Q![#`!]!^#h!c!}#m#R#S#m#T#o#m#y#z!a$f$g!a%W%o#m%p&a#m&b&j#m#BY#BZ!a$IS$I_!a$I|$JO!a$JT$JU!a$KV$KW!a&FU&FV!a~!fYh~X^!apq!a#y#z!a$f$g!a#BY#BZ!a$IS$I_!a$I|$JO!a$JT$JU!a$KV$KW!a&FU&FV!a~#ZOn~~#`Oo~~#ePU~!Q![#`~#mO!e~~#rWR~}!O#m!Q![#m!c!}#m#R#S#m#T#o#m%W%o#m%p&a#m&b&j#m",
  tokenizers: [0],
  topRules: {"Script":[0,1]},
  specialized: [{term: 3, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 0
})
