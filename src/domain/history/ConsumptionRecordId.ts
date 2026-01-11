/**
 * Value Object representing a unique consumption record identifier
 * Uses timestamp + random string for guaranteed uniqueness across the app lifecycle
 */
export class ConsumptionRecordId {
  private constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("ConsumptionRecordId cannot be empty")
    }
  }

  /**
   * Create ConsumptionRecordId from a string value
   * @param value The ID string
   */
  static from(value: string): ConsumptionRecordId {
    return new ConsumptionRecordId(value)
  }

  /**
   * Generate a new unique ConsumptionRecordId
   * Uses timestamp + random string for uniqueness
   */
  static generate(): ConsumptionRecordId {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 15)
    const uniqueId = `${timestamp}-${randomPart}`
    return new ConsumptionRecordId(uniqueId)
  }

  /**
   * Convert to string representation
   */
  public toString(): string {
    return this.value
  }

  /**
   * Check equality with another ConsumptionRecordId
   */
  public equals(other: ConsumptionRecordId): boolean {
    return this.value === other.value
  }
}
