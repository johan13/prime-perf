CC := gcc
CFLAGS := -O3 -Wall -march=skylake

sieve: main.o primes.o
	$(CC) -s -o sieve $^ -lm

.PHONY: clean
clean:
	$(RM) sieve main.o primes.o
