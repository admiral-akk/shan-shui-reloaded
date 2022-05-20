

function parseQueryParams(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get('seed');
    if (seed) {
        return seed;
    } else {
        return Date.now().toString();
    }
}
const SEED = parseQueryParams();
(window as any).SEED = SEED;
(window as any).rng.seed((window as any).SEED);
console.log(`Seed set to: ${(window as any).SEED}`);