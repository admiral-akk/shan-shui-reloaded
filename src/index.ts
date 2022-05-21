import { parseQueryParams } from "./ParseArgs";
import { InitializeGlobalVariables } from "./GlobalVariables"
import { UniformRNG } from "./UniformRNG";
import { PerlinNoise } from "./PerlinNoise";
import { PolyTools } from "./PolyTools";
import { Point } from "./Point";
import { bezmh, loopNoise, mapval, normRand, poly, randChoice, randGaussian, unNan, wtrand } from "./Utils";
import { Distance } from "./GeometryUtils";
import { stroke } from "./Stroke";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

const perlin = new PerlinNoise(rng);
const polyTools = new PolyTools();

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
InitializeGlobalVariables(rng, seed, perlin, polyTools);