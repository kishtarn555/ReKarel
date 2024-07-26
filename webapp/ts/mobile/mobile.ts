import { ControlBar, ControlBarData } from "../desktop/controlBar"
import { WorldViewController } from "../worldViewController/worldViewController"

type MobileUIData = {
    controls:ControlBarData
}




export class MobileUI {
    private controlBar: ControlBar
    private static _instance:MobileUI

    constructor(data:MobileUIData) {
        MobileUI._instance = this;
        this.controlBar = new ControlBar(data.controls, WorldViewController.GetInstance());
        this.controlBar.Init();
    }

    static GetInstance() {
        return this._instance;
    }

    
}