import { splitPanels } from "./split";
import { responsiveHack } from "./responsive-load";
import { createEditors } from "./editor";
import { GetDesktopUIHelper } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";
import { HookUpCommonUI } from "./common-ui";

splitPanels();

var [destkopEditor, phoneEditor] = createEditors();
//TODO: ThisShouldnt be here
function hideElement(element:string) {
    $(element).addClass("d-none");
}
function showElement(element:string) {
    $(element).removeClass("d-none");    
}

HookUpCommonUI(
    {
        editor:destkopEditor,
        downloadModal: {
            modal: "#saveCodeModal",
            confirm_btn: "#downloadCodeBtn",
            inputField: "#codeName",
            wrongCodeWarning:"#wrongCodeName",
        },
    }
)
let DesktopUI = GetDesktopUIHelper();
let PhoneUI = GetPhoneUIHelper({
    editor: phoneEditor,
    codeIndent: "#codeIndent",
    codeUnindent: "#codeUnindent",
    navToolbar: {
        "#codeTabBtn": () => "",
        "#worldTabBtn": () => "",
        "#execTabBtn": () => "",
        "#settingTabBtn": () => ""
    },
    codeTabToolbar: {
        "#codeEdit": () => {                        
            hideElement("#editToolbar");
            hideElement("#pascalAction");
            hideElement("#pascalFlow");
            hideElement("#pascalKeyword");

            showElement("#editToolbar");
            return "";
        },
        "#codeAction": () => {                        
            hideElement("#editToolbar");
            hideElement("#pascalAction");
            hideElement("#pascalFlow");
            hideElement("#pascalKeyword");

            showElement("#pascalAction");
            return "";
        },
        "#codeFlow": () => {            
            hideElement("#editToolbar");
            hideElement("#pascalAction");
            hideElement("#pascalFlow");
            hideElement("#pascalKeyword");
            
            showElement("#pascalFlow");
            return "";
        },
        "#codeKeyword": () => {            
            hideElement("#editToolbar");
            hideElement("#pascalAction");
            hideElement("#pascalFlow");
            hideElement("#pascalKeyword");

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
