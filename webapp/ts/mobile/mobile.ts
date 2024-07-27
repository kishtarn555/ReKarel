import { ControlBar, ControlBarData } from "../desktop/controlBar"
import { FocusBar, FocusToolbar } from "../desktop/focusBar"
import { WorldViewController } from "../worldViewController/worldViewController"

type MobileUIData = {
    controls:ControlBarData
    focus: FocusToolbar
}




export class MobileUI {
    private controlBar: ControlBar
    private focusBar: FocusBar
    private static _instance:MobileUI

    constructor(data:MobileUIData) {
        MobileUI._instance = this;
        this.controlBar = new ControlBar(data.controls, WorldViewController.GetInstance());
        this.focusBar = new FocusBar(data.focus);
        this.controlBar.Init();
        this.focusBar.Connect();
    }

    static GetInstance() {
        return this._instance;
    }

    
}