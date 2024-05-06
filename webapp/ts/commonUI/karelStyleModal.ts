import { GetCurrentSetting, SetWorldRendererStyle } from "../settings";
import { DefaultWRStyle, WRStyle } from "../worldRenderer";
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

function setFormData(style: WRStyle): void {
    $('#disabledColor').val(style.disabled);
    $('#exportCellBackgroundColor').val(style.exportCellBackground);
    $('#karelColor').val(style.karelColor);
    $('#gridBackgroundColor').val(style.gridBackgroundColor);
    $('#errorGridBackgroundColor').val(style.errorGridBackgroundColor);
    $('#gridBorderColor').val(style.gridBorderColor);
    $('#errorGridBorderColor').val(style.errorGridBorderColor);
    $('#gutterBackgroundColor').val(style.gutterBackgroundColor);
    $('#gutterColor').val(style.gutterColor);
    $('#beeperBackgroundColor').val(style.beeperBackgroundColor);
    $('#beeperColor').val(style.beeperColor);
}


function loadPreset() {
    const val = $("#karelStylePreset").val();
    if (val==="current") {
        setFormData(GetCurrentSetting().worldRendererStyle);
        return;
    }
    if (val==="default") {
        setFormData(DefaultWRStyle);
        return;
    }
    
}


export function HookStyleModal(view:WorldViewController) {

    $("#setKarelStyleBtn").on("click",()=> {
        const style = parseFormData();
        console.log(style);
        view.renderer.style = style;
        view.Update();
        SetWorldRendererStyle(style);
    })
    $("#karelStyleModal").on("show.bs.modal",()=> {
        setFormData(view.renderer.style);
    })
    $("#karelStyleLoadPresetBtn").on("click",()=> {
        loadPreset();
    })
}