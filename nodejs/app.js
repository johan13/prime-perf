const { performance } = require("perf_hooks");

main();
function main() {
    let iterations = 0;
    const start = performance.now();
    const deadline = start + 5000;
    while (performance.now() < deadline) {
        const numPrimes = countPrimes(1_000_000);
        if (numPrimes !== 78_498)
            throw new Error(`Wrong answer: ${numPrimes}`);
        iterations++;
    }
    const durationMs = performance.now() - start;
    console.log(`${iterations} iterations, average ${(durationMs / iterations).toFixed(3)} ms/iteration.`);
}

function countPrimes(upperLimit) {
    const bits = new Uint32Array(Math.ceil(upperLimit / 32)).fill(~0);
    const getBit = b => (bits[(b / 32) | 0] & (1 << b % 32)) !== 0;
    const clearBit = b => (bits[(b / 32) | 0] &= ~(1 << b % 32));

    // 0 and 1 are not primes. Also reset the bits >=upperLimit.
    bits[0] = ~3;
    for (let i = upperLimit; i < bits.length * 32; i++)
        clearBit(i);

    const stop = Math.ceil(Math.sqrt(upperLimit)) | 0;
    for (let i = 2; i < stop; i++) {
        if (getBit(i)) {
            for (let j = i + i; j < upperLimit; j += i) {
                clearBit(j);
            }
        }
    }
    return countOnes(bits);
}

// Based on "Bit Twiddling Hacks"
function countOnes(bits) {
    let count = 0;
    for (let n of bits) {
        n = n - ((n >> 1) & 0x55555555);
        n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
        count += (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
    }
    return count;
}
