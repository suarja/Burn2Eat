import { FoodData } from "../../types/FoodData"

/**
 * Template and utilities for creating consistent food data entries
 */

/**
 * Creates a food data entry template with validation
 * Use this template to ensure consistent data structure across all category files
 */
export const createFoodDataTemplate = (): Partial<FoodData> => ({
  id: "", // Required: kebab-case unique identifier
  names: {
    en: "", // Required: English name
    fr: "", // Required: French name
  },
  calories: 0, // Required: calories per portion
  portionSize: {
    amount: 0, // Required: numeric amount
    unit: "piece", // Required: piece | 100g | cup | slice | serving | bottle | can
  },
  category: "fast-food", // Required: fast-food | dessert | beverage | snack | fruit | main-course
  imageUrl: "", // Required: Unsplash URL format: https://images.unsplash.com/photo-ID?w=400&h=400&fit=crop
  unsplashId: "", // Optional: Unsplash photo ID for traceability
  description: {
    en: "", // Optional: English description
    fr: "", // Optional: French description
  },
  tags: [], // Optional: array of search tags
})

/**
 * Validates food data entry for completeness and consistency
 */
export const validateFoodData = (
  food: Partial<FoodData>,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Required field validation
  if (!food.id) errors.push("ID is required")
  if (!food.names?.en) errors.push("English name is required")
  if (!food.names?.fr) errors.push("French name is required")
  if (!food.calories || food.calories <= 0) errors.push("Valid calorie count is required")
  if (!food.portionSize?.amount || food.portionSize.amount <= 0)
    errors.push("Valid portion amount is required")
  if (!food.portionSize?.unit) errors.push("Portion unit is required")
  if (!food.category) errors.push("Category is required")
  if (!food.imageUrl) errors.push("Image URL is required")

  // Format validation
  if (food.id && !/^[a-z0-9-]+$/.test(food.id)) {
    errors.push("ID must be kebab-case (lowercase letters, numbers, hyphens only)")
  }

  if (food.imageUrl && !food.imageUrl.includes("images.unsplash.com")) {
    errors.push("Image URL should be from Unsplash for consistency")
  }

  // Calorie range validation (reasonable limits)
  if (food.calories && (food.calories < 1 || food.calories > 2000)) {
    errors.push("Calorie count should be between 1 and 2000 per portion")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Common Unsplash food search terms for finding appropriate images
 */
export const UNSPLASH_FOOD_SEARCH_TERMS = [
  // General terms
  "food",
  "meal",
  "dish",
  "cuisine",
  "delicious",

  // Fast food
  "burger",
  "pizza",
  "fries",
  "fast food",
  "sandwich",

  // Desserts
  "cake",
  "dessert",
  "cookie",
  "ice cream",
  "chocolate",
  "sweet",

  // Beverages
  "drink",
  "beverage",
  "coffee",
  "juice",
  "smoothie",
  "soda",

  // Fruits
  "fruit",
  "fresh",
  "apple",
  "banana",
  "berry",
  "citrus",

  // Snacks
  "snack",
  "nuts",
  "chips",
  "healthy snack",

  // Main course
  "main dish",
  "dinner",
  "lunch",
  "plate",
  "grilled",
  "pasta",
  "rice",

  // Breakfast
  "breakfast",
  "cereal",
  "eggs",
  "pancakes",
  "toast",
  "morning meal",

  // Healthy
  "healthy",
  "salad",
  "vegetable",
  "whole grain",
  "lean protein",
]

/**
 * Helper function to format Unsplash URL correctly
 */
export const formatUnsplashUrl = (photoId: string): string => {
  return `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop`
}

/**
 * Example food data entry showing proper structure
 */
export const EXAMPLE_FOOD_ENTRY: FoodData = {
  id: "grilled-chicken-breast",
  names: {
    en: "Grilled Chicken Breast",
    fr: "Blanc de Poulet Grillé",
  },
  calories: 185,
  portionSize: {
    amount: 100,
    unit: "100g",
  },
  category: "main-course",
  imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop",
  unsplashId: "1532550907401-a500c9a57435",
  description: {
    en: "Lean grilled chicken breast, high in protein",
    fr: "Blanc de poulet grillé maigre, riche en protéines",
  },
  tags: ["chicken", "protein", "healthy", "grilled", "lean"],
}
