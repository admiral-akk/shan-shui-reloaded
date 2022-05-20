import { PerlinNoise } from "./PerlinNoise";

export { }

declare global {
    interface Window { SEED: any; Noise: PerlinNoise; }
}

window.SEED = window.SEED || {};
window.Noise = window.Noise || {};