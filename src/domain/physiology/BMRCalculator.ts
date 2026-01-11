import { UserHealthInfo } from "./UserHealthInfo"
import { Kilocalories } from "../common/UnitTypes"

/**
 * Domain service for calculating Basal Metabolic Rate (BMR)
 * Uses the Harris-Benedict revised formula
 *
 * BMR represents the minimum calories needed to maintain basic physiological functions at rest
 *
 * Formula (Harris-Benedict revised):
 * - Men: BMR = 88.362 + (13.397 × weight in kg) + (4.799 × height in cm) - (5.677 × age in years)
 * - Women: BMR = 447.593 + (9.247 × weight in kg) + (3.098 × height in cm) - (4.330 × age in years)
 * - Unspecified: Average of both formulas
 *
 * MVP Note: Since UserHealthInfo does not currently have an age field,
 * we use a default age of 30 years for all calculations
 * TODO: Add age field to UserHealthInfo in v2 for more accurate BMR calculations
 */
export class BMRCalculator {
  private readonly DEFAULT_AGE = 30 // Assumed age for MVP

  /**
   * Calculate Basal Metabolic Rate (BMR) for a user
   *
   * @param userInfo The user's health information (sex, weight, height)
   * @param age Optional age override (defaults to 30 if not provided)
   * @returns BMR in kilocalories per day
   */
  calculateBMR(userInfo: UserHealthInfo, age?: number): Kilocalories {
    const weight = userInfo.getWeight() // kg
    const height = userInfo.getHeight() // cm
    const sex = userInfo.getSex()
    const actualAge = age ?? this.DEFAULT_AGE

    let bmr: number

    if (sex === "male") {
      bmr = this.calculateMaleBMR(weight, height, actualAge)
    } else if (sex === "female") {
      bmr = this.calculateFemaleBMR(weight, height, actualAge)
    } else {
      // For "unspecified", use average of male and female BMR
      const maleBMR = this.calculateMaleBMR(weight, height, actualAge)
      const femaleBMR = this.calculateFemaleBMR(weight, height, actualAge)
      bmr = (maleBMR + femaleBMR) / 2
    }

    // Round to nearest integer for cleaner display
    return Math.round(bmr) as Kilocalories
  }

  /**
   * Calculate Total Daily Energy Expenditure (TDEE)
   * TDEE = BMR × Activity Multiplier
   *
   * Activity levels:
   * - Sedentary (little/no exercise): BMR × 1.2
   * - Light (exercise 1-3 days/week): BMR × 1.375
   * - Moderate (exercise 3-5 days/week): BMR × 1.55
   * - Active (exercise 6-7 days/week): BMR × 1.725
   * - Very Active (intense exercise daily): BMR × 1.9
   *
   * For MVP, we assume "light" activity level (1.375) as a reasonable default
   */
  calculateTDEE(
    bmr: Kilocalories,
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active" = "light",
  ): Kilocalories {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    const tdee = bmr * multipliers[activityLevel]
    return Math.round(tdee) as Kilocalories
  }

  /**
   * Calculate BMR for males using Harris-Benedict revised formula
   * BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
   */
  private calculateMaleBMR(weight: number, height: number, age: number): number {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
  }

  /**
   * Calculate BMR for females using Harris-Benedict revised formula
   * BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
   */
  private calculateFemaleBMR(weight: number, height: number, age: number): number {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
  }

  /**
   * Estimate calories burned from an activity given duration and user weight
   * This can be used to calculate how much activity is needed to burn off consumed calories
   *
   * Formula: Calories = (MET × 3.5 × weight(kg) / 200) × duration(minutes)
   *
   * Note: This calculation is already handled by EffortCalculator,
   * but included here for completeness in BMR context
   */
  estimateCaloriesBurned(met: number, durationMinutes: number, weightKg: number): Kilocalories {
    const calories = ((met * 3.5 * weightKg) / 200) * durationMinutes
    return Math.round(calories) as Kilocalories
  }
}
