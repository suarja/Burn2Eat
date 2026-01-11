import { Grams, Kilocalories, Minutes } from "../../domain/common/UnitTypes"
import { ConsumptionHistoryRepository } from "../../domain/history/ConsumptionHistoryRepository"
import { ConsumptionRecord } from "../../domain/history/ConsumptionRecord"
import { ConsumptionRecordId } from "../../domain/history/ConsumptionRecordId"
import { Dish } from "../../domain/nutrition/Dish"

/**
 * Input for recording a consumption
 */
export interface RecordConsumptionInput {
  dish: Dish // The dish that was consumed
  calories: number // Actual calories consumed (might differ from dish default if portion adjusted)
  primaryEffort: {
    minutes: number // Minutes of primary activity to burn these calories
    activityLabel: string // Label of the primary activity (e.g., "Course à pied")
  }
  gramsConsumed?: number // Optional: portion size in grams
}

/**
 * Output after recording consumption
 */
export interface RecordConsumptionOutput {
  success: boolean
  record?: ConsumptionRecord
  error?: string
}

/**
 * Use case for recording when a user consumes a dish
 *
 * This is triggered when the user clicks "Oui, je mange!" in ResultScreen
 * Creates a snapshot of the dish data and effort calculation for historical tracking
 */
export class RecordConsumptionUseCase {
  constructor(private readonly consumptionHistoryRepository: ConsumptionHistoryRepository) {}

  /**
   * Execute the use case to record a consumption
   *
   * @param input The consumption data (dish, calories, effort)
   * @returns Promise with success status and created record
   */
  async execute(input: RecordConsumptionInput): Promise<RecordConsumptionOutput> {
    try {
      // Validate input
      if (!input.dish) {
        return {
          success: false,
          error: "Dish is required",
        }
      }

      if (input.calories < 0) {
        return {
          success: false,
          error: "Calories cannot be negative",
        }
      }

      if (input.primaryEffort.minutes < 0) {
        return {
          success: false,
          error: "Effort minutes cannot be negative",
        }
      }

      if (!input.primaryEffort.activityLabel || input.primaryEffort.activityLabel.trim() === "") {
        return {
          success: false,
          error: "Activity label is required",
        }
      }

      // Create consumption record
      const record = ConsumptionRecord.create({
        consumptionId: ConsumptionRecordId.generate(),
        dishId: input.dish.getId(),
        dishName: input.dish.getName(),
        calories: input.calories as Kilocalories,
        consumedAt: new Date(), // Current time
        primaryEffort: {
          minutes: input.primaryEffort.minutes as Minutes,
          activityLabel: input.primaryEffort.activityLabel,
        },
        gramsConsumed: input.gramsConsumed !== undefined ? (input.gramsConsumed as Grams) : undefined,
      })

      // Save to repository
      const savedRecord = await this.consumptionHistoryRepository.save(record)

      return {
        success: true,
        record: savedRecord,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("RecordConsumptionUseCase error:", errorMessage)

      return {
        success: false,
        error: errorMessage,
      }
    }
  }
}
