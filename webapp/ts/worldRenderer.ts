import { gutters } from "@codemirror/view";

class WorldRenderer {
    GutterSize: number;
    canvasContext: CanvasRenderingContext2D
    origin: { f: number, c: number };
    CellSize: number;
    margin: number;

    constructor(canvasContext: CanvasRenderingContext2D) {
        this.canvasContext = canvasContext;
        this.origin = { f: 1, c: 1 };
        this.CellSize= 30;
        this.margin = 12;
        this.GutterSize = 30;

    }

    GetRowCount(): number {
        return Math.ceil((this.canvasContext.canvas.clientHeight-this.GutterSize)/ this.CellSize );
    }

    GetColCount(): number {
        return Math.ceil((this.canvasContext.canvas.clientWidth-this.GutterSize)/ this.CellSize );
    }

    DrawVerticalGutter(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        
        this.canvasContext.fillStyle = "#e6e6e6";
        this.canvasContext.fillRect(0, 0, this.GutterSize, h - this.GutterSize);
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = "#c4c4c4";
        this.canvasContext.beginPath();
        for (let i =0; i < rows; i++) {
            this.canvasContext.moveTo(0, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
            this.canvasContext.lineTo(this.GutterSize, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
        }
        this.canvasContext.stroke();
        
        this.canvasContext.fillStyle= "#444444";
        this.canvasContext.font = `${this.CellSize - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i =0; i < rows; i++) {
            // this.canvasContext.measureText()
            this.canvasContext.fillText(`${i+this.origin.f}`, this.GutterSize/2, h-(this.GutterSize+ (i+0.5) *this.CellSize), this.CellSize - this.margin);
        }
        


    }

    DrawHorizontalGutter(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.fillStyle = "#e6e6e6";
        this.canvasContext.fillRect(this.GutterSize, h - this.GutterSize, w, h);
        let cols = this.GetColCount();
        this.canvasContext.strokeStyle = "#c4c4c4";
        this.canvasContext.beginPath();
        for (let i =0; i < cols; i++) {
            this.canvasContext.moveTo(this.GutterSize+(i+1)*this.CellSize-0.5, h);            
            this.canvasContext.lineTo(this.GutterSize+(i+1)*this.CellSize-0.5, h-this.GutterSize);
        }
        this.canvasContext.stroke();
        return;
        this.canvasContext.fillStyle= "#444444";
        this.canvasContext.font = `${this.CellSize - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i =0; i < cols; i++) {
            // this.canvasContext.measureText()
            this.canvasContext.fillText(`${i+this.origin.c}`, this.GutterSize/2, h-(this.GutterSize+ (i+0.5) *this.CellSize), this.CellSize - this.margin);
        }

    }

    DrawGutters(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.fillStyle = "#c4c4c4";
        this.canvasContext.fillRect(0, h-this.GutterSize, this.GutterSize, this.GutterSize);
        this.DrawVerticalGutter();
        this.DrawHorizontalGutter();
    }


    Draw() {
        
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawGutters();
    }

    UpdateScroll(left: number, right: number): void {
        let worldWidth = 100;
        let worldHeight = 100;

        this.origin = {
            f: Math.floor(1+ worldHeight*left),
            c: Math.floor(1+ worldWidth*left),
        }
    }

}

export { WorldRenderer };