import { WorldController } from "../worldController";

export type AmountModal = {
    modal:string,
    confirmBtn:string,
    inputField:string,
}




export function HookAmountModal(modal: AmountModal, worldController:WorldController) {
    $(modal.confirmBtn).on("click", ()=> {
        const inputValue = $(modal.inputField).val();
        if (inputValue === "") {
            return;
        }
        const amount = parseFloat(inputValue as string);
        if (amount < -1) {
            return;
        }
        worldController.SetBeepers(amount);
    })
}

