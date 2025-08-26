import { FoodData } from "../../types/FoodData"
import { FOODS_DATASET } from "../foods-dataset"
// Import all category additions
import { BEVERAGE_ADDITIONS } from "../categories/beverage-additions"
import { BREAKFAST_ADDITIONS } from "../categories/breakfast-additions"
import { DESSERT_ADDITIONS } from "../categories/dessert-additions"
import { FAST_FOOD_ADDITIONS } from "../categories/fast-food-additions"
import { FRUIT_ADDITIONS } from "../categories/fruit-additions"
import { MAIN_COURSE_ADDITIONS } from "../categories/main-course-additions"
import { SNACK_ADDITIONS } from "../categories/snack-additions"

/**
 * Dataset Merger Utility
 * Combines all category addition files with the main dataset
 */

/**
 * All category addition arrays
 */
const CATEGORY_ADDITIONS: FoodData[][] = [
  BEVERAGE_ADDITIONS,
  BREAKFAST_ADDITIONS,
  DESSERT_ADDITIONS,
  FAST_FOOD_ADDITIONS,
  FRUIT_ADDITIONS,
  MAIN_COURSE_ADDITIONS,
  SNACK_ADDITIONS,
]

/**
 * Merges all category additions with the main dataset
 * Validates for duplicate IDs and returns the combined dataset
 */
export const mergeAllFoodData = (): {
  mergedData: FoodData[]
  stats: {
    originalCount: number
    newItemsCount: number
    totalCount: number
    duplicateIds: string[]
  }
} => {
  const originalCount = FOODS_DATASET.length
  const allAdditions = CATEGORY_ADDITIONS.flat()
  const newItemsCount = allAdditions.length

  // Check for duplicate IDs
  const allIds = new Set<string>()
  const duplicateIds: string[] = []

  // Check original dataset IDs
  FOODS_DATASET.forEach((food) => {
    if (allIds.has(food.id)) {
      duplicateIds.push(food.id)
    } else {
      allIds.add(food.id)
    }
  })

  // Check addition IDs
  allAdditions.forEach((food) => {
    if (allIds.has(food.id)) {
      duplicateIds.push(food.id)
    } else {
      allIds.add(food.id)
    }
  })

  // Combine all data (duplicates will be handled by consumer)
  const mergedData = [...FOODS_DATASET, ...allAdditions]

  return {
    mergedData,
    stats: {
      originalCount,
      newItemsCount,
      totalCount: mergedData.length,
      duplicateIds,
    },
  }
}

/**
 * Gets category breakdown of the merged dataset
 */
export const getCategoryBreakdown = (foods: FoodData[] = mergeAllFoodData().mergedData) => {
  const categoryCount: Record<string, number> = {}

  foods.forEach((food) => {
    categoryCount[food.category] = (categoryCount[food.category] || 0) + 1
  })

  return categoryCount
}

/**
 * Validates the merged dataset for common issues
 */
export const validateMergedDataset = (foods: FoodData[] = mergeAllFoodData().mergedData) => {
  const issues: string[] = []
  const ids = new Set<string>()

  foods.forEach((food, index) => {
    // Check for duplicate IDs
    if (ids.has(food.id)) {
      issues.push(`Duplicate ID found: ${food.id}`)
    } else {
      ids.add(food.id)
    }

    // Check for required fields
    if (!food.names?.en) issues.push(`Missing English name at index ${index}`)
    if (!food.names?.fr) issues.push(`Missing French name at index ${index}`)
    if (!food.calories || food.calories <= 0) issues.push(`Invalid calories at index ${index}`)
    if (!food.imageUrl) issues.push(`Missing image URL at index ${index}`)

    // Check calorie ranges
    if (food.calories > 2000)
      issues.push(`Unusually high calories (${food.calories}) for ${food.id}`)
    if (food.calories < 1) issues.push(`Unusually low calories (${food.calories}) for ${food.id}`)
  })

  return {
    isValid: issues.length === 0,
    issues,
    totalItems: foods.length,
  }
}

/**
 * Generates a summary report of the dataset merger
 */
export const generateMergerReport = () => {
  const { mergedData, stats } = mergeAllFoodData()
  const categoryBreakdown = getCategoryBreakdown(mergedData)
  const validation = validateMergedDataset(mergedData)

  return {
    stats,
    categoryBreakdown,
    validation,
    summary: {
      message: `Successfully merged ${stats.newItemsCount} new items with ${stats.originalCount} existing items`,
      hasIssues: !validation.isValid || stats.duplicateIds.length > 0,
      recommendedAction:
        validation.isValid && stats.duplicateIds.length === 0
          ? "Ready to update main dataset file"
          : "Fix validation issues before proceeding",
    },
  }
}
