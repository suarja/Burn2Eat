import { Kilocalories, Minutes } from "../common/UnitTypes"

/**
 * Value Object representing aggregated daily consumption statistics
 * Combines consumption data with BMR to provide insights on calorie balance
 */
export class DailySummary {
  private constructor(
    private readonly date: Date,
    private readonly totalCalories: Kilocalories,
    private readonly bmr: Kilocalories,
    private readonly consumptionCount: number,
    private readonly surplus: Kilocalories,
    private readonly targetEffort: {
      minutes: Minutes
      activityLabel: string
    } | null,
  ) {}

  /**
   * Create a daily summary from consumption records and BMR
   *
   * @param date The date for this summary
   * @param totalCalories Total calories consumed during the day
   * @param bmr User's basal metabolic rate
   * @param consumptionCount Number of food items consumed
   * @param targetEffort Optional effort needed to burn surplus (only if surplus > 0)
   */
  static create(
    date: Date,
    totalCalories: Kilocalories,
    bmr: Kilocalories,
    consumptionCount: number,
    targetEffort?: {
      minutes: Minutes
      activityLabel: string
    },
  ): DailySummary {
    const surplus = (totalCalories - bmr) as Kilocalories

    // Validate inputs
    if (totalCalories < 0) {
      throw new Error("Total calories cannot be negative")
    }

    if (bmr < 0) {
      throw new Error("BMR cannot be negative")
    }

    if (consumptionCount < 0) {
      throw new Error("Consumption count cannot be negative")
    }

    return new DailySummary(
      date,
      totalCalories,
      bmr,
      consumptionCount,
      surplus,
      targetEffort ?? null,
    )
  }

  /**
   * Get the summary date
   */
  public getDate(): Date {
    return this.date
  }

  /**
   * Get total calories consumed
   */
  public getTotalCalories(): Kilocalories {
    return this.totalCalories
  }

  /**
   * Get user's basal metabolic rate
   */
  public getBMR(): Kilocalories {
    return this.bmr
  }

  /**
   * Get number of food items consumed
   */
  public getConsumptionCount(): number {
    return this.consumptionCount
  }

  /**
   * Get calorie surplus/deficit
   * Positive = surplus (ate more than BMR)
   * Negative = deficit (ate less than BMR)
   */
  public getSurplus(): Kilocalories {
    return this.surplus
  }

  /**
   * Check if there's a calorie surplus (ate more than BMR)
   */
  public hasSurplus(): boolean {
    return this.surplus > 0
  }

  /**
   * Check if there's a calorie deficit (ate less than BMR)
   */
  public hasDeficit(): boolean {
    return this.surplus < 0
  }

  /**
   * Check if consumption is balanced with BMR (within ±50 kcal)
   */
  public isBalanced(): boolean {
    return Math.abs(this.surplus) <= 50
  }

  /**
   * Get target effort to compensate surplus
   * Returns null if no surplus (deficit or balanced)
   */
  public getTargetEffort(): { minutes: Minutes; activityLabel: string } | null {
    return this.targetEffort
  }

  /**
   * Check if compensating effort is needed
   */
  public needsCompensation(): boolean {
    return this.hasSurplus() && this.targetEffort !== null
  }

  /**
   * Get absolute surplus amount (always positive)
   */
  public getAbsoluteSurplus(): Kilocalories {
    return Math.abs(this.surplus) as Kilocalories
  }

  /**
   * Get formatted summary string for display
   */
  public getSummaryText(): string {
    if (this.consumptionCount === 0) {
      return "Aucune consommation aujourd'hui"
    }

    if (this.hasSurplus()) {
      return `Surplus de ${Math.round(this.surplus)} kcal`
    } else if (this.hasDeficit()) {
      return `Déficit de ${Math.round(Math.abs(this.surplus))} kcal`
    } else {
      return "Équilibre calorique atteint"
    }
  }

  /**
   * Get calorie percentage relative to BMR
   * Returns value like 110 (meaning 110% of BMR consumed)
   */
  public getPercentageOfBMR(): number {
    if (this.bmr === 0) return 0
    return Math.round((this.totalCalories / this.bmr) * 100)
  }
}
