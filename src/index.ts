import fs from "fs";
import path from "path";
import ch from "chalk";
import ProgressBar from "progress";
import { Argument, Command } from "commander";
import { Animation } from "./main/Animation.js";
import { RenderContext } from "./main/RenderContext.js";
import { spawn } from "child_process";

const program = new Command();

program
    .name('anim-util')
    .description('Script based animation creation utility')
    .version('0.1.0')
    .addArgument(new Argument("<operation>", "The operation to perform").choices(["frame", "generate"]))
    .addArgument(new Argument("<animation>", "The animation to generate"))
    .option("-f, --frame <number>", "The frame number to generate or start generating at, first frame = 0", "0")
    .option("-w, --width <pixels>", "Override the animation width")
    .option("-h, --height <pixels>", "Override the animation height")
    .option("-r, --framerate <fps>", "Override the animation framerate")
    .option("-n, --frames <count>", "Override the length of animation in frames")
    .option("-a, --audio <file>", "File to use for audio input")
    .option("--audio-offset <duration>", "Start position in audio file to start");

program.parse();

console.log(`${program.name()} v${program.version()}`);

const files = fs.readdirSync("run/anim", {recursive: true, encoding: 'utf-8'});
for (const file of files) {
    if (file.endsWith(".js")) {
        try {
            await import(path.join("../run/anim", file));
        } catch (e: any) {
            console.warn(ch.yellow(`Error with loading module: ${file}:\n${(e as Error).stack}`));
        }
    }
}

console.log(`Loaded ${Animation.animations.size} animations`);

const options = program.opts();

const animation = Animation.animations.get(program.args[1]);
if (animation === undefined) {
    console.error(ch.red(`Animation not found: ${program.args[1]}`));
    process.exit(1);
}

if (isNaN(parseInt(options.frame))) {
    console.error(ch.red("Invalid frame"));
    process.exit(1);
}

const animOptions = animation.defaultOptions;

if (options.width && isFinite(parseInt(options.width))) animOptions.width = parseInt(options.width);
if (options.height && isFinite(parseInt(options.height))) animOptions.height = parseInt(options.height);
if (options.framerate && isFinite(parseInt(options.framerate))) animOptions.framerate = parseInt(options.framerate);
if (options.frames && isFinite(parseInt(options.frames))) animOptions.frames = parseInt(options.frames);

const context = new RenderContext(animOptions);

animation.init(context);

console.log(ch.blueBright.bold(`Using animation '${animation.name}'`));
console.log(`  ${animOptions.width}x${animOptions.height}, Frames: ${animOptions.frames}@${animOptions.framerate}fps, ${(animOptions.frames / animOptions.framerate).toFixed(2)}s`);

try {
    fs.mkdirSync("out");
} catch (e) {}

if (program.args[0] == "frame") {
    console.log(ch.green("Generating single frame: " + options.frame));
    context.frame(parseInt(options.frame));
    animation.render(context);
    fs.writeFileSync(`out/frame.png`, context.canvas.toBuffer());
} else if (program.args[0] == "generate") {
    fs.rmSync("out/output.mp4", {force: true});
    const args = [];
    args.push("-framerate", animOptions.framerate.toString(), "-f", "image2pipe", "-i", "-");
    if (options.audio) {
        if (options.audioOffset) {
            args.push("-ss", options.audioOffset);
        }
        args.push("-i", options.audio, "-c:a", "copy");
    }
    args.push("-shortest", "output.mp4");
    const ffmpeg = spawn("ffmpeg", args, {cwd: "./out", stdio: "pipe"});
    const bar = new ProgressBar(ch.green("Generating [:bar] :current/:total :rate/s :percent :etas"), {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: animOptions.frames - parseInt(options.frame)
    });
    ffmpeg.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    ffmpeg.stderr.on('data', (data) => {
        process.stderr.write(data);
    });
    for (let i = parseInt(options.frame); i < animOptions.frames; i++) {
        context.frame(i);
        animation.render(context);
        ffmpeg.stdin.write(context.canvas.toBuffer());
        bar.tick(1);
    }
    ffmpeg.stdin.end();
}