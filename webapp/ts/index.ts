import { splitPanels } from "./split";
import { setLanguage, SetText } from "./editor/editor";
import { DesktopController } from "./desktop/desktop-ui";
import { GetPhoneUIHelper } from "./phone-ui";
import { HookUpCommonUI } from "./common-ui";
import { World } from "../../js/karel";
import { karel } from "../../js";
import { KarelController } from "./KarelController";
import { responsiveHack } from "./responsive-load";
import { InitSettings, StartSettings } from "./settings";
import { getEditors } from "./editor/editorsInstances";
import { HookSession, RestoreSession } from "./session";


var [desktopEditor, phoneEditor] = getEditors();
//TODO: ThisShouldnt be here
function hideElement(element: string) {
    $(element).addClass("d-none");
}
function showElement(element: string) {
    $(element).removeClass("d-none");
}


let KarelWorld: World = new World(100, 100);
let karelController = new KarelController(KarelWorld, desktopEditor);

const pascalConfirm = {
    accept: () => {
        SetText(
            desktopEditor,
            "iniciar-programa\n\tinicia-ejecucion\n\t\t{ TODO poner codigo aqui }\n\t\tapagate;\n\ttermina-ejecucion\nfinalizar-programa"
        );
        setLanguage(desktopEditor, "pascal");
    },
    message: "¡Perderás todo el código no guardado!",
    title: "Nuevo código Pascal",
    reject: () => { },
};
const javaConfirm = {
    accept: () => {
        SetText(
            desktopEditor,
            "class program {\n\tprogram () {\n\t\t// TODO poner codigo aqui \n\t\tturnoff();\n\t}\n}"
        );
        setLanguage(desktopEditor, "java");
    },
    message: "¡Perderás todo el código no guardado!",
    title: "Nuevo código Java",
    reject: () => { },
};

const newWorldConfirm = {
    accept: () => {
        karelController.NewWorld();
    },
    message: "¡Perderás todo lo del mundo no guardado!",
    title: "Nuevo mundo",
    reject: () => { },
};




function debugWorld() {
    KarelWorld.resize(90, 105);
    KarelWorld.move(12, 19);
    KarelWorld.rotate('OESTE');
    for (let k = 0; k < 4; k++) {
        KarelWorld.addWall(5 + k, 5 + k * 2, k);
        KarelWorld.addWall(2, 2, k);
        KarelWorld.setDumpCell(
            1, k + 1, true
        )
    }
    KarelWorld.setBuzzers(9, 12, 13);
}

// let DesktopUI = GetDesktopUIHelper(KarelWorld);
let DesktopUI = new DesktopController(
    {
        desktopEditor,
        worldCanvas: $("#worldCanvas"),
        worldContainer: $("#worldContainer"),
        controlBar: {
            execution: {
                reset: $("#desktopResetKarel"),
                compile: $("#desktopCompileKarel"),
                run: $("#dekstopRunKarel"),
                step: $("#desktopStepProgram"),
                future: $("#desktopFutureProgram"),
            },
            beeperInput: $("#beeperBag"),
            infiniteBeeperInput: $("#infiniteBeepersBtn"),
            delayInput: $("#delayPanel"),
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
            focus: {
                karel: $("#desktopGoKarel"),
                origin: $("#desktopGoHome"),
                selector: $("#desktopGoSelection"),
            },
            evaluate: {
                evaluate: $("#desktopEvaluateCell"),
                ignore: $("#desktopIgnoreCell"),
            }
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
            evaluate: {
                evaluate: $("#contextEvaluateCell"),
                ignore: $("#contextIgnoreCell"),
            }
        },
        gizmos: {
            selectionBox: {
                main: $("#desktopBoxSelect")[0],
                bottom: $("#desktopBoxSelect [name='bottom']")[0],
                top: $("#desktopBoxSelect [name='top']")[0],
                left: $("#desktopBoxSelect [name='left']")[0],
                right: $("#desktopBoxSelect [name='right']")[0],
                cursor: $("#desktopBoxSelect [name='cursor']")[0],
            },
            HorizontalScrollElement: $("#worldScrolledContainerHorizontal"),
            VerticalScrollElement: $("#worldScrolledContainerVertical"),
        },
        worldZoom: $("#zoomDekstop"),
        console: {
            console: $("#desktopConsole"),
            clear: $("#desktopClearConsole"),
            parent: $("#ExecDataContent")
        },
        callStack: {
            panel : $("#pilaTab")
        }
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
            "#pAvanza": () => "avanza;",
            "#pGira": () => "gira-izquierda;",
            "#pCoge": () => "coge-zumbador;",
            "#pDeja": () => "deja-zumbador;",
            "#pApagate": () => "apagate;",
            "#pSalir": () => "sal-de-instruccion;",
        }
    },
    navToolbar: {
        "#codeTabBtn": () => "",
        "#worldTabBtn": () => "",
        "#execTabBtn": () => ""
    },

});


HookUpCommonUI(
    {
        editor: desktopEditor,
        downloadCodeModal: {
            modal: "#saveCodeModal",
            confirmBtn: "#downloadCodeBtn",
            inputField: "#codeName",
            wrongCodeWarning: "#wrongCodeName",
        },
        resizeModal: {
            modal: "#resizeWorldModal",
            confirmBtn: "#resizeBtn",
            rowField: "#rowField",
            columnField: "#columnField",
        },
        evaluatorModal: {
            modal:$("#evaluatorModal"),
            form:$("#evaluatorForm"),
            evaluatePosition:$("#evaluatePosition"),
            evaluateBag:$("#evaluateBag"),
            evaluateOrientation:$("#evaluateOrientation"),
            evaluateUniverse:$("#evaluateUniverse"),
            countMoves:$("#countMoves"),
            countPicks:$("#countPicks"),
            countPuts:$("#countPuts"),
            countTurns:$("#countTurns"),
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
            {
                button: "#newWorldBtn",
                data: newWorldConfirm
            },
        ],
        amountModal: {
            modal: "#ammountModal",
            confirmBtn: "#btnSetAmount",
            inputField: "#beeperCountInput",

        },
        wordSaveModal: {
            inputBtn:"#downloadWorldIn",
            outputBtn:"#downloadWorldOut",
            confirmBtn:"#saveWorldBtn",
            inputField:"#worldName",
            worldData:"#worldData",
            wrongWorldWaring:"#wrongWorldName",
        },
        navbar: {
            openCode: "#openCodeBtn",
            openWorldIn: "#openWorldInBtn"
        },
        karelController: karelController,
        worldController: DesktopUI.worldController
    }
)

splitPanels(DesktopUI.ResizeCanvas.bind(DesktopUI));

//Activate default states
PhoneUI.changeCodeToolbar("#codeAction");
PhoneUI.changeNavToolbar("#codeTabBtn");


$(document).ready(() => {
    HookSession();
    InitSettings(DesktopUI);
    responsiveHack();
    DesktopUI.Init();
    StartSettings(DesktopUI);
    RestoreSession();
})
