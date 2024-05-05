import { WRStyle } from "../worldRenderer";
import { WorldViewController } from "../worldViewController";

function parseFormData(): WRStyle {
    return {
        disabled: $('#disabledColor').val() as string,
        exportCellBackground: $('#exportCellBackgroundColor').val() as string,
        karelColor: $('#karelColor').val() as string,
        gridBackgroundColor: $('#gridBackgroundColor').val() as string,
        errorGridBackgroundColor: $('#errorGridBackgroundColor').val() as string,
        gridBorderColor: $('#gridBorderColor').val() as string,
        errorGridBorderColor: $('#errorGridBorderColor').val() as string,
        gutterBackgroundColor: $('#gutterBackgroundColor').val() as string,
        gutterColor: $('#gutterColor').val() as string,
        beeperBackgroundColor: $('#beeperBackgroundColor').val() as string,
        beeperColor: $('#beeperColor').val() as string,
    };
}


export function HookStyleModal(view:WorldViewController) {

    $("#setKarelStyleBtn").on("click",()=> {
        const style = parseFormData();
        console.log(style);
        view.renderer.style = style;
        view.Update();
    })
}