import { UniformRNG } from "./UniformRNG";

//https://raw.githubusercontent.com/processing/p5.js/master/src/math/noise.js
export class PerlinNoise {
    PERLIN_YWRAPB = 4;
    PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
    PERLIN_ZWRAPB = 8;
    PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
    // 4095
    PERLIN_SIZE = (1 << 12) - 1;
    perlin_octaves = 4;
    perlin_amp_falloff = 0.5;

    constructor(private rng: UniformRNG) { }

    // Returns a cosine with:
    // - frequency: 1/2
    // - phase offset: pi
    // - rescaled to [0,1]
    scaled_cosine(i: number): number {
        return 0.5 * (1 - Math.cos(i * Math.PI));
    }

    perlin = InitializePerlinArray(this.PERLIN_SIZE, () => this.rng.random());

    // Returns a random valued between [0,1]
    noise(x: number, y: number = 0, z: number = 0): number {
        if (x < 0) {
            x = -x;
        }
        if (y < 0) {
            y = -y;
        }
        if (z < 0) {
            z = -z;
        }
        var xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z);
        var xf = x - xi;
        var yf = y - yi;
        var zf = z - zi;
        var rxf, ryf;
        var r = 0;
        var ampl = 0.5;
        var n1, n2, n3;
        for (var o = 0; o < this.perlin_octaves; o++) {
            var of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
            rxf = this.scaled_cosine(xf);
            ryf = this.scaled_cosine(yf);
            n1 = this.perlin[of & this.PERLIN_SIZE];
            n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
            n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
            n2 += rxf * (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
            n1 += ryf * (n2 - n1);
            of += this.PERLIN_ZWRAP;
            n2 = this.perlin[of & this.PERLIN_SIZE];
            n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
            n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
            n3 += rxf * (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
            n2 += ryf * (n3 - n2);
            n1 += this.scaled_cosine(zf) * (n2 - n1);
            r += n1 * ampl;
            ampl *= this.perlin_amp_falloff;
            xi <<= 1;
            xf *= 2;
            yi <<= 1;
            yf *= 2;
            zi <<= 1;
            zf *= 2;
            if (xf >= 1.0) {
                xi++;
                xf--;
            }
            if (yf >= 1.0) {
                yi++;
                yf--;
            }
            if (zf >= 1.0) {
                zi++;
                zf--;
            }
        }
        return r;
    }

    noiseDetail(lod: number, falloff: number) {
        if (lod > 0) {
            this.perlin_octaves = lod;
        }
        if (falloff > 0) {
            this.perlin_amp_falloff = falloff;
        }
    }

    noiseSeed(seed: number) {
        const lcg = new LinearCongruentialGenerator(this.rng, seed);
        this.perlin = InitializePerlinArray(this.PERLIN_SIZE, () => lcg.rand());
    }

}

function InitializePerlinArray(size: number, rng: () => number): Array<number> {
    let perlin = new Array(size + 1);
    for (var i = 0; i < size + 1; i++) {
        perlin[i] = rng();
    }
    return perlin;
}

// https://en.wikipedia.org/wiki/Linear_congruential_generator
class LinearCongruentialGenerator {
    m = 4294967296;
    a = 1664525;
    c = 1013904223;
    seed: number;
    z: number;
    constructor(rng: UniformRNG, seedVal?: number) {
        const seed = (seedVal ? seedVal : rng.next() * this.m) >>> 0;
        this.seed = seed;
        this.z = seed;
    }

    // Returns a value from [0,1]
    rand() {
        this.z = (this.a * this.z + this.c) % this.m;
        return this.z / this.m;
    }
}