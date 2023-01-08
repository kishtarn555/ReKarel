type WRStyle = {
    disabled: string,
    karelColor: string,
    gridBackgroundColor: string,
    gridBorderColor: string,
    gutterBackgroundColor: string,
    gutterColor: string,
}

// FIXME: Change f coords to r (so it's all in english)
class WorldRenderer {
    GutterSize: number;
    canvasContext: CanvasRenderingContext2D
    origin: { f: number, c: number };
    CellSize: number;
    margin: number;
    style: WRStyle

    constructor(canvasContext: CanvasRenderingContext2D, style: WRStyle) {
        this.canvasContext = canvasContext;
        this.origin = { f: 1, c: 1 };
        this.CellSize= 30;
        this.margin = 8;
        this.GutterSize = 30;
        this.style = style;

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
        
        this.canvasContext.fillStyle = this.style.gutterBackgroundColor;
        this.canvasContext.fillRect(0, 0, this.GutterSize, h - this.GutterSize);
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        this.canvasContext.beginPath();
        for (let i =0; i < rows; i++) {
            this.canvasContext.moveTo(0, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
            this.canvasContext.lineTo(this.GutterSize, h-(this.GutterSize+ (i+1) *this.CellSize)+0.5);
        }
        this.canvasContext.stroke();
        
        this.canvasContext.fillStyle= this.style.gutterColor;
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
        this.canvasContext.fillStyle = this.style.gutterBackgroundColor;
        this.canvasContext.fillRect(this.GutterSize, h - this.GutterSize, w, h);
        let cols = this.GetColCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        this.canvasContext.beginPath();
        for (let i =0; i < cols; i++) {
            this.canvasContext.moveTo(this.GutterSize+(i+1)*this.CellSize-0.5, h);            
            this.canvasContext.lineTo(this.GutterSize+(i+1)*this.CellSize-0.5, h-this.GutterSize);
        }
        this.canvasContext.stroke();
        this.canvasContext.fillStyle= this.style.gutterColor;
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
        this.canvasContext.fillStyle = this.style.gridBorderColor;
        this.canvasContext.fillRect(0, h-this.GutterSize, this.GutterSize, this.GutterSize);
        this.DrawVerticalGutter();
        this.DrawHorizontalGutter();
    }

    DrawGrid(): void {
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        let cols = this.GetColCount();
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
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
        this.canvasContext.fillStyle = this.style.gridBackgroundColor;
        this.canvasContext.fillRect(this.GutterSize, 0, w-this.GutterSize, h-this.GutterSize);
        this.DrawGrid();
    }

    DrawKarel(r: number, c:number, orientation: "north" | "east" | "south" | "west" = "north") : void {
        if (r- this.origin.f < 0 || r- this.origin.f >= this.GetRowCount()) {
            // Cull Karel it's outside view by y coord
            return;
        }
        
        if (c- this.origin.c < 0 || c- this.origin.c >= this.GetColCount()) {
            // Cull Karel it's outside view by x coord
            return;
        }
        let h = this.canvasContext.canvas.clientHeight;
        let x = this.GutterSize+ this.CellSize * (c- this.origin.c)+ this.CellSize/2;
        let y = h-(this.GutterSize+ this.CellSize * (r- this.origin.f)+ this.CellSize/2);
        
        this.canvasContext.translate(x-0.5, y-0.5);
        this.canvasContext.fillStyle = this.style.karelColor;
        this.canvasContext.beginPath();
        switch (orientation) {
            case "east":
                this.canvasContext.rotate(Math.PI/2);
                break;
            case "south":
                this.canvasContext.rotate(Math.PI);
                break;
            case "west":
                this.canvasContext.rotate(3*Math.PI/2);
                break;
        }
        //FIXME: NOT ADHOC
        this.canvasContext.moveTo(0,-14);
        this.canvasContext.lineTo(14,0);
        this.canvasContext.lineTo(5,0);
        this.canvasContext.lineTo(5,14);
        this.canvasContext.lineTo(-5,14);
        this.canvasContext.lineTo(-5,0);
        this.canvasContext.lineTo(-14,0);
        this.canvasContext.lineTo(0,-14);
        this.canvasContext.fill();
        //Reset transform
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    Draw() {
        
        let h = this.canvasContext.canvas.clientHeight;
        let w = this.canvasContext.canvas.clientWidth;
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawGutters();
        this.DrawBackground();
        this.DrawKarel(10, 8, "south");
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

export { WorldRenderer, WRStyle};