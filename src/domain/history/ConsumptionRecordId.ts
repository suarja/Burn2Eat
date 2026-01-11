import { v4 as uuidv4 } from "uuid"

/**
 * Value Object representing a unique consumption record identifier
 * Uses UUID for guaranteed uniqueness across the app lifecycle
 */
export class ConsumptionRecordId {
  private constructor(private readonly value: string) {
    if (!value || value.trim() === "") {
      throw new Error("ConsumptionRecordId cannot be empty")
    }
  }

  /**
   * Create ConsumptionRecordId from a string value
   * @param value The UUID string
   */
  static from(value: string): ConsumptionRecordId {
    return new ConsumptionRecordId(value)
  }

  /**
   * Generate a new unique ConsumptionRecordId
   */
  static generate(): ConsumptionRecordId {
    return new ConsumptionRecordId(uuidv4())
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
