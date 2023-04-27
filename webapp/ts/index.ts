import { splitPanels } from "./split";
import { responsiveHack, SetResponsiveness, SetDesktopView, SetPhoneView } from "./responsive-load";
import { createEditors } from "./editor";
import { DesktopController } from "./desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";
import { HookUpCommonUI, SetText } from "./common-ui";
import { World } from "../../js/karel";
import { karel } from "../../js";
import { KarelController } from "./KarelController";


var [desktopEditor, phoneEditor] = createEditors();
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
            desktopEditor, 
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
            desktopEditor, 
            "class program {\n\tprogram () {\n\t\t// TODO poner codigo aqui \n\t\tturnoff();\n\t}\n}"
        ); 
    },
    message:"¡Perderás todo el código no guardado!",
    title: "Nuevo código Java",
    reject: ()=>{ },
};
HookUpCommonUI(
    {
        editor:desktopEditor,
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
let karelController = new  KarelController(KarelWorld, desktopEditor);

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

// let DesktopUI = GetDesktopUIHelper(KarelWorld);
let DesktopUI = new DesktopController(
    {
        worldCanvas: $("#worldCanvas"),
        worldContainer: $("#worldContainer"),
        controlBar: {
            execution: {
                reset: $("#desktopResetKarel"),
                compile: $("#desktopCompileKarel"),
                run: $("#dekstopRunKarel"),
                step: $("#desktopStepProgram"),
                future: $("#desktopFutureProgram"),
            }
        },
        toolbar: {
            karel: {
                north: $("#desktopKarelNorth"),
                east: $("#desktopKarelEast"),
                south: $("#desktopKarelSouth"),
                west: $("#desktopKarelWest"),
            },
            beepers: {
                addOne: $("#desktopAddBeeper"),
                removeOne: $("#desktopDecrementBeeper"),
                infinite: $("#desktopSetInfinite"),
                ammount: $("#desktopSetAmmount"),                
                clear: $("#desktopRemoveAll"),
            },            
            wall: {
                north: $("#desktopNorthWall"),
                east: $("#desktopEastWall"),
                south: $("#desktopSouthWall"),
                west: $("#desktopWestWall"),
                outside: $("#desktopOuterWall"),
            },
            focus:  {
                karel: $("#desktopGoKarel"),
                origin: $("#desktopGoHome"),
                selector: $("#desktopGoSelection"),
            },
        },
        context: {
            toggler: $("#contextMenuToggler"),
            container: $("#contextMenuDiv"),
            beepers: {
                addOne: $("#contextAddBeeper"),
                removeOne: $("#contextDecrementBeeper"),
                infinite: $("#contextSetInfinite"),
                ammount: $("#contextSetAmmount"),                
                clear: $("#contextRemoveAll"),
            },            
            karel: {
                north: $("#contextKarelNorth"),
                east: $("#contextKarelEast"),
                south: $("#contextKarelSouth"),
                west: $("#contextKarelWest"),
            },
            wall: {                
                north: $("#contextNorthWall"),
                east: $("#contextEastWall"),
                south: $("#contextSouthWall"),
                west: $("#contextWestWall"),
                outside: $("#contextOuterWall"),
            },
        },
        gizmos: {
            selectionBox: {
                main: $("#desktopBoxSelect")[0],
                bottom: $("#desktopBoxSelect [name='bottom']")[0],
                top: $("#desktopBoxSelect [name='top']")[0],
                left: $("#desktopBoxSelect [name='left']")[0],
                right: $("#desktopBoxSelect [name='right']")[0],
            }
        },
        worldZoom: $("#zoomDekstop")
    },
    karelController
);
let PhoneUI = GetPhoneUIHelper({
    editor: phoneEditor,
    mainEdtior: desktopEditor,
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
    
});


splitPanels(DesktopUI.ResizeCanvas.bind(DesktopUI));

//Activate default states
PhoneUI.changeCodeToolbar("#codeAction");
PhoneUI.changeNavToolbar("#codeTabBtn");

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
        DesktopUI.ResizeCanvas();
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
    DesktopUI.Init();
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

