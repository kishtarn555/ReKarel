import { splitPanels } from "./split";
import { responsiveHack, SetResponsiveness, SetDesktopView, SetPhoneView } from "./responsive-load";
import { createEditors } from "./editor";
import { GetDesktopUIHelper, ToggleConextMenu, ResizeDesktopCanvas } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";
import { HookUpCommonUI, SetText } from "./common-ui";
import { World } from "../../js/karel";
import { karel } from "../../js";

splitPanels(ResizeDesktopCanvas);

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

let KarelWorld: World = new World(100, 100);

function debugWorld () {
    KarelWorld.resize(90, 105);
    KarelWorld.move(12, 19);
    KarelWorld.rotate('OESTE');
    for (let k =0; k < 4; k++) {
        KarelWorld.addWall(5+k, 5+k*2, k);
        KarelWorld.addWall(2, 2, k);
        KarelWorld.setDumpCell(
            1, k+1, true
        )
    }
    KarelWorld.setBuzzers(9,12, 13);
    console.log("test");
}

let DesktopUI = GetDesktopUIHelper(KarelWorld);
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

type fontSizes = number;
type responsiveInterfaces = "auto" | "desktop" | "mobile";

type AppSettings = {
    interface : responsiveInterfaces,
    editorFontSize: fontSizes,
}

let appSettings: AppSettings = {
    interface : "auto",
    editorFontSize: 12
}

function isFontSize(str: number): str is fontSizes {
    return 6 < str && str < 31;
}
function isResponsiveInterfaces(str: string): str is responsiveInterfaces {
    return ["auto" , "desktop" , "mobile"].indexOf(str)>-1;
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
    $(":root")[0].style.setProperty("--editor-font-size", `${settings.editorFontSize}pt`);
    if (settings.interface== "desktop")
        ResizeDesktopCanvas();
}

function setSettings(event: Event) {
    let interfaceType = <string>$("#settingsForm select[name=interface]").val();
    let fontSize = <number>$("#settingsForm input[name=fontSize]").val();
    console.log(fontSize);
    if (isResponsiveInterfaces(interfaceType)) {
        appSettings.interface= interfaceType;
    }
    if (isFontSize(fontSize)) {
        appSettings.editorFontSize= fontSize;
    }
    
    console.log(appSettings);
    applySettings(appSettings);
    event.preventDefault();
    return false;
}
$(document).ready(()=>{
    debugWorld();
    $("#settingsForm").on("submit", setSettings)
    responsiveHack();
    applySettings(appSettings);    
    DesktopUI.ResizeDesktopCanvas();
    DesktopUI.controller.Update();
})


$(document).on("keydown", (e)=> {
    if (e.ctrlKey && e.which === 75) {
        let fontSize = appSettings.editorFontSize;
        fontSize--;
        if (fontSize < 7) fontSize=7;
        appSettings.editorFontSize= fontSize;
        applySettings(appSettings);
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.which === 76) {
        let fontSize = appSettings.editorFontSize;
        fontSize++;
        if (fontSize > 30) fontSize=30;
        appSettings.editorFontSize= fontSize;        
        applySettings(appSettings);
        e.preventDefault();
        return false;
    }
    
});