import { FOODS_DATASET } from "../data/foods-dataset"
import { FoodData, FoodDataValidation } from "../types/FoodData"

/**
 * Validate a single food data entry
 */
export function validateFoodData(food: FoodData): FoodDataValidation {
  const errors: string[] = []

  // Required fields validation
  if (!food.id || food.id.trim() === "") {
    errors.push("ID is required and cannot be empty")
  }

  if (!food.names.en || food.names.en.trim() === "") {
    errors.push("English name is required")
  }

  if (!food.names.fr || food.names.fr.trim() === "") {
    errors.push("French name is required")
  }

  if (!food.calories || food.calories <= 0) {
    errors.push("Calories must be a positive number")
  }

  if (!food.portionSize.amount || food.portionSize.amount <= 0) {
    errors.push("Portion amount must be positive")
  }

  if (!food.imageUrl || !food.imageUrl.startsWith("https://")) {
    errors.push("Image URL must be a valid HTTPS URL")
  }

  // Validate Unsplash URL format if present
  if (
    food.imageUrl.includes("unsplash.com") &&
    !food.imageUrl.match(/images\.unsplash\.com\/photo-/)
  ) {
    errors.push("Invalid Unsplash URL format")
  }

  // Category validation
  const validCategories = ["fast-food", "dessert", "beverage", "snack", "fruit", "main-course"]
  if (!validCategories.includes(food.category)) {
    errors.push(`Invalid category: ${food.category}. Must be one of: ${validCategories.join(", ")}`)
  }

  // Portion unit validation
  const validUnits = ["piece", "100g", "cup", "slice", "serving", "bottle", "can"]
  if (!validUnits.includes(food.portionSize.unit)) {
    errors.push(
      `Invalid portion unit: ${food.portionSize.unit}. Must be one of: ${validUnits.join(", ")}`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate the entire food dataset
 */
export function validateFoodDataset(): {
  isValid: boolean
  totalItems: number
  validItems: number
  invalidItems: FoodData[]
  duplicateIds: string[]
  errors: Array<{ foodId: string; errors: string[] }>
} {
  const errors: Array<{ foodId: string; errors: string[] }> = []
  const invalidItems: FoodData[] = []
  const seenIds = new Set<string>()
  const duplicateIds: string[] = []
  let validItems = 0

  // Check for duplicate IDs
  FOODS_DATASET.forEach((food) => {
    if (seenIds.has(food.id)) {
      duplicateIds.push(food.id)
    } else {
      seenIds.add(food.id)
    }
  })

  // Validate each food item
  FOODS_DATASET.forEach((food) => {
    const validation = validateFoodData(food)

    if (!validation.isValid) {
      invalidItems.push(food)
      errors.push({
        foodId: food.id,
        errors: validation.errors,
      })
    } else {
      validItems++
    }
  })

  return {
    isValid: errors.length === 0 && duplicateIds.length === 0,
    totalItems: FOODS_DATASET.length,
    validItems,
    invalidItems,
    duplicateIds,
    errors,
  }
}

/**
 * Check if image URLs are accessible
 * Note: This should be used in tests or dev tools, not in production
 */
export async function validateImageUrls(foods: FoodData[] = FOODS_DATASET): Promise<{
  accessible: string[]
  broken: Array<{ foodId: string; url: string; error: string }>
}> {
  const accessible: string[] = []
  const broken: Array<{ foodId: string; url: string; error: string }> = []

  for (const food of foods) {
    try {
      const response = await fetch(food.imageUrl, { method: "HEAD" })
      if (response.ok) {
        accessible.push(food.id)
      } else {
        broken.push({
          foodId: food.id,
          url: food.imageUrl,
          error: `HTTP ${response.status}: ${response.statusText}`,
        })
      }
    } catch (error) {
      broken.push({
        foodId: food.id,
        url: food.imageUrl,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return { accessible, broken }
}

/**
 * Generate a report of the dataset validation
 */
export function generateDatasetReport(): string {
  const validation = validateFoodDataset()

  let report = `# Food Dataset Validation Report\n\n`
  report += `**Total Items:** ${validation.totalItems}\n`
  report += `**Valid Items:** ${validation.validItems}\n`
  report += `**Invalid Items:** ${validation.invalidItems.length}\n`
  report += `**Overall Status:** ${validation.isValid ? "✅ VALID" : "❌ INVALID"}\n\n`

  if (validation.duplicateIds.length > 0) {
    report += `## Duplicate IDs\n`
    validation.duplicateIds.forEach((id) => {
      report += `- ${id}\n`
    })
    report += `\n`
  }

  if (validation.errors.length > 0) {
    report += `## Validation Errors\n\n`
    validation.errors.forEach(({ foodId, errors }) => {
      report += `### ${foodId}\n`
      errors.forEach((error) => {
        report += `- ${error}\n`
      })
      report += `\n`
    })
  }

  // Category breakdown
  const categories = [...new Set(FOODS_DATASET.map((f) => f.category))]
  report += `## Category Breakdown\n\n`
  categories.forEach((category) => {
    const count = FOODS_DATASET.filter((f) => f.category === category).length
    report += `- **${category}:** ${count} items\n`
  })

  return report
}
