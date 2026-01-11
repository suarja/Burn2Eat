import { useCallback, useEffect, useState } from "react"

import type { GetTodayHistoryOutput } from "../../src/application/usecases/GetTodayHistoryUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for loading today's consumption history with daily summary
 * Automatically loads on mount and provides refresh capability
 */
export const useTodayHistory = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<GetTodayHistoryOutput["records"]>([])
  const [summary, setSummary] = useState<GetTodayHistoryOutput["summary"]>(null)

  /**
   * Load today's history
   */
  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const useCase = Dependencies.getTodayHistoryUseCase()
      const result = await useCase.execute()

      if (result.success) {
        setRecords(result.records)
        setSummary(result.summary)
        console.log(
          `✅ useTodayHistory: Loaded ${result.records.length} consumption records for today`,
        )
      } else {
        console.warn("❌ useTodayHistory: Failed to load history:", result.error)
        setError(result.error || "Failed to load history")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("💥 useTodayHistory: Exception:", errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Refresh history (alias for loadHistory)
   */
  const refresh = useCallback(() => {
    return loadHistory()
  }, [loadHistory])

  /**
   * Load history on mount
   */
  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  return {
    records,
    summary,
    loading,
    error,
    refresh,
  }
}
