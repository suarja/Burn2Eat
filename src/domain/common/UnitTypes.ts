// /domain/common/UnitTypes.ts
export type Kilocalories = number & { readonly __brand: "kcal" }
export type Kilograms = number & { readonly __brand: "kg" }
export type Centimeters = number & { readonly __brand: "cm" }
export type Minutes = number & { readonly __brand: "min" }
export type Grams = number & { readonly __brand: "g" }

// /domain/common/DomainError.ts
export abstract class DomainError extends Error {
  abstract readonly code: string
}

// /domain/common/Result.ts
export type Ok<T> = { ok: true; value: T }
export type Err<E extends DomainError> = { ok: false; error: E }
export type Result<T, E extends DomainError> = Ok<T> | Err<E>
