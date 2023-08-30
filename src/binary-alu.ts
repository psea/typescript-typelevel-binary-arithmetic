type Bit = 0 | 1

type Not<A extends Bit> = A extends 0 ? 1 : 0
type Or<A extends Bit, B extends Bit> = [A, B] extends [0, 0] ? 0 : 1;
type And<A extends Bit, B extends Bit> = [A, B] extends [1, 1] ? 1 : 0;
type Xor<A extends Bit, B extends Bit> = [A, B] extends [1, 0] | [0, 1]  ? 1 : 0;
type NAnd<A extends Bit, B extends Bit> = Not<And<A, B>>

type BinaryNumber = Array<Bit>
type BEmpty = [];
type BZero = [0];

type FirstBit<T extends BinaryNumber> = T extends [infer First, ...any] ? First : 0
type LastBit<T extends BinaryNumber> = T extends [...any, infer Last] ? Last : 0 
type HeadBits<T extends BinaryNumber> = T extends [...infer Head, any] ? Head : []
type TailBits<T extends BinaryNumber> = T extends [any, ...infer Tail] ? Tail : []
type Size<T extends BinaryNumber> = T['length']

type TakeFirstNBits<T extends BinaryNumber, N extends number, I extends ANum.ANum = ANum.Zero, Acc extends BinaryNumber = BEmpty> =
  ANum.ToNumber<I> extends N 
    ? Acc 
    : Last<T> extends Bit
      ? TakeFirstNBits<Head<T>, N, ANum.Inc<I>, [Last<T>, ...Acc]>
      : never

type AsByte<T extends BinaryNumber> = TakeFirstNBits<[...TupleOfLength<8, 0>, ...T], 8>

type ShiftLeft<T extends BinaryNumber, N extends number, I extends ANum.ANum = ANum.Zero> = 
  N extends ANum.ToNumber<I> ? T : ShiftLeft<[...T, 0], N, ANum.Inc<I>>

type HalfAdder<A extends Bit, B extends Bit> = [S: Xor<A, B>, CO: And<A,B>]

type FullAdder<A extends Bit, B extends Bit, CI extends Bit> = 
  HalfAdder<A, B> extends [infer HA1S extends Bit, infer HA1CO extends Bit] ?
  HalfAdder<CI, HA1S> extends [infer HA2S extends Bit, infer HA2CO extends Bit] ?
  [S: HA2S, CO: Or<HA1CO, HA2CO>]
  : never : never

type Adder<A extends BinaryNumber, B extends BinaryNumber, CI extends Bit = 0> =
  [Size<A>, Size<B>] extends [0, 0]
    ? [] 
    : FullAdder<LastBit<A>, LastBit<B>, CI> extends [infer S, infer CO extends Bit] ?
      [...Adder<Head<A>, Head<B>, CO>, S]
      : never

type Mul10<A extends BinaryNumber> = Adder<ShiftLeft<A, 3>, ShiftLeft<A, 1>>

// TODO https://en.wikipedia.org/wiki/Binary_multiplier

// TODO substraction

type CompareBit<A extends Bit, B extends Bit> = 
  [A, B] extends [1, 0] ? 'GT' :
  [A, B] extends [0, 1] ? 'LT' :
  'EQ'

type Compare<A extends BinaryNumber, B extends BinaryNumber> =
  [Size<A>, Size<B>] extends [0, 0] 
    ? 'EQ' 
    : CompareBit<FirstBit<A>, FirstBit<B>> extends infer R
      ? R extends 'EQ'
        ? Compare<TailBits<A>, TailBits<B>>
        : R
      : never 

// [TODO] have to do padding !! 
type TC1 = Compare<[1, 1, 0], [1, 1]>

// Convert from/to BinaryNumbers

// Convert BinaryNumber to tuple of equal length
type Unwind<A extends Array<Bit>, Acc extends Array<any> = [], P extends ANum.ANum = ANum.One> = 
  A extends [...infer Head extends Array<Bit>, 0] ? 
  Unwind<Head, Acc, ANum.Mul2<P>> :
  A extends [...infer Head extends Array<Bit>, 1] ?
  Unwind<Head, [...P, ...Acc], ANum.Mul2<P>>
  : Acc 

// From BinaryNumber to number
type ToNumber<A extends BinaryNumber> = Unwind<A>['length']

// From array of BinaryNumbers to array of numbers
type MapToNumbers<Xs extends Array<BinaryNumber>> = 
  Xs extends [infer X extends BinaryNumber, ...infer Xs extends Array<BinaryNumber>]
    ? [ToNumber<X>, ...MapToNumbers<Xs>]
    : []

type FromDigit<S> =
  S extends '0' ? [0] :
  S extends '1' ? [1] :
  S extends '2' ? [1, 0] : 
  S extends '3' ? [1, 1] : 
  S extends '4' ? [1, 0, 0] : 
  S extends '5' ? [1, 0, 1] : 
  S extends '6' ? [1, 1, 0] : 
  S extends '7' ? [1, 1, 1] : 
  S extends '8' ? [1, 0, 0, 0] : 
  S extends '9' ? [1, 0, 0, 1] : 
  []

// From decimal string to BinaryNumber
type FromString<S, N extends BinaryNumber = BZero> =
  S extends `${infer First}${infer Rest}`
    ? FromString<Rest, Adder<Mul10<N>, FromDigit<First>>>
    : N

// From array of decimal strings to array of BinaryNumbers
type MapFromStrings<Xs extends Array<string>> =
  Xs extends [infer X, ...infer Xs extends Array<string>]
    ? [FromString<X>, ...MapFromStrings<Xs>]
    : []

type ToBit<S> = S extends '0' ? 0 : 1

type MapToBits<A extends Array<'0' | '1'>> = 
  A extends [infer First, ...infer Rest extends Array<'0'|'1'>] 
    ? [ToBit<First>, ...MapToBits<Rest>] 
    : []

// From binary string to BinaryNumber
// TODO constrain to ony '0' | '1' strings
type FromBinaryString<S extends string> = MapToBits<Split<S>>

// From BinaryNumber to binary string 
type ToBinaryString<A extends BinaryNumber> = Join<A>

// Tests
type Test5 = FromBinaryString<'101'>
type Test5N = ToNumber<Test5>
type Test5x10 = Mul10<Test5>
type Test5x10S = ToBinaryString<Test5x10> 
type Test5x10N = ToNumber<Test5x10> 
type TToNumber = ToNumber<FromBinaryString<'1111111111111'>>

type TA1 = FromBinaryString<'101010'>
type TB1 = FromBinaryString<'010101'>
type TSum1 = ToBinaryString<Adder<TA1, TB1>>

type TA16 = FromBinaryString<'1000100010001000'>
type TB16 = FromBinaryString<'0100100001000100'>
type TSum16 = ToBinaryString<Adder<TA16, TB16>>

type TA32 = FromBinaryString<'10001000100010001000100010001000'>
type TB32 = FromBinaryString<'01001000010001001000100010001000'>
type TSum32 = ToBinaryString<Adder<TA32, TB32>>

type A1 = FromString<'5'>
type N1 = FromString<'127'>
type N2 = FromString<'121'>
type N1N2 = Adder<N1, N2>
type N1N2B = ToBinaryString<N1N2>
type N1N2N = ToNumber<N1N2>

type AddStr<A extends string, B extends string> = ToNumber<Adder<FromString<A>, FromString<B>>>
type Eval1 = AddStr<'1234', '4321'>

declare function sumStr<A extends string, B extends string>(a: A, b: B): AddStr<A, B>;
