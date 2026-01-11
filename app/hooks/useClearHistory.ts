import { useCallback, useState } from "react"

import type { ClearHistoryOutput } from "../../src/application/usecases/ClearHistoryUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for clearing all consumption history
 * Used when user confirms clearing all history in confirmation modal
 *
 * WARNING: This is a destructive operation that cannot be undone
 */
export const useClearHistory = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Clear all consumption history
   */
  const clearHistory = useCallback(async (): Promise<ClearHistoryOutput> => {
    setLoading(true)
    setError(null)

    try {
      const useCase = Dependencies.clearHistoryUseCase()
      const result = await useCase.execute()

      if (!result.success) {
        console.warn("❌ useClearHistory: Failed to clear:", result.error)
        setError(result.error || "Failed to clear history")
      } else {
        console.log("✅ useClearHistory: History cleared successfully")
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("💥 useClearHistory: Exception:", errorMessage)
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
    clearHistory,
    loading,
    error,
  }
}
