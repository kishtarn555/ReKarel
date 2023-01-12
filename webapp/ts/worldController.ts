import { WorldRenderer } from "./worldRenderer";
import { World } from "../../js/karel";
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

    UpdateScroll(left: number, top: number): void {
        let worldWidth = this.renderer.GetWorldColCount();
        let worldHeight = this.renderer.GetWorldRowCount();

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