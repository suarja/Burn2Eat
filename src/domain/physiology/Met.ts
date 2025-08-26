/**
 * MET (Metabolic Equivalent of Task) value object
 * Represents the energy cost of physical activity
 * 1 MET = energy cost of sitting quietly = 3.5 mL O₂/kg/min
 */
export class Met {
  private constructor(public readonly value: number) {}

  /**
   * Create MET value with validation
   */
  static of(value: number): Met {
    if (value <= 0) {
      throw new Error("MET value must be positive")
    }
    if (value > 25) {
      throw new Error("MET value too high (max 25 METs)")
    }
    return new Met(value)
  }

  /**
   * Get MET value as number
   */
  toNumber(): number {
    return this.value
  }

  /**
   * Check if this is light intensity (<3 METs)
   */
  isLightIntensity(): boolean {
    return this.value < 3.0
  }

  /**
   * Check if this is moderate intensity (3-6 METs)
   */
  isModerateIntensity(): boolean {
    return this.value >= 3.0 && this.value < 6.0
  }

  /**
   * Check if this is vigorous intensity (≥6 METs)
   */
  isVigorousIntensity(): boolean {
    return this.value >= 6.0
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.value} METs`
  }

  /**
   * Equality comparison
   */
  equals(other: Met): boolean {
    return this.value === other.value
  }
}
