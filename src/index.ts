import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
import { PseudoRandomNumberGenerator } from "./PseudoRandomNumberGenerator";
import { PerlinNoise } from "./PerlinNoise";

const rng = new PseudoRandomNumberGenerator();
Math.random = () => rng.random();

const seed = parseQueryParams();
window.SEED = seed;
rng.seed(seed);

window.Noise = new PerlinNoise();
