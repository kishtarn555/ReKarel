import { WorldRenderer } from "./worldRenderer";
import { World } from "../../js/karel";
import { karel } from "../../js";
class WorldController {
    renderer: WorldRenderer
    container: HTMLElement
    world: World;
    state: {
        cursorX: number,
        cursorY: number,
    }


    constructor(renderer: WorldRenderer, container: HTMLElement, world: World) {
        this.renderer = renderer;
        this.container = container;
        this.world = world;
    }

    Select(r: number, c: number, rowCount: number, colCount:number) {

    }

    TrackMouse(e: MouseEvent) {
        let canvas = this.renderer.canvasContext.canvas;
        let boundingBox =canvas.getBoundingClientRect();
        let x = (e.clientX - boundingBox.left) * canvas.width / boundingBox.width;
        let y = (e.clientY - boundingBox.top)* canvas.height / boundingBox.height;
        this.state.cursorX= x /  window.devicePixelRatio;
        this.state.cursorY= y /  window.devicePixelRatio;
    }

    FocusOrigin() {
        this.container.scrollLeft = 0;
        this.container.scrollTop = this.container.scrollHeight - this.container.clientHeight;
    }

    FocusKarel() {
        let r = Math.max(1,this.world.i-2);
        let c = Math.max(1, this.world.j-2);

        this.FocusTo(r,c);
    }

    FocusTo(r: number, c: number) {
        

        let left = c/(this.world.w - this.renderer.GetColCount("floor") + 1) ;
        left = left < 0 ? 0 :left;
        left = left > 1 ? 1 :left;
        let top = r/(this.world.h - this.renderer.GetRowCount("floor") + 1);        
        top = top < 0 ? 0 :top;
        top = top > 1 ? 1 :top;

        this.container.scrollLeft = left * (this.container.scrollWidth - this.container.clientWidth);
        this.container.scrollTop = (1-top) * (this.container.scrollHeight - this.container.clientHeight);

        

    }

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.world.w;
        let worldHeight = this.world.h;

        this.renderer.origin = {
            f: Math.floor(
                1+ Math.max(
                    0, 
                    (worldHeight-this.renderer.GetRowCount("floor") + 1)*top
                )
            ),
            c: Math.floor(
                1+ Math.max(
                    0,
                    (worldWidth-this.renderer.GetColCount("floor") + 1)*left
                )
                ),
        }
        this.Update();
    }

    Update() {
        this.renderer.Draw(this.world);
    }
}

export {WorldController};