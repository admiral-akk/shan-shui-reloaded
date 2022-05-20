export function parseQueryParams(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get('seed');
    if (seed) {
        return seed;
    } else {
        return Date.now().toString();
    }
}