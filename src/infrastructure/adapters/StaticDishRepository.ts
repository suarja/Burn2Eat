import { Kilocalories } from "../../domain/common/UnitTypes"
import { Dish } from "../../domain/nutrition/Dish"
import { DishId } from "../../domain/nutrition/DishId"
import { CategoryInfo, DishRepository } from "../../domain/nutrition/DishRepository"
import { NutritionalInfo } from "../../domain/nutrition/NutritionalInfo"
import { FoodData } from "../data"
import { mergeAllFoodData } from "../data/utils/dataset-merger"

const FOODS_DATASET = mergeAllFoodData().mergedData
/**
 * Infrastructure adapter that implements DishRepository using static food dataset
 * Translates between infrastructure FoodData and domain Dish entities
 */
export class StaticDishRepository implements DishRepository {
  getAll(): Promise<Dish[]> {
    return Promise.resolve(FOODS_DATASET.map(this.toDomainDish))
  }

  async findByName(query: string, limit?: number): Promise<Dish[]> {
    const lowerQuery = query.toLowerCase()
    const foodsData = FOODS_DATASET.filter(
      (food) =>
        food.names.en.toLowerCase().includes(lowerQuery) ||
        food.names.fr.toLowerCase().includes(lowerQuery) ||
        food.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
    const limitedFoods = limit ? foodsData.slice(0, limit) : foodsData

    return limitedFoods.map((foodData) => this.toDomainDish(foodData))
  }

  async findById(id: string): Promise<Dish | null> {
    const foodData = FOODS_DATASET.find((food) => food.id === id)

    if (!foodData) {
      return null
    }

    return this.toDomainDish(foodData)
  }

  async findPopular(limit: number = 10): Promise<Dish[]> {
    // For MVP, return first N items as "popular"
    // Could be enhanced with popularity scoring later
    const popularFoods = FOODS_DATASET.slice(0, limit)

    return popularFoods.map((foodData) => this.toDomainDish(foodData))
  }

  async findByCategory(category: string, limit?: number, page: number = 0): Promise<Dish[]> {
    const foodsData = FOODS_DATASET.filter((food) => food.category === category)
    
    // Apply pagination
    const startIndex = page * (limit || foodsData.length)
    const endIndex = limit ? startIndex + limit : foodsData.length
    const paginatedFoods = foodsData.slice(startIndex, endIndex)

    return paginatedFoods.map((foodData) => this.toDomainDish(foodData))
  }

  async search(
    query: string,
    filters?: {
      category?: string
      maxCalories?: number
      minCalories?: number
    },
  ): Promise<Dish[]> {
    const lowerQuery = query.toLowerCase()
    let results = FOODS_DATASET.filter(
      (food) =>
        food.names.en.toLowerCase().includes(lowerQuery) ||
        food.names.fr.toLowerCase().includes(lowerQuery) ||
        food.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )

    // Apply filters
    if (filters) {
      if (filters.category) {
        results = results.filter((food) => food.category === filters.category)
      }

      if (filters.maxCalories !== undefined) {
        results = results.filter((food) => food.calories <= filters.maxCalories!)
      }

      if (filters.minCalories !== undefined) {
        results = results.filter((food) => food.calories >= filters.minCalories!)
      }
    }

    return results.map((foodData) => this.toDomainDish(foodData))
  }

  /**
   * Private method to convert infrastructure FoodData to domain Dish
   * This is where the translation happens between layers
   */
  private toDomainDish(foodData: FoodData): Dish {
    const dishId = DishId.from(foodData.id)

    // Convert calories to branded type
    const calories = foodData.calories as Kilocalories
    const nutrition = NutritionalInfo.perServing(calories)

    // Use the English name for the domain (could be configurable)
    const name = foodData.names.en

    return Dish.create({
      dishId,
      name,
      nutrition,
      imageUrl: foodData.imageUrl, // Map the image URL from infrastructure to domain
    })
  }

  /**
   * Helper method to get available food categories
   * Useful for UI category filters
   */
  async getAvailableCategories(): Promise<string[]> {
    const categories = [...new Set(FOODS_DATASET.map((food) => food.category))]
    return categories
  }

  /**
   * Get categories with metadata for UI display
   */
  async getCategories(): Promise<CategoryInfo[]> {
    const categoryMap = new Map<string, number>()
    
    // Count dishes per category
    FOODS_DATASET.forEach((food) => {
      categoryMap.set(food.category, (categoryMap.get(food.category) || 0) + 1)
    })

    const categoryIconMap: Record<string, { icon: string; name: string; description?: string }> = {
      "fast-food": {
        icon: "🍔",
        name: "Fast Food",
        description: "Burgers, pizzas, frites et autres plats rapides"
      },
      "dessert": {
        icon: "🧁",
        name: "Desserts",
        description: "Gâteaux, glaces, chocolats et sucreries"
      },
      "beverage": {
        icon: "🥤",
        name: "Boissons",
        description: "Sodas, jus, café et autres boissons"
      },
      "snack": {
        icon: "🍿",
        name: "Collations",
        description: "Chips, noix, barres et en-cas"
      },
      "fruit": {
        icon: "🍎",
        name: "Fruits",
        description: "Fruits frais et secs"
      },
      "main-course": {
        icon: "🍽️",
        name: "Plats Principaux",
        description: "Viandes, poissons, pâtes et plats complets"
      },
      "breakfast": {
        icon: "🥐",
        name: "Petit-déjeuner",
        description: "Céréales, pains, œufs et produits matinaux"
      }
    }

    return Array.from(categoryMap.entries()).map(([categoryId, count]) => ({
      id: categoryId,
      name: categoryIconMap[categoryId]?.name || categoryId,
      icon: categoryIconMap[categoryId]?.icon || "🍽️",
      count,
      description: categoryIconMap[categoryId]?.description
    }))
  }

  /**
   * Helper method to get dataset statistics
   * Useful for analytics or admin interfaces
   */
  async getDatasetInfo(): Promise<{
    totalDishes: number
    categories: string[]
    averageCalories: number
  }> {
    const totalDishes = FOODS_DATASET.length
    const categories = await this.getAvailableCategories()
    const averageCalories = Math.round(
      FOODS_DATASET.reduce((sum, food) => sum + food.calories, 0) / totalDishes,
    )

    return {
      totalDishes,
      categories,
      averageCalories,
    }
  }
}
