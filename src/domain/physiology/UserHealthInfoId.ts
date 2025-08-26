/**
 * Value object representing a unique identifier for UserHealthInfo
 * Uses UUID for global uniqueness
 */
export class UserHealthInfoId {
  private constructor(private readonly value: string) {}

  /**
   * Create from existing ID string
   */
  static from(value: string): UserHealthInfoId {
    if (!value || value.trim() === "") {
      throw new Error("UserHealthInfoId cannot be empty")
    }

    // Basic UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(value)) {
      throw new Error("UserHealthInfoId must be a valid UUID format")
    }

    return new UserHealthInfoId(value)
  }

  /**
   * Generate a new unique ID
   * Uses crypto.randomUUID() for UUID v4 generation
   */
  static generate(): UserHealthInfoId {
    // Generate UUID v4
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    return new UserHealthInfoId(uuid)
  }

  /**
   * Get the ID value as string
   */
  toString(): string {
    return this.value
  }

  /**
   * Get the raw value
   */
  getValue(): string {
    return this.value
  }

  /**
   * Check equality with another UserHealthInfoId
   */
  equals(other: UserHealthInfoId): boolean {
    return this.value === other.value
  }

  /**
   * Static method to create default/primary user ID
   * For single-user scenarios
   */
  static primary(): UserHealthInfoId {
    return UserHealthInfoId.from("00000000-0000-4000-8000-000000000001")
  }
}
