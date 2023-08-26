// type Zero = [];
// 
// type Succ<N extends number[]> = [1, ...N];
// 
// type AddP<A extends number[], B extends number[]> = [...A, ...B];
// 
// type ToNumber<N extends number[]> = N["length"];
// 
// type BuildTuple<C extends Number, N extends number[]> =
//     N["length"] extends C
//     ? N
//     : BuildTuple<C, [1, ...N]>;
// type FromNumber<N extends number> = BuildTuple<N, []>
// 
// type Add<A extends number, B extends number> = AddP<FromNumber<A>, FromNumber<B>>;
// type Sum<A extends number, B extends number> = Add<A, B> extends infer S
//     ? S extends number[] ? ToNumber<S> : never
//     : never;
// 
// type N3 = Succ<Succ<Succ<Zero>>>;
// type N2 = Succ<Succ<Zero>>;

// type N5 = ToNumber<AddP<N2, N3>>