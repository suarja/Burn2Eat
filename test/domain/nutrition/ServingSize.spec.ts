import { Grams } from "@/domain/common/UnitTypes"
import { PortionUnit } from "@/domain/nutrition/PortionUnit"
import { ServingSize, InvalidServingSizeError } from "@/domain/nutrition/ServingSize"

describe("ServingSize Value Object", () => {
  describe("ServingSize.fromString", () => {
    it("should create serving from weight strings", () => {
      const serving = ServingSize.fromString("100g")
      expect(serving.getAmount()).toBe(100)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
      expect(serving.toGrams()).toBe(100)
    })

    it("should create serving from volume strings", () => {
      const serving = ServingSize.fromString("250ml")
      expect(serving.getAmount()).toBe(250)
      expect(serving.getUnit()).toBe(PortionUnit.MILLILITERS)
      expect(serving.toGrams()).toBe(250) // 1ml ≈ 1g approximation
    })

    it("should create serving from count strings", () => {
      const serving = ServingSize.fromString("1 piece")
      expect(serving.getAmount()).toBe(1)
      expect(serving.getUnit()).toBe(PortionUnit.PIECE)
      expect(serving.toGrams()).toBe(20) // Default piece weight
    })

    it("should handle decimal amounts", () => {
      const serving = ServingSize.fromString("21.5g")
      expect(serving.getAmount()).toBe(21.5)
      expect(serving.toGrams()).toBe(21.5)
    })

    it("should handle comma decimals", () => {
      const serving = ServingSize.fromString("21,5g")
      expect(serving.getAmount()).toBe(21.5)
      expect(serving.toGrams()).toBe(21.5)
    })

    it("should throw error for invalid input", () => {
      expect(() => ServingSize.fromString("")).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.fromString("no numbers")).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.fromString("0g")).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.fromString("-5g")).toThrow(InvalidServingSizeError)
    })

    it("should handle various unit formats", () => {
      expect(ServingSize.fromString("2 slices").getUnit()).toBe(PortionUnit.SLICE)
      expect(ServingSize.fromString("1 bouteille").getUnit()).toBe(PortionUnit.BOTTLE)
      expect(ServingSize.fromString("3 tranches").getUnit()).toBe(PortionUnit.SLICE)
    })
  })

  describe("ServingSize.grams", () => {
    it("should create serving from grams", () => {
      const serving = ServingSize.grams(150)
      expect(serving.getAmount()).toBe(150)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
      expect(serving.toGrams()).toBe(150)
    })

    it("should throw error for invalid grams", () => {
      expect(() => ServingSize.grams(0)).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.grams(-10)).toThrow(InvalidServingSizeError)
    })
  })

  describe("ServingSize.pieces", () => {
    it("should create serving from pieces with weight", () => {
      const serving = ServingSize.pieces(3, 25) // 3 pieces, 25g each
      expect(serving.getAmount()).toBe(3)
      expect(serving.getUnit()).toBe(PortionUnit.PIECE)
      expect(serving.toGrams()).toBe(75) // 3 * 25
    })

    it("should throw error for invalid parameters", () => {
      expect(() => ServingSize.pieces(0, 25)).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.pieces(3, 0)).toThrow(InvalidServingSizeError)
      expect(() => ServingSize.pieces(-1, 25)).toThrow(InvalidServingSizeError)
    })
  })

  describe("ServingSize.slices", () => {
    it("should create serving from slices with weight", () => {
      const serving = ServingSize.slices(2, 40) // 2 slices, 40g each
      expect(serving.getAmount()).toBe(2)
      expect(serving.getUnit()).toBe(PortionUnit.SLICE)
      expect(serving.toGrams()).toBe(80) // 2 * 40
    })
  })

  describe("Conversion calculations", () => {
    it("should calculate correct grams for various units", () => {
      expect(ServingSize.fromString("1kg").toGrams()).toBe(1000)
      expect(ServingSize.fromString("1l").toGrams()).toBe(1000)
      expect(ServingSize.fromString("1 cup").toGrams()).toBe(200)
      expect(ServingSize.fromString("1 bottle").toGrams()).toBe(330)
      expect(ServingSize.fromString("1 can").toGrams()).toBe(250)
    })

    it("should handle fractional conversions", () => {
      expect(ServingSize.fromString("0.5kg").toGrams()).toBe(500)
      expect(ServingSize.fromString("2.5 cups").toGrams()).toBe(500) // 2.5 * 200
    })
  })

  describe("toDisplayString", () => {
    it("should format French display strings correctly", () => {
      expect(ServingSize.fromString("1 piece").toDisplayString("fr")).toBe("1 pièce")
      expect(ServingSize.fromString("2 pieces").toDisplayString("fr")).toBe("2 pièces")
      expect(ServingSize.fromString("1 slice").toDisplayString("fr")).toBe("1 tranche")
      expect(ServingSize.fromString("3 slices").toDisplayString("fr")).toBe("3 tranches")
      expect(ServingSize.fromString("1 bottle").toDisplayString("fr")).toBe("1 bouteille")
      expect(ServingSize.fromString("2 bottles").toDisplayString("fr")).toBe("2 bouteilles")
    })

    it("should format English display strings correctly", () => {
      expect(ServingSize.fromString("1 piece").toDisplayString("en")).toBe("1 piece")
      expect(ServingSize.fromString("2 pieces").toDisplayString("en")).toBe("2 piece")
    })

    it("should default to French", () => {
      expect(ServingSize.fromString("1 piece").toDisplayString()).toBe("1 pièce")
    })

    it("should handle weight units", () => {
      expect(ServingSize.fromString("100g").toDisplayString()).toBe("100 grammes")
      expect(ServingSize.fromString("250ml").toDisplayString()).toBe("250 millilitres")
    })
  })

  describe("getDisplayContext", () => {
    it("should return per-product context for count units", () => {
      const serving = ServingSize.fromString("1 slice") // 30g per slice
      const context = serving.getDisplayContext(60 as Grams) // 60g = 2 slices

      expect(context.quantityText).toBe("pour 2 tranches")
      expect(context.isPerProduct).toBe(true)
    })

    it("should return per-gram context for weight units", () => {
      const serving = ServingSize.fromString("100g")
      const context = serving.getDisplayContext(150 as Grams)

      expect(context.quantityText).toBe("pour 150g")
      expect(context.isPerProduct).toBe(false)
    })

    it("should handle single units correctly", () => {
      const serving = ServingSize.fromString("1 piece") // 20g per piece
      const context = serving.getDisplayContext(20 as Grams) // 20g = 1 piece

      expect(context.quantityText).toBe("pour 1 pièce")
      expect(context.isPerProduct).toBe(true)
    })

    it("should handle different product types", () => {
      const bottleServing = ServingSize.fromString("1 bottle") // 330g
      const bottleContext = bottleServing.getDisplayContext(330 as Grams)
      expect(bottleContext.quantityText).toBe("pour 1 bouteille")

      const canServing = ServingSize.fromString("1 can") // 250g
      const canContext = canServing.getDisplayContext(500 as Grams)
      expect(canContext.quantityText).toBe("pour 2 canettes")
    })
  })

  describe("equals", () => {
    it("should compare servings by value", () => {
      const serving1 = ServingSize.fromString("100g")
      const serving2 = ServingSize.fromString("100g")
      const serving3 = ServingSize.fromString("200g")

      expect(serving1.equals(serving2)).toBe(true)
      expect(serving1.equals(serving3)).toBe(false)
    })

    it("should compare different units with same grams", () => {
      const serving1 = ServingSize.grams(100)
      const serving2 = ServingSize.fromString("100ml") // Also 100g equivalent

      // Different units, same grams - should be equal by grams
      expect(serving1.toGrams()).toBe(serving2.toGrams())
      // But not equal as value objects (different amount/unit combination)
      expect(serving1.equals(serving2)).toBe(false)
    })
  })

  describe("withAmount", () => {
    it("should create new serving with different amount", () => {
      const original = ServingSize.fromString("1 piece") // 20g
      const doubled = original.withAmount(2) // Should be 40g

      expect(doubled.getAmount()).toBe(2)
      expect(doubled.getUnit()).toBe(PortionUnit.PIECE)
      expect(doubled.toGrams()).toBe(40)

      // Original should be unchanged (immutability)
      expect(original.getAmount()).toBe(1)
      expect(original.toGrams()).toBe(20)
    })

    it("should throw error for invalid amount", () => {
      const serving = ServingSize.fromString("100g")
      expect(() => serving.withAmount(0)).toThrow(InvalidServingSizeError)
      expect(() => serving.withAmount(-5)).toThrow(InvalidServingSizeError)
    })
  })

  describe("scale", () => {
    it("should scale serving by factor", () => {
      const original = ServingSize.fromString("100g")
      const scaled = original.scale(1.5)

      expect(scaled.getAmount()).toBe(150)
      expect(scaled.getUnit()).toBe(PortionUnit.GRAMS)
      expect(scaled.toGrams()).toBe(150)
    })

    it("should handle fractional scaling", () => {
      const original = ServingSize.fromString("2 pieces") // 40g
      const scaled = original.scale(0.5) // Should be 1 piece, 20g

      expect(scaled.getAmount()).toBe(1)
      expect(scaled.toGrams()).toBe(20)
    })

    it("should throw error for invalid scale factor", () => {
      const serving = ServingSize.fromString("100g")
      expect(() => serving.scale(0)).toThrow(InvalidServingSizeError)
      expect(() => serving.scale(-1)).toThrow(InvalidServingSizeError)
    })
  })
})
