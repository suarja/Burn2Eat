import { Grams } from "../common/UnitTypes"
import { ServingSize, InvalidServingSizeError } from "./ServingSize"
import { PortionUnit, PortionUnitUtils } from "./PortionUnit"

/**
 * Display context for UI components
 * Encapsulates how serving information should be presented
 */
export interface DisplayContext {
  readonly quantityText: string
  readonly isPerProduct: boolean
  readonly servingDescription: string
}

/**
 * QuantityConverter Domain Service
 * 
 * Following DDD patterns:
 * - Domain service for complex business logic that doesn't belong in entities/value objects
 * - Stateless operations that work with domain objects
 * - Encapsulates conversion rules and business knowledge
 * 
 * Research-based approach:
 * - Based on FDA serving size guidelines
 * - Informed by food portion estimation studies
 * - Handles edge cases from real-world food data
 */
export class QuantityConverter {
  
  /**
   * Parse serving size string with enhanced error handling and validation
   * More robust than the original ResultScreen parsing logic
   */
  parseServingString(input: string): ServingSize {
    if (!input || typeof input !== 'string') {
      throw new InvalidServingSizeError("Serving string cannot be empty")
    }
    
    try {
      return ServingSize.fromString(input)
    } catch (error) {
      // Fallback for unparseable strings - assume 100g
      console.warn(`Failed to parse serving string "${input}", defaulting to 100g:`, error)
      return ServingSize.grams(100)
    }
  }
  
  /**
   * Convert any serving size to grams
   * Handles all the conversion logic that was scattered in ResultScreen
   */
  convertToGrams(amount: number, unit: PortionUnit): Grams {
    if (amount <= 0) {
      throw new InvalidServingSizeError("Amount must be positive")
    }
    
    try {
      // Create a temporary serving size to leverage conversion logic
      const tempServing = ServingSize.fromString(`${amount} ${unit}`)
      return tempServing.toGrams()
    } catch (error) {
      // Fallback to basic conversion
      return this.basicUnitConversion(amount, unit)
    }
  }
  
  /**
   * Basic unit conversion fallback
   * Extracted from original ResultScreen logic
   */
  private basicUnitConversion(amount: number, unit: PortionUnit): Grams {
    const conversionFactors = {
      [PortionUnit.GRAMS]: 1,
      [PortionUnit.KILOGRAMS]: 1000,
      [PortionUnit.MILLILITERS]: 1, // 1ml ≈ 1g approximation
      [PortionUnit.LITERS]: 1000,
      [PortionUnit.CUP]: 200,
      [PortionUnit.TABLESPOON]: 15,
      [PortionUnit.TEASPOON]: 5,
      [PortionUnit.PIECE]: 20,
      [PortionUnit.SLICE]: 30,
      [PortionUnit.SERVING]: 150,
      [PortionUnit.PORTION]: 150,
      [PortionUnit.BOTTLE]: 330,
      [PortionUnit.CAN]: 250,
      [PortionUnit.PER_100G]: 100
    }
    
    const factor = conversionFactors[unit as keyof typeof conversionFactors] || 100 // Default fallback
    return Math.max(1, amount * factor) as Grams
  }
  
  /**
   * Generate display context for UI components
   * Replaces the complex getDisplayContext logic from ResultScreen
   */
  generateDisplayContext(servingSize: ServingSize, selectedGrams: Grams): DisplayContext {
    const context = servingSize.getDisplayContext(selectedGrams)
    
    return {
      quantityText: context.quantityText,
      isPerProduct: context.isPerProduct,
      servingDescription: servingSize.toDisplayString()
    }
  }
  
  /**
   * Extract serving size from food data structure
   * Replaces extractServingSizeFromLocalDish logic from ResultScreen
   */
  extractServingSizeFromFoodData(foodData: {
    portionSize: { amount: number; unit: string }
  }): ServingSize {
    const { amount, unit } = foodData.portionSize
    
    try {
      // Convert portion unit string to standardized format
      const standardizedUnit = this.standardizeUnitString(unit)
      return ServingSize.fromString(`${amount} ${standardizedUnit}`)
    } catch (error) {
      console.warn(`Failed to extract serving size from food data:`, error)
      // Fallback to 100g
      return ServingSize.grams(100)
    }
  }
  
  /**
   * Standardize unit strings from various data sources
   * Handles the unit conversion logic from ResultScreen
   */
  private standardizeUnitString(unit: string): string {
    const normalized = unit.toLowerCase().trim()
    
    // Map various unit representations to standard format
    const unitMappings = {
      "100g": "100g",
      "g": "g",  // Add explicit mapping for grams
      "kg": "kg", // Add explicit mapping for kilograms
      "piece": "piece", 
      "slice": "slice",
      "cup": "cup",
      "serving": "serving",
      "bottle": "bottle",
      "can": "can",
      "ml": "ml",
      "l": "l"
    }
    
    return unitMappings[normalized as keyof typeof unitMappings] || unit // Return original if no mapping found
  }
  
  /**
   * Calculate portion ratio for scaling
   * Useful for quantity selector and portion adjustments
   */
  calculatePortionRatio(originalServing: ServingSize, newGrams: Grams): number {
    const originalGrams = originalServing.toGrams()
    if (originalGrams === 0) return 1
    
    return newGrams / originalGrams
  }
  
  /**
   * Validate serving size constraints
   * Business rules for reasonable portion sizes
   */
  validateServingSize(servingSize: ServingSize): boolean {
    const grams = servingSize.toGrams()
    
    // Business rule: portions should be between 1g and 5000g (5kg)
    if (grams < 1 || grams > 5000) {
      return false
    }
    
    // Business rule: check for reasonable unit amounts
    const amount = servingSize.getAmount()
    const unit = servingSize.getUnit()
    
    if (unit === PortionUnit.PIECE && amount > 50) {
      return false // More than 50 pieces seems unreasonable
    }
    
    if (unit === PortionUnit.SLICE && amount > 20) {
      return false // More than 20 slices seems unreasonable
    }
    
    if (unit === PortionUnit.BOTTLE && amount > 10) {
      return false // More than 10 bottles seems unreasonable
    }
    
    return true
  }
  
  /**
   * Get suggested serving sizes for a food item
   * Provides common portion options for UI
   */
  getSuggestedServings(baseServing: ServingSize): ServingSize[] {
    const suggestions: ServingSize[] = [baseServing]
    
    // Add scaled versions
    try {
      suggestions.push(baseServing.scale(0.5)) // Half portion
      suggestions.push(baseServing.scale(1.5)) // 1.5x portion
      suggestions.push(baseServing.scale(2.0)) // Double portion
    } catch (error) {
      // If scaling fails, just return the base serving
      console.warn("Failed to generate scaled servings:", error)
    }
    
    // Add common gram amounts if not already weight-based
    if (!PortionUnitUtils.isWeightBased(baseServing.getUnit())) {
      suggestions.push(ServingSize.grams(50))
      suggestions.push(ServingSize.grams(100))
      suggestions.push(ServingSize.grams(200))
    }
    
    return suggestions.filter(serving => this.validateServingSize(serving))
  }
  
  /**
   * Compare two serving sizes
   * Useful for UI selection and validation
   */
  compareServings(serving1: ServingSize, serving2: ServingSize): number {
    const grams1 = serving1.toGrams()
    const grams2 = serving2.toGrams()
    
    return grams1 - grams2
  }
  
  /**
   * Format serving size for logging/debugging
   */
  formatForLogging(servingSize: ServingSize): string {
    return `${servingSize.getAmount()} ${servingSize.getUnit()} (${servingSize.toGrams()}g)`
  }
}