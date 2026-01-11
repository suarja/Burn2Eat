import { useCallback, useState } from "react"

import type {
  RecordConsumptionInput,
  RecordConsumptionOutput,
} from "../../src/application/usecases/RecordConsumptionUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for recording food consumption
 * Used when user clicks "Oui, je mange!" in ResultScreen
 */
export const useRecordConsumption = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Record a consumption
   */
  const recordConsumption = useCallback(
    async (input: RecordConsumptionInput): Promise<RecordConsumptionOutput> => {
      setLoading(true)
      setError(null)

      try {
        const useCase = Dependencies.recordConsumptionUseCase()
        const result = await useCase.execute(input)

        if (!result.success) {
          console.warn("❌ useRecordConsumption: Failed to record:", result.error)
          setError(result.error || "Failed to record consumption")
        } else {
          console.log("✅ useRecordConsumption: Consumption recorded successfully")
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("💥 useRecordConsumption: Exception:", errorMessage)
        setError(errorMessage)

        return {
          success: false,
          error: errorMessage,
        }
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return {
    recordConsumption,
    loading,
    error,
  }
}
