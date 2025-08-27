import { DomainError } from "../common/UnitTypes"

/**
 * Domain-driven portion units following DDD value object patterns
 * Represents the different ways food portions can be measured
 * Based on research of food portion estimation methods and FDA guidelines
 */
export enum PortionUnit {
  // Weight-based (most precise)
  GRAMS = "g",
  KILOGRAMS = "kg",
  
  // Volume-based 
  MILLILITERS = "ml",
  LITERS = "l",
  CUP = "cup",
  TABLESPOON = "tbsp",
  TEASPOON = "tsp",
  
  // Count-based (common for packaged foods)
  PIECE = "piece",
  SLICE = "slice",
  SERVING = "serving",
  PORTION = "portion",
  
  // Container-based
  BOTTLE = "bottle",
  CAN = "can",
  
  // Special cases
  PER_100G = "100g" // Standardized nutritional reference
}

/**
 * Domain error for invalid portion unit operations
 */
export class InvalidPortionUnitError extends DomainError {
  readonly code = "INVALID_PORTION_UNIT"
  
  constructor(unit: string) {
    super(`Invalid portion unit: ${unit}`)
  }
}

/**
 * Utility functions for PortionUnit domain logic
 * Following DDD patterns: behavior close to data, immutable operations
 */
export class PortionUnitUtils {
  
  /**
   * Parse string to PortionUnit with validation
   * Research: Based on FDA serving size guidance and OpenFoodFacts API patterns
   */
  static fromString(unitString: string): PortionUnit {
    const normalized = unitString.toLowerCase().trim()
    
    // Container units (check these FIRST before volume units)
    if (normalized.includes("bottle") || normalized.includes("bouteille")) return PortionUnit.BOTTLE
    if (normalized.includes("can") || normalized.includes("canette")) return PortionUnit.CAN
    
    // Count-based units (check before volume units that might contain 'l')
    if (normalized.includes("slice") || normalized.includes("tranche")) return PortionUnit.SLICE
    if (normalized.includes("piece") || normalized.includes("pièce")) return PortionUnit.PIECE
    if (normalized.includes("serving") || normalized.includes("portion")) return PortionUnit.SERVING
    
    // Weight units (check more specific first)
    if (normalized.includes("kg")) return PortionUnit.KILOGRAMS
    if (normalized.includes("per 100g") || normalized.includes("pour 100g")) return PortionUnit.PER_100G
    if (normalized.includes("g") && !normalized.includes("kg")) return PortionUnit.GRAMS
    
    // Volume units (check ml before l to avoid false matches)
    if (normalized.includes("ml")) return PortionUnit.MILLILITERS
    if (normalized.includes("tbsp") || normalized.includes("tablespoon")) return PortionUnit.TABLESPOON
    if (normalized.includes("tsp") || normalized.includes("teaspoon")) return PortionUnit.TEASPOON
    if (normalized.includes("cup") || normalized.includes("tasse")) return PortionUnit.CUP
    if (normalized === "l" || (normalized.match(/^\d+(\.\d+)?\s*l$/) && !normalized.includes("ml"))) return PortionUnit.LITERS
    
    throw new InvalidPortionUnitError(unitString)
  }
  
  /**
   * Check if unit represents a weight measurement
   * Useful for direct gram conversions vs approximations
   */
  static isWeightBased(unit: PortionUnit): boolean {
    return [PortionUnit.GRAMS, PortionUnit.KILOGRAMS, PortionUnit.PER_100G].includes(unit)
  }
  
  /**
   * Check if unit represents a volume measurement  
   * Volume often approximates to weight for food (1ml ≈ 1g for most foods)
   */
  static isVolumeBased(unit: PortionUnit): boolean {
    return [
      PortionUnit.MILLILITERS, 
      PortionUnit.LITERS, 
      PortionUnit.CUP, 
      PortionUnit.TABLESPOON, 
      PortionUnit.TEASPOON
    ].includes(unit)
  }
  
  /**
   * Check if unit requires food-specific conversion factors
   * Count and container-based units need context (e.g., "1 slice of bread" vs "1 slice of pizza")
   */
  static requiresContextualConversion(unit: PortionUnit): boolean {
    return [
      PortionUnit.PIECE,
      PortionUnit.SLICE, 
      PortionUnit.SERVING,
      PortionUnit.PORTION,
      PortionUnit.BOTTLE,
      PortionUnit.CAN
    ].includes(unit)
  }
  
  /**
   * Get display name for UI (supports internationalization)
   */
  static getDisplayName(unit: PortionUnit, locale: string = "fr"): string {
    const displayNames = {
      fr: {
        [PortionUnit.GRAMS]: "grammes",
        [PortionUnit.KILOGRAMS]: "kilogrammes", 
        [PortionUnit.MILLILITERS]: "millilitres",
        [PortionUnit.LITERS]: "litres",
        [PortionUnit.CUP]: "tasse",
        [PortionUnit.TABLESPOON]: "cuillère à soupe",
        [PortionUnit.TEASPOON]: "cuillère à café",
        [PortionUnit.PIECE]: "pièce",
        [PortionUnit.SLICE]: "tranche",
        [PortionUnit.SERVING]: "portion",
        [PortionUnit.PORTION]: "portion",
        [PortionUnit.BOTTLE]: "bouteille", 
        [PortionUnit.CAN]: "canette",
        [PortionUnit.PER_100G]: "pour 100g"
      },
      en: {
        [PortionUnit.GRAMS]: "grams",
        [PortionUnit.KILOGRAMS]: "kilograms",
        [PortionUnit.MILLILITERS]: "milliliters", 
        [PortionUnit.LITERS]: "liters",
        [PortionUnit.CUP]: "cup",
        [PortionUnit.TABLESPOON]: "tablespoon",
        [PortionUnit.TEASPOON]: "teaspoon",
        [PortionUnit.PIECE]: "piece",
        [PortionUnit.SLICE]: "slice", 
        [PortionUnit.SERVING]: "serving",
        [PortionUnit.PORTION]: "portion",
        [PortionUnit.BOTTLE]: "bottle",
        [PortionUnit.CAN]: "can",
        [PortionUnit.PER_100G]: "per 100g"
      }
    }
    
    return displayNames[locale as keyof typeof displayNames]?.[unit] || displayNames.en[unit] || unit
  }
}