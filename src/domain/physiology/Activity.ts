import { Met } from "./Met";

/**
 * Domain entity representing a physical activity
 * Contains no infrastructure dependencies
 */
export class Activity {
  private constructor(
    public readonly key: string,
    public readonly label: string,
    public readonly met: Met
  ) {}

  /**
   * Create a new activity with validation
   */
  static define(key: string, label: string, met: Met): Activity {
    if (!key || key.trim() === '') {
      throw new Error('Activity key cannot be empty');
    }
    if (!label || label.trim() === '') {
      throw new Error('Activity label cannot be empty');
    }
    
    return new Activity(key.trim(), label.trim(), met);
  }

  /**
   * Get the MET value for this activity
   */
  getMET(): Met {
    return this.met;
  }

  /**
   * Get activity key
   */
  getKey(): string {
    return this.key;
  }

  /**
   * Get activity label
   */
  getLabel(): string {
    return this.label;
  }

  /**
   * Check if this is a low-intensity activity
   */
  isLowIntensity(): boolean {
    return this.met.isLightIntensity();
  }

  /**
   * Check if this is a moderate-intensity activity
   */
  isModerateIntensity(): boolean {
    return this.met.isModerateIntensity();
  }

  /**
   * Check if this is a high-intensity activity
   */
  isHighIntensity(): boolean {
    return this.met.isVigorousIntensity();
  }

  /**
   * Compare activities by MET value
   */
  isMoreIntense(other: Activity): boolean {
    return this.met.value > other.met.value;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.label} (${this.met.toString()})`;
  }

  /**
   * Equality comparison by key
   */
  equals(other: Activity): boolean {
    return this.key === other.key;
  }
}