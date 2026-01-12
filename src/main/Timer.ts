export class Timer {
    start: number;
    end: number;
    timeFunction: (x: number) => number;

    constructor(start: number, end: number, timeFunction: (x: number) => number) {
        this.start = start;
        this.end = end;
        this.timeFunction = timeFunction;
    }

    apply(t: number) {
        const x = Math.min(Math.max((t - this.start) / (this.end - this.start), 0), 1);
        return this.timeFunction(x);
    }
}

// ref: https://easings.net/
export const TimeFunctions = {
    linear: (x: number) => x,
    easeIn: (x: number) => x * x,
    easeOut: (x: number) => 1 - (1 - x) * (1 - x),
    easeInOut: (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}