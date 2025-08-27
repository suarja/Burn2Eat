import { Dish } from "./Dish"

/**
 * Category information with metadata
 */
export interface CategoryInfo {
  id: string
  name: string
  icon: string
  count: number
  description?: string
}

/**
 * Domain port for accessing dish data
 * This is an interface that will be implemented by infrastructure adapters
 */
export interface DishRepository {
  /**
   * Find dishes by name query
   * Supports partial matching and multiple languages
   */
  findByName(query: string, limit?: number): Promise<Dish[]>

  /**
   * Find a dish by its unique identifier
   */
  findById(id: string): Promise<Dish | null>

  /**
   * Get popular dishes for recommendations
   */
  findPopular(limit?: number): Promise<Dish[]>

  /**
   * Find dishes by category (if applicable)
   * @param category - The category to filter by
   * @param limit - Maximum number of dishes to return
   * @param page - Page number for pagination (0-based)
   */
  findByCategory?(category: string, limit?: number, page?: number): Promise<Dish[]>

  /**
   * Get available categories with metadata
   */
  getCategories(): Promise<CategoryInfo[]>

  /**
   * Search dishes by tags or keywords
   */
  search?(
    query: string,
    filters?: {
      category?: string
      maxCalories?: number
      minCalories?: number
    },
  ): Promise<Dish[]>

  /**
   * Find dish by barcode (EAN13, EAN8, UPC_A)
   * Returns null if product not found in external database
   */
  findByBarcode?(barcode: string): Promise<Dish | null>

  /**
   * Find dish by barcode with additional metadata (including serving size)
   * Returns null if product not found in external database
   */
  findByBarcodeWithMetadata?(barcode: string): Promise<{ dish: Dish; servingSize?: string } | null>

  getAll(): Promise<Dish[]>
}
