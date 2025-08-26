/**
 * Infrastructure data layer exports
 * Centralized access to all datasets and utilities
 */

// Main dataset export
// Import for internal use in stats
import { FOODS_DATASET } from "./foods-dataset"

export {
  FOODS_DATASET,
  getFoodCount,
  getFoodsByCategory,
  getFoodById,
  searchFoodsByName,
} from "./foods-dataset"

// Type exports
export type {
  FoodData,
  FoodCategory,
  PortionUnit,
  FoodNames,
  PortionSize,
  FoodDescription,
  FoodDataValidation,
} from "../types/FoodData"

// Validation utilities
export {
  validateFoodData,
  validateFoodDataset,
  validateImageUrls,
  generateDatasetReport,
} from "../utils/validateFoodDataset"

/**
 * Quick stats about the dataset
 */
export const DATASET_STATS = {
  get totalFoods() {
    return FOODS_DATASET.length
  },
  get categories() {
    return [...new Set(FOODS_DATASET.map((f) => f.category))]
  },
  get averageCalories() {
    return Math.round(FOODS_DATASET.reduce((sum, f) => sum + f.calories, 0) / FOODS_DATASET.length)
  },
} as const
