import { World } from "../../js/karel";

type WRStyle = {
    beeperBackgroundColor: string,
    beeperColor: string,
    disabled: string,
    exportCellBackground: string,
    karelColor: string,
    gridBackgroundColor: string,
    errorGridBackgroundColor: string,
    gridBorderColor: string,
    errorGridBorderColor:string,
    gutterBackgroundColor: string,
    gutterColor: string,
    wallColor:string,
}




const DefaultWRStyle: WRStyle = {
    disabled: '#4f4f4f',
    exportCellBackground: '#f5f7a8',
    karelColor: '#3E6AC1',
    gridBackgroundColor: '#f8f9fA',
    errorGridBackgroundColor: "#f5d5d5",
    gridBorderColor: '#c4c4c4',
    errorGridBorderColor: '#a8838f',
    gutterBackgroundColor: '#e6e6e6',
    gutterColor: "#444444",
    beeperBackgroundColor: "#0ADB23",    
    beeperColor: "#000000",
    wallColor:"#000000"
}

export function isWRStyle(obj: any): obj is WRStyle {
    if (!obj || typeof obj !== 'object') return false;

    const requiredKeys = [
        'disabled',
        'exportCellBackground',
        'karelColor',
        'gridBackgroundColor',
        'errorGridBackgroundColor',
        'gridBorderColor',
        'errorGridBorderColor',
        'gutterBackgroundColor',
        'gutterColor',
        'beeperBackgroundColor',
        'beeperColor',
        'wallColor'
    ];

    for (const key of requiredKeys) {
        if (!(key in obj) || typeof obj[key] !== 'string') {
            return false;
        }
    }

    return true;
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
    private world: World;
    private mode: "normal" | "error";

    constructor(canvasContext: CanvasRenderingContext2D, style: WRStyle, scale: number) {
        this.canvasContext = canvasContext;
        this.origin = { f: 1, c: 1 };
        this.CellSize= 28;
        this.margin = 8;
        this.GutterSize = 28;
        this.style = style;      
        this.world = undefined; 
        this.scale=scale;
        this.mode = "normal";
    }

    GetWidth() : number {
        return this.canvasContext.canvas.width / this.scale;
    }

    GetHeight() : number {
        return this.canvasContext.canvas.height / this.scale;
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

    ErrorMode() {
        this.mode = "error";
    }

    NormalMode() {
        this.mode = "normal";
    }

    private GetWorldRowCount(): number {
        return this.world.h;
    }

    private GetWorldColCount(): number {
        return this.world.w;
    }

    private DrawVerticalGutter(): void {
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

    private DrawHorizontalGutter(): void {
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

    private DrawGutters(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gridBorderColor;
        this.canvasContext.fillRect(0, h-this.GutterSize, this.GutterSize, this.GutterSize);
        this.DrawVerticalGutter();
        this.DrawHorizontalGutter();
    }

    private DrawGrid(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        let cols = this.GetColCount();
        let rows = this.GetRowCount();
        this.canvasContext.strokeStyle = this.style.gridBorderColor;
        if (this.mode === "error") {
            this.canvasContext.strokeStyle = this.style.errorGridBorderColor;
        }
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

    private DrawBackground(): void {
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.fillStyle = this.style.gridBackgroundColor;
        
        if (this.mode === "error") {
            this.canvasContext.fillStyle = this.style.errorGridBackgroundColor;
        }
        this.canvasContext.fillRect(this.GutterSize, 0, w-this.GutterSize, h-this.GutterSize);
    }

    private DrawKarel(r: number, c:number, orientation: "north" | "east" | "south" | "west" = "north") : void {
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
        this.canvasContext.moveTo(0,-this.CellSize/2);
        this.canvasContext.lineTo(this.CellSize/2,0);
        this.canvasContext.lineTo(this.CellSize/4,0);
        this.canvasContext.lineTo(this.CellSize/4,this.CellSize/2);
        this.canvasContext.lineTo(-this.CellSize/4,this.CellSize/2);
        this.canvasContext.lineTo(-this.CellSize/4,0);
        this.canvasContext.lineTo(-this.CellSize/2,0);
        this.canvasContext.lineTo(0,-this.CellSize/2);
        this.canvasContext.fill();
        //Reset transform
        this.ResetTransform();
    }

    private ResetTransform() {
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.scale(this.scale,this.scale)
    }

    private ColorCell(r: number, c: number, color:string) : void {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize;
        let y = h-((r+1)*this.CellSize+this.GutterSize);

        this.canvasContext.fillStyle= color;
        this.canvasContext.fillRect(x, y, this.CellSize, this.CellSize);
    }

    private DrawTextVerticallyAlign(text:string, x: number, y:number, maxWidth: number) {
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";

        let hs = this.canvasContext.measureText(text).actualBoundingBoxAscent-this.canvasContext.measureText(text).actualBoundingBoxDescent;
        // this.canvasContext.strokeText(text, x, y+hs/2, maxWidth);
        this.canvasContext.fillText(text, x, y+hs/2, maxWidth);

    }

    private SetBeeperFont(scale: number) {
        this.canvasContext.textBaseline = "alphabetic";
        this.canvasContext.font = `${scale * this.CellSize/2}px monospace`
    }

    private DrawTextCell(r: number, c: number, text: string) {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize+this.CellSize/2;
        let y = h-((r+0.5)*this.CellSize+this.GutterSize);
        this.DrawTextVerticallyAlign(text, x, y, this.CellSize*2);
    }

    private DrawBeeperSquare(
        { r, c, ammount, background, color }: 
        { r: number; c: number; ammount: number; background: string; color: string; }
    ) {
        let h = this.GetHeight();
        let x = c*this.CellSize+this.GutterSize;
        let y = h-((r+1)*this.CellSize+this.GutterSize);
        let text = ammount !==-1?String(ammount): '∞';
        this.SetBeeperFont(ammount !==-1? 1: 1.5);
        let measure = this.canvasContext.measureText(text);
        let textH = measure.actualBoundingBoxAscent+4;
        let textW = Math.min(measure.width+4, this.CellSize-5);
        this.canvasContext.fillStyle = background;
        this.canvasContext.fillRect(
            x+this.CellSize/2-(textW/2), 
            y+this.CellSize/2-(textH/2),             
            textW, 
            textH
        );               
        this.canvasContext.fillStyle= color;        
        this.DrawTextCell(r, c, text);
    }

    private DrawWall(r: number, c: number, type: "north"| "east" | "west" | "south") {
        let h = this.GetHeight();
        let x = this.GutterSize+ (c+0.5) * this.CellSize;
        let y = h-(this.GutterSize+ (r+0.5) * this.CellSize);
        this.canvasContext.translate(x,y);
        switch (type) {
            case "north":
                break;
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
        let lineOr = this.canvasContext.lineWidth;
        this.canvasContext.strokeStyle = this.style.wallColor;
        this.canvasContext.lineWidth = 2;
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(-this.CellSize/2, -this.CellSize/2+0.5);
        this.canvasContext.lineTo(this.CellSize/2, -this.CellSize/2+0.5);
        this.canvasContext.stroke();
        this.canvasContext.lineWidth = lineOr;
        this.ResetTransform();
    }

    private DrawWalls() {
        for (let i =0; i < this.GetRowCount(); i++) {
            for (let j =0; j < this.GetColCount(); j++) {
                let walls = this.world.walls(i + this.origin.f, j + this.origin.c);
                for (let k =0; k < 4; k++) {
                    if ((walls & (1<<k))!==0) {
                        this.DrawWall(i,j, this.GetOrientation(k));
                    }
                }
            }
        }
    }


    private DrawBeepers() {
        for (let i =0; i < this.GetRowCount(); i++) {
            for (let j =0; j < this.GetColCount(); j++) {
                let buzzers: number = this.world.buzzers(i + this.origin.f, j + this.origin.c);
                if (buzzers!==0) {
                    this.DrawBeeperSquare({
                        r:i,
                        c:j, 
                        ammount:buzzers, 
                        background:this.style.beeperBackgroundColor, 
                        color:this.style.beeperColor
                    });
                }
            }
        }
    }

    private DrawDumpCells() {
        for (let i =0; i < this.GetRowCount(); i++) {
            for (let j =0; j < this.GetColCount(); j++) {
                if (this.world.getDumpCell(i+this.origin.f, j + this.origin.c)) {
                    this.ColorCell(i,j, this.style.exportCellBackground);
                }
            }
        }
    }

    Draw(world: World) {        
        this.world= world;
        this.ResetTransform();
        let h = this.GetHeight();
        let w = this.GetWidth();
        this.canvasContext.clearRect(0, 0, w, h);
        this.DrawGutters();
        this.DrawBackground();
        this.DrawDumpCells();
        this.DrawGrid();        
        this.DrawKarel(
            world.i, 
            world.j,  
            this.GetOrientation(world.orientation)
            )
        this.DrawWalls();
        this.DrawBeepers();       
    }

    GetOrientation(n: number): "north"|"east"|"west"|"south" {
        switch(n) {
            case 0:
                return "west";
            case 1:
                return "north";
            case 2:
                return "east";
            case 3:
                return "south";
        }
        return "north";
    }

    PointToCell(x:number, y:number) : {r:number, c: number} {
        let c = (x-this.GutterSize)/this.CellSize;
        let r = ((this.GetHeight()-y)-this.GutterSize)/this.CellSize;

        if (c < 0 || r < 0) {
            return {r: -1, c: -1};
        }
        
        return {
            r: Math.floor(r) + this.origin.f, 
            c: Math.floor(c) + this.origin.c,
        };
    }

    CellToPoint(r:number, c: number): {x:number, y:number} {        
        return {
            x: (this.GutterSize+(c-this.origin.c)*this.CellSize) * this.scale / window.devicePixelRatio,
            y: (this.GetHeight()-(this.GutterSize+(r-this.origin.f+1)*this.CellSize))*this.scale / window.devicePixelRatio,
        };        
    }

}

export { WorldRenderer, WRStyle, DefaultWRStyle};