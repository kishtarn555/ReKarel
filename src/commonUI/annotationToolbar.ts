import { WorldViewController } from "../worldViewController/worldViewController";

export const DEFAULT_COLORS = [
    { color: "#ff0000", aria: "Rojo" },      
    { color: "#2e8f43", aria: "Verde" },    
    { color: "#0000ff", aria: "Azul" },     
    { color: "#ffacea", aria: "Rosa" },    
    { color: "#00ffff", aria: "Cian" },     
    { color: "#43230a", aria: "Tostado" },    
    { color: "#ff7f00", aria: "Naranja" },   
    { color: "#800080", aria: "Morado" },   
    { color: "#008080", aria: "Verde azulado" },     
    { color: "#808080", aria: "Gris" },     
];

export type AnnotationToolbarData = {
    defaultColorGrid: JQuery
    clearColorButton: JQuery
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
        this.ui.clearColorButton.on("click", (ev) => {
            worldController.SetGizmo(null);
        });
        
    }
}