import { blob } from "./Blob";
import { div } from "./Div";
import { Distance } from "./GeometryUtils";
import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { PolyTools } from "./PolyTools";
import { stroke } from "./Stroke";
import { texture } from "./Texture";
import { Tree } from "./Tree";
import { UniformRNG } from "./UniformRNG";
import { bezmh, loopNoise, mapval, normRand, poly, randChoice, randGaussian, unNan, wtrand } from "./Utils";

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
    }
}

export function InitializeGlobalVariables(rng: UniformRNG, seed: string, perlin: PerlinNoise, polyTools: PolyTools, tree: Tree) {
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
}