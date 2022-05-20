export { }

declare global {
    interface Window { SEED: any; }
}

window.SEED = window.SEED || {};