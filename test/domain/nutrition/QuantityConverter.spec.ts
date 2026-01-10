import { Grams } from "@/domain/common/UnitTypes"
import { PortionUnit } from "@/domain/nutrition/PortionUnit"
import { QuantityConverter } from "@/domain/nutrition/QuantityConverter"
import { ServingSize, InvalidServingSizeError } from "@/domain/nutrition/ServingSize"

describe("QuantityConverter Domain Service", () => {
  let converter: QuantityConverter

  beforeEach(() => {
    converter = new QuantityConverter()
  })

  describe("parseServingString", () => {
    it("should parse valid serving strings", () => {
      const serving = converter.parseServingString("100g")
      expect(serving.getAmount()).toBe(100)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
      expect(serving.toGrams()).toBe(100)
    })

    it("should handle complex serving strings", () => {
      const serving = converter.parseServingString("21.5g")
      expect(serving.getAmount()).toBe(21.5)
      expect(serving.toGrams()).toBe(21.5)
    })

    it("should fallback to 100g for unparseable strings", () => {
      // Should not throw, but fallback to 100g
      const serving = converter.parseServingString("invalid format")
      expect(serving.toGrams()).toBe(100)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
    })

    it("should throw error for empty input", () => {
      expect(() => converter.parseServingString("")).toThrow(InvalidServingSizeError)
      expect(() => converter.parseServingString(null as any)).toThrow(InvalidServingSizeError)
      expect(() => converter.parseServingString(undefined as any)).toThrow(InvalidServingSizeError)
    })
  })

  describe("convertToGrams", () => {
    it("should convert weight units correctly", () => {
      expect(converter.convertToGrams(100, PortionUnit.GRAMS)).toBe(100)
      expect(converter.convertToGrams(1, PortionUnit.KILOGRAMS)).toBe(1000)
    })

    it("should convert volume units correctly", () => {
      expect(converter.convertToGrams(250, PortionUnit.MILLILITERS)).toBe(250)
      expect(converter.convertToGrams(1, PortionUnit.LITERS)).toBe(1000)
      expect(converter.convertToGrams(1, PortionUnit.CUP)).toBe(200)
    })

    it("should convert count units correctly", () => {
      expect(converter.convertToGrams(1, PortionUnit.PIECE)).toBe(20)
      expect(converter.convertToGrams(1, PortionUnit.SLICE)).toBe(30)
      expect(converter.convertToGrams(1, PortionUnit.SERVING)).toBe(150)
    })

    it("should convert container units correctly", () => {
      expect(converter.convertToGrams(1, PortionUnit.BOTTLE)).toBe(330)
      expect(converter.convertToGrams(1, PortionUnit.CAN)).toBe(250)
    })

    it("should handle fractional amounts", () => {
      expect(converter.convertToGrams(0.5, PortionUnit.KILOGRAMS)).toBe(500)
      expect(converter.convertToGrams(2.5, PortionUnit.CUP)).toBe(500) // 2.5 * 200
    })

    it("should throw error for invalid amounts", () => {
      expect(() => converter.convertToGrams(0, PortionUnit.GRAMS)).toThrow(InvalidServingSizeError)
      expect(() => converter.convertToGrams(-5, PortionUnit.GRAMS)).toThrow(InvalidServingSizeError)
    })
  })

  describe("generateDisplayContext", () => {
    it("should generate context for weight-based servings", () => {
      const serving = ServingSize.fromString("100g")
      const context = converter.generateDisplayContext(serving, 150 as Grams)

      expect(context.quantityText).toBe("pour 150g")
      expect(context.isPerProduct).toBe(false)
      expect(context.servingDescription).toBe("100 grammes")
    })

    it("should generate context for count-based servings", () => {
      const serving = ServingSize.fromString("1 slice") // 30g per slice
      const context = converter.generateDisplayContext(serving, 60 as Grams) // 2 slices

      expect(context.quantityText).toBe("pour 2 tranches")
      expect(context.isPerProduct).toBe(true)
      expect(context.servingDescription).toBe("1 tranche")
    })

    it("should handle single unit contexts", () => {
      const serving = ServingSize.fromString("1 piece") // 20g
      const context = converter.generateDisplayContext(serving, 20 as Grams) // 1 piece

      expect(context.quantityText).toBe("pour 1 pièce")
      expect(context.isPerProduct).toBe(true)
    })
  })

  describe("extractServingSizeFromFoodData", () => {
    it("should extract serving from food data structure", () => {
      const foodData = {
        portionSize: { amount: 100, unit: "g" },
      }

      const serving = converter.extractServingSizeFromFoodData(foodData)
      expect(serving.getAmount()).toBe(100)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
    })

    it("should handle different unit formats", () => {
      const foodData1 = {
        portionSize: { amount: 1, unit: "piece" },
      }
      const serving1 = converter.extractServingSizeFromFoodData(foodData1)
      expect(serving1.getUnit()).toBe(PortionUnit.PIECE)

      const foodData2 = {
        portionSize: { amount: 2, unit: "slice" },
      }
      const serving2 = converter.extractServingSizeFromFoodData(foodData2)
      expect(serving2.getUnit()).toBe(PortionUnit.SLICE)
    })

    it("should fallback to 100g for invalid data", () => {
      const invalidFoodData = {
        portionSize: { amount: 1, unit: "invalid_unit" },
      }

      const serving = converter.extractServingSizeFromFoodData(invalidFoodData)
      expect(serving.toGrams()).toBe(100)
      expect(serving.getUnit()).toBe(PortionUnit.GRAMS)
    })
  })

  describe("calculatePortionRatio", () => {
    it("should calculate correct ratios", () => {
      const serving = ServingSize.fromString("100g")

      expect(converter.calculatePortionRatio(serving, 200 as Grams)).toBe(2)
      expect(converter.calculatePortionRatio(serving, 50 as Grams)).toBe(0.5)
      expect(converter.calculatePortionRatio(serving, 100 as Grams)).toBe(1)
    })

    it("should handle edge cases", () => {
      const serving = ServingSize.fromString("100g")
      expect(converter.calculatePortionRatio(serving, 0 as Grams)).toBe(0)
    })
  })

  describe("validateServingSize", () => {
    it("should validate reasonable serving sizes", () => {
      expect(converter.validateServingSize(ServingSize.fromString("100g"))).toBe(true)
      expect(converter.validateServingSize(ServingSize.fromString("1 piece"))).toBe(true)
      expect(converter.validateServingSize(ServingSize.fromString("2 slices"))).toBe(true)
    })

    it("should reject extreme serving sizes", () => {
      // Too small (less than 1g)
      expect(converter.validateServingSize(ServingSize.fromString("0.5g"))).toBe(false)

      // Too large (more than 5kg)
      expect(converter.validateServingSize(ServingSize.fromString("6000g"))).toBe(false)
    })

    it("should reject unreasonable unit amounts", () => {
      // Too many pieces
      expect(converter.validateServingSize(ServingSize.pieces(100, 10))).toBe(false)

      // Too many slices
      expect(converter.validateServingSize(ServingSize.slices(50, 10))).toBe(false)

      // Too many bottles
      expect(converter.validateServingSize(ServingSize.fromString("20 bottles"))).toBe(false)
    })

    it("should accept reasonable unit amounts", () => {
      expect(converter.validateServingSize(ServingSize.pieces(5, 20))).toBe(true)
      expect(converter.validateServingSize(ServingSize.slices(3, 30))).toBe(true)
      expect(converter.validateServingSize(ServingSize.fromString("2 bottles"))).toBe(true)
    })
  })

  describe("getSuggestedServings", () => {
    it("should generate scaled suggestions", () => {
      const baseServing = ServingSize.fromString("100g")
      const suggestions = converter.getSuggestedServings(baseServing)

      expect(suggestions.length).toBeGreaterThan(1)
      expect(suggestions).toContainEqual(baseServing) // Should include original

      // Should have scaled versions
      const gramsValues = suggestions.map((s) => s.toGrams())
      expect(gramsValues).toContain(50) // 0.5x
      expect(gramsValues).toContain(150) // 1.5x
      expect(gramsValues).toContain(200) // 2x
    })

    it("should add gram suggestions for non-weight units", () => {
      const baseServing = ServingSize.fromString("1 piece")
      const suggestions = converter.getSuggestedServings(baseServing)

      const gramsValues = suggestions.map((s) => s.toGrams())
      expect(gramsValues).toContain(50)
      expect(gramsValues).toContain(100)
      expect(gramsValues).toContain(200)
    })

    it("should filter out invalid suggestions", () => {
      const baseServing = ServingSize.fromString("5000g") // At the limit
      const suggestions = converter.getSuggestedServings(baseServing)

      // Should not include scaled versions that exceed limits
      const hasExcessive = suggestions.some((s) => s.toGrams() > 5000)
      expect(hasExcessive).toBe(false)
    })
  })

  describe("compareServings", () => {
    it("should compare servings by gram weight", () => {
      const serving1 = ServingSize.fromString("100g")
      const serving2 = ServingSize.fromString("200g")
      const serving3 = ServingSize.fromString("1 piece") // 20g

      expect(converter.compareServings(serving1, serving2)).toBeLessThan(0) // 100 < 200
      expect(converter.compareServings(serving2, serving1)).toBeGreaterThan(0) // 200 > 100
      expect(converter.compareServings(serving1, serving1)).toBe(0) // 100 = 100
      expect(converter.compareServings(serving3, serving1)).toBeLessThan(0) // 20 < 100
    })
  })

  describe("formatForLogging", () => {
    it("should format serving for logging", () => {
      const serving = ServingSize.fromString("100g")
      const formatted = converter.formatForLogging(serving)

      expect(formatted).toBe("100 g (100g)")
    })

    it("should handle different units", () => {
      const serving = ServingSize.fromString("1 piece") // 20g
      const formatted = converter.formatForLogging(serving)

      expect(formatted).toBe("1 piece (20g)")
    })
  })
})
