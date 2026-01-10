import { useCallback, useState, useEffect } from "react"

import { CalculateEffortOutput } from "@/application/usecases"
import { Grams, Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"
import type { SimpleDish } from "@/navigators/AppNavigator"

import { useFoodCatalog } from "./useFoodData"
import { usePortionCalculation } from "./usePortionCalculation"
import { useCurrentProfile } from "./useUserProfile"

/**
 * Custom hook for managing effort calculation in ResultScreen
 *
 * This hook orchestrates:
 * - Portion calculation (serving size, quantity, calories)
 * - Effort calculation (exercise time required)
 * - State management for loading and error states
 * - Integration between portion and effort calculations
 *
 * Following DDD principles:
 * - Uses domain-driven use cases
 * - Encapsulates complex business logic
 * - Provides clean API for UI consumption
 */
export const useResultEffort = () => {
  // State for effort calculation
  const [effortResult, setEffortResult] = useState<CalculateEffortOutput | null>(null)
  const [effortLoading, setEffortLoading] = useState(false)
  const [effortError, setEffortError] = useState<string | null>(null)

  // Track the flow type to determine calorie calculation method
  const [flowType, setFlowType] = useState<"foodId" | "simpleDish" | null>(null)

  // Dependencies
  const { profile, loading: profileLoading } = useCurrentProfile()
  const {
    actions: { calculateEffortForDish, findDish },
  } = useFoodCatalog()

  // Portion calculation hook
  const {
    result: portionResult,
    loading: portionLoading,
    error: portionError,
    calculateFromFoodId,
    calculateFromDish,
    updateSelectedGrams,
  } = usePortionCalculation()

  /**
   * Initialize calculation from food ID (traditional search flow)
   * Uses full dish calories (not portion-based) to match original behavior
   */
  const initializeFromFoodId = useCallback(
    async (foodId: string, selectedGrams?: Grams, servingSizeString?: string): Promise<void> => {
      try {
        // Set flow type for proper calorie calculation
        setFlowType("foodId")

        // Use default serving size if not provided
        const defaultGrams = selectedGrams || (21.5 as Grams)

        // Let the CalculatePortionUseCase handle dish lookup internally
        await calculateFromFoodId(foodId, defaultGrams, servingSizeString)
      } catch (error) {
        console.error("❌ useResultEffort: Failed to initialize from foodId:", error)
        throw error
      }
    },
    [calculateFromFoodId],
  )

  /**
   * Initialize calculation from SimpleDish (barcode scanning flow)
   */
  const initializeFromSimpleDish = useCallback(
    async (simpleDish: SimpleDish, selectedGrams?: Grams): Promise<void> => {
      try {
        // Set flow type for proper calorie calculation
        setFlowType("simpleDish")

        // Convert SimpleDish to domain Dish
        // This mirrors the convertSimpleDishToDish logic from ResultScreen
        const dish = Dish.create({
          dishId: DishId.from(simpleDish.id),
          name: simpleDish.name,
          nutrition: NutritionalInfo.perServing(simpleDish.calories as Kilocalories),
          imageUrl: undefined, // OpenFoodFacts images not handled yet
        })

        // Use actual serving size from OpenFoodFacts or default
        const servingSizeString = simpleDish.servingSize || "100g"
        const defaultGrams = selectedGrams || parseServingSizeToGrams(servingSizeString)

        await calculateFromDish(dish, defaultGrams, servingSizeString)
      } catch (error) {
        console.error("❌ useResultEffort: Failed to initialize from SimpleDish:", error)
        throw error
      }
    },
    [calculateFromDish],
  )

  /**
   * Update the selected quantity and recalculate everything
   */
  const updateQuantity = useCallback(
    async (newGrams: Grams): Promise<void> => {
      await updateSelectedGrams(newGrams)
    },
    [updateSelectedGrams],
  )

  /**
   * Effect to calculate effort when portion calculation completes
   */
  useEffect(() => {
    if (!portionResult || !portionResult.adjustedDish || !profile || !flowType) {
      return
    }

    const calculateEffort = async () => {
      setEffortLoading(true)
      setEffortError(null)

      try {
        // Apply correct calorie calculation based on flow type
        // This restores the original ResultScreen behavior
        let finalCalories: Kilocalories
        let adjustedDish: Dish

        if (flowType === "foodId") {
          // HomeScreen flow: Use full dish calories (original behavior)
          finalCalories = portionResult.dish.getCalories()
          console.log(`🍔 HomeScreen flow: Using full dish calories (${finalCalories} kcal)`)
        } else {
          // SimpleDish/Barcode flow: Use portion-based calories (original behavior)
          finalCalories = portionResult.actualCalories
          console.log(
            `📱 Barcode flow: Using portion calories (${finalCalories} kcal for ${portionResult.selectedGrams}g)`,
          )
        }

        // Create adjusted dish with correct calories for effort calculation
        adjustedDish = Dish.create({
          dishId: portionResult.dish.getId(),
          name: portionResult.dish.getName(),
          nutrition: NutritionalInfo.perServing(finalCalories),
          imageUrl: portionResult.dish.getImageUrl(),
        })

        console.log(
          `🧮 Calculating effort for ${portionResult.dish.getName()} (${finalCalories} kcal)`,
        )

        const effort = await calculateEffortForDish(adjustedDish)

        if (!effort) {
          throw new Error("No effort calculated")
        }

        console.log("✅ Effort calculated successfully:", effort.effort.primary.minutes, "min")
        setEffortResult(effort)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("❌ Error calculating effort:", errorMessage)
        setEffortError(errorMessage)
        setEffortResult(null)
      } finally {
        setEffortLoading(false)
      }
    }

    calculateEffort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Note: calculateEffortForDish is intentionally omitted to prevent infinite loops
    // The function is stable within the component lifecycle and the real dependencies
    // are portionResult, profile, and flowType data, which capture the calculation inputs
  }, [portionResult, profile, flowType])

  /**
   * Clear all calculation state
   */
  const clearResults = useCallback((): void => {
    setEffortResult(null)
    setEffortError(null)
    setEffortLoading(false)
    setFlowType(null)
  }, [])

  // Computed loading state (true if any calculation is in progress)
  const loading = portionLoading || effortLoading || profileLoading

  // Computed error state (first error encountered)
  const error = portionError || effortError

  // Check if results are ready for display
  const isReady = !loading && !error && portionResult && effortResult

  return {
    // State
    loading,
    error,
    isReady,

    // Portion calculation results
    portionResult,
    dish: portionResult?.dish || null,
    // Apply correct calorie calculation for UI display
    actualCalories: (() => {
      if (!portionResult || !flowType) return null
      if (flowType === "foodId") {
        // HomeScreen: Show full dish calories
        return portionResult.dish.getCalories()
      } else {
        // Barcode: Show portion-based calories
        return portionResult.actualCalories
      }
    })(),
    selectedGrams: portionResult?.selectedGrams || null,
    // Apply correct display context based on flow type
    displayContext: (() => {
      if (!portionResult || !flowType) return null

      if (flowType === "foodId") {
        // HomeScreen: Force display for whole dish (like "pour 1 burger" or "pour 1 portion")
        // Based on the original serving size, determine the appropriate unit text
        const originalServingString = portionResult.originalServingSize.toDisplayString()
        const normalized = originalServingString.toLowerCase().trim()

        // Detect the type of food and show appropriate context
        if (normalized.includes("pièce") || normalized.includes("piece")) {
          return {
            quantityText: "pour 1 pièce",
            servingDescription: originalServingString,
            isPerProduct: true,
          }
        } else if (normalized.includes("tranche") || normalized.includes("slice")) {
          return {
            quantityText: "pour 1 tranche",
            servingDescription: originalServingString,
            isPerProduct: true,
          }
        } else if (normalized.includes("bouteille") || normalized.includes("bottle")) {
          return {
            quantityText: "pour 1 bouteille",
            servingDescription: originalServingString,
            isPerProduct: true,
          }
        } else if (normalized.includes("canette") || normalized.includes("can")) {
          return {
            quantityText: "pour 1 canette",
            servingDescription: originalServingString,
            isPerProduct: true,
          }
        } else {
          // Default: show as portion for whole dish
          return {
            quantityText: "pour 1 portion",
            servingDescription: originalServingString,
            isPerProduct: true,
          }
        }
      } else {
        // Barcode: Use portion-based context as calculated
        return portionResult.displayContext
      }
    })(),
    originalServingSize: portionResult?.originalServingSize || null,

    // Effort calculation results
    effortResult,
    primaryEffort: effortResult?.effort.primary || null,
    alternativeEfforts: effortResult?.effort.alternatives || [],

    // Actions
    initializeFromFoodId,
    initializeFromSimpleDish,
    updateQuantity,
    clearResults,

    // Convenience getters for common UI patterns
    get suggestedServing(): string {
      if (!portionResult || !flowType) return "100g"

      if (flowType === "foodId") {
        // HomeScreen: Show the whole dish as suggested serving with gram weight
        const originalServingString = portionResult.originalServingSize.toDisplayString()
        const normalized = originalServingString.toLowerCase().trim()
        const dishTotalCalories = portionResult.dish.getCalories()
        const caloriesPer100g = portionResult.dish.getNutrition().getCalories()

        // Calculate total grams for the whole dish (reverse from calories)
        const totalGrams = Math.round((dishTotalCalories / caloriesPer100g) * 100)

        // Return appropriate whole dish serving with weight
        if (normalized.includes("pièce") || normalized.includes("piece")) {
          return `1 pièce (${totalGrams}g)`
        } else if (normalized.includes("tranche") || normalized.includes("slice")) {
          return `1 tranche (${totalGrams}g)`
        } else if (normalized.includes("bouteille") || normalized.includes("bottle")) {
          return `1 bouteille (${totalGrams}ml)`
        } else if (normalized.includes("canette") || normalized.includes("can")) {
          return `1 canette (${totalGrams}ml)`
        } else {
          return `1 portion (${totalGrams}g)`
        }
      } else {
        // Barcode: Show original calculated serving size
        return portionResult.originalServingSize.toDisplayString()
      }
    },

    get quantityText(): string {
      return portionResult?.displayContext.quantityText || ""
    },

    get primaryEffortMinutes(): number {
      return effortResult?.effort.primary.minutes || 0
    },

    get primaryEffortActivity(): string {
      return effortResult?.effort.primary.activityLabel || ""
    },
  }
}

/**
 * Helper function extracted from original ResultScreen
 * TODO: This should eventually be moved to the domain layer
 */
function parseServingSizeToGrams(servingSize: string): Grams {
  if (!servingSize) return 100 as Grams

  const normalized = servingSize.toLowerCase().trim()
  const numMatch = normalized.match(/(\d+(?:\.\d+)?|\d+(?:,\d+)?)/)
  const numValue = numMatch ? parseFloat(numMatch[1].replace(",", ".")) : 100

  if (normalized.includes("g")) {
    return Math.max(1, numValue) as Grams
  }

  // Convert common serving units to estimated grams
  if (normalized.includes("slice") || normalized.includes("tranche")) {
    return Math.max(30, numValue * 30) as Grams
  }

  if (normalized.includes("piece") || normalized.includes("pièce")) {
    return Math.max(20, numValue * 20) as Grams
  }

  if (normalized.includes("ml") || normalized.includes("l")) {
    return Math.max(1, numValue) as Grams
  }

  if (normalized.includes("cup") || normalized.includes("tasse")) {
    return Math.max(200, numValue * 200) as Grams
  }

  if (normalized.includes("portion") || normalized.includes("serving")) {
    return Math.max(150, numValue * 150) as Grams
  }

  if (normalized.includes("bottle") || normalized.includes("bouteille")) {
    return Math.max(330, numValue * 330) as Grams
  }

  if (normalized.includes("can") || normalized.includes("canette")) {
    return Math.max(250, numValue * 250) as Grams
  }

  return Math.max(1, numValue) as Grams
}
