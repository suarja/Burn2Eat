import {
  PortionUnit,
  PortionUnitUtils,
  InvalidPortionUnitError,
} from "@/domain/nutrition/PortionUnit"

describe("PortionUnit Domain", () => {
  describe("PortionUnitUtils.fromString", () => {
    it("should parse weight units correctly", () => {
      expect(PortionUnitUtils.fromString("per 100g")).toBe(PortionUnit.PER_100G)
      expect(PortionUnitUtils.fromString("100g")).toBe(PortionUnit.GRAMS)
      expect(PortionUnitUtils.fromString("50g")).toBe(PortionUnit.GRAMS)
      expect(PortionUnitUtils.fromString("1.5kg")).toBe(PortionUnit.KILOGRAMS)
    })

    it("should parse volume units correctly", () => {
      expect(PortionUnitUtils.fromString("250ml")).toBe(PortionUnit.MILLILITERS)
      expect(PortionUnitUtils.fromString("1l")).toBe(PortionUnit.LITERS)
      expect(PortionUnitUtils.fromString("1 cup")).toBe(PortionUnit.CUP)
      expect(PortionUnitUtils.fromString("2 tasse")).toBe(PortionUnit.CUP)
    })

    it("should parse count-based units correctly", () => {
      expect(PortionUnitUtils.fromString("1 piece")).toBe(PortionUnit.PIECE)
      expect(PortionUnitUtils.fromString("2 pièces")).toBe(PortionUnit.PIECE)
      expect(PortionUnitUtils.fromString("1 slice")).toBe(PortionUnit.SLICE)
      expect(PortionUnitUtils.fromString("3 tranches")).toBe(PortionUnit.SLICE)
    })

    it("should parse container units correctly", () => {
      expect(PortionUnitUtils.fromString("1 bottle")).toBe(PortionUnit.BOTTLE)
      expect(PortionUnitUtils.fromString("1 bouteille")).toBe(PortionUnit.BOTTLE)
      expect(PortionUnitUtils.fromString("1 can")).toBe(PortionUnit.CAN)
      expect(PortionUnitUtils.fromString("2 canettes")).toBe(PortionUnit.CAN)
    })

    it("should throw error for invalid units", () => {
      expect(() => PortionUnitUtils.fromString("invalid")).toThrow(InvalidPortionUnitError)
      expect(() => PortionUnitUtils.fromString("")).toThrow(InvalidPortionUnitError)
      expect(() => PortionUnitUtils.fromString("xyz")).toThrow(InvalidPortionUnitError)
    })

    it("should handle case insensitive input", () => {
      expect(PortionUnitUtils.fromString("ML")).toBe(PortionUnit.MILLILITERS)
      expect(PortionUnitUtils.fromString("PIECE")).toBe(PortionUnit.PIECE)
      expect(PortionUnitUtils.fromString("Cup")).toBe(PortionUnit.CUP)
    })
  })

  describe("PortionUnitUtils.isWeightBased", () => {
    it("should identify weight-based units", () => {
      expect(PortionUnitUtils.isWeightBased(PortionUnit.GRAMS)).toBe(true)
      expect(PortionUnitUtils.isWeightBased(PortionUnit.KILOGRAMS)).toBe(true)
      expect(PortionUnitUtils.isWeightBased(PortionUnit.PER_100G)).toBe(true)
    })

    it("should identify non-weight-based units", () => {
      expect(PortionUnitUtils.isWeightBased(PortionUnit.MILLILITERS)).toBe(false)
      expect(PortionUnitUtils.isWeightBased(PortionUnit.PIECE)).toBe(false)
      expect(PortionUnitUtils.isWeightBased(PortionUnit.SLICE)).toBe(false)
      expect(PortionUnitUtils.isWeightBased(PortionUnit.CUP)).toBe(false)
    })
  })

  describe("PortionUnitUtils.isVolumeBased", () => {
    it("should identify volume-based units", () => {
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.MILLILITERS)).toBe(true)
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.LITERS)).toBe(true)
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.CUP)).toBe(true)
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.TABLESPOON)).toBe(true)
    })

    it("should identify non-volume-based units", () => {
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.GRAMS)).toBe(false)
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.PIECE)).toBe(false)
      expect(PortionUnitUtils.isVolumeBased(PortionUnit.SLICE)).toBe(false)
    })
  })

  describe("PortionUnitUtils.requiresContextualConversion", () => {
    it("should identify units requiring contextual conversion", () => {
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.PIECE)).toBe(true)
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.SLICE)).toBe(true)
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.SERVING)).toBe(true)
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.BOTTLE)).toBe(true)
    })

    it("should identify units not requiring contextual conversion", () => {
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.GRAMS)).toBe(false)
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.MILLILITERS)).toBe(false)
      expect(PortionUnitUtils.requiresContextualConversion(PortionUnit.CUP)).toBe(false)
    })
  })

  describe("PortionUnitUtils.getDisplayName", () => {
    it("should return French display names", () => {
      expect(PortionUnitUtils.getDisplayName(PortionUnit.GRAMS, "fr")).toBe("grammes")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.PIECE, "fr")).toBe("pièce")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.SLICE, "fr")).toBe("tranche")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.BOTTLE, "fr")).toBe("bouteille")
    })

    it("should return English display names", () => {
      expect(PortionUnitUtils.getDisplayName(PortionUnit.GRAMS, "en")).toBe("grams")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.PIECE, "en")).toBe("piece")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.SLICE, "en")).toBe("slice")
      expect(PortionUnitUtils.getDisplayName(PortionUnit.BOTTLE, "en")).toBe("bottle")
    })

    it("should default to English for unknown locales", () => {
      expect(PortionUnitUtils.getDisplayName(PortionUnit.GRAMS, "unknown")).toBe("grams")
    })

    it("should default to French when no locale specified", () => {
      expect(PortionUnitUtils.getDisplayName(PortionUnit.GRAMS)).toBe("grammes")
    })
  })
})
