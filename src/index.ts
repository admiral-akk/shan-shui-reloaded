import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
import { UniformRNG } from "./UniformRNG";
import { PerlinNoise } from "./PerlinNoise";
import { PolyTools } from "./PolyTools";
import { Point } from "./Point";
import { bezmh, loopNoise, mapval, normRand, poly, randChoice, randGaussian, unNan, wtrand } from "./Utils";
import { Distance } from "./GeometryUtils";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

const perlin = new PerlinNoise(rng);
const polyTools = new PolyTools();

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
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