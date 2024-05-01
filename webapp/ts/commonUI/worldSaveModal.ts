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

function setWorldData(data:string, fileName:string, modal:WorldSaveModal) {
    $(modal.worldData).val(data)
    let blob = new Blob([data], { type: 'text/plain'});
    $(modal.confirmBtn).attr("href", window.URL.createObjectURL(blob));
    $(modal.confirmBtn).attr("download", fileName);

}

function setInputWorld(modal:WorldSaveModal, worldController: WorldController) {
    defaultFileName = "world.in"
    const filename = $(modal.inputField).val() as string
    $(modal.inputField).val(filename.replace(/\.out$/, ".in"));
    const input = `${worldController.world}`

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
}