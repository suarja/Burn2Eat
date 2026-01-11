import { ConsumptionHistoryRepository } from "../../domain/history/ConsumptionHistoryRepository"

/**
 * Output after clearing history
 */
export interface ClearHistoryOutput {
  success: boolean
  error?: string
}

/**
 * Use case for clearing all consumption history
 *
 * This is triggered when the user confirms clearing all history
 * in the history screen (after a confirmation modal)
 *
 * WARNING: This is a destructive operation that cannot be undone
 */
export class ClearHistoryUseCase {
  constructor(private readonly consumptionHistoryRepository: ConsumptionHistoryRepository) {}

  /**
   * Execute the use case to clear all consumption history
   *
   * @returns Promise with success status
   */
  async execute(): Promise<ClearHistoryOutput> {
    try {
      await this.consumptionHistoryRepository.clearAll()

      return {
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("ClearHistoryUseCase error:", errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}
