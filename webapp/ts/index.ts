import { splitPanels } from "./split";
import { responsiveHack, SetResponsiveness, SetDesktopView, SetPhoneView } from "./responsive-load";
import { createEditors } from "./editor";
import { GetDesktopUIHelper } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";
import { HookUpCommonUI, SetText } from "./common-ui";

splitPanels();

var [destkopEditor, phoneEditor] = createEditors();
//TODO: ThisShouldnt be here
function hideElement(element:string) {
    $(element).addClass("d-none");
}
function showElement(element:string) {
    $(element).removeClass("d-none");    
}
const pascalConfirm = {
    accept: ()=>{
        SetText(
            destkopEditor, 
            "iniciar-programa\n\tinicia-ejecucion\n\t\t{ TODO poner codigo aqui }\n\t\tapagate;\n\ttermina-ejecucion\nfinalizar-programa"
        ); 
    },
    message:"¡Perderás todo el código no guardado!",
    title: "Nuevo código Pascal",
    reject: ()=>{ },
};
const javaConfirm = {
    accept: ()=>{
        SetText(
            destkopEditor, 
            "class program {\n\tprogram () {\n\t\t// TODO poner codigo aqui \n\t\tturnoff();\n\t}\n}"
        ); 
    },
    message:"¡Perderás todo el código no guardado!",
    title: "Nuevo código Java",
    reject: ()=>{ },
};
HookUpCommonUI(
    {
        editor:destkopEditor,
        downloadModal: {
            modal: "#saveCodeModal",
            confirmBtn: "#downloadCodeBtn",
            inputField: "#codeName",
            wrongCodeWarning:"#wrongCodeName",
        },
        confirmModal: {
            modal: "#confirmModal",
            titleField: "#confirmModalTitle",
            messageField: "#confirmModalMessage",
            confirmBtn: "#confirmModalYes",
            rejectBtn: "#confirmModalNo",
        },
        confirmCallers: [
            {
                button: "#newJavaCodeNavBtn",
                data: javaConfirm
            },            
            {
                button: "#newPascalCodeNavBtn",
                data: pascalConfirm
            },
            {
                button: "#newJavaCodeBtn",
                data: javaConfirm
            },
            {
                button: "#newPascalCodeBtn",
                data: pascalConfirm
            },
        ]
    }
)
let DesktopUI = GetDesktopUIHelper();
let PhoneUI = GetPhoneUIHelper({
    editor: phoneEditor,
    mainEdtior: destkopEditor,
    codeTab: {
        indent: "#codeIndent",
        unindent: "#codeUnindent",
        undo: "#codeUndo",
        redo: "#codeRedo",
        toolbar: {
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
    },
    navToolbar: {
        "#codeTabBtn": () => "",
        "#worldTabBtn": () => "",
        "#execTabBtn": () => ""
    },
    
})

//Activate default states
PhoneUI.changeCodeToolbar("#codeAction");
PhoneUI.changeNavToolbar("#codeTabBtn");
//Hoock all UI
$("#infiniteBeepersBtn").click(DesktopUI.toggleInfinityBeepers);

type AppSettings = {
    interface : "auto" | "desktop" | "mobile"
}

let appSettings: AppSettings = {
    interface : "auto"
}


function applySettings(settings: AppSettings) {
    switch (settings.interface) {
        case "auto":
            SetResponsiveness();
            break;
        case "desktop":
            SetDesktopView();
            break;
        case "mobile":
            SetPhoneView();
            break;
        default:
            SetDesktopView();
            break;
    }
}

function setSettings(event: Event) {
    switch ($("#settingsForm select[name=interface]").val()) {
        case "desktop":
            appSettings.interface=  "desktop";
            break;
        case "mobile":
                appSettings.interface=  "mobile";
                break;
        case "auto":
        default:
            appSettings.interface=  "auto";
            break;
    }
    console.log(appSettings);
    applySettings(appSettings);
    event.preventDefault();
    return false;
}
$(document).ready(()=>{
    $("#settingsForm").on("submit", setSettings)
    responsiveHack();
    applySettings({ interface: "auto"});
    //THIS NEEDS TO BE MOVED
    $("#worldContainer").scroll(()=> {
        console.log("lol");
        let x = $("#worldContainer").scrollLeft();
        let y = $("#worldContainer").scrollTop();
    });
})


