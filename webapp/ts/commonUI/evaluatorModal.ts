import { World } from "../../../js/karel";
import { KarelController } from "../KarelController";


export type EvaluatorData = {
    modal: JQuery,
    form:JQuery,
    evaluatePosition: JQuery,
    evaluateOrientation: JQuery,
    evaluateBag: JQuery,
    evaluateUniverse: JQuery,

    
    countMoves: JQuery,
    countTurns: JQuery,
    countPicks: JQuery,
    countPuts: JQuery,

    

}


function getData(ui:EvaluatorData) {
    console.log("GetDATA?");
    const kcInstance = KarelController.GetInstance();
    ui.evaluatePosition.prop("checked", kcInstance.world.getDumps(World.DUMP_POSITION));
    ui.evaluateOrientation.prop("checked", kcInstance.world.getDumps(World.DUMP_ORIENTATION));
    ui.evaluateBag.prop("checked", kcInstance.world.getDumps(World.DUMP_BAG));
    ui.evaluateUniverse.prop("checked", kcInstance.world.getDumps(World.DUMP_ALL_BUZZERS));

    
    ui.countMoves.prop("checked", kcInstance.world.getDumps(World.DUMP_MOVE));
    ui.countTurns.prop("checked", kcInstance.world.getDumps(World.DUMP_LEFT));
    ui.countPicks.prop("checked", kcInstance.world.getDumps(World.DUMP_PICK_BUZZER));
    ui.countPuts.prop("checked", kcInstance.world.getDumps(World.DUMP_LEAVE_BUZZER));

    
}

function setData(ui: EvaluatorData) {
    console.log("SetDATA?");
    const kcInstance = KarelController.GetInstance();
    kcInstance.world.setDumps(World.DUMP_POSITION, ui.evaluatePosition.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_ORIENTATION, ui.evaluateOrientation.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_BAG, ui.evaluateBag.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_ALL_BUZZERS, ui.evaluateUniverse.prop("checked"));

    kcInstance.world.setDumps(World.DUMP_MOVE, ui.countMoves.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_LEFT, ui.countTurns.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_PICK_BUZZER, ui.countPicks.prop("checked"));
    kcInstance.world.setDumps(World.DUMP_LEAVE_BUZZER, ui.countPuts.prop("checked"));
}


export function HookEvaluatorModal(ui:EvaluatorData) {
    ui.modal.on("shown.bs.modal",()=>getData(ui)); 
    ui.form.on("submit",(e)=>{
        e.preventDefault();
        setData(ui);
    }); 
}