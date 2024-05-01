import bootstrap from 'bootstrap'
import {EditorView} from "@codemirror/view"
import { ConfirmData, ConfirmModal, ConfirmPromptArgs, confirmPrompt, confirmPromptEnd, ConfirmModalBtn } from './commonUI/confirmPrompt'
import { DownloadCodeModal,hookDownloadModel } from './commonUI/downloadCodeModel'
import { HookResizeModal, ResizeModal } from './commonUI/resizeModel'
import { KarelController } from './KarelController'
import { AmountModal, HookAmountModal } from './commonUI/amountModal'
import { WorldController } from './worldController'


interface UiData {
    editor: EditorView,
    downloadCodeModal: DownloadCodeModal,
    resizeModal:ResizeModal,
    confirmModal: ConfirmModal,
    amountModal: AmountModal,
    confirmCallers: Array<ConfirmModalBtn>,
    karelController:KarelController,
    worldController: WorldController,
    
}



function HookUpCommonUI(uiData: UiData) {
    
    hookDownloadModel(uiData.downloadCodeModal, uiData.editor);
    HookAmountModal(uiData.amountModal, uiData.worldController);

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

    HookResizeModal(uiData.resizeModal, uiData.karelController);
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

export {HookUpCommonUI,SetText, ERRORCODES, UiData};