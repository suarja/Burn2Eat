import { Dish } from "../nutrition/Dish";
import { UserHealthInfo } from "../physiology/UserHealthInfo";

/**
 * Domain value object representing a request to calculate effort needed to burn calories from food
 * 
 * This encapsulates the input data needed for effort calculation:
 * - The dish consumed (with calories)
 * - The user's health profile (weight, preferred activities)
 */
export class EffortRequest {
  private constructor(
    public readonly dish: Dish,
    public readonly user: UserHealthInfo
  ) {}

  /**
   * Create an effort request
   * 
   * @param dish - The consumed dish
   * @param user - User's health information
   */
  static of(dish: Dish, user: UserHealthInfo): EffortRequest {
    if (!dish) {
      throw new Error('Dish is required for effort calculation');
    }
    if (!user) {
      throw new Error('User health info is required for effort calculation');
    }

    return new EffortRequest(dish, user);
  }

  /**
   * Get the calories that need to be burned
   */
  getCalories() {
    return this.dish.getCalories();
  }

  /**
   * Get user's weight for calculation
   */
  getUserWeight() {
    return this.user.getWeight();
  }

  /**
   * Get user's preferred activity keys in priority order
   */
  getPreferredActivityKeys(): string[] {
    return this.user.getPreferredActivityKeys();
  }

  /**
   * Get primary preferred activity key
   */
  getPrimaryActivityKey(): string | null {
    return this.user.getPrimaryActivityKey();
  }

  /**
   * Check if this is a high-calorie request (>400 kcal)
   */
  isHighCalorieRequest(): boolean {
    return this.dish.isHighCalorie();
  }

  /**
   * Get a summary for logging/debugging
   */
  getSummary(): string {
    return `EffortRequest(${this.dish.getName()}: ${this.getCalories()} kcal, User: ${this.getUserWeight()}kg)`;
  }

  /**
   * Create a request with different user (useful for comparisons)
   */
  withUser(user: UserHealthInfo): EffortRequest {
    return new EffortRequest(this.dish, user);
  }

  /**
   * Create a request with different dish (useful for alternatives)
   */
  withDish(dish: Dish): EffortRequest {
    return new EffortRequest(dish, this.user);
  }

  /**
   * Equality comparison based on dish and user
   */
  equals(other: EffortRequest): boolean {
    return this.dish.equals(other.dish) && 
           this.user.toString() === other.user.toString(); // Simple comparison for now
  }

  /**
   * String representation
   */
  toString(): string {
    return this.getSummary();
  }
}