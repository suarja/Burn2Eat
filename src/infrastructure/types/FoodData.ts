/**
 * Type definitions for food dataset infrastructure
 */

export type FoodCategory = "fast-food" | "dessert" | "beverage" | "snack" | "fruit" | "main-course"

export type PortionUnit = "piece" | "100g" | "cup" | "slice" | "serving" | "bottle" | "can"

export interface FoodNames {
  en: string
  fr: string
}

export interface PortionSize {
  amount: number
  unit: PortionUnit
}

export interface FoodDescription {
  en?: string
  fr?: string
}

/**
 * Core food data structure for the static dataset
 * Contains all information needed for nutrition domain
 */
export interface FoodData {
  /** Unique identifier for the food item */
  id: string

  /** Localized names */
  names: FoodNames

  /** Calories per standard portion */
  calories: number

  /** Standard portion size definition */
  portionSize: PortionSize

  /** Food category for organization */
  category: FoodCategory

  /** URL to food image (Unsplash or other libre source) */
  imageUrl: string

  /** Optional Unsplash photo ID for traceability */
  unsplashId?: string

  /** Optional localized descriptions */
  description?: FoodDescription

  /** Tags for search functionality */
  tags?: string[]
}

/**
 * Validation result for food data
 */
export interface FoodDataValidation {
  isValid: boolean
  errors: string[]
}
