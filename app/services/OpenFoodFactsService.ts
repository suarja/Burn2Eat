import { ApisauceInstance, create, ApiResponse } from "apisauce"

import { Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"

/**
 * OpenFoodFacts API Service
 *
 * Integrates with OpenFoodFacts API to retrieve product information by barcode
 * and transform it into domain objects.
 */
export class OpenFoodFactsService {
  private apisauce: ApisauceInstance

  constructor() {
    this.apisauce = create({
      baseURL: "https://world.openfoodfacts.org/api/v2/",
      timeout: 10000,
      headers: {
        "Accept": "application/json",
        "User-Agent": "Burn2Eat-App/1.0 (https://github.com/burn2eat/app)",
      },
    })
  }

  /**
   * Find product by barcode and return as Dish domain object
   */
  async findProductByBarcode(barcode: string): Promise<Dish | null> {
    try {
      const response: ApiResponse<OpenFoodFactsResponse> = await this.apisauce.get(
        `product/${barcode}`,
      )

      // Check if request failed
      if (!response.ok) {
        console.warn(`OpenFoodFacts API error: ${response.status}`)
        return null
      }

      // Check if product exists
      if (!response.data?.status || response.data.status !== 1) {
        console.info(`Product not found in OpenFoodFacts: ${barcode}`)
        return null
      }

      // Check if product data exists
      if (!response.data.product) {
        console.info(`No product data found for barcode: ${barcode}`)
        return null
      }

      // Transform OpenFoodFacts data to Dish
      return this.transformToDish(response.data.product, barcode)
    } catch (error) {
      console.error("Error fetching from OpenFoodFacts:", error)
      return null
    }
  }

  /**
   * Transform OpenFoodFacts product data to Dish domain object
   */
  private transformToDish(product: OpenFoodFactsProduct, barcode: string): Dish | null {
    try {
      // Extract product name
      const name =
        product.product_name ||
        product.product_name_fr ||
        product.product_name_en ||
        "Produit inconnu"

      console.log({ product })

      // Extract calories per 100g (always use per 100g for consistent calculation)
      let caloriesPer100g = product.nutriments?.["energy-kcal_100g"]
      if (!caloriesPer100g && product.nutriments) {
        // Try alternative fields
        const energyKcal = product.nutriments["energy-kcal"]
        const energyKj = product.nutriments["energy-kj_100g"]

        if (energyKcal) {
          // Assume energyKcal is per 100g if no specific per 100g value
          caloriesPer100g = energyKcal
        } else if (energyKj) {
          caloriesPer100g = energyKj / 4.184 // Convert kJ to kcal
        }
      }

      if (!caloriesPer100g || caloriesPer100g <= 0) {
        console.warn(`No calorie information for product: ${barcode}`)
        return null
      }

      // Create domain objects using per100g method
      const dishId = DishId.from(`openfoodfacts-${barcode}`)
      const nutritionalInfo = NutritionalInfo.per100g(caloriesPer100g as Kilocalories)

      // Extract suggested serving size for UI display
      const servingSize = product.serving_size || undefined

      const dish = Dish.create({
        dishId,
        name,
        nutrition: nutritionalInfo,
        imageUrl: product.image_url,
      })

      // Store serving size as metadata (we'll extend Dish later if needed)
      if (servingSize) {
        console.log(`📏 Suggested serving size for ${name}: ${servingSize}`)
        // For now, just log it - we'll use it in the UI component
      }

      return dish
    } catch (error) {
      console.error("Error transforming OpenFoodFacts data to Dish:", error)
      return null
    }
  }
}

/**
 * OpenFoodFacts API Response Types
 */
export interface OpenFoodFactsResponse {
  status: number
  status_verbose: string
  product?: OpenFoodFactsProduct
  code?: string
}

export interface OpenFoodFactsProduct {
  _id: string
  product_name?: string
  product_name_fr?: string
  product_name_en?: string
  brands?: string
  categories?: string
  categories_hierarchy?: string[]
  serving_size?: string
  nutriments?: {
    "energy-kcal_100g"?: number
    "energy-kcal"?: number
    "energy-kj_100g"?: number
    "energy-kcal_per_portion"?: number
    [key: string]: number | undefined
  }
  image_url?: string
  ingredients_text?: string
}

// Singleton instance for convenience
export const openFoodFactsService = new OpenFoodFactsService()
