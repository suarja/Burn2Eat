import { PortionUnit, PortionUnitUtils, InvalidPortionUnitError } from "./PortionUnit"
import { Grams } from "../common/UnitTypes"

/**
 * Domain error for invalid serving size operations
 */
export class InvalidServingSizeError extends Error {
  constructor(message: string) {
    super(`Invalid serving size: ${message}`)
  }
}

/**
 * ServingSize Value Object following DDD principles
 *
 * Research-based design:
 * - Value objects are immutable and defined by attributes
 * - Perfect for measurements and quantities
 * - Encapsulates conversion logic and business rules
 * - Provides type safety and domain validation
 *
 * Based on FDA serving size guidelines and food portion estimation research
 */
export class ServingSize {
  private constructor(
    private readonly amount: number,
    private readonly unit: PortionUnit,
    private readonly gramsEquivalent: Grams,
  ) {
    // Domain validation
    if (amount <= 0) {
      throw new InvalidServingSizeError("Amount must be positive")
    }
    if (gramsEquivalent <= 0) {
      throw new InvalidServingSizeError("Grams equivalent must be positive")
    }
  }

  /**
   * Create serving size from string input (common in food databases)
   * Examples: "100g", "1 slice", "250ml", "1 piece"
   */
  static fromString(input: string): ServingSize {
    if (!input || typeof input !== "string") {
      throw new InvalidServingSizeError("Input must be a non-empty string")
    }

    const normalized = input.toLowerCase().trim()

    // Extract numeric value
    const numMatch = normalized.match(/(-?\d+(?:[.,]\d+)?)/)
    if (!numMatch) {
      throw new InvalidServingSizeError(`No numeric value found in: ${input}`)
    }

    const amount = parseFloat(numMatch[1].replace(",", "."))
    if (amount <= 0) {
      throw new InvalidServingSizeError(`Invalid amount: ${amount}`)
    }

    try {
      const unit = PortionUnitUtils.fromString(normalized)
      const gramsEquivalent = ServingSize.calculateGramsEquivalent(amount, unit)

      return new ServingSize(amount, unit, gramsEquivalent)
    } catch (error) {
      if (error instanceof InvalidPortionUnitError) {
        throw new InvalidServingSizeError(`Unknown unit in: ${input}`)
      }
      throw error
    }
  }

  /**
   * Create serving size directly from grams
   */
  static grams(amount: number): ServingSize {
    if (amount <= 0) {
      throw new InvalidServingSizeError("Grams must be positive")
    }

    return new ServingSize(amount, PortionUnit.GRAMS, amount as Grams)
  }

  /**
   * Create serving size for pieces with weight estimation
   */
  static pieces(amount: number, estimatedGramsPer: number): ServingSize {
    if (amount <= 0 || estimatedGramsPer <= 0) {
      throw new InvalidServingSizeError("Amount and grams per piece must be positive")
    }

    const totalGrams = (amount * estimatedGramsPer) as Grams
    return new ServingSize(amount, PortionUnit.PIECE, totalGrams)
  }

  /**
   * Create serving size for slices with weight estimation
   */
  static slices(amount: number, estimatedGramsPer: number): ServingSize {
    if (amount <= 0 || estimatedGramsPer <= 0) {
      throw new InvalidServingSizeError("Amount and grams per slice must be positive")
    }

    const totalGrams = (amount * estimatedGramsPer) as Grams
    return new ServingSize(amount, PortionUnit.SLICE, totalGrams)
  }

  /**
   * Calculate grams equivalent based on unit and amount
   * Research-based conversion factors from food portion estimation studies
   */
  private static calculateGramsEquivalent(amount: number, unit: PortionUnit): Grams {
    switch (unit) {
      // Direct weight measurements
      case PortionUnit.GRAMS:
        return amount as Grams
      case PortionUnit.KILOGRAMS:
        return (amount * 1000) as Grams
      case PortionUnit.PER_100G:
        return (amount * 100) as Grams

      // Volume measurements (approximation: 1ml ≈ 1g for most foods)
      case PortionUnit.MILLILITERS:
        return amount as Grams
      case PortionUnit.LITERS:
        return (amount * 1000) as Grams
      case PortionUnit.CUP:
        return (amount * 200) as Grams // 1 cup ≈ 200g average
      case PortionUnit.TABLESPOON:
        return (amount * 15) as Grams // 1 tbsp ≈ 15g
      case PortionUnit.TEASPOON:
        return (amount * 5) as Grams // 1 tsp ≈ 5g

      // Count-based (using research-based averages)
      case PortionUnit.PIECE:
        return (amount * 20) as Grams // Average piece ≈ 20g (varies widely)
      case PortionUnit.SLICE:
        return (amount * 30) as Grams // Average slice ≈ 30g (bread, cheese, etc.)
      case PortionUnit.SERVING:
      case PortionUnit.PORTION:
        return (amount * 150) as Grams // Standard serving ≈ 150g

      // Container-based
      case PortionUnit.BOTTLE:
        return (amount * 330) as Grams // Standard bottle ≈ 330ml ≈ 330g
      case PortionUnit.CAN:
        return (amount * 250) as Grams // Standard can ≈ 250ml ≈ 250g

      default:
        throw new InvalidServingSizeError(`Cannot calculate grams for unit: ${unit}`)
    }
  }

