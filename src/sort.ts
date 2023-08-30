// mergeSplitAcc [] xs ys = [xs, ys]
// mergeSplitAcc [x] xs ys = [x:xs, ys]
// mergeSplitAcc (x:y:rest) xs ys = mergeSplitAcc rest (x:xs) (y:ys)
// 
// mergeSplit xs = mergeSplitAcc xs [] []

type MergeSplit<T extends BinaryNumber[], Xs extends BinaryNumber[] = [], Ys extends BinaryNumber[] = []> = 
  T extends [infer X] 
    ? [[...Xs, X], Ys]
    : T extends [infer X extends BinaryNumber, infer Y extends BinaryNumber, ...infer Rest extends BinaryNumber[]]
      ? MergeSplit<Rest, [...Xs, X], [...Ys, Y]>
      : [Xs, Ys] 

// merge xs [] = xs
// merge [] ys = ys
// merge (x:xs) (y:ys) =
//    if x < y 
//    then x:merge xs (y:ys)
//    else y:merge (x:xs) ys

type Merge<Xs extends BinaryNumber[], Ys extends BinaryNumber[]> =
  Xs extends [] ? Ys :
  Ys extends [] ? Xs :
  [Xs, Ys] extends [[infer X extends BinaryNumber, ...infer Xs extends BinaryNumber[]], [infer Y extends BinaryNumber, ...infer Ys extends BinaryNumber[]]]
    ? Compare<X, Y> extends 'LT'
      ? [X, ...Merge<Xs, [Y, ...Ys]>]
      : [Y, ...Merge<[X, ...Xs], Ys>]
    : never 

// mergeSort :: (Ord a) => [a] -> [a]
// mergeSort [] = []
// mergeSort [x] = [x]
// mergeSort xs = 
//   let [ls, rs] = mergeSplit xs
//   in merge (mergeSort ls) (mergeSort rs)

type MergeSort<Xs extends Array<BinaryNumber>> =
  Xs['length'] extends 1 | 0
    ? Xs
    : MergeSplit<Xs> extends [infer Ls extends Array<BinaryNumber>, infer Rs extends Array<BinaryNumber>]
      ? Merge<MergeSort<Ls>, MergeSort<Rs>>
      : never

type SortNumberStr<Xs extends readonly string[]> = MapToNumbers<MergeSort<MapFromStrings<Mutable<Xs>>>>

type SN1 = SortNumberStr<['3', '1', '2', '0']>
  
declare function sortStr<A extends readonly string[]>(xs: A): SortNumberStr<A>
