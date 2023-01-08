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
        this.margin = 8;
        this.GutterSize = 30;

    }

    GetRowCount(mode : "floor"| "ceil" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.canvasContext.canvas.clientHeight-this.GutterSize)/ this.CellSize );
            case "floor":
                return Math.floor((this.canvasContext.canvas.clientHeight-this.GutterSize)/ this.CellSize );
        }
        return Math.ceil((this.canvasContext.canvas.clientHeight-this.GutterSize)/ this.CellSize );
    }

    GetColCount(mode : "floor"| "ceil" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.canvasContext.canvas.clientWidth-this.GutterSize)/ this.CellSize );
            case "floor":
                return Math.floor((this.canvasContext.canvas.clientWidth-this.GutterSize)/ this.CellSize );
        }
        return Math.ceil((this.canvasContext.canvas.clientWidth-this.GutterSize)/ this.CellSize );
    }

    GetWorldRowCount(): number {
        return 100;
    }

    GetWorldColCount(): number {
        return 100;
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
        this.canvasContext.font = `${Math.min(this.CellSize, this.GutterSize) - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i =0; i < rows; i++) {
            // this.canvasContext.measureText()
            if (i+this.origin.f <= this.GetWorldRowCount())
                this.canvasContext.fillText(
                    `${i+this.origin.f}`, 
                    this.GutterSize/2, 
                    h-(this.GutterSize+ (i+0.5) *this.CellSize), 
                    this.GutterSize - this.margin
                );
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
        this.canvasContext.fillStyle= "#444444";
        this.canvasContext.font = `${Math.min(this.CellSize, this.GutterSize) - this.margin}px monospace`;
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "middle";
        for (let i =0; i < cols; i++) {
            // this.canvasContext.measureText()            
            if (i+this.origin.c <= this.GetWorldColCount())
                this.canvasContext.fillText(
                    `${i+this.origin.c}`, 
                    this.GutterSize + i*this.CellSize + 0.5*this.CellSize,
                    h-this.GutterSize/2, 
                    this.CellSize - this.margin
                );
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

    DrawGrid(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        let cols = this.GetColCount();
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = "#c4c4c4";
        this.canvasContext.beginPath();
        for (let i =0; i < rows; i++) {
            this.canvasContext.moveTo(this.GutterSize, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
            this.canvasContext.lineTo(w, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
        }
        
        for (let i =0; i < cols; i++) {
            this.canvasContext.moveTo(this.GutterSize+(i+1)*this.CellSize-0.5, 0);
            this.canvasContext.lineTo(this.GutterSize+(i+1)*this.CellSize-0.5, h-this.GutterSize);
        }
        this.canvasContext.stroke();
    }

    DrawBackground(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.fillStyle = "#fdfdfd";
        this.canvasContext.fillRect(this.GutterSize, 0, w-this.GutterSize, h-this.GutterSize);
        this.DrawGrid();
    }

    DrawKarel(f: number, c:number) : void {
        f

    }

    Draw() {
        
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawGutters();
        this.DrawBackground();
    }

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.GetWorldColCount();
        let worldHeight = this.GetWorldRowCount();

        this.origin = {
            f: Math.floor(
                1+ Math.max(
                    0, 
                    worldHeight-this.GetRowCount("floor")+1
                )*top
            ),
            c: Math.floor(
                1+ Math.max(
                    0,
                    worldWidth-this.GetColCount("floor")+1
                )*left
                ),
        }
        this.Draw()
    }

}

export { WorldRenderer };