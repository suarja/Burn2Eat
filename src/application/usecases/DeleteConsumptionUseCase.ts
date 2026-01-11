import { ConsumptionHistoryRepository } from "../../domain/history/ConsumptionHistoryRepository"
import { ConsumptionRecordId } from "../../domain/history/ConsumptionRecordId"

/**
 * Input for deleting a consumption record
 */
export interface DeleteConsumptionInput {
  recordId: string // ConsumptionRecordId as string
}

/**
 * Output after deleting a consumption
 */
export interface DeleteConsumptionOutput {
  success: boolean
  error?: string
}

/**
 * Use case for deleting a single consumption record
 *
 * This is triggered when the user taps the delete button on a consumption record
 * in the history screen
 */
export class DeleteConsumptionUseCase {
  constructor(private readonly consumptionHistoryRepository: ConsumptionHistoryRepository) {}

  /**
   * Execute the use case to delete a consumption record
   *
   * @param input The record ID to delete
   * @returns Promise with success status
   */
  async execute(input: DeleteConsumptionInput): Promise<DeleteConsumptionOutput> {
    try {
      // Validate input
      if (!input.recordId || input.recordId.trim() === "") {
        return {
          success: false,
          error: "Record ID is required",
        }
      }

      // Create ConsumptionRecordId from string
      const recordId = ConsumptionRecordId.from(input.recordId)

      // Delete the record
      const deleted = await this.consumptionHistoryRepository.deleteById(recordId)

      if (!deleted) {
        return {
          success: false,
          error: "Record not found",
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("DeleteConsumptionUseCase error:", errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}
