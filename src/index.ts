import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
import { UniformRNG } from "./UniformRNG";
import { PerlinNoise } from "./PerlinNoise";

const rng = new UniformRNG();

const seed = parseQueryParams();
rng.seed(seed);

window.Noise = new PerlinNoise(rng);

// We add global variables at the end to ensure that we don't inadvertidly depend on them in our Typescript.
Math.random = () => rng.random();
window.SEED = seed;