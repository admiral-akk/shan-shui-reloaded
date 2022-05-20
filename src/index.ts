import { parseQueryParams } from "./ParseArgs";
import { } from "./GlobalVariables"
console.log('Hello words');

export class PseudoRandomNumberGenerator {
    private s = 1234;
    private p = 999979;
    private q = 999983;
    private m = this.p * this.q;

    hash(x: any): number {
        const y = window.btoa(JSON.stringify(x));
        let z = 0;
        for (let i = 0; i < y.length; i++) {
            z += y.charCodeAt(i) * Math.pow(128, i);
        }
        return z;
    }

    seed(x?: any): void {
        if (!x) {
            x = Date.now();
        }
        var y = 0;
        var z = 0;
        while (y % this.p == 0 || y % this.q == 0 || y == 0 || y == 1) {
            y = (this.hash(x) + z) % this.m;
        }
        this.s = y;
        console.log(["int seed", this.s]);
        for (var i = 0; i < 10; i++) {
            this.next();
        }
    }

    random(): number {
        return this.next();
    }

    next(): number {
        this.s = (this.s * this.s) % this.m;
        return this.s / this.m;
    }

    test(sampleCount: number = 10000000, buckets: number = 10): number[] {
        const t0 = Date.now();

        const chart: number[] = [];
        for (let i = 0; i < buckets; i++) {
            chart.push(0);
        }
        for (let i = 0; i < sampleCount; i++) {
            chart[Math.floor(this.next() * buckets)] += 1;
        }
        console.log(chart);
        console.log(`Finished in: ${Date.now() - t0}ms`);
        return chart;
    }
}

const rng = new PseudoRandomNumberGenerator();
const seed = parseQueryParams();
window.SEED = seed;
rng.seed(seed);
Math.random = () => rng.random();