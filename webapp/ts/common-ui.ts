import bootstrap from 'bootstrap'
import {EditorView} from "@codemirror/view"

type DownloadModal = {
    modal:string,
    confirmBtn:string,
    inputField:string,
    wrongCodeWarning: string
}

type ConfirmModal = {
    modal: string,
    confirmBtn: string,
    rejectBtn: string,
    titleField: string,
    messageField: string
}

type ConfirmData = {
    title:string,
    message: string,
    accept: ()=>void,
    reject: ()=>void,
}

type ConfimModalBtn = {
    button: string,
    data: ConfirmData,
}

interface UiData {
    editor: EditorView,
    downloadModal: DownloadModal,
    confirmModal: ConfirmModal,
    confirmCallers: Array<ConfimModalBtn>,
    
}
interface ConfirmPromptArgs {
    modalData: ConfirmData,
    uiData: UiData,
}
function confirmPrompt(evenet) {
    let data: ConfirmPromptArgs = evenet.data
    
    $(data.uiData.confirmModal.titleField).html(data.modalData.title);
    $(data.uiData.confirmModal.messageField).html(data.modalData.message);

    $(data.uiData.confirmModal.confirmBtn).on(
        "click",
        data.modalData.accept
    );
    $(data.uiData.confirmModal.rejectBtn).on(
        "click",
        data.modalData.reject
    );

    let modal = new bootstrap.Modal($(data.uiData.confirmModal.modal).get(0)); 
    modal.show();
}


function confirmPromptEnd(event) {
    let data: ConfirmPromptArgs = event.data

    $(data.uiData.confirmModal.confirmBtn).off(
        "click",
        data.modalData.accept
    )

    $(data.uiData.confirmModal.rejectBtn).off(
        "click",
        data.modalData.reject
    )
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
    $(modal.confirmBtn).attr("href", window.URL.createObjectURL(blob));
    $(modal.confirmBtn).attr("download", newFilename);
}

function HookUpCommonUI(uiData: UiData) {
    
    $(uiData.downloadModal.modal).on('show.bs.modal', ()=>setFileNameLink(uiData.downloadModal, uiData.editor));
    $(uiData.downloadModal.inputField).change(()=>setFileNameLink(uiData.downloadModal, uiData.editor));

    //Hook ConfirmCallers
    uiData.confirmCallers.forEach((confirmCaller)=> {
        let confirmArgs: ConfirmPromptArgs = {            
                uiData: uiData,
                modalData: confirmCaller.data,            
        };
        $(confirmCaller.button).on(
            'click',
            null,
            confirmArgs,
            confirmPrompt,
            
            );        
        $(uiData.confirmModal.modal).on(
            'hidden.bs.modal',
            null,
            confirmArgs,
            confirmPromptEnd,
            )
    });
}
function SetText(editor: EditorView, message:string) {
    let transaction = editor.state.update({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert:message
        }
    })
    editor.dispatch(transaction);
}

const ERRORCODES = {
    WALL: 'Karel ha chocado con un muro!',
    WORLDUNDERFLOW:
      'Karel intentó tomar zumbadores en una posición donde no había!',
    BAGUNDERFLOW:
      'Karel intentó dejar un zumbador pero su mochila estaba vacía!',
    INSTRUCTION: 'Karel ha superado el límite de instrucciones!',
    STACK: 'La pila de karel se ha desbordado!',
};

export {HookUpCommonUI,SetText, ERRORCODES};