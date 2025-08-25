import { Kilograms, Centimeters } from "../common/UnitTypes";
import { Sex } from "./Sex";

/**
 * Domain entity representing user health profile
 * Used for effort calculations and activity recommendations
 */
export class UserHealthInfo {
  private constructor(
    public readonly sex: Sex,
    public readonly weight: Kilograms,
    public readonly height: Centimeters,
    public readonly preferredActivityKeys: string[]
  ) {}

  /**
   * Create user health info with validation
   */
  static create(
    sex: Sex, 
    weight: Kilograms, 
    height: Centimeters, 
    preferredActivities: string[]
  ): UserHealthInfo {
    // Validate weight range (30-300 kg)
    if (weight < 30 || weight > 300) {
      throw new Error('Weight must be between 30 and 300 kg');
    }
    
    // Validate height range (120-250 cm)
    if (height < 120 || height > 250) {
      throw new Error('Height must be between 120 and 250 cm');
    }

    return new UserHealthInfo(sex, weight, height, [...preferredActivities]);
  }

  /**
   * Create average/default user profile for anonymous usage
   */
  static average(): UserHealthInfo {
    // Based on global population averages
    const weight = 70 as Kilograms; // ~70kg average
    const height = 170 as Centimeters; // ~170cm average
    const sex: Sex = "unspecified";
    const defaultActivities = [
      "walking_brisk",
      "jogging_general", 
      "cycling_moderate",
      "swimming_leisurely",
      "weight_training_general"
    ];

    return new UserHealthInfo(sex, weight, height, defaultActivities);
  }

  /**
   * Get user weight
   */
  getWeight(): Kilograms {
    return this.weight;
  }

  /**
   * Get user height
   */
  getHeight(): Centimeters {
    return this.height;
  }

  /**
   * Get user sex
   */
  getSex(): Sex {
    return this.sex;
  }

  /**
   * Get preferred activity keys in priority order
   */
  getPreferredActivityKeys(): string[] {
    return [...this.preferredActivityKeys];
  }

  /**
   * Get primary preferred activity key
   */
  getPrimaryActivityKey(): string | null {
    return this.preferredActivityKeys.length > 0 ? this.preferredActivityKeys[0] : null;
  }

  /**
   * Calculate BMI (Body Mass Index)
   */
  calculateBMI(): number {
    const heightInMeters = this.height / 100;
    return Number((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  /**
   * Get BMI category
   */
  getBMICategory(): 'underweight' | 'normal' | 'overweight' | 'obese' {
    const bmi = this.calculateBMI();
    
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  /**
   * Check if user has healthy weight
   */
  hasHealthyWeight(): boolean {
    const category = this.getBMICategory();
    return category === 'normal';
  }

  /**
   * Create a copy with updated preferred activities
   */
  withPreferredActivities(activityKeys: string[]): UserHealthInfo {
    return new UserHealthInfo(this.sex, this.weight, this.height, [...activityKeys]);
  }

  /**
   * String representation
   */
  toString(): string {
    return `UserHealthInfo(${this.sex}, ${this.weight}kg, ${this.height}cm, BMI: ${this.calculateBMI()})`;
  }
}