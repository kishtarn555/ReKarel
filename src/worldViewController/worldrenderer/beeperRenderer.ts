import { KarelNumbers } from "@rekarel/core";


interface DrawBeeperSquareArgs {
    cellX: number;
    cellY: number;
    cellWidth: number;
    cellHeight: number;
    amount: number;
    background: string;
    color: string;
}

export class BeeperRenderer {
    constructor(protected canvasContext: CanvasRenderingContext2D) {}

    public DrawBeeperSquare(args: DrawBeeperSquareArgs) {
        this.canvasContext.save();
        this.canvasContext.translate(args.cellX + args.cellWidth / 2, args.cellY + args.cellHeight / 2);
        this.prepareCanvas(args);
        this.drawBackground(args);
        this.drawText(args);        
        this.canvasContext.restore();
    }
    
    protected drawBackground(args: DrawBeeperSquareArgs) {        
        throw new Error("Not implemented");
    }
    
    
    protected drawText(args: DrawBeeperSquareArgs) {
        throw new Error("Not implemented");
    }

    protected prepareCanvas(args: DrawBeeperSquareArgs) {
    }
}

export class BasicBeeperRenderer extends BeeperRenderer {

    private DrawTextVerticallyAlign(text:string, maxWidth: number) {
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";
        let measure = this.canvasContext.measureText(text);
        let hs = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent;       
        this.canvasContext.fillText(text, 0, hs / 2, maxWidth);
    }

    protected drawBackground({ cellX, cellY, cellWidth, cellHeight, amount, background, color }: DrawBeeperSquareArgs) {
        const text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        let measure = this.canvasContext.measureText(text);
        let textH = measure.actualBoundingBoxAscent+4;
        let textW = Math.min(measure.width+4, cellWidth-5);
        this.canvasContext.fillStyle = background;
        this.canvasContext.fillRect(
            -(textW/2), 
            -(textH/2),             
            textW, 
            textH
        ); 
    }

    protected drawText(args: DrawBeeperSquareArgs): void {
        const { amount, color } = args;
        const text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        this.canvasContext.fillStyle = color;
        this.canvasContext.font = "16px sans-serif";
        this.DrawTextVerticallyAlign(text, args.cellWidth * 2);
    }
}


export class HorizontalFitterBeeperRenderer extends BeeperRenderer {
    text = "";
    private transparency = "";

    private DrawTextVerticallyAlign(text:string) {
        let measure = this.canvasContext.measureText(text);
        let hs = measure.actualBoundingBoxAscent - measure.actualBoundingBoxDescent;       
        this.canvasContext.fillText(text, 0, hs / 2);
    }

    setTransparency(alpha: number) {
        this.transparency = Math.min(255, Math.round(255 * alpha)).toString(16);
        if (this.transparency.length == 1) this.transparency = "0" + this.transparency;
    }

    protected drawBackground({ cellWidth, background }: DrawBeeperSquareArgs) {
        let measure = this.canvasContext.measureText(this.text);
        let textH = measure.actualBoundingBoxAscent + 4;
        let textW = Math.min(measure.width+4, cellWidth - 2);
        this.canvasContext.fillStyle = background + this.transparency;
        this.canvasContext.fillRect(
            -(textW/2), 
            -(textH/2),             
            textW, 
            textH
        ); 
    }

    protected drawText(args: DrawBeeperSquareArgs): void {
        const { amount, color } = args;
        const text = KarelNumbers.isInfinite(amount) ? '∞' : String(amount);
        this.canvasContext.fillStyle = color;
        this.DrawTextVerticallyAlign(text);
    }

    protected prepareCanvas(args: DrawBeeperSquareArgs) {
        const { amount, cellWidth } = args;
        
        this.canvasContext.textAlign = "center";
        this.canvasContext.textBaseline = "alphabetic";
        
        this.canvasContext.font = `${cellWidth}px monospace`;
        this.text = KarelNumbers.isInfinite(amount) ? '∞' : `${amount}`;
        let scale = 0.8;
        if (KarelNumbers.isInfinite(amount)) {
            scale = 0.8;
        } else if (this.text.length == 1) {
            scale = 0.68;             
        } else  if (this.text.length == 2) {
            scale = 0.62;
        } else {
            scale = 1.8/this.text.length;
        }
        this.canvasContext.font = `${cellWidth* scale }px monospace`;
    }
}