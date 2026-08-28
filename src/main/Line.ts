import { RenderContext } from "./RenderContext.js";
import { Timer } from "./Timer.js";

export class Line {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    timer: Timer;

    constructor(x1: number, y1: number, x2: number, y2: number, timer: Timer) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.timer = timer;
    }

    draw(ctx: RenderContext) {
        this.drawT(ctx, ctx.t);
    }

    drawT(ctx: RenderContext, time: number) {
        const t = this.timer.apply(time);
        if (t <= 0) return;
        const p = 1 - t;
        ctx.ctx.beginPath();
        ctx.ctx.moveTo(this.x1 - ctx.cameraX, this.y1 - ctx.cameraY);
        ctx.ctx.lineTo(p * this.x1 + t * this.x2 - ctx.cameraX, p * this.y1 + t * this.y2 - ctx.cameraY);
        ctx.ctx.stroke();
    }

    line(ctx: RenderContext) {
        this.lineT(ctx, ctx.t);
    }

    lineT(ctx: RenderContext, time: number) {
        const t = this.timer.apply(time);
        if (t <= 0) return;
        const p = 1 - t;
        ctx.ctx.moveTo(this.x1 - ctx.cameraX, this.y1 - ctx.cameraY);
        ctx.ctx.lineTo(p * this.x1 + t * this.x2 - ctx.cameraX, p * this.y1 + t * this.y2 - ctx.cameraY);

    }
}