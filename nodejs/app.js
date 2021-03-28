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
    // bit n of bits represents the number 2*n+1. If the bit is set then the number is a candidate.
    // This implementation eliminates 2 but it doesn't eliminate 1, so those errors cancel out.
    const bits = new Uint32Array(Math.ceil(upperLimit / 64)).fill(~0);
    const isPrime = n => bits[n >> 6] & 1 << (n >> 1 & 0x1f);
    const markNotPrime = n => bits[n >> 6] &= ~(1 << (n >> 1 & 0x1f));

    // If upperLimit is not a multiple of 64 then don't count the extra numbers at the end.
    for (let i = upperLimit >> 0 | 1; i < bits.length * 64; i += 2)
        markNotPrime(i);

    const sqrtUpperLimit = Math.ceil(Math.sqrt(upperLimit)) >> 0;
    for (let i = 3; i < sqrtUpperLimit; i += 2) {
        if (isPrime(i)) {
            for (let j = i + i + i; j < upperLimit; j += i + i)
                markNotPrime(j);
        }
    }
    return countOnes(bits);
}

// Based on "Bit Twiddling Hacks"
function countOnes(bits) {
    let count = 0;
    for (let n of bits) {
        n = n - (n >> 1 & 0x55555555);
        n = (n & 0x33333333) + (n >> 2 & 0x33333333);
        count += (n + (n >> 4) & 0xf0f0f0f) * 0x1010101 >> 24;
    }
    return count;
}
