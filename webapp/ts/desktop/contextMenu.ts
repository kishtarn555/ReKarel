import bootstrap from "bootstrap"
import { BeeperToolbar, EvaluateToolbar, KarelToolbar, WallToolbar } from "./commonTypes"
import { WorldViewController } from "../worldViewController/worldViewController"
import { AppVars } from "../volatileMemo"

export type ContextMenuData = {
    toggler: JQuery,
    container: JQuery
    beepers: BeeperToolbar,
    karel: KarelToolbar,
    wall: WallToolbar,
    evaluate: EvaluateToolbar
    
}

export class DesktopContextMenu {
    toggler: JQuery
    container: JQuery
    beepers: BeeperToolbar
    karel: KarelToolbar
    wall: WallToolbar
    evaluate: EvaluateToolbar


    constructor(data: ContextMenuData, worldCanvas:JQuery, worldController:WorldViewController) {
        this.toggler = data.toggler;
        this.container = data.container;
        this.beepers = data.beepers;
        this.karel = data.karel;
        this.wall = data.wall;
        this.evaluate = data.evaluate;
        this.Hook(worldCanvas, worldController);
    }

    
    private Hook(worldCanvas:JQuery, worldController:WorldViewController ) {
        worldCanvas.on("contextmenu", (e)=>{
            const dropmenu =new bootstrap.Dropdown(this.toggler[0]);
            dropmenu.hide();
            this.container[0].style.setProperty("top", `${e.pageY}px`);
            this.container[0].style.setProperty("left", `${e.pageX}px`);      
            this.ToggleContextMenu();
            e.preventDefault();
        })
        const ContextAction = (target: JQuery, method:()=> void) => {
            target.on(
                "click",
                (()=> {
                    this.ToggleContextMenu();
                    method();
                }).bind(this)
            );
        }
        ContextAction(this.beepers.addOne, ()=>worldController.ChangeBeepers(1));
        ContextAction(this.beepers.removeOne, ()=>worldController.ChangeBeepers(-1));        
        ContextAction(this.beepers.infinite, ()=>worldController.SetBeepers(-1));
        ContextAction(this.beepers.clear, ()=>worldController.SetBeepers(0));
        ContextAction(this.beepers.random, ()=>worldController.SetRandomBeepers(AppVars.randomBeeperMinimum, AppVars.randomBeeperMaximum));

        
        ContextAction(this.karel.north, ()=>worldController.SetKarelOnSelection("north"));
        ContextAction(this.karel.east, ()=>worldController.SetKarelOnSelection("east"));
        ContextAction(this.karel.south, ()=>worldController.SetKarelOnSelection("south"));
        ContextAction(this.karel.west, ()=>worldController.SetKarelOnSelection("west"));
        
        ContextAction(this.wall .north, ()=>worldController.ToggleWall("north"));
        ContextAction(this.wall .east, ()=>worldController.ToggleWall("east"));
        ContextAction(this.wall .south, ()=>worldController.ToggleWall("south"));
        ContextAction(this.wall .west, ()=>worldController.ToggleWall("west"));
        ContextAction(this.wall .outside, ()=>worldController.ToggleWall("outer"));

        ContextAction(this.evaluate.evaluate, ()=>worldController.SetCellEvaluation(true) );
        ContextAction(this.evaluate.ignore, ()=>worldController.SetCellEvaluation(false) );
    }

    ToggleContextMenu() {
        const dropmenu = new bootstrap.Dropdown(this.toggler[0]);
        if (this.toggler.attr("aria-expanded")==="false") {
            dropmenu.show();
        } else {
            dropmenu.hide();
        }
    }

}