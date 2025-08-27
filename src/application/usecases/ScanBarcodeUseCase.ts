import { DishRepository } from "../../domain/nutrition/DishRepository"

/**
 * Application use case for scanning barcodes and retrieving product information
 *
 * Orchestrates barcode scanning with external product databases (OpenFoodFacts)
 * to provide food data for effort calculations.
 */
export class ScanBarcodeUseCase {
  constructor(private readonly dishRepository: DishRepository) {}

  /**
   * Scan barcode and retrieve product information
   */
  async execute(input: ScanBarcodeInput): Promise<ScanBarcodeOutput> {
    // Validate input
    if (!input.barcode || !input.barcode.trim()) {
      throw new Error("Barcode is required")
    }

    // Validate barcode format (basic validation)
    const barcode = input.barcode.trim()
    if (!this.isValidBarcodeFormat(barcode)) {
      throw new Error("Invalid barcode format")
    }

    // Get product from external database via repository with metadata
    const result = await this.dishRepository.findByBarcodeWithMetadata?.(barcode)

    if (!result || !result.dish) {
      return {
        success: false,
        error: "PRODUCT_NOT_FOUND",
        message: "Produit non trouvé dans la base de données",
        barcode,
        dish: null,
      }
    }

    const { dish, servingSize } = result

    return {
      success: true,
      barcode,
      dish: {
        id: dish.getId().toString(),
        name: dish.getName(),
        calories: dish.getCalories(),
        description: null, // Description not available in current Dish domain model
        servingSize: servingSize || null,
      },
    }
  }

  /**
   * Validate barcode format (EAN13, EAN8, UPC_A)
   */
  private isValidBarcodeFormat(barcode: string): boolean {
    // EAN13: 13 digits
    if (/^\d{13}$/.test(barcode)) return true

    // EAN8: 8 digits
    if (/^\d{8}$/.test(barcode)) return true

    // UPC_A: 12 digits
    if (/^\d{12}$/.test(barcode)) return true

    // Code128: Variable length alphanumeric (6-20 characters)
    if (/^[A-Z0-9]{6,20}$/.test(barcode)) return true

    return false
  }
}

/**
 * Input data for barcode scanning use case
 */
export interface ScanBarcodeInput {
  barcode: string
}

/**
 * Output data for barcode scanning use case
 */
export interface ScanBarcodeOutput {
  success: boolean
  barcode: string
  dish?: {
    id: string
    name: string
    calories: number
    description?: string | null
    servingSize?: string | null
  } | null
  error?: ScanBarcodeError
  message?: string
}

/**
 * Error types for barcode scanning
 */
export type ScanBarcodeError =
  | "INVALID_BARCODE"
  | "PRODUCT_NOT_FOUND"
  | "NETWORK_ERROR"
  | "API_ERROR"