  // Getters (Value object pattern - expose data through methods)

  getAmount(): number {
    return this.amount
  }

  getUnit(): PortionUnit {
    return this.unit
  }

  toGrams(): Grams {
    return this.gramsEquivalent
  }

  /**
   * Generate display string for UI
   * Supports internationalization and proper formatting
   */
  toDisplayString(locale: string = "fr"): string {
    const unitDisplay = PortionUnitUtils.getDisplayName(this.unit, locale)

    // Handle pluralization for French
    if (locale === "fr") {
      if (this.amount === 1) {
        if (this.unit === PortionUnit.PIECE) return "1 pièce"
        if (this.unit === PortionUnit.SLICE) return "1 tranche"
        if (this.unit === PortionUnit.BOTTLE) return "1 bouteille"
        if (this.unit === PortionUnit.CAN) return "1 canette"
        if (this.unit === PortionUnit.CUP) return "1 tasse"
      } else {
        if (this.unit === PortionUnit.PIECE) return `${this.amount} pièces`
        if (this.unit === PortionUnit.SLICE) return `${this.amount} tranches`
        if (this.unit === PortionUnit.BOTTLE) return `${this.amount} bouteilles`
        if (this.unit === PortionUnit.CAN) return `${this.amount} canettes`
        if (this.unit === PortionUnit.CUP) return `${this.amount} tasses`
      }
    }

    // Default formatting
    return `${this.amount} ${unitDisplay}`
  }

  /**
   * Create display context for UI components
   * Handles "per product" vs "per portion" logic
   */
  getDisplayContext(selectedGrams: Grams): { quantityText: string; isPerProduct: boolean } {
    const requiresContextual = PortionUnitUtils.requiresContextualConversion(this.unit)

    if (requiresContextual) {
      // For whole products, calculate estimated units
      const estimatedUnits = Math.round((selectedGrams / this.gramsEquivalent) * this.amount)

      if (this.unit === PortionUnit.SLICE) {
        return {
          quantityText: estimatedUnits === 1 ? "pour 1 tranche" : `pour ${estimatedUnits} tranches`,
          isPerProduct: true,
        }
      } else if (this.unit === PortionUnit.PIECE) {
        return {
          quantityText: estimatedUnits === 1 ? "pour 1 pièce" : `pour ${estimatedUnits} pièces`,
          isPerProduct: true,
        }
      } else if (this.unit === PortionUnit.BOTTLE) {
        return {
          quantityText:
            estimatedUnits === 1 ? "pour 1 bouteille" : `pour ${estimatedUnits} bouteilles`,
          isPerProduct: true,
        }
      } else if (this.unit === PortionUnit.CAN) {
        return {
          quantityText: estimatedUnits === 1 ? "pour 1 canette" : `pour ${estimatedUnits} canettes`,
          isPerProduct: true,
        }
      } else {
        return {
          quantityText: estimatedUnits === 1 ? "pour 1 portion" : `pour ${estimatedUnits} portions`,
          isPerProduct: true,
        }
      }
    }

    // Weight-based portions
    return {
      quantityText: `pour ${selectedGrams}g`,
      isPerProduct: false,
    }
  }

  /**
   * Value object equality (compare by attributes, not identity)
   */
  equals(other: ServingSize): boolean {
    return (
      this.amount === other.amount &&
      this.unit === other.unit &&
      this.gramsEquivalent === other.gramsEquivalent
    )
  }

  /**
   * Create a new ServingSize with different amount (immutability)
   */
  withAmount(newAmount: number): ServingSize {
    if (newAmount <= 0) {
      throw new InvalidServingSizeError("New amount must be positive")
    }

    const newGramsEquivalent = ((this.gramsEquivalent / this.amount) * newAmount) as Grams
    return new ServingSize(newAmount, this.unit, newGramsEquivalent)
  }

  /**
   * Scale the serving size by a factor (immutability)
   */
  scale(factor: number): ServingSize {
    if (factor <= 0) {
      throw new InvalidServingSizeError("Scale factor must be positive")
    }

    return this.withAmount(this.amount * factor)
  }
}
