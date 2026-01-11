import { Canvas, CanvasRenderingContext2D, createCanvas } from "canvas";
import { Options } from "./types.js";

export class RenderContext {
    width: number;
    height: number;

    framerate: number;
    frames: number;
    f: number = 0;
    t: number = 0;

    cameraX: number = 0;
    cameraY: number = 0;

    canvas: Canvas;
    ctx: CanvasRenderingContext2D;

    constructor(options: Options) {
        this.width = options.width;
        this.height = options.height;
        this.framerate = options.framerate;
        this.frames = options.frames;
        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');
    }

    frame(f: number) {
        this.f = f;
        this.t = f / this.framerate;
    }
}