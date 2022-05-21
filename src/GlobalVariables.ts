import { Arch } from "./Arch";
import { blob } from "./Blob";
import { div } from "./Div";
import { download } from "./Downloader";
import { Distance } from "./GeometryUtils";
import { Man } from "./Man";
import { Memory } from "./Memory";
import { Mount } from "./Mount";
import { MountPlanner } from "./MountPlanner";
import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { PolyTools } from "./PolyTools";
import { stroke } from "./Stroke";
import { texture } from "./Texture";
import { Tree } from "./Tree";
import { UniformRNG } from "./UniformRNG";
import { Update } from "./Update";
import { bezmh, loopNoise, mapval, normRand, poly, randChoice, randGaussian, unNan, wtrand } from "./Utils";
import { water } from "./Water";

declare global {
    interface Window {
        SEED: any;
        Noise: PerlinNoise;
        PolyTools: PolyTools;
        unNan: (plist: any) => any;
        distance: (p0: Point, p1: Point) => number;
        mapval: (value: number, istart: number, istop: number, ostart: number, ostop: number) => number;
        loopNoise: (noiseList: number[]) => void;
        randChoice: (arr: any[]) => any;
        normRand: (m: number, M: number) => number;
        wtrand: (weightFunction: (val: number) => number) => number;
        randGaussian: () => number;
        bezmh: (P: Point[], w?: number) => Point[];
        poly: (plist: Point[], args: any) => string;
        stroke: (ptlist: Point[], args: any) => string;
        blob: (x: number, y: number, args: any, noise: PerlinNoise) => string | Point[];
        div: (plist: Point[], reso: number) => Point[];
        texture: (ptlist: Point[][], args: any) => Point[][] | string;
        Tree: Tree,
        Mount: Mount,
        Arch: Arch,
        Man: Man,
        water: (xoff: number, yoff: number, seed: number, args: any) => string;
        mountplanner: (xmin: number, xmax: number) => any[];
        MEM: Memory;
        viewupdate: () => void;
        needupdate: () => boolean;
        update: () => void;
        download: (filename: string, text: string) => void;
    }
}

export function InitializeGlobalVariables(rng: UniformRNG, seed: string,
    perlin: PerlinNoise, polyTools: PolyTools, tree: Tree, mount: Mount, arch: Arch, man: Man, mountPlanner: MountPlanner,
    memory: Memory, update: Update) {
    Math.random = () => rng.random();
    window.SEED = seed;
    window.Noise = perlin;
    window.PolyTools = polyTools;
    window.unNan = (plist: any) => unNan(plist);
    window.distance = (p0: Point, p1: Point) => Distance(p0, p1);
    window.mapval = (value: number, istart: number, istop: number, ostart: number, ostop: number) =>
        mapval(value, istart, istop, ostart, ostop);
    window.loopNoise = (noiseList: number[]) => loopNoise(noiseList);
    window.randChoice = (arr: any[]) => randChoice(arr);
    window.normRand = (m: number, M: number) => normRand(m, M);
    window.wtrand = (weightFunction: (val: number) => number) => wtrand(weightFunction);
    window.randGaussian = () => randGaussian();
    window.bezmh = (P: Point[], w?: number) => bezmh(polyTools, P, w);
    window.poly = (plist: Point[], args: any) => poly(plist, args);
    window.stroke = (plist: Point[], args: any) => stroke(plist, args, perlin);
    window.blob = (x: number, y: number, args: any) => blob(x, y, args, perlin);
    window.div = (plist: Point[], reso: number) => div(plist, reso);
    window.texture = (ptlist: Point[][], args: any) => texture(ptlist, args, perlin);
    window.Tree = tree;
    window.Mount = mount;
    window.Arch = arch;
    window.Man = man;
    window.water = (xoff: number, yoff: number, seed: number, args: any) => water(xoff, yoff, seed, args, perlin);
    window.mountplanner = (xmin: number, xmax: number) => mountPlanner.mountplanner(xmin, xmax);
    window.MEM = memory;
    window.viewupdate = () => update.viewupdate();
    window.needupdate = () => update.needupdate();
    window.update = () => update.update();
    window.download = (filename: string, text: string) => download(filename, text);
}