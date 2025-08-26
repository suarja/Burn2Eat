import { Dish } from "./Dish";

/**
 * Domain port for accessing dish data
 * This is an interface that will be implemented by infrastructure adapters
 */
export interface DishRepository {
  /**
   * Find dishes by name query
   * Supports partial matching and multiple languages
   */
  findByName(query: string, limit?: number): Promise<Dish[]>;
  
  /**
   * Find a dish by its unique identifier
   */
  findById(id: string): Promise<Dish | null>;
  
  /**
   * Get popular dishes for recommendations
   */
  findPopular(limit?: number): Promise<Dish[]>;
  
  /**
   * Find dishes by category (if applicable)
   */
  findByCategory?(category: string, limit?: number): Promise<Dish[]>;
  
  /**
   * Search dishes by tags or keywords
   */
  search?(query: string, filters?: {
    category?: string;
    maxCalories?: number;
    minCalories?: number;
  }): Promise<Dish[]>;

  getAll() :Promise<Dish[]> 
}