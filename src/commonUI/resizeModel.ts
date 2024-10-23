import { KarelController } from "../KarelController"

export type ResizeModal = {
    modal: string,
    confirmBtn: string,
    rowField: string,
    columnField: string
}


export function HookResizeModal(resizeModel: ResizeModal, karelController: KarelController) {
    $(resizeModel.modal).on('show.bs.modal', ()=> {
        $(resizeModel.rowField).val(karelController.world.h)
        $(resizeModel.columnField).val(karelController.world.w)
    })

    $(resizeModel.confirmBtn).on('click', () => {
        let w = parseInt($(resizeModel.columnField).val() as string);
        let h = parseInt($(resizeModel.rowField).val() as string);
        if (Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0) {
            karelController.Resize(w, h);
            karelController.Reset();
        } else {
            // TODO: Add a toast alert
        }
        
    })
}