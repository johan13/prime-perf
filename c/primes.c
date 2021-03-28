#include <math.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

static int is_prime(uint64_t *bits, int n)
{
    return bits[n >> 7] & (1ul << ((n >> 1) & 0x3f)) ? 1 : 0;
}

static void mark_not_prime(uint64_t *bits, int n)
{
    bits[n >> 7] &= ~(1ul << ((n >> 1) & 0x3f));
}

static int count_ones(uint64_t *begin, uint64_t *end)
{
    int count = 0;
    for (; begin < end; begin++)
        count += __builtin_popcountl(*begin);
    return count;
}

int count_primes(int upper_limit)
{
    // bit n of bits represents the number 2*n+1. If the bit is set then the number is a candidate.
    // This implementation eliminates 2 but it doesn't eliminate 1, so those errors cancel out.
    int num_words = (upper_limit + 127) / 128;
    uint64_t *bits = malloc(num_words * 8);
    memset(bits, 0xff, num_words * 8);

    // If upper_limit is not a multiple of 128 then don't count the extra numbers at the end.
    for (int i = upper_limit | 1; i < num_words * 128; i += 2)
        mark_not_prime(bits, i);

    int sqrt_upper_limit = ceilf(sqrtf(upper_limit));
    for (int i = 3; i < sqrt_upper_limit; i += 2)
    {
        if (is_prime(bits, i))
        {
            for (int j = 3 * i; j < upper_limit; j += 2 * i)
                mark_not_prime(bits, j);
        }
    }

    int num_primes = count_ones(bits, bits + num_words);
    free(bits);
    return num_primes;
}
