import { Kilocalories } from "../common/UnitTypes"

/**
 * Pure domain entity for nutritional information
 * No dependencies on infrastructure types
 */
export class NutritionalInfo {
  private constructor(
    private readonly calories: Kilocalories,
    private readonly protein?: number,
    private readonly carbs?: number,
    private readonly fat?: number,
  ) {}

  /**
   * Create nutritional info for a standard serving
   */
  static perServing(calories: Kilocalories): NutritionalInfo {
    return new NutritionalInfo(calories)
  }

  /**
   * Create nutritional info with full macronutrient breakdown
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
   * Get calories per serving
   */
  public getCalories(): Kilocalories {
    return this.calories
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
