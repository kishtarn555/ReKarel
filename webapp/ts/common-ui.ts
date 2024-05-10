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
import { EvaluatorData, HookEvaluatorModal } from './commonUI/evaluatorModal'



interface UiData {
    editor: EditorView,
    downloadCodeModal: DownloadCodeModal,
    resizeModal:ResizeModal,
    confirmModal: ConfirmModal,
    wordSaveModal:WorldSaveModal,
    amountModal: AmountModal,
    evaluatorModal:EvaluatorData
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
    HookEvaluatorModal(uiData.evaluatorModal);
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



export {HookUpCommonUI, UiData};