import { openFoodFactsService } from "@/services/OpenFoodFactsService"

import { Dish } from "../../domain/nutrition/Dish"
import { DishRepository } from "../../domain/nutrition/DishRepository"

/**
 * OpenFoodFacts implementation of DishRepository
 *
 * This adapter connects the domain layer with the OpenFoodFacts API
 * via the OpenFoodFactsService infrastructure service.
 */
export class OpenFoodFactsRepository implements DishRepository {
  /**
   * Find dishes by name query (delegates to search method)
   */
  async findByName(query: string, limit?: number): Promise<Dish[]> {
    // OpenFoodFacts doesn't have a direct name search that returns dishes
    // This would require a separate implementation or fallback to StaticDishRepository
    throw new Error(
      "Name search not implemented in OpenFoodFactsRepository. Use StaticDishRepository instead.",
    )
  }

  /**
   * Find a dish by its unique identifier
   */
  async findById(id: string): Promise<Dish | null> {
    // Extract barcode from OpenFoodFacts ID format (e.g., "openfoodfacts-1234567890123")
    if (id.startsWith("openfoodfacts-")) {
      const barcode = id.replace("openfoodfacts-", "")
      return this.findByBarcode(barcode)
    }
    return null
  }

  /**
   * Get popular dishes for recommendations
   */
  async findPopular(limit?: number): Promise<Dish[]> {
    // OpenFoodFacts doesn't have a "popular" endpoint
    // This would require a different implementation or fallback
    throw new Error(
      "Popular dishes not available in OpenFoodFactsRepository. Use StaticDishRepository instead.",
    )
  }

  /**
   * Find dishes by category
   */
  async findByCategory?(category: string, limit?: number): Promise<Dish[]> {
    // This could be implemented with OpenFoodFacts category API
    // For now, not implemented
    throw new Error("Category search not implemented in OpenFoodFactsRepository.")
  }

  /**
   * Search dishes by tags or keywords
   */
  async search?(
    query: string,
    filters?: {
      category?: string
      maxCalories?: number
      minCalories?: number
    },
  ): Promise<Dish[]> {
    // This could be implemented with OpenFoodFacts search API
    // For now, not implemented
    throw new Error("Advanced search not implemented in OpenFoodFactsRepository.")
  }

  /**
   * Find dish by barcode - MAIN FUNCTIONALITY
   */
  async findByBarcode(barcode: string): Promise<Dish | null> {
    try {
      return await openFoodFactsService.findProductByBarcode(barcode)
    } catch (error) {
      console.error("Error in OpenFoodFactsRepository.findByBarcode:", error)
      return null
    }
  }

  /**
   * Get all dishes
   */
  async getAll(): Promise<Dish[]> {
    // Not applicable for OpenFoodFacts (external API)
    throw new Error(
      "getAll not available in OpenFoodFactsRepository. Use StaticDishRepository instead.",
    )
  }
}
