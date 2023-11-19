# TypeScript type-level binary arithmetic

## Overview

This project abuses the capabilities of TypeScript to perform arithmetic operations at the type level, entirely during compile time.

The primary objectives are to add numbers and sort an array of numbers, all at the type level, without any runtime execution.

The end result? Two functions whose outputs are determined by their return types. For a practical demonstration, see the `playground.ts` file.

`sumStr` adds two string representations of integers, returning a number type.

```ts
const x = sumStr("23", "32");
//    ^? const x:55
```

`sortStr` takes an array of strings representing integers and sorts them, returning a number array type.

```ts
const xs = ["3", "1", "2", "0"] as const;
const sortedXs = sortStr(xs);
//    ^? sortedXs = [0, 1, 2, 3];
```

And here's the kicker: these functions have empty bodies! This might just make TypeScript the fastest language in the universe, with a runtime of precisely zero. 😉️ Just a bit of fun, but it's fascinating what's possible, isn't it?

## Approach

### Arithmetics

We will build it all up from the bits,
simulating logical circuits of a arithmetic logic unit of a CPU.
For a detailed look at how these arithmetic operations are implemented,
see the
[binary-alu.ts](https://github.com/psea/typescript-typelevel-binary-arithmetic/blob/main/src/binary-alu.ts) file.

Inspiration: [Adder on Wikipedia](<https://en.wikipedia.org/wiki/Adder_(electronics)>)

A Bit is a type that can be either 0 or 1.

```ts
type Bit = 0 | 1;
```

We then define binary operations like `Not`, `Or`, `And`, etc.,
which operates on `Bit`s.

```ts
type Or<A extends Bit, B extends Bit> = [A, B] extends [0, 0] ? 0 : 1;
```

_**Binary number**_ is an array of `Bit`s

```ts
type BinaryNumber = Array<Bit>;
```

We've also got some handy utility types for getting the first and last bits of a binary number, along with its size.

```ts
type FirstBit<T extends BinaryNumber> = T extends [infer First, ...any]
  ? First
  : 0;
type Size<T extends BinaryNumber> = T["length"];
```

The heart of our arithmetic is the half-adder,
a logical operation that takes two bits and returns their sum and a carry bit.

Given two `Bit`s half-adder returns a named tuple with Sum and Carry bits.

```ts
type HalfAdder<A extends Bit, B extends Bit> = [S: Xor<A, B>, CO: And<A, B>];
```

Having that we will build a full-adder. Full-adder is capable of taking two bits, a carry bit and produce a sum and a carry bit for the next operation.

```ts
type FullAdder<A extends Bit, B extends Bit, CI extends Bit> = HalfAdder<
  A,
  B
> extends [infer HA1S extends Bit, infer HA1CO extends Bit]
  ? HalfAdder<CI, HA1S> extends [
      infer HA2S extends Bit,
      infer HA2CO extends Bit
    ]
    ? [S: HA2S, CO: Or<HA1CO, HA2CO>]
    : never
  : never;
```

Then the adder is just a series of full-adders taking corresponding bits from
the binary number and passing carry bit from one adder to the next.
We implement that recursively, taking last bits of the binary number
and recurse on the rest.

```ts
type Adder<
  A extends BinaryNumber,
  B extends BinaryNumber,
  CI extends Bit = 0
> = [Size<A>, Size<B>] extends [0, 0]
  ? []
  : FullAdder<LastBit<A>, LastBit<B>, CI> extends [
      infer S,
      infer CO extends Bit
    ]
  ? [...Adder<Head<A>, Head<B>, CO>, S]
  : never;
```

And we are done!
`Adder` type is capable of producing a binary sum of two binary numbers.

For the `sumStr` function we will create
a `FromString` function to convert decimal integer string to a `BinaryNumber`
and a `ToNumber` string converting `BinaryNumber` to a proper `number` type.

Having that `AddStr` would convert two strings to binary numbers, add them together, and convert it to a `number`.

```ts
type AddStr<A extends string, B extends string> = ToNumber<
  Adder<FromString<A>, FromString<B>>
>;
```

### Sorting

Sorting algorithm would need a way to compare numbers -
`Compare` type compares two binary numbers. The `Compare` type works by
recursively comparing the bits of two binary numbers from the most significant bit to the least significant bit.

Before each type in the implementation, there is a comment
with an equivalent Haskell program,
which helps to draw parallels with functional programming concepts.
For more details, see the implementation in
[sort.ts](https://github.com/psea/typescript-typelevel-binary-arithmetic/blob/main/src/sort.ts) file.

## Kindred Spirits

For further reading and similar projects, check out:

[4-Bit Virtual Machine](https://gist.github.com/acutmore/9d2ce837f019608f26ff54e0b1c23d6e)

[Binary Arithmetic](https://blog.joshuakgoldberg.com/binary-arithmetic/)
