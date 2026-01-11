/**
 * Infrastructure type for consumption record persistence
 * This is the "data transfer object" that gets saved to MMKV storage
 *
 * Plain object structure (not domain entity) for easy JSON serialization
 */
export interface ConsumptionRecordData {
  id: string // ConsumptionRecordId as string
  dishId: string // DishId as string
  dishName: string // Snapshot of dish name
  calories: number // Kilocalories as number
  consumedAt: string // ISO date string (e.g., "2026-01-11T14:30:00.000Z")
  primaryEffort: {
    minutes: number // Minutes as number
    activityLabel: string // e.g., "Course à pied"
  }
  gramsConsumed?: number // Optional: Grams as number
}

/**
 * Type guard to validate if an unknown object is valid ConsumptionRecordData
 * Used to ensure data integrity when loading from storage
 *
 * @param data The data to validate
 * @returns true if valid, false otherwise
 */
export function isValidConsumptionRecordData(data: any): data is ConsumptionRecordData {
  if (!data || typeof data !== "object") {
    return false
  }

  // Validate required fields
  if (typeof data.id !== "string" || data.id.trim() === "") {
    return false
  }

  if (typeof data.dishId !== "string" || data.dishId.trim() === "") {
    return false
  }

  if (typeof data.dishName !== "string" || data.dishName.trim() === "") {
    return false
  }

  if (typeof data.calories !== "number" || data.calories < 0) {
    return false
  }

  if (typeof data.consumedAt !== "string" || data.consumedAt.trim() === "") {
    return false
  }

  // Validate date format (must be valid ISO string)
  const date = new Date(data.consumedAt)
  if (isNaN(date.getTime())) {
    return false
  }

  // Validate primaryEffort object
  if (!data.primaryEffort || typeof data.primaryEffort !== "object") {
    return false
  }

  if (typeof data.primaryEffort.minutes !== "number" || data.primaryEffort.minutes < 0) {
    return false
  }

  if (
    typeof data.primaryEffort.activityLabel !== "string" ||
    data.primaryEffort.activityLabel.trim() === ""
  ) {
    return false
  }

  // Validate optional gramsConsumed
  if (data.gramsConsumed !== undefined) {
    if (typeof data.gramsConsumed !== "number" || data.gramsConsumed < 0) {
      return false
    }
  }

  return true
}

/**
 * Array of ConsumptionRecordData
 * This is what gets stored in MMKV under a single key for MVP
 */
export type ConsumptionRecordDataArray = ConsumptionRecordData[]

/**
 * Type guard to validate if an unknown value is a valid array of ConsumptionRecordData
 *
 * @param data The data to validate
 * @returns true if valid array, false otherwise
 */
export function isValidConsumptionRecordDataArray(data: any): data is ConsumptionRecordDataArray {
  if (!Array.isArray(data)) {
    return false
  }

  return data.every((item) => isValidConsumptionRecordData(item))
}
