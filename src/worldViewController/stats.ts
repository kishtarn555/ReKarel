import { CellSelection } from "./selection";
import { KarelController } from "../KarelController";
import { KarelNumbers } from "@rekarel/core";

export type WorldStatsElements = {
    main: JQuery<HTMLElement>,
    beeper: JQuery<HTMLElement>,
    selection: JQuery<HTMLElement>,
    dimension: JQuery<HTMLElement>,
    instruction: JQuery<HTMLElement>,
    move: JQuery<HTMLElement>,
    turnleft: JQuery<HTMLElement>,
    putbeeper: JQuery<HTMLElement>,
    pickbeeper: JQuery<HTMLElement>,
    stack: JQuery<HTMLElement>,
    memo: JQuery<HTMLElement>
}

export class WorldStats {
    elements: WorldStatsElements

    constructor(elements: WorldStatsElements) {
        this.elements = elements;
    }



    UpdateStats(selection: CellSelection, controller:KarelController) {
        this.elements.main.text(
            `(${selection.r }, ${selection.c})`
        );
        this.elements.beeper.text(
            `${KarelNumbers.isInfinite(controller.world.buzzers(selection.r, selection.c)) ? 'Infinito ∞' : controller.world.buzzers(selection.r, selection.c).toLocaleString()}@(${selection.dr*selection.rows }, ${selection.dc*selection.cols})`
        );
        this.elements.selection.text(`De (${selection.r}, ${selection.c}) - (${selection.GetSecondAnchor().r}, ${selection.GetSecondAnchor().c}) `);
        this.elements.dimension.text(`(${selection.dr*selection.rows } filas, ${selection.dc*selection.cols} columnas)`);
        
        const runtime = controller.GetRuntime().state;
        const world = controller.world;

        function formatStat(value: number, max: number): string {
            if (!controller.running) {
                return "N/A";
            }
            if (max !== -1) {
                let percent = max !== 0? ((value / max) * 100).toFixed(1): "100.0";
                if (value < max && percent === "100.0") {
                    percent = "99.9";
                }
                return `${value.toLocaleString()} / ${max.toLocaleString()} (${percent}%)`;
            }
            return `${value.toLocaleString()}`;
        }

        this.elements.instruction.text(formatStat(runtime.ic, world.maxInstructions));
        this.elements.move.text(formatStat(runtime.moveCount, world.maxMove));
        this.elements.turnleft.text(formatStat(runtime.turnLeftCount, world.maxTurnLeft));
        this.elements.putbeeper.text(formatStat(runtime.leaveBuzzerCount, world.maxLeaveBuzzer));
        this.elements.pickbeeper.text(formatStat(runtime.pickBuzzerCount, world.maxPickBuzzer));
        this.elements.stack.text(formatStat(runtime.stackSize, world.maxStackSize));
        this.elements.memo.text(formatStat(runtime.stackMemory, world.maxStackMemory));



    }
}