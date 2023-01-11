type WRStyle = {
    beeperBackgroundColor: string,
    beeperColor: string,
    disabled: string,
    exportCellBackground: string,
    karelColor: string,
    gridBackgroundColor: string,
    gridBorderColor: string,
    gutterBackgroundColor: string,
    gutterColor: string,
}

// FIXME: Change f coords to r (so it's all in english)
class WorldRenderer {
    GutterSize: number;
    canvasContext: CanvasRenderingContext2D;
    origin: { f: number, c: number };
    CellSize: number;
    margin: number;
    style: WRStyle;
    scale: number;
    scroller: HTMLElement;

    constructor(canvasContext: CanvasRenderingContext2D, style: WRStyle, scroller: HTMLElement) {
        this.canvasContext = canvasContext;
        this.origin = { f: 1, c: 1 };
        this.CellSize= 35;
        this.margin = 8;
        this.GutterSize = 30;
        this.style = style;
        this.scale = 1;
        this.scroller = scroller;
    }

    GetWidth() : number {
        return this.canvasContext.canvas.width;
    }

    GetHeight() : number {
        return this.canvasContext.canvas.height;
    }

    GetRowCount(mode : "floor"| "ceil" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.GetHeight()-this.GutterSize)/ this.CellSize );
            case "floor":
                return Math.floor((this.GetHeight()-this.GutterSize)/ this.CellSize );
        }
    }

    GetColCount(mode : "floor"| "ceil" = "ceil"): number {
        switch (mode) {
            case "ceil":
                return Math.ceil((this.GetWidth()-this.GutterSize)/ this.CellSize );
            case "floor":
                return Math.floor((this.GetWidth()-this.GutterSize)/ this.CellSize );
        }
    }

    GetWorldRowCount(): number {
        return 100;
    }

    GetWorldColCount(): number {
        return 100;
    }

    DrawVerticalGutter(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        
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
                this.DrawTextVerticallyAlign(
                    `${i+this.origin.f}`, 
                    this.GutterSize/2, 
                    h-(this.GutterSize+ (i+0.5) *this.CellSize), 
                    this.GutterSize - this.margin
                );
        }
        


    }

    DrawHorizontalGutter(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
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
                this.DrawTextVerticallyAlign(
                    `${i+this.origin.c}`, 
                    this.GutterSize + i*this.CellSize + 0.5*this.CellSize,
                    h-this.GutterSize/2, 
                    this.CellSize - this.margin
                );
        }

    }

    DrawGutters(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gridBorderColor;
        this.canvasContext.fillRect(0, h-this.GutterSize, this.GutterSize, this.GutterSize);
        this.DrawVerticalGutter();
        this.DrawHorizontalGutter();
    }

    DrawGrid(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
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
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gridBackgroundColor;
        this.canvasContext.fillRect(this.GutterSize, 0, w-this.GutterSize, h-this.GutterSize);
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
        let h = this.GetHeight();
        let x = this.GutterSize+ this.CellSize * (c- this.origin.c)+ this.CellSize/2;
        let y = h-(this.GutterSize+ this.CellSize * (r- this.origin.f)+ this.CellSize/2);
        
        this.canvasContext.translate(x-0.5, y+0.5);
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
        this.canvasContext.moveTo(0,-17);
        this.canvasContext.lineTo(17,0);
        this.canvasContext.lineTo(8,0);
        this.canvasContext.lineTo(8,17);
        this.canvasContext.lineTo(-8,17);
        this.canvasContext.lineTo(-8,0);
        this.canvasContext.lineTo(-17,0);
        this.canvasContext.lineTo(0,-17);
        this.canvasContext.fill();
        //Reset transform
        this.ResetTransform();
    }

    ResetTransform() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    }

    ColorCell(r: number, c: number, color:string) : void {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize;
        let y = h-((r+1)*this.CellSize+this.GutterSize);

        this.canvasContext.fillStyle= color;
        this.canvasContext.fillRect(x, y, this.CellSize, this.CellSize);
    }

    DrawTextVerticallyAlign(text:string, x: number, y:number, maxWidth: number) {
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";

        let hs = this.canvasContext.measureText(text).actualBoundingBoxAscent;
        // this.canvasContext.strokeText(text, x, y+hs/2, maxWidth);
        this.canvasContext.fillText(text, x, y+hs/2, maxWidth);

    }

    SetBeeperFont() {
        this.canvasContext.textBaseline = "alphabetic";
        this.canvasContext.font = `${this.CellSize-18}px monospace`
    }

    DrawTextCell(r: number, c: number, text: string) {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize+this.CellSize/2;
        let y = h-((r+0.5)*this.CellSize+this.GutterSize);
        this.DrawTextVerticallyAlign(text, x, y, this.CellSize-8);
    }

    DrawBeeperSquare(
        { r, c, ammount, background, color }: 
        { r: number; c: number; ammount: number; background: string; color: string; }) {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize;
        let y = h-((r+1)*this.CellSize+this.GutterSize);
        this.SetBeeperFont();
        let measure = this.canvasContext.measureText(String(ammount));
        let textH = measure.actualBoundingBoxAscent+6;
        let textW = Math.min(measure.width+6, this.CellSize-8);
        this.canvasContext.fillStyle = background;
        this.canvasContext.fillRect(
            x+this.CellSize/2-(textW/2), 
            y+this.CellSize/2-(textH/2),             
            textW, 
            textH
        );               
        this.canvasContext.fillStyle= color;        
        this.DrawTextCell(r, c, String(ammount));
    }

    Draw() {        
        this.ResetTransform();
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawGutters();
        this.DrawBackground();
        this.ColorCell(3, 3, this.style.exportCellBackground);
        this.DrawGrid();        
        this.DrawKarel(5, 5, "east");
        this.DrawKarel(5, 6, "north");
        this.DrawKarel(5, 7, "west");
        this.DrawKarel(5, 8, "south");
        this.DrawBeeperSquare({
            r: 3, 
            c: 3, 
            ammount: 1,
            background: this.style.beeperBackgroundColor,
            color: this.style.beeperColor
        });

        
    }

    FocusOrigin() {
        this.scroller.scrollLeft = 0;
        this.scroller.scrollTop = this.scroller.scrollHeight - this.scroller.clientHeight;
    }

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.GetWorldColCount();
        let worldHeight = this.GetWorldRowCount();

        this.origin = {
            f: Math.floor(
                1+ Math.max(
                    0, 
                    (worldHeight-this.GetRowCount("floor") + 1)*top
                )
            ),
            c: Math.floor(
                1+ Math.max(
                    0,
                    (worldWidth-this.GetColCount("floor") + 1)*left
                )
                ),
        }
        this.Draw()
    }

}

export { WorldRenderer, WRStyle};