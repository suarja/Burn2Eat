import { useCallback, useState } from "react"

import type {
  DeleteConsumptionInput,
  DeleteConsumptionOutput,
} from "../../src/application/usecases/DeleteConsumptionUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for deleting a consumption record
 * Used when user taps delete button on a record in history screen
 */
export const useDeleteConsumption = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Delete a consumption record
   */
  const deleteRecord = useCallback(async (recordId: string): Promise<DeleteConsumptionOutput> => {
    setLoading(true)
    setError(null)

    try {
      const useCase = Dependencies.deleteConsumptionUseCase()
      const result = await useCase.execute({ recordId })

      if (!result.success) {
        console.warn("❌ useDeleteConsumption: Failed to delete:", result.error)
        setError(result.error || "Failed to delete consumption")
      } else {
        console.log("✅ useDeleteConsumption: Consumption deleted successfully")
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("💥 useDeleteConsumption: Exception:", errorMessage)
      setError(errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    deleteRecord,
    loading,
    error,
  }
}
