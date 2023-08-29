type First<T extends any[]> = T extends [infer First, ...any] ? First : never 
type Last<T extends any[]> = T extends [...any, infer Last] ? Last : never 
type Head<T extends any[]> = T extends [...infer Head, any] ? Head : []
type Tail<T extends any[]> = T extends [any, ...infer Tail] ? Tail : []

type TupleOfLength<N extends number, E = any, Acc extends Array<E> = [], I extends ANum.ANum = ANum.Zero> = 
  ANum.ToNumber<I> extends N ? Acc : TupleOfLength<N, E, [E, ...Acc], ANum.Inc<I>>

type Split<S> = S extends `${infer First}${infer Rest}` ? [First, ...Split<Rest>] : []
type Join<A extends Array<any>> = A extends [infer First extends string | number | boolean, ...infer Rest] ? `${First}${Join<Rest>}` : ''