// Numbers respresented as tuples (arrays)
type ANum = Array<any>
type ANumZero = []
type ANumOne = [any]
type ANumInc<N extends ANum> = [any, ...N]
type ANumMul2<N extends ANum> = [...N, ...N]
type ANumToNumber<N extends ANum> = N['length']

type TupleOfLength<N extends number, E = any, Acc extends Array<E> = [], I extends ANum = ANumZero> = 
  ANumToNumber<I> extends N ? Acc : TupleOfLength<N, E, [E, ...Acc], ANumInc<I>>

// type Last<T extends any[]> = [any, ...T][T["length"]]
type First<T extends any[]> = T extends [infer First, ...any] ? First : any[]
type Last<T extends any[]> = T extends [...any, infer Last] ? Last : any[] 
type Head<T extends any[]> = T extends [...infer Head, any] ? Head : any[]
type Tail<T extends any[]> = T extends [any, ...infer Tail] ? Tail : any[]

type Falsy = 0 | false
type Truthy = 1 | true
type Bool = 0 | 1

type Not<A extends Bool> = A extends 1 ? 0 : 1

type Or<A extends Bool, B extends Bool> = [A, B] extends [0, 0] ? 0 : 1;

type And<A extends Bool, B extends Bool> = [A, B] extends [1, 1] ? 1 : 0;

type NAnd<A extends Bool, B extends Bool> = Not<And<A, B>>

// type Xor<A extends Bool, B extends Bool> = And<Or<A, B>, NAnd<A,B>>
type Xor<A extends Bool, B extends Bool> = [A, B] extends [1, 0] | [0, 1]  ? 1 : 0;

// [TODO] add tests
type TOr = Or<1, 0>
type TAnd = And<1, 1>
type TXor = Xor<1, 0>

type BinaryNumber = Array<Bool>
type BEmpty = [];
type BZero = [0];

type TakeFirstBits<T extends BinaryNumber, N extends number, I extends ANum = ANumZero, Acc extends BinaryNumber = BEmpty> =
  ANumToNumber<I> extends N 
    ? Acc 
    : Last<T> extends Bool
      ? TakeFirstBits<Head<T>, N, ANumInc<I>, [Last<T>, ...Acc]>
      : never

type AsByte<T extends BinaryNumber> = TakeFirstBits<[...TupleOfLength<8, 0>, ...T], 8>

type ShiftLeft<T extends BinaryNumber, N extends number, I extends ANum = ANumZero> = 
  N extends ANumToNumber<I> ? T : ShiftLeft<[...T, 0], N, ANumInc<I>>

type HalfAdder<A extends Bool, B extends Bool> = [S: Xor<A, B>, CO: And<A,B>]

type FullAdder<A extends Bool, B extends Bool, CI extends Bool> = 
  HalfAdder<A, B> extends [infer HA1S extends Bool, infer HA1CO extends Bool] ?
  HalfAdder<CI, HA1S> extends [infer HA2S extends Bool, infer HA2CO extends Bool] ?
  [S: HA2S, CO: Or<HA1CO, HA2CO>]
  : never : never

type Adder<A extends BinaryNumber, B extends BinaryNumber, CI extends Bool = 0> =
  A['length'] extends B['length'] ?
  Last<A> extends infer LastA extends Bool ?
  Last<B> extends infer LastB extends Bool ?
  FullAdder<LastA, LastB, CI> extends [infer S extends Bool, infer CO extends Bool] ?
  [...Adder<Head<A>, Head<B>, CO>, S]
  : [] : [] : [CI] : ['inputs have to be the same size']

type Mul10Byte<T extends BinaryNumber> = Adder<AsByte<ShiftLeft<T, 3>>, AsByte<ShiftLeft<T, 1>>>

// TODO https://en.wikipedia.org/wiki/Binary_multiplier

// TODO substraction

// TODO compare

type Unwind<A extends Array<Bool>, Acc extends Array<any> = [], P extends ANum = ANumOne> = 
  A extends [...infer Head extends Array<Bool>, 0] ? 
  Unwind<Head, Acc, ANumMul2<P>> :
  A extends [...infer Head extends Array<Bool>, 1] ?
  Unwind<Head, [...P, ...Acc], ANumMul2<P>>
  : Acc 

type ToNumber<A extends Array<Bool>> = Unwind<A>['length']

type FromDigit<S> =
  S extends '0' ? [0] :
  S extends '1' ? [1] :
  S extends '2' ? [1, 0] : 
  S extends '3' ? [1, 1] : 
  []

type FromDigits<S extends string[], N extends BinaryNumber = BZero> = 
  S extends [] 
    ? N
    : FromDigit<First<S>> extends infer X
      ? FromDigits<Tail<S>, Adder<AsByte<Mul10Byte<N>>, AsByte<X>>>
      : never

type FromString<S extends string> = FromDigits<Split<S>>

type TestFromString1 = ToNumber<FromString<'123'>>

type Split<S> = S extends `${infer First}${infer Rest}` ? [First, ...Split<Rest>] : []
type Join<A extends Array<any>> = A extends [infer First extends string | number | boolean, ...infer Rest] ? `${First}${Join<Rest>}` : ''

type ToBool<S> = S extends '0' ? 0 : 1
type MapToBool<A extends Array<'0' | '1'>> = 
  A extends [infer First, ...infer Rest extends Array<'0'|'1'>] 
    ? [ToBool<First>, ...MapToBool<Rest>] 
    : []

// TODO constrain to ony '0' | '1' strings
type ToBinary<S extends string> = MapToBool<Split<S>>

type Test5 = ToBinary<'101'>
type Test5N = ToNumber<Test5>
type Test5x10 = Mul10Byte<Test5>
type Test5x10N = ToNumber<Test5x10> 
//type TToNumber = ToNumber<ToBinary<'1111111111111'>>

type TA1 = ToBinary<'101010'>
type TB1 = ToBinary<'010101'>

type TSum1 = Adder<TA1, TB1>









