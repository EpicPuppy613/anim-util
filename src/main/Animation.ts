import { Options } from "./types.js";
import { RenderContext } from "./RenderContext.js";

export class Animation {
    static animations = new Map<string, Animation>();

    name: string;
    defaultOptions: Options;
    preinit: ((o: Options) => Options) | null;
    init: ((c: RenderContext) => void) | null;
    render: (c: RenderContext) => void;
    cleanup: ((c: RenderContext) => void) | null;

    constructor(name: string, defaultOptions: Options, render: (c: RenderContext) => void) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.preinit = null;
        this.init = null;
        this.render = render;
        this.cleanup = null;
        Animation.animations.set(this.name, this);
    }

    hookPreinit(hook: (o: Options) => Options) {
        this.preinit = hook;
        return this;
    }

    hookInit(hook: (c: RenderContext) => void) {
        this.init = hook;
        return this;
    }

    hookCleanup(hook: (c: RenderContext) => void) {
        this.cleanup = this.cleanup;
        return this;
    }
}