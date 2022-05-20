import { PerlinNoise } from "./PerlinNoise";
import { PolyTools } from "./PolyTools";

export { }

declare global {
    interface Window { SEED: any; Noise: PerlinNoise; PolyTools: PolyTools; }
}

window.SEED = window.SEED || {};
window.Noise = window.Noise || {};
window.PolyTools = window.PolyTools || {};