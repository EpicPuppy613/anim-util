import { Options } from "./types.js";
import { RenderContext } from "./RenderContext.js";

export class Animation {
    static animations = new Map<string, Animation>();

    name: string;
    defaultOptions: Options;
    preinit: ((o: Options) => Promise<Options>) | null;
    init: ((c: RenderContext) => Promise<void>) | null;
    render: (c: RenderContext) => void;
    cleanup: ((c: RenderContext) => Promise<void>) | null;

    constructor(name: string, defaultOptions: Options, render: (c: RenderContext) => void) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.preinit = null;
        this.init = null;
        this.render = render;
        this.cleanup = null;
        Animation.animations.set(this.name, this);
    }

    hookPreinit(hook: (o: Options) => Promise<Options>) {
        this.preinit = hook;
        return this;
    }

    hookInit(hook: (c: RenderContext) => Promise<void>) {
        this.init = hook;
        return this;
    }

    hookCleanup(hook: (c: RenderContext) => Promise<void>) {
        this.cleanup = this.cleanup;
        return this;
    }
}