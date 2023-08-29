// Numbers respresented as tuples (arrays)
namespace ANum {
  export type ANum = Array<any>
  export type Zero = []
  export type One = [any]
  export type Inc<N extends ANum> = [any, ...N]
  export type Add<A extends ANum, B extends ANum> = [...A, ...B]
  export type Mul2<N extends ANum> = [...N, ...N]

  export type ToNumber<N extends ANum> = N['length']

  type BuildTuple<C extends Number, N extends number[]> =
      N["length"] extends C
      ? N
      : BuildTuple<C, [1, ...N]>;

  export type FromNumber<N extends number> = BuildTuple<N, []>

  // type Add<A extends number, B extends number> = AddP<FromNumber<A>, FromNumber<B>>;
  // type Sum<A extends number, B extends number> = Add<A, B> extends infer S
  //     ? S extends number[] ? ToNumber<S> : never
  //     : never;
}