import bootstrap from 'bootstrap'
import {EditorView} from "@codemirror/view"
import { ConfirmData, ConfirmModal, ConfirmPromptArgs, confirmPrompt, confirmPromptEnd, ConfirmModalBtn } from './commonUI/confirmPrompt'
import { DownloadCodeModal,hookDownloadModel } from './commonUI/downloadCodeModel'
import { HookResizeModal, ResizeModal } from './commonUI/resizeModel'
import { KarelController } from './KarelController'
import { AmountModal, HookAmountModal } from './commonUI/amountModal'
import { WorldViewController } from './worldViewController/worldViewController'
import { HookWorldSaveModal, WorldSaveModal } from './commonUI/worldSaveModal'
import { HookNavbar, NavbarData } from './commonUI/navbar'
import { HookStyleModal } from './commonUI/karelStyleModal'



interface UiData {
    editor: EditorView,
    downloadCodeModal: DownloadCodeModal,
    resizeModal:ResizeModal,
    confirmModal: ConfirmModal,
    wordSaveModal:WorldSaveModal,
    amountModal: AmountModal,
    confirmCallers: Array<ConfirmModalBtn>,
    karelController:KarelController,
    worldController: WorldViewController,
    navbar:NavbarData
    
}



function HookUpCommonUI(uiData: UiData) {
    
    hookDownloadModel(uiData.downloadCodeModal, uiData.editor);
    HookAmountModal(uiData.amountModal, uiData.worldController);
    HookWorldSaveModal(uiData.wordSaveModal, uiData.karelController);
    HookNavbar(uiData.navbar, uiData.editor, uiData.karelController);
    HookStyleModal(uiData.worldController);
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


const ERRORCODES = {
    WALL: 'Karel ha chocado con un muro!',
    WORLDUNDERFLOW:
      'Karel intentó tomar zumbadores en una posición donde no había!',
    BAGUNDERFLOW:
      'Karel intentó dejar un zumbador pero su mochila estaba vacía!',
    INSTRUCTION: 'Karel ha superado el límite de instrucciones!',
    STACK: 'La pila de karel se ha desbordado!',
};

export {HookUpCommonUI, ERRORCODES, UiData};