import { Line } from "./Line.js";
import { TimeFunctions, Timer } from "./Timer.js";
import { RenderContext } from "./RenderContext.js";

export class Path {
    x: number[];
    y: number[];
    timer: Timer;
    distance: boolean;

    lines: Line[] = [];

    constructor(x: number, y: number, timer: Timer, useDistance: boolean = true) {
        this.x = [x];
        this.y = [y];
        this.timer = timer;
        this.distance = useDistance;
    }

    addPoint(x: number, y: number) {
        this.x.push(x);
        this.y.push(y);
    }

    prepare() {
        let l = this.x.length - 1;
        if (this.distance) {
            let total = 0;
            for (let i = 0; i < l; i++) {
                total += Math.sqrt((this.x[i] - this.x[i + 1]) ** 2 + (this.y[i] - this.y[i + 1]) ** 2);
                l = total;
            }
        }
        let total = 0;
        for (let i = 0; i < l; i++) {
            if (this.distance) {
                let start = total / l;
                total += Math.sqrt((this.x[i] - this.x[i + 1]) ** 2 + (this.y[i] - this.y[i + 1]) ** 2);
                let end = total / l;
                this.lines.push(new Line(this.x[i], this.y[i], this.x[i + 1], this.y[i + 1], new Timer(start, end, TimeFunctions.linear)));
            } else {
                this.lines.push(new Line(this.x[i], this.y[i], this.x[i + 1], this.y[i + 1], new Timer(i / l, (i + 1) / l, TimeFunctions.linear)));
            }
        }
    }

    draw(ctx: RenderContext) {
        for (const line of this.lines) {
            line.drawT(ctx, this.timer.apply(ctx.t));
        }
    }

    line(ctx: RenderContext) {
        for (const line of this.lines) {
            line.lineT(ctx, this.timer.apply(ctx.t));
        }
    }
}