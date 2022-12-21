import {EditorView} from "@codemirror/view"

type DownloadModal = {
    modal:string,
    confirm_btn:string,
    inputField:string,
    wrongCodeWarning: string
}

interface UiData {
    editor: EditorView,
    downloadModal: DownloadModal,
}

function confirmPrompt() {


}

const fileRegex = /^[a-zA-Z0-9._]+$/;
function setFileNameLink(modal: DownloadModal, editor:EditorView) {
    let newFilename: string = <string>$(modal.inputField).val();    
    if (!fileRegex.test(newFilename)) {
        $(modal.wrongCodeWarning).removeAttr("hidden");
        newFilename="code.txt";
    } else {
        $(modal.wrongCodeWarning).attr("hidden", "");
    }
    let blob = new Blob([editor.state.doc.toString()], { type: 'text/plain'});
    $(modal.confirm_btn).attr("href", window.URL.createObjectURL(blob));
    $(modal.confirm_btn).attr("download", newFilename);
}


function HookUpCommonUI(uiData: UiData) {
    
    $(uiData.downloadModal.modal).on('shown', ()=>setFileNameLink(uiData.downloadModal, uiData.editor));
    $(uiData.downloadModal.inputField).change(()=>setFileNameLink(uiData.downloadModal, uiData.editor))
}

export {HookUpCommonUI};