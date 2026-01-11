import { ConsumptionRecordId } from "./ConsumptionRecordId"
import { Grams, Kilocalories, Minutes } from "../common/UnitTypes"
import { DishId } from "../nutrition/DishId"

export interface ConsumptionRecordConfig {
  consumptionId: ConsumptionRecordId
  dishId: DishId
  dishName: string
  calories: Kilocalories
  consumedAt: Date
  primaryEffort: {
    minutes: Minutes
    activityLabel: string
  }
  gramsConsumed?: Grams
}

/**
 * Pure domain entity representing a consumed dish
 * This is an immutable snapshot - even if the dish is later removed from the catalog,
 * we preserve the historical record with all necessary data
 */
export class ConsumptionRecord {
  private constructor(
    private readonly consumptionId: ConsumptionRecordId,
    private readonly dishId: DishId,
    private readonly dishName: string,
    private readonly calories: Kilocalories,
    private readonly consumedAt: Date,
    private readonly primaryEffort: {
      minutes: Minutes
      activityLabel: string
    },
    private readonly gramsConsumed?: Grams,
  ) {}

  /**
   * Create a new consumption record
   */
  static create(config: ConsumptionRecordConfig): ConsumptionRecord {
    // Domain validation
    if (!config.dishName || config.dishName.trim() === "") {
      throw new Error("Dish name cannot be empty")
    }

    if (config.calories < 0) {
      throw new Error("Calories cannot be negative")
    }

    if (config.primaryEffort.minutes < 0) {
      throw new Error("Effort minutes cannot be negative")
    }

    if (!config.primaryEffort.activityLabel || config.primaryEffort.activityLabel.trim() === "") {
      throw new Error("Activity label cannot be empty")
    }

    if (config.gramsConsumed !== undefined && config.gramsConsumed < 0) {
      throw new Error("Grams consumed cannot be negative")
    }

    return new ConsumptionRecord(
      config.consumptionId,
      config.dishId,
      config.dishName.trim(),
      config.calories,
      config.consumedAt,
      config.primaryEffort,
      config.gramsConsumed,
    )
  }

  /**
   * Get consumption record ID
   */
  public getId(): ConsumptionRecordId {
    return this.consumptionId
  }

  /**
   * Get dish ID (reference to original dish)
   */
  public getDishId(): DishId {
    return this.dishId
  }

  /**
   * Get dish name (snapshot)
   */
  public getDishName(): string {
    return this.dishName
  }

  /**
   * Get calories (snapshot)
   */
  public getCalories(): Kilocalories {
    return this.calories
  }

  /**
   * Get consumption timestamp
   */
  public getConsumedAt(): Date {
    return this.consumedAt
  }

  /**
   * Get primary effort calculation
   */
  public getPrimaryEffort(): { minutes: Minutes; activityLabel: string } {
    return this.primaryEffort
  }

  /**
   * Get grams consumed (optional portion size)
   */
  public getGramsConsumed(): Grams | undefined {
    return this.gramsConsumed
  }

  /**
   * Check if this record is from today
   */
  public isToday(): boolean {
    const today = new Date()
    return this.isSameDay(today)
  }

  /**
   * Check if this record is from a specific day
   */
  public isSameDay(date: Date): boolean {
    const recordDate = this.consumedAt
    return (
      recordDate.getFullYear() === date.getFullYear() &&
      recordDate.getMonth() === date.getMonth() &&
      recordDate.getDate() === date.getDate()
    )
  }

  /**
   * Get formatted time (HH:MM)
   */
  public getFormattedTime(): string {
    const hours = this.consumedAt.getHours().toString().padStart(2, "0")
    const minutes = this.consumedAt.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }
}
