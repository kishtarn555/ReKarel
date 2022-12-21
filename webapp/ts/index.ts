import { splitPanels } from "./split";
import { responsiveHack } from "./responsive-load";
import { createEditors } from "./editor";
import { GetDesktopUIHelper } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";

splitPanels();

var [destkopEditor, phoneEditor] = createEditors();
//TODO: ThisShouldnt be here
function hideElement(element:string) {
    $(element).addClass("d-none");
}
function showElement(element:string) {
    $(element).removeClass("d-none");    
}

let DesktopUI = GetDesktopUIHelper();
let PhoneUI = GetPhoneUIHelper({
    editor: phoneEditor,
    codeIndent: "#codeIndent",
    codeUnindent: "#codeUnindent",
    navToolbar: {
        "#codeTabBtn": () => "",
        "#worldTabBtn": () => "",
        "#execTabBtn": () => ""
    },
    codeTabToolbar: {
        "#codeAction": () => {
            showElement("#pascalAction");
            hideElement("#pascalFlow");
            hideElement("#pascalKeyword");
            return "";
        },
        "#codeFlow": () => {
            hideElement("#pascalAction");
            showElement("#pascalFlow");
            hideElement("#pascalKeyword");
            return "";
        },
        "#codeKeyword": () => {
            hideElement("#pascalAction");
            hideElement("#pascalFlow");
            showElement("#pascalKeyword");
            return "";
        }
    },
    simpleCodeInputs: {
        "#pAvanza":()=>"avanza;",
        "#pGira":()=>"gira-izquierda;",
        "#pCoge":()=>"coge-zumbador;",
        "#pDeja":()=>"deja-zumbador;",
        "#pApagate":()=>"apagate;",
        "#pSalir":()=>"sal-de-instruccion;",
    }
})

//Activate default states
PhoneUI.changeCodeToolbar("#codeAction");
PhoneUI.changeNavToolbar("#codeTabBtn");
//Hoock all UI
$("#infiniteBeepersBtn").click(DesktopUI.toggleInfinityBeepers);


$(document).ready(()=>{
    responsiveHack();
})
