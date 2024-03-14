import { EditorView } from "codemirror";

export type DownloadModal = {
    modal:string,
    confirmBtn:string,
    inputField:string,
    wrongCodeWarning: string
}


const fileRegex = /^[a-zA-Z0-9._]+$/;
export function setFileNameLink(modal: DownloadModal, editor:EditorView) {
    let newFilename: string = <string>$(modal.inputField).val();    
    if (!fileRegex.test(newFilename)) {
        $(modal.wrongCodeWarning).removeAttr("hidden");
        newFilename="code.txt";
    } else {
        $(modal.wrongCodeWarning).attr("hidden", "");
    }
    let blob = new Blob([editor.state.doc.toString()], { type: 'text/plain'});
    $(modal.confirmBtn).attr("href", window.URL.createObjectURL(blob));
    $(modal.confirmBtn).attr("download", newFilename);
}