import { Grams, Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { DishRepository } from "@/domain/nutrition/DishRepository"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"
import { QuantityConverter, DisplayContext } from "@/domain/nutrition/QuantityConverter"
import { ServingSize, InvalidServingSizeError } from "@/domain/nutrition/ServingSize"

/**
 * Input for portion calculation use case
 */
export interface CalculatePortionInput {
  readonly dishId?: string
  readonly dish?: Dish
  readonly servingSizeString?: string
  readonly selectedGrams: Grams
}

/**
 * Output from portion calculation use case
 */
export interface CalculatePortionOutput {
  readonly success: boolean
  readonly error?: string
  readonly result?: PortionCalculationResult
}

/**
 * Result of portion calculation with all necessary UI information
 */
export interface PortionCalculationResult {
  readonly dish: Dish
  readonly originalServingSize: ServingSize
  readonly selectedGrams: Grams
  readonly actualCalories: Kilocalories
  readonly displayContext: DisplayContext
  readonly adjustedDish: Dish // Dish with calories adjusted for selected quantity
}

/**
 * Use case for calculating portion information and adjusted calories
 *
 * Following established patterns from other use cases in the project:
 * - Clear input/output interfaces
 * - Error handling with success/error pattern
 * - Domain logic orchestration
 * - Dependency injection through constructor
 */
export class CalculatePortionUseCase {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly quantityConverter: QuantityConverter = new QuantityConverter(),
  ) {}

  /**
   * Calculate portion information from dish ID and serving details
   */
  async execute(input: CalculatePortionInput): Promise<CalculatePortionOutput> {
    try {
      // Get the dish (either provided or fetched)
      const dish = await this.getDish(input)
      if (!dish) {
        return {
          success: false,
          error: input.dishId ? `Dish not found: ${input.dishId}` : "No dish provided",
        }
      }

      // Parse serving size information
      const servingSize = this.parseServingSize(input, dish)

      // Calculate actual calories for selected grams
      const actualCalories = this.calculateActualCalories(dish, input.selectedGrams)

      // Generate display context
      const displayContext = this.quantityConverter.generateDisplayContext(
        servingSize,
        input.selectedGrams,
      )

      // Create adjusted dish for downstream calculations (like effort calculation)
      const adjustedDish = this.createAdjustedDish(dish, actualCalories)

      return {
        success: true,
        result: {
          dish,
          originalServingSize: servingSize,
          selectedGrams: input.selectedGrams,
          actualCalories,
          displayContext,
          adjustedDish,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("❌ CalculatePortionUseCase: Error calculating portion:", errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  /**
   * Calculate portion info with sensible defaults for missing information
   */
  async executeWithDefaults(input: {
    dish: Dish
    selectedGrams?: Grams
    servingSizeString?: string
  }): Promise<CalculatePortionOutput> {
    const selectedGrams = input.selectedGrams || (100 as Grams)
    const servingSizeString = input.servingSizeString || "100g"

    return this.execute({
      dish: input.dish,
      selectedGrams,
      servingSizeString,
    })
  }

  /**
   * Get suggested portion sizes for a dish
   * Useful for portion selector UI components
   */
  async getSuggestedPortions(input: {
    dishId?: string
    dish?: Dish
    servingSizeString?: string
  }): Promise<{
    success: boolean
    error?: string
    suggestions?: ServingSize[]
  }> {
    try {
      const dish = await this.getDish(input)
      if (!dish) {
        return {
          success: false,
          error: input.dishId ? `Dish not found: ${input.dishId}` : "No dish provided",
        }
      }

      const baseServing = this.parseServingSize(input, dish)
      const suggestions = this.quantityConverter.getSuggestedServings(baseServing)

      return {
        success: true,
        suggestions,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Get or fetch the dish from the input parameters
   */
  private async getDish(input: { dishId?: string; dish?: Dish }): Promise<Dish | null> {
    if (input.dish) {
      return input.dish
    }

    if (input.dishId) {
      try {
        return await this.dishRepository.findById(input.dishId)
      } catch (error) {
        console.warn(`Failed to fetch dish by ID ${input.dishId}:`, error)
        return null
      }
    }

    return null
  }

  /**
   * Parse serving size from input or extract from food data
   */
  private parseServingSize(
    input: {
      servingSizeString?: string
      dishId?: string
    },
    dish: Dish,
  ): ServingSize {
    if (input.servingSizeString) {
      try {
        return this.quantityConverter.parseServingString(input.servingSizeString)
      } catch (error) {
        console.warn(
          `Failed to parse serving size "${input.servingSizeString}", using default:`,
          error,
        )
        return ServingSize.grams(100)
      }
    }

    // Try to extract from food data if we have a dish ID
    if (input.dishId) {
      try {
        // This would need to be extended to work with actual food data structure
        // For now, default to 100g
        return ServingSize.grams(100)
      } catch (error) {
        console.warn("Failed to extract serving size from dish data:", error)
        return ServingSize.grams(100)
      }
    }

    // Default fallback
    return ServingSize.grams(100)
  }

  /**
   * Calculate actual calories for selected grams
   * Uses the dish's nutritional info to scale calories appropriately
   */
  private calculateActualCalories(dish: Dish, selectedGrams: Grams): Kilocalories {
    const nutrition = dish.getNutrition()

    // If nutrition supports per-gram calculation, use it
    if (typeof nutrition.calculateCaloriesForQuantity === "function") {
      return nutrition.calculateCaloriesForQuantity(selectedGrams)
    }

    // Fallback: assume dish calories are per 100g and scale
    const dishCalories = dish.getCalories()
    return ((dishCalories * selectedGrams) / 100) as Kilocalories
  }

  /**
   * Create a new dish with adjusted calories for downstream use cases
   * This dish can be used with CalculateEffortUseCase
   */
  private createAdjustedDish(originalDish: Dish, actualCalories: Kilocalories): Dish {
    const adjustedNutrition = NutritionalInfo.perServing(actualCalories)

    return Dish.create({
      dishId: originalDish.getId(),
      name: originalDish.getName(),
      nutrition: adjustedNutrition,
      imageUrl: originalDish.getImageUrl(),
    })
  }

  /**
   * Validate input parameters
   */
  private validateInput(input: CalculatePortionInput): string[] {
    const errors: string[] = []

    if (!input.dish && !input.dishId) {
      errors.push("Either dish or dishId must be provided")
    }

    if (input.selectedGrams <= 0) {
      errors.push("Selected grams must be positive")
    }

    if (input.selectedGrams > 5000) {
      errors.push("Selected grams exceeds reasonable limit (5000g)")
    }

    return errors
  }

  /**
   * Calculate portion ratio for UI feedback
   * Useful for showing "2x normal serving" etc.
   */
  calculatePortionRatio(originalServing: ServingSize, selectedGrams: Grams): number {
    return this.quantityConverter.calculatePortionRatio(originalServing, selectedGrams)
  }
}
