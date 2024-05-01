import { WorldController } from "../worldController";

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

function setInputWorld(modal:WorldSaveModal, worldController: WorldController) {
    defaultFileName = "world.in";
    const filename = $(modal.inputField).val() as string;
    $(modal.inputField).val(filename.replace(/\.out$/, ".in"));
    setFileNameLink(modal);

    const input = worldController.world.save();
    $(modal.worldData).val(input);
    setWorldData(input, modal);
}


function setOutputWorld(modal:WorldSaveModal, worldController: WorldController) {
    defaultFileName = "world.out";
    const filename = $(modal.inputField).val() as string;
    $(modal.inputField).val(filename.replace(/\.in$/, ".out"));
    setFileNameLink(modal);

    const output = worldController.world.output();
    $(modal.worldData).val(output);
    setWorldData(output, modal);
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

export function HookWorldSaveModal(modal:WorldSaveModal, worldController:WorldController) {
    $(modal.inputBtn).on("click", ()=>setInputWorld(modal,worldController) );
    $(modal.outputBtn).on("click", ()=>setOutputWorld(modal,worldController) );
}