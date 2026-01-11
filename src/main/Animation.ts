import { Options } from "./types.js";
import { RenderContext } from "./RenderContext.js";

export class Animation {
    static animations = new Map<string, Animation>();

    name: string;
    defaultOptions: Options;
    init: (c: RenderContext) => void;
    render: (c: RenderContext) => void;

    constructor(name: string, defaultOptions: Options, init: (c: RenderContext) => void, render: (c: RenderContext) => void) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.init = init;
        this.render = render;
        Animation.animations.set(this.name, this);
    }
}