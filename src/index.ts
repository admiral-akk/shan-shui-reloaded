import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
import { UniformRNG } from "./UniformRNG";
import { PerlinNoise } from "./PerlinNoise";
import { PolyTools } from "./PolyTools";
import { Point } from "./Point";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

const perlin = new PerlinNoise(rng);
const poly = new PolyTools();

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
Math.random = () => rng.random();
window.SEED = seed;
window.Noise = perlin;
window.PolyTools = poly;