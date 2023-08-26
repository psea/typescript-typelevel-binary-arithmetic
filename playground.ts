type S<T, U> = T extends T
  ? U extends U
    ? [T, U]
    : never 
  : never

type Pretty<T> = { [K in keyof T]: T[K] } & {}

type StringLen<N extends number, A extends any[]> = A["length"] extends N ? A : StringLen<N, [' ', ...A]>
type JoinArray<A extends any[]> = A extends [infer First extends string, ...infer Rest] ? `${First}${JoinArray<Rest>}` : '' 
type BuildLine<N extends number> = JoinArray<StringLen<N, []>>

// type Line = StringLen<5, []>
// type LineS = JoinArray<Line>
// type Line5 = BuildLine<5>
// 
// type XtoFixedStringMap = ['000', '001', '002', '003']
// type XtoFixedString<X extends number> = XtoFixedStringMap[X]
// type T1 = XtoFixedString<0>
// type C = {[K in XtoFixedStringMap[number]]: '      '}
// 
// type Test = S<'x' | 'y' | 'z', 'x' | 'y' | 'z'>
// type St = Line5 extends infer line ? [{'a': line; 'b': line }] : never
