import { PerlinNoise } from "./PerlinNoise";
import { Point } from "./Point";
import { PolyTools } from "./PolyTools";

export { }

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
    }
}

window.SEED = window.SEED || {};
window.Noise = window.Noise || {};
window.PolyTools = window.PolyTools || {};