import { WorldViewController } from "../worldViewController/worldViewController";

const DEFAULT_COLORS = [
    { color: "#ff0000", aria: "Red" },         // Red
    { color: "#00ff00", aria: "Green" },       // Green
    { color: "#0000ff", aria: "Blue" },        // Blue
    { color: "#ffff00", aria: "Yellow" },      // Yellow
    { color: "#ff00ff", aria: "Magenta" },     // Magenta
    { color: "#00ffff", aria: "Cyan" },        // Cyan
    { color: "#ffffff", aria: "White" },       // White
    { color: "#000000", aria: "Black" },       // Black
    { color: "#ffa500", aria: "Orange" },      // Orange
    { color: "#800080", aria: "Purple" },      // Purple
    { color: "#808000", aria: "Olive" },       // Olive
    { color: "#008080", aria: "Teal" },        // Teal
    { color: "#c0c0c0", aria: "Silver" },      // Silver
    { color: "#808080", aria: "Gray" },        // Gray
    { color: "#a52a2a", aria: "Brown" },       // Brown
    { color: "#ffd700", aria: "Gold" },        // Gold
];

export type AnnotationToolbarData = {
    defaultColorGrid: JQuery
};

export class AnnotationToolbar {
    ui: AnnotationToolbarData;

    constructor(ui: AnnotationToolbarData) {
        this.ui = ui;
    }

    Build() {
        this.ui.defaultColorGrid.empty();

        for (const color of DEFAULT_COLORS) {
            const colorButton = $(
                `<button 
                    class="btn-color"
                    data-color="${color.color}" 
                    style="background-color: ${color.color};" 
                    aria-label="${color.aria}" 
                    title="${color.aria}"
                    data-bs-dismiss="modal" data-bs-dialog="none"
                ></button>`
            );
            this.ui.defaultColorGrid.append(colorButton);
        }
    }

    Connect() {
        const worldController = WorldViewController.GetInstance();
        this.ui.defaultColorGrid.on("click", "button.btn-color", (ev) => {
            const target = $(ev.currentTarget);
            const color = target.data("color") as string;
            worldController.SetGizmo({ color: color });
        });
        
    }
}