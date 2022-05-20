import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
import { PseudoRandomNumberGenerator } from "./PseudoRandomNumberGenerator";
const rng = new PseudoRandomNumberGenerator();
const seed = parseQueryParams();
window.SEED = seed;
rng.seed(seed);
Math.random = () => rng.random();