import { ControlBar, ControlBarData } from "../desktop/controlBar"
import { FocusBar, FocusToolbar } from "../desktop/focusBar"
import { KarelController } from "../KarelController"
import { WorldViewController } from "../worldViewController/worldViewController"

type MobileUIData = {
    controls:ControlBarData
    focus: FocusToolbar
}


type MobileState = "execution" | "code" | "world"


export class MobileUI {
    private controlBar: ControlBar
    private focusBar: FocusBar
    private state: MobileState
    private static _instance:MobileUI

    constructor(data:MobileUIData) {
        MobileUI._instance = this;
        this.controlBar = new ControlBar(data.controls, WorldViewController.GetInstance());
        this.focusBar = new FocusBar(data.focus);
        this.controlBar.Init();
        this.focusBar.Connect();

        KarelController.GetInstance().RegisterStateChangeObserver((_, state)=> {
            if (state === "unstarted" && this.state === "execution") {
                this.SetState("world");
                return;
            }
            if (state !== "unstarted" && this.state !== "execution") {
                this.SetState("execution");
            }
        });
        $(`*[data-kl-state="world"]`).addClass("d-none");
        $(`*[data-kl-state="execution"]`).addClass("d-none");
        $(`*[data-kl-state="code"]`).addClass("d-none");
        this.state ="world";
        this.SetState("world");
    }

    static GetInstance() {
        return this._instance;
    }

    SetState(state:MobileState) {
        $(`*[data-kl-state="${this.state}"]`).addClass("d-none");;
        this.state = state;        
        $(`*[data-kl-state="${this.state}"]`).removeClass("d-none");
        $(`*[data-kl-state2="${this.state}"]`).removeClass("d-none");

    }

    
}