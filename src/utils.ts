type Mutable<T> = { -readonly [Key in keyof T]: T[Key]}
