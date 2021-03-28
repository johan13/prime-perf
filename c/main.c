#include <stdint.h>
#include <stdio.h>
#include <time.h>

// count_primes is in a separate compilation unit to avoid optimizing the argument value.
int count_primes(int upper_limit);
static uint64_t get_us();

int main()
{
    int iterations = 0;
    uint64_t start = get_us();
    uint64_t deadline = start + 5000000;
    while (get_us() < deadline)
    {
        int num_primes = count_primes(1000000);
        if (num_primes != 78498)
        {
            fprintf(stderr, "Wrong answer: %d\n", num_primes);
            return 1;
        }
        iterations++;
    }
    uint64_t duration_us = get_us() - start;
    printf("%d iterations, average %.3f ms/iteration\n", iterations, duration_us / 1000. / iterations);
}

static uint64_t get_us()
{
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return ts.tv_sec * 1000000ul + ts.tv_nsec / 1000;
}
