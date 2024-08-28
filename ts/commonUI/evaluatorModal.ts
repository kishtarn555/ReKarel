import { DumpTypes } from "@rekarel/core";
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

    maxInstructions:JQuery,
    maxStackSize:JQuery,
    maxMove:JQuery,
    maxTurnLeft:JQuery,
    maxPickBuzzer:JQuery,
    maxLeaveBuzzer:JQuery,

}


function getData(ui:EvaluatorData) {
    console.log("GetDATA?");
    const kcInstance = KarelController.GetInstance();
    ui.evaluatePosition.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_POSITION));
    ui.evaluateOrientation.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_ORIENTATION));
    ui.evaluateBag.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_BAG));
    ui.evaluateUniverse.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_ALL_BUZZERS));

    
    ui.countMoves.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_MOVE));
    ui.countTurns.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_LEFT));
    ui.countPicks.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_PICK_BUZZER));
    ui.countPuts.prop("checked", kcInstance.world.getDumps(DumpTypes.DUMP_LEAVE_BUZZER));

    ui.maxInstructions.val(kcInstance.world.maxInstructions);
    ui.maxStackSize.val(kcInstance.world.maxStackSize);
    ui.maxMove.val(kcInstance.world.maxMove);
    ui.maxTurnLeft.val(kcInstance.world.maxTurnLeft);
    ui.maxPickBuzzer.val(kcInstance.world.maxPickBuzzer);
    ui.maxLeaveBuzzer.val(kcInstance.world.maxLeaveBuzzer);


    
}

function setData(ui: EvaluatorData) {
    console.log("SetDATA?");
    const kcInstance = KarelController.GetInstance();
    kcInstance.world.setDumps(DumpTypes.DUMP_POSITION, ui.evaluatePosition.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_ORIENTATION, ui.evaluateOrientation.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_BAG, ui.evaluateBag.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_ALL_BUZZERS, ui.evaluateUniverse.prop("checked"));

    kcInstance.world.setDumps(DumpTypes.DUMP_MOVE, ui.countMoves.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_LEFT, ui.countTurns.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_PICK_BUZZER, ui.countPicks.prop("checked"));
    kcInstance.world.setDumps(DumpTypes.DUMP_LEAVE_BUZZER, ui.countPuts.prop("checked"));

    
    function validateMax(inputVal:any, min:number=1) {
        const isInteger = Number.isInteger(Number(inputVal));
        const isValid = isInteger && Number(inputVal) >= min;
        return isValid;
    }
    const maxInstructions = ui.maxInstructions.val();
    const maxStackSize = ui.maxStackSize.val();
    const maxMove = ui.maxMove.val();
    const maxTurnLeft = ui.maxTurnLeft.val();
    const maxPickBuzzer = ui.maxPickBuzzer.val();
    const maxLeaveBuzzer = ui.maxLeaveBuzzer.val();
    if (validateMax(maxInstructions))
        kcInstance.world.maxInstructions = maxInstructions as number;    
    if (validateMax(maxStackSize))
        kcInstance.world.maxStackSize = maxStackSize as number;
    if (validateMax(maxMove,-1))
        kcInstance.world.maxMove = maxMove as number;    
    if (validateMax(maxTurnLeft,-1))
        kcInstance.world.maxTurnLeft = maxTurnLeft as number;
    if (validateMax(maxPickBuzzer,-1))
        kcInstance.world.maxPickBuzzer = maxPickBuzzer as number;    
    if (validateMax(maxLeaveBuzzer,-1))
        kcInstance.world.maxLeaveBuzzer = maxLeaveBuzzer as number;
}


export function HookEvaluatorModal(ui:EvaluatorData) {
    ui.modal.on("show.bs.modal",()=>getData(ui)); 
    ui.form.on("submit",(e)=>{
        e.preventDefault();
        setData(ui);
    }); 
}