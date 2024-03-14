import { KarelController } from "../KarelController"

export type ResizeModal = {
    modal: string,
    confirmBtn: string,
    rowField: string,
    columnField: string
}


export function HookResizeModal(resizeModel: ResizeModal, karelController: KarelController) {
    $(resizeModel.confirmBtn).on('click', () => {
        let w = parseInt($(resizeModel.columnField).val() as string);
        let h = parseInt($(resizeModel.rowField).val() as string);
        karelController.world.resize(w, h);
    })
}