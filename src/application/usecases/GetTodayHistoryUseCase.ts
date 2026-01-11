import { Kilocalories, Minutes } from "../../domain/common/UnitTypes"
import { ConsumptionHistoryRepository } from "../../domain/history/ConsumptionHistoryRepository"
import { ConsumptionRecord } from "../../domain/history/ConsumptionRecord"
import { DailySummary } from "../../domain/history/DailySummary"
import { BMRCalculator } from "../../domain/physiology/BMRCalculator"
import { ActivityCatalog } from "../../domain/physiology/ActivityCatalog"
import { UserHealthInfoRepository } from "../../domain/physiology/UserHealthInfoRepository"

/**
 * Output from GetTodayHistoryUseCase
 */
export interface GetTodayHistoryOutput {
  success: boolean
  records: ConsumptionRecord[]
  summary: DailySummary | null
  error?: string
}

/**
 * Use case for retrieving today's consumption history with daily summary
 *
 * This orchestrates:
 * 1. Loading today's consumption records
 * 2. Getting current user profile
 * 3. Calculating BMR
 * 4. Creating daily summary with target effort to compensate surplus
 */
export class GetTodayHistoryUseCase {
  constructor(
    private readonly consumptionHistoryRepository: ConsumptionHistoryRepository,
    private readonly userHealthInfoRepository: UserHealthInfoRepository,
    private readonly bmrCalculator: BMRCalculator,
    private readonly activityCatalog: ActivityCatalog,
  ) {}

  /**
   * Execute the use case to get today's history
   *
   * @returns Promise with consumption records and daily summary
   */
  async execute(): Promise<GetTodayHistoryOutput> {
    try {
      const today = new Date()

      // Load today's consumption records
      const records = await this.consumptionHistoryRepository.findByDate(today)

      // If no records, return empty result
      if (records.length === 0) {
        return {
          success: true,
          records: [],
          summary: null,
        }
      }

      // Get current user profile
      const userProfile = await this.userHealthInfoRepository.getCurrent()
      if (!userProfile) {
        // No user profile - can't calculate summary
        return {
          success: true,
          records,
          summary: null,
        }
      }

      // Calculate BMR
      const bmr = this.bmrCalculator.calculateBMR(userProfile)

      // Calculate total calories consumed
      const totalCalories = records.reduce((sum, record) => {
        return (sum + record.getCalories()) as Kilocalories
      }, 0 as Kilocalories)

      // Calculate surplus/deficit
      const surplus = (totalCalories - bmr) as Kilocalories

      // Calculate target effort if there's a surplus
      let targetEffort: { minutes: Minutes; activityLabel: string } | undefined

      if (surplus > 0) {
        // Get user's preferred activity
        const preferredActivityKeys = userProfile.getPreferredActivityKeys()
        const primaryActivityKey = preferredActivityKeys[0] // Use first preferred activity

        if (primaryActivityKey) {
          const activity = await this.activityCatalog.getByKey(primaryActivityKey)

          if (activity) {
            // Calculate minutes needed to burn the surplus
            // Formula: minutes = calories / (MET × 3.5 × weight / 200)
            const met = activity.getMET().toNumber()
            const weight = userProfile.getWeight()
            const minutes = Math.ceil(surplus / ((met * 3.5 * weight) / 200))

            targetEffort = {
              minutes: minutes as Minutes,
              activityLabel: activity.getLabel(),
            }
          }
        }
      }

      // Create daily summary
      const summary = DailySummary.create(
        today,
        totalCalories,
        bmr,
        records.length,
        targetEffort,
      )

      return {
        success: true,
        records,
        summary,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("GetTodayHistoryUseCase error:", errorMessage)

      return {
        success: false,
        records: [],
        summary: null,
        error: errorMessage,
      }
    }
  }
}
