import { DishRepository } from "../../domain/nutrition/DishRepository";
import { Dish } from "../../domain/nutrition/Dish";
import { DishId } from "../../domain/nutrition/DishId";
import { NutritionalInfo } from "../../domain/nutrition/NutritionalInfo";
import { Kilocalories } from "../../domain/common/UnitTypes";
import {
  FOODS_DATASET,
  getFoodById,
  getFoodsByCategory,
  searchFoodsByName,
  FoodData
} from "../data";

/**
 * Infrastructure adapter that implements DishRepository using static food dataset
 * Translates between infrastructure FoodData and domain Dish entities
 */
export class StaticDishRepository implements DishRepository {
  
  async findByName(query: string, limit?: number): Promise<Dish[]> {
    const foodsData = searchFoodsByName(query);
    const limitedFoods = limit ? foodsData.slice(0, limit) : foodsData;
    
    return limitedFoods.map(foodData => this.toDomainDish(foodData));
  }

  async findById(id: string): Promise<Dish | null> {
    const foodData = getFoodById(id);
    
    if (!foodData) {
      return null;
    }
    
    return this.toDomainDish(foodData);
  }

  async findPopular(limit: number = 10): Promise<Dish[]> {
    // For MVP, return first N items as "popular"
    // Could be enhanced with popularity scoring later
    const popularFoods = FOODS_DATASET.slice(0, limit);
    
    return popularFoods.map(foodData => this.toDomainDish(foodData));
  }

  async findByCategory(category: string, limit?: number): Promise<Dish[]> {
    const foodsData = getFoodsByCategory(category);
    const limitedFoods = limit ? foodsData.slice(0, limit) : foodsData;
    
    return limitedFoods.map(foodData => this.toDomainDish(foodData));
  }

  async search(query: string, filters?: {
    category?: string;
    maxCalories?: number;
    minCalories?: number;
  }): Promise<Dish[]> {
    let results = searchFoodsByName(query);

    // Apply filters
    if (filters) {
      if (filters.category) {
        results = results.filter(food => food.category === filters.category);
      }
      
      if (filters.maxCalories !== undefined) {
        results = results.filter(food => food.calories <= filters.maxCalories!);
      }
      
      if (filters.minCalories !== undefined) {
        results = results.filter(food => food.calories >= filters.minCalories!);
      }
    }

    return results.map(foodData => this.toDomainDish(foodData));
  }

  /**
   * Private method to convert infrastructure FoodData to domain Dish
   * This is where the translation happens between layers
   */
  private toDomainDish(foodData: FoodData): Dish {
    const dishId = DishId.from(foodData.id);
    
    // Convert calories to branded type
    const calories = foodData.calories as Kilocalories;
    const nutrition = NutritionalInfo.perServing(calories);
    
    // Use the English name for the domain (could be configurable)
    const name = foodData.names.en;
    
    return Dish.create({ 
      dishId, 
      name, 
      nutrition 
    });
  }

  /**
   * Helper method to get available food categories
   * Useful for UI category filters
   */
  async getAvailableCategories(): Promise<string[]> {
    const categories = [...new Set(FOODS_DATASET.map(food => food.category))];
    return categories;
  }

  /**
   * Helper method to get dataset statistics
   * Useful for analytics or admin interfaces
   */
  async getDatasetInfo(): Promise<{
    totalDishes: number;
    categories: string[];
    averageCalories: number;
  }> {
    const totalDishes = FOODS_DATASET.length;
    const categories = await this.getAvailableCategories();
    const averageCalories = Math.round(
      FOODS_DATASET.reduce((sum, food) => sum + food.calories, 0) / totalDishes
    );

    return {
      totalDishes,
      categories,
      averageCalories
    };
  }
}