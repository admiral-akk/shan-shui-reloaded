import { PseudoRandomNumberGenerator } from '../src/index';


describe('testing rng distribution', () => {
    test('random numbers should be roughly evenly distributed.', () => {
        const rng = new PseudoRandomNumberGenerator();
        const bucketCount = 10;
        const sampleCount = 10000000;
        const samples = rng.test(sampleCount, bucketCount);
        samples.forEach((val, i) => {
            expect(Math.abs(val - sampleCount / bucketCount)).toBeLessThan(sampleCount / bucketCount);
        })
    });
});