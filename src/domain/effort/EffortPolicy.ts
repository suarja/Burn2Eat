import { Kilocalories, Kilograms, Minutes } from "../common/UnitTypes"

/**
 * Domain interface that encapsulates the physiological equation for effort calculation
 *
 * This abstraction allows us to:
 * - Switch between different calculation methods (Harris-Benedict, Katch-McArdle, etc.)
 * - Adjust for individual variations or environmental factors
 * - Keep the core formula isolated and testable
 */
export interface EffortPolicy {
  /**
   * Calculate minutes needed to burn specific calories for a given activity
   *
   * @param calories - Calories to burn
   * @param userWeightKg - User's weight in kilograms
   * @param activityMET - MET value of the physical activity
   * @returns Minutes required to burn the specified calories
   */
  minutesToBurn(calories: Kilocalories, userWeightKg: Kilograms, activityMET: number): Minutes
}

/**
 * Standard MET-based effort policy implementation
 *
 * Uses the widely accepted formula from exercise physiology:
 * Calories per minute = MET × 3.5 × weight(kg) ÷ 200
 * Therefore: Minutes = Calories ÷ (MET × 3.5 × weight(kg) ÷ 200)
 */
export class StandardMETEffortPolicy implements EffortPolicy {
  minutesToBurn(calories: Kilocalories, userWeightKg: Kilograms, activityMET: number): Minutes {
    // Validate inputs
    if (calories <= 0) {
      throw new Error("Calories must be positive")
    }
    if (userWeightKg <= 0) {
      throw new Error("Weight must be positive")
    }
    if (activityMET <= 0) {
      throw new Error("MET value must be positive")
    }

    // Standard MET formula: minutes = calories / (MET × 3.5 × weight(kg) / 200)
    const caloriesPerMinute = (activityMET * 3.5 * userWeightKg) / 200
    const minutes = calories / caloriesPerMinute

    // Round to nearest minute and ensure minimum of 1 minute
    const roundedMinutes = Math.max(1, Math.round(minutes))

    return roundedMinutes as Minutes
  }

  /**
   * Get the calorie burn rate for a specific activity and user weight
   * Useful for displaying "calories per minute" information
   */
  getCalorieBurnRate(userWeightKg: Kilograms, activityMET: number): number {
    if (userWeightKg <= 0 || activityMET <= 0) {
      throw new Error("Weight and MET must be positive")
    }

    return (activityMET * 3.5 * userWeightKg) / 200
  }

  /**
   * Calculate total calories that would be burned for a given duration
   * Inverse of the main calculation
   */
  caloriesBurned(minutes: Minutes, userWeightKg: Kilograms, activityMET: number): Kilocalories {
    if (minutes <= 0 || userWeightKg <= 0 || activityMET <= 0) {
      throw new Error("All values must be positive")
    }

    const caloriesPerMinute = (activityMET * 3.5 * userWeightKg) / 200
    const totalCalories = minutes * caloriesPerMinute

    return Math.round(totalCalories) as Kilocalories
  }
}

/**
 * Conservative effort policy that adds a safety margin
 * Useful for users who want to be sure they burn at least the target calories
 */
export class ConservativeEffortPolicy implements EffortPolicy {
  private readonly standardPolicy: StandardMETEffortPolicy
  private readonly safetyMarginPercent: number

  constructor(safetyMarginPercent: number = 10) {
    this.standardPolicy = new StandardMETEffortPolicy()
    this.safetyMarginPercent = safetyMarginPercent
  }

  minutesToBurn(calories: Kilocalories, userWeightKg: Kilograms, activityMET: number): Minutes {
    const standardMinutes = this.standardPolicy.minutesToBurn(calories, userWeightKg, activityMET)
    const extraMinutes = Math.round(standardMinutes * (this.safetyMarginPercent / 100))

    return (standardMinutes + extraMinutes) as Minutes
  }
}

/**
 * Factory for creating effort policies based on user preferences or context
 */
export class EffortPolicyFactory {
  static standard(): EffortPolicy {
    return new StandardMETEffortPolicy()
  }

  static conservative(safetyMargin: number = 10): EffortPolicy {
    return new ConservativeEffortPolicy(safetyMargin)
  }

  static forUserLevel(level: "beginner" | "intermediate" | "advanced"): EffortPolicy {
    switch (level) {
      case "beginner":
        return new ConservativeEffortPolicy(15) // 15% extra time
      case "intermediate":
        return new ConservativeEffortPolicy(5) // 5% extra time
      case "advanced":
        return new StandardMETEffortPolicy() // No margin
      default:
        return new StandardMETEffortPolicy()
    }
  }
}
