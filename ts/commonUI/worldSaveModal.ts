import { KarelController } from "../KarelController";

export type WorldSaveModal = {
    inputBtn:string,
    outputBtn:string,
    worldData:string,
    inputField:string,
    wrongWorldWaring:string
    confirmBtn:string , 
} 

let defaultFileName = "world.in"

function setWorldData(data:string, modal:WorldSaveModal) {
    $(modal.worldData).val(data)
    let blob = new Blob([data], { type: 'text/plain'});
    $(modal.confirmBtn).attr("href", window.URL.createObjectURL(blob));

}

function setInputWorld(modal:WorldSaveModal, karelController: KarelController) {
    defaultFileName = "world.in";
    const filename = $(modal.inputField).val() as string;
    $(modal.inputField).val(filename.replace(/\.out$/, ".in"));
    setFileNameLink(modal);

    const input = karelController.world.save("start");
    $(modal.worldData).val(input);
    setWorldData(input, modal);
}


function setOutputWorld(modal:WorldSaveModal, karelController: KarelController) {
    defaultFileName = "world.out";
    const filename = $(modal.inputField).val() as string;
    $(modal.inputField).val(filename.replace(/\.in$/, ".out"));
    setFileNameLink(modal);
    let result = KarelController.GetInstance().Compile(false);
    let output;
    $(modal.worldData).val("Procesando...");
    if (result == null) {
        output = "ERROR DE COMPILACION";
    } else {
        
        KarelController.GetInstance().RunTillEnd(false).then(()=> {
            if (KarelController.GetInstance().EndedOnError()) {
                output = "ERROR DE EJECUCION"
            } else {
                output = karelController.world.output();
            }
            $(modal.worldData).val(output);
            setWorldData(output, modal);
        })
    }
}

const fileRegex = /^[a-zA-Z0-9._]+$/;
function setFileNameLink(modal: WorldSaveModal) {
    let newFilename: string = <string>$(modal.inputField).val();    
    if (!fileRegex.test(newFilename)) {
        $(modal.wrongWorldWaring).removeAttr("hidden");
        newFilename=defaultFileName;
    } else {
        $(modal.wrongWorldWaring).attr("hidden", "");
    }
    
    $(modal.confirmBtn).attr("download", newFilename);
}

export function HookWorldSaveModal(modal:WorldSaveModal, karelController:KarelController) {
    $(modal.inputBtn).on("click", ()=>setInputWorld(modal,karelController) );
    $(modal.outputBtn).on("click", ()=>setOutputWorld(modal,karelController) );

    $(modal.inputField).on("change", ()=>{setFileNameLink(modal)});
}