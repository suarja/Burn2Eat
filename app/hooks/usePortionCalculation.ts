import { useCallback, useState } from "react"

import { Grams, Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { ServingSize } from "@/domain/nutrition/ServingSize"
import { DisplayContext } from "@/domain/nutrition/QuantityConverter"
import { 
  CalculatePortionInput,
  CalculatePortionOutput,
  PortionCalculationResult
} from "@/application/usecases/CalculatePortionUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for portion calculation management
 * 
 * Following modern React DDD patterns (2024):
 * - Encapsulates business logic through use cases
 * - Provides clean state management for UI
 * - Maintains separation of concerns
 * - Enables independent testing
 * 
 * This hook bridges the domain layer (ServingSize, QuantityConverter) 
 * and the UI layer (ResultScreen component)
 */
export const usePortionCalculation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PortionCalculationResult | null>(null)

  const calculatePortionUseCase = Dependencies.calculatePortionUseCase()

  /**
   * Calculate portion information from dish and serving details
   */
  const calculatePortion = useCallback(
    async (input: CalculatePortionInput): Promise<CalculatePortionOutput> => {
      setLoading(true)
      setError(null)

      try {
        const calculationResult = await calculatePortionUseCase.execute(input)

        if (calculationResult.success && calculationResult.result) {
          setResult(calculationResult.result)
        } else {
          console.warn("❌ usePortionCalculation: Failed to calculate portion:", calculationResult.error)
          setError(calculationResult.error || "Failed to calculate portion")
          setResult(null)
        }

        return calculationResult
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("💥 usePortionCalculation: Exception during calculation:", errorMessage)
        setError(errorMessage)
        setResult(null)
        
        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [calculatePortionUseCase]
  )

  /**
   * Calculate portion with sensible defaults (simplified API for common use cases)
   */
  const calculatePortionWithDefaults = useCallback(
    async (input: {
      dish: Dish
      selectedGrams?: Grams
      servingSizeString?: string
    }): Promise<CalculatePortionOutput> => {
      return calculatePortionUseCase.executeWithDefaults(input)
    },
    [calculatePortionUseCase]
  )

  /**
   * Calculate portion from food ID and serving string
   * Useful for traditional food search flow
   */
  const calculateFromFoodId = useCallback(
    async (dishId: string, selectedGrams: Grams, servingSizeString?: string): Promise<CalculatePortionOutput> => {
      return calculatePortion({
        dishId,
        selectedGrams,
        servingSizeString
      })
    },
    [calculatePortion]
  )

  /**
   * Calculate portion from dish object directly
   * Useful for barcode scanning flow
   */
  const calculateFromDish = useCallback(
    async (dish: Dish, selectedGrams: Grams, servingSizeString?: string): Promise<CalculatePortionOutput> => {
      return calculatePortion({
        dish,
        selectedGrams,
        servingSizeString
      })
    },
    [calculatePortion]
  )

  /**
   * Get suggested portion sizes for a dish
   */
  const getSuggestedPortions = useCallback(
    async (input: {
      dishId?: string
      dish?: Dish
      servingSizeString?: string
    }) => {
      setLoading(true)
      setError(null)

      try {
        const result = await calculatePortionUseCase.getSuggestedPortions(input)
        
        if (!result.success) {
          setError(result.error || "Failed to get suggested portions")
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [calculatePortionUseCase]
  )

  /**
   * Update selected quantity and recalculate
   * Useful for quantity selector interactions
   */
  const updateSelectedGrams = useCallback(
    async (newGrams: Grams): Promise<void> => {
      if (!result) {
        console.warn("No current calculation result to update")
        return
      }

      // Recalculate with new grams using the same dish and serving info
      await calculatePortion({
        dish: result.dish,
        selectedGrams: newGrams,
        servingSizeString: result.originalServingSize.toDisplayString()
      })
    },
    [result, calculatePortion]
  )

  /**
   * Clear current calculation state
   */
  const clearCalculation = useCallback((): void => {
    setResult(null)
    setError(null)
    setLoading(false)
  }, [])

  /**
   * Get portion ratio for UI feedback
   */
  const getPortionRatio = useCallback((): number | null => {
    if (!result) return null
    
    return calculatePortionUseCase.calculatePortionRatio(
      result.originalServingSize,
      result.selectedGrams
    )
  }, [result, calculatePortionUseCase])

  /**
   * Format portion information for display
   */
  const getDisplayInfo = useCallback((): {
    quantityText: string
    servingDescription: string
    isPerProduct: boolean
  } | null => {
    if (!result) return null

    return {
      quantityText: result.displayContext.quantityText,
      servingDescription: result.displayContext.servingDescription,
      isPerProduct: result.displayContext.isPerProduct
    }
  }, [result])

  return {
    // State
    loading,
    error,
    result,

    // Actions
    calculatePortion,
    calculatePortionWithDefaults,
    calculateFromFoodId,
    calculateFromDish,
    getSuggestedPortions,
    updateSelectedGrams,
    clearCalculation,

    // Computed values
    getPortionRatio,
    getDisplayInfo,

    // Convenience getters for common UI needs
    get dish() { return result?.dish || null },
    get originalServingSize() { return result?.originalServingSize || null },
    get selectedGrams() { return result?.selectedGrams || null },
    get actualCalories() { return result?.actualCalories || null },
    get displayContext() { return result?.displayContext || null },
    get adjustedDish() { return result?.adjustedDish || null }
  }
}