import { Kilocalories, Grams } from "../common/UnitTypes"

/**
 * Pure domain entity for nutritional information
 * Stores nutritional data per 100g for consistent calculation
 * No dependencies on infrastructure types
 */
export class NutritionalInfo {
  private constructor(
    private readonly caloriesPer100g: Kilocalories,
    private readonly protein?: number,
    private readonly carbs?: number,
    private readonly fat?: number,
  ) {}

  /**
   * Create nutritional info from calories per 100g
   */
  static per100g(calories: Kilocalories): NutritionalInfo {
    return new NutritionalInfo(calories)
  }

  /**
   * Create nutritional info for a standard serving
   * @deprecated Use per100g() and calculateCaloriesForQuantity() instead
   */
  static perServing(calories: Kilocalories): NutritionalInfo {
    return new NutritionalInfo(calories)
  }

  /**
   * Create nutritional info with full macronutrient breakdown (per 100g)
   */
  static withMacros(
    calories: Kilocalories,
    protein: number,
    carbs: number,
    fat: number,
  ): NutritionalInfo {
    return new NutritionalInfo(calories, protein, carbs, fat)
  }

  /**
   * Calculate calories for a specific quantity in grams
   */
  public calculateCaloriesForQuantity(grams: Grams): Kilocalories {
    return ((this.caloriesPer100g * grams) / 100) as Kilocalories
  }

  /**
   * Get calories per 100g
   */
  public getCaloriesPer100g(): Kilocalories {
    return this.caloriesPer100g
  }

  /**
   * Get calories per serving (for backward compatibility)
   * @deprecated Use calculateCaloriesForQuantity() with specific grams instead
   */
  public getCalories(): Kilocalories {
    return this.caloriesPer100g
  }

  /**
   * Get protein content (if available)
   */
  public getProtein(): number | undefined {
    return this.protein
  }

  /**
   * Get carbohydrate content (if available)
   */
  public getCarbs(): number | undefined {
    return this.carbs
  }

  /**
   * Get fat content (if available)
   */
  public getFat(): number | undefined {
    return this.fat
  }

  /**
   * Check if macro breakdown is available
   */
  public hasMacros(): boolean {
    return this.protein !== undefined && this.carbs !== undefined && this.fat !== undefined
  }
}
