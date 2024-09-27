import { KarelController } from "../KarelController";

export type WorldSaveModal = {
    worldDataIn:string,
    worldDataOut:string,
    nameField:string,
    modal:string,
    wrongNameWaring:string
    inputBtn:string, 
    outputBtn:string, 
} 

let defaultFileName = "world.in"

function setWorldData(data:string, textBox:string, btn: string) {
    $(textBox).val(data)
    let blob = new Blob([data], { type: 'text/plain'});
    $(btn).attr("href", window.URL.createObjectURL(blob));

}

function setInputWorld(modal:WorldSaveModal, karelController: KarelController) {
    defaultFileName = "world.in";
    const filename = $(modal.nameField).val() as string;
    $(modal.nameField).val(filename.replace(/\.out$/, ".in"));
    setFileNameLink(modal);

    const input = karelController.world.save("start");
    setWorldData(input, modal.worldDataIn, modal.inputBtn);
}


function setOutputWorld(modal:WorldSaveModal, karelController: KarelController) {
    defaultFileName = "world.out";
    const filename = $(modal.nameField).val() as string;
    $(modal.nameField).val(filename.replace(/\.in$/, ".out"));
    setFileNameLink(modal);
    let result = KarelController.GetInstance().Compile(false);
    let output;
    $(modal.worldDataOut).val("Procesando...");
    if (result == null) {
        output = "ERROR DE COMPILACION";
    } else {
        
        KarelController.GetInstance().RunTillEnd(false).then(()=> {
            if (KarelController.GetInstance().EndedOnError()) {
                output = "ERROR DE EJECUCION"
            } else {
                output = karelController.world.output();
            }
            setWorldData(output, modal.worldDataOut, modal.outputBtn);
        })
    }
}

const fileRegex = /^[a-zA-Z0-9._]+$/;
function setFileNameLink(modal: WorldSaveModal) {
    let newFilename: string = <string>$(modal.nameField).val();    
    if (!fileRegex.test(newFilename)) {
        $(modal.wrongNameWaring).removeAttr("hidden");
        newFilename=defaultFileName;
    } else {
        $(modal.wrongNameWaring).attr("hidden", "");
    }
    
    $(modal.inputBtn).attr("download", newFilename+".in");
    $(modal.outputBtn).attr("download", newFilename+".out");
}

export function HookWorldSaveModal(modal:WorldSaveModal, karelController:KarelController) {
    $(modal.modal).on("show.bs.modal", ()=>{
        setInputWorld(modal,karelController) 
        setOutputWorld(modal,karelController) 
    });
    

    $(modal.nameField).on("change", ()=>{setFileNameLink(modal)});
}