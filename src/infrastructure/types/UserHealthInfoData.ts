import { Sex } from "../../domain/physiology/Sex";

/**
 * Data structure for UserHealthInfo serialization/deserialization
 * Used by infrastructure adapters for persistence
 */
export interface UserHealthInfoData {
  id: string;
  sex: Sex;
  weight: number; // Kilograms
  height: number; // Centimeters
  preferredActivityKeys: string[];
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

/**
 * Validation helper for UserHealthInfoData
 */
export function isValidUserHealthInfoData(data: any): data is UserHealthInfoData {
  return (
    data &&
    typeof data.id === 'string' &&
    data.id.length > 0 &&
    ['male', 'female', 'unspecified'].includes(data.sex) &&
    typeof data.weight === 'number' &&
    data.weight >= 30 &&
    data.weight <= 300 &&
    typeof data.height === 'number' &&
    data.height >= 120 &&
    data.height <= 250 &&
    Array.isArray(data.preferredActivityKeys) &&
    data.preferredActivityKeys.every((key: any) => typeof key === 'string')
  );
}