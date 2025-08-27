import { useCallback, useState, useEffect } from "react"

import { Grams, Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"
import { CalculateEffortOutput } from "@/application/usecases"
import type { SimpleDish } from "@/navigators/AppNavigator"

import { useCurrentProfile } from "./useUserProfile"
import { usePortionCalculation } from "./usePortionCalculation"
import { useFoodCatalog } from "./useFoodData"

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

  // Dependencies
  const { profile, loading: profileLoading } = useCurrentProfile()
  const {
    actions: { calculateEffortForDish, findDish }
  } = useFoodCatalog()
  
  // Portion calculation hook
  const {
    result: portionResult,
    loading: portionLoading,
    error: portionError,
    calculateFromFoodId,
    calculateFromDish,
    updateSelectedGrams
  } = usePortionCalculation()

  /**
   * Initialize calculation from food ID (traditional search flow)
   */
  const initializeFromFoodId = useCallback(
    async (foodId: string, selectedGrams?: Grams, servingSizeString?: string): Promise<void> => {
      try {
        // Extract food data and create serving size
        // This mirrors the logic from the original ResultScreen
        const dish = findDish(JSON.parse(JSON.stringify(foodId)).value)
        if (!dish) {
          throw new Error(`Dish not found for foodId: ${foodId}`)
        }

        // Use default serving size if not provided
        const defaultGrams = selectedGrams || 21.5 as Grams
        
        await calculateFromFoodId(foodId, defaultGrams, servingSizeString)
      } catch (error) {
        console.error("❌ useResultEffort: Failed to initialize from foodId:", error)
        throw error
      }
    },
    [calculateFromFoodId, findDish]
  )

  /**
   * Initialize calculation from SimpleDish (barcode scanning flow)
   */
  const initializeFromSimpleDish = useCallback(
    async (simpleDish: SimpleDish, selectedGrams?: Grams): Promise<void> => {
      try {
        // Convert SimpleDish to domain Dish
        // This mirrors the convertSimpleDishToDish logic from ResultScreen
        const dish = Dish.create({
          dishId: DishId.from(simpleDish.id),
          name: simpleDish.name,
          nutrition: NutritionalInfo.perServing(simpleDish.calories as Kilocalories),
          imageUrl: undefined // OpenFoodFacts images not handled yet
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
    [calculateFromDish]
  )

  /**
   * Update the selected quantity and recalculate everything
   */
  const updateQuantity = useCallback(
    async (newGrams: Grams): Promise<void> => {
      await updateSelectedGrams(newGrams)
    },
    [updateSelectedGrams]
  )

  /**
   * Effect to calculate effort when portion calculation completes
   */
  useEffect(() => {
    if (!portionResult || !portionResult.adjustedDish || profileLoading || !profile) {
      return
    }

    const calculateEffort = async () => {
      setEffortLoading(true)
      setEffortError(null)

      try {
        console.log(
          `🧮 Calculating effort for ${portionResult.selectedGrams}g of ${portionResult.dish.getName()} (${portionResult.actualCalories} kcal)`
        )

        const effort = await calculateEffortForDish(portionResult.adjustedDish)

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
  }, [portionResult, profileLoading, profile, calculateEffortForDish])

  /**
   * Clear all calculation state
   */
  const clearResults = useCallback((): void => {
    setEffortResult(null)
    setEffortError(null)
    setEffortLoading(false)
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
    actualCalories: portionResult?.actualCalories || null,
    selectedGrams: portionResult?.selectedGrams || null,
    displayContext: portionResult?.displayContext || null,
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
      return portionResult?.originalServingSize.toDisplayString() || "100g"
    },

    get quantityText(): string {
      return portionResult?.displayContext.quantityText || ""
    },

    get primaryEffortMinutes(): number {
      return effortResult?.effort.primary.minutes || 0
    },

    get primaryEffortActivity(): string {
      return effortResult?.effort.primary.activityLabel || ""
    }
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