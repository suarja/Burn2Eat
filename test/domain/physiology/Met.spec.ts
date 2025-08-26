import { Met } from "../../../src/domain/physiology/Met"

describe("Met (Pure Domain)", () => {
  describe("Creation", () => {
    it("should create MET with valid positive value", () => {
      // Arrange & Act
      const met = Met.of(3.5)

      // Assert
      expect(met).toBeInstanceOf(Met)
      expect(met.value).toBe(3.5)
      expect(met.toNumber()).toBe(3.5)
    })

    it("should throw error for zero MET value", () => {
      // Act & Assert
      expect(() => Met.of(0)).toThrow("MET value must be positive")
    })

    it("should throw error for negative MET value", () => {
      // Act & Assert
      expect(() => Met.of(-1.5)).toThrow("MET value must be positive")
    })

    it("should throw error for extremely high MET value", () => {
      // Act & Assert
      expect(() => Met.of(30)).toThrow("MET value too high (max 25 METs)")
    })

    it("should accept valid high MET values", () => {
      // Act
      const met = Met.of(20)

      // Assert
      expect(met.toNumber()).toBe(20)
    })
  })

  describe("Intensity Classification", () => {
    it("should identify light intensity correctly", () => {
      // Light intensity: < 3 METs
      const lightMET1 = Met.of(1.5)
      const lightMET2 = Met.of(2.9)
      const moderateMET = Met.of(3.0)

      expect(lightMET1.isLightIntensity()).toBe(true)
      expect(lightMET2.isLightIntensity()).toBe(true)
      expect(moderateMET.isLightIntensity()).toBe(false)

      expect(lightMET1.isModerateIntensity()).toBe(false)
      expect(lightMET1.isVigorousIntensity()).toBe(false)
    })

    it("should identify moderate intensity correctly", () => {
      // Moderate intensity: 3-6 METs
      const lightMET = Met.of(2.9)
      const moderateMET1 = Met.of(3.0)
      const moderateMET2 = Met.of(5.9)
      const vigorousMET = Met.of(6.0)

      expect(moderateMET1.isModerateIntensity()).toBe(true)
      expect(moderateMET2.isModerateIntensity()).toBe(true)

      expect(lightMET.isModerateIntensity()).toBe(false)
      expect(vigorousMET.isModerateIntensity()).toBe(false)

      expect(moderateMET1.isLightIntensity()).toBe(false)
      expect(moderateMET1.isVigorousIntensity()).toBe(false)
    })

    it("should identify vigorous intensity correctly", () => {
      // Vigorous intensity: ≥ 6 METs
      const moderateMET = Met.of(5.9)
      const vigorousMET1 = Met.of(6.0)
      const vigorousMET2 = Met.of(12.0)

      expect(vigorousMET1.isVigorousIntensity()).toBe(true)
      expect(vigorousMET2.isVigorousIntensity()).toBe(true)

      expect(moderateMET.isVigorousIntensity()).toBe(false)

      expect(vigorousMET1.isLightIntensity()).toBe(false)
      expect(vigorousMET1.isModerateIntensity()).toBe(false)
    })
  })

  describe("Utility Methods", () => {
    it("should provide correct string representation", () => {
      const met = Met.of(7.5)
      expect(met.toString()).toBe("7.5 METs")
    })

    it("should handle equality comparison correctly", () => {
      const met1 = Met.of(5.0)
      const met2 = Met.of(5.0)
      const met3 = Met.of(4.5)

      expect(met1.equals(met2)).toBe(true)
      expect(met1.equals(met3)).toBe(false)
    })

    it("should handle decimal values correctly", () => {
      const met = Met.of(3.7)
      expect(met.toNumber()).toBe(3.7)
      expect(met.toString()).toBe("3.7 METs")
    })
  })

  describe("Edge Cases", () => {
    it("should handle minimum valid value", () => {
      const met = Met.of(0.1)
      expect(met.toNumber()).toBe(0.1)
      expect(met.isLightIntensity()).toBe(true)
    })

    it("should handle maximum valid value", () => {
      const met = Met.of(25)
      expect(met.toNumber()).toBe(25)
      expect(met.isVigorousIntensity()).toBe(true)
    })

    it("should handle boundary values correctly", () => {
      // Test exact boundaries
      const lightModeBoundary = Met.of(3.0)
      const modeVigorBoundary = Met.of(6.0)

      expect(lightModeBoundary.isLightIntensity()).toBe(false)
      expect(lightModeBoundary.isModerateIntensity()).toBe(true)

      expect(modeVigorBoundary.isModerateIntensity()).toBe(false)
      expect(modeVigorBoundary.isVigorousIntensity()).toBe(true)
    })
  })
})
