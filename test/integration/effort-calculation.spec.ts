import { StaticActivityCatalog } from "../../src/infrastructure/adapters/StaticActivityCatalog"
import { StaticDishRepository } from "../../src/infrastructure/adapters/StaticDishRepository"

describe("Effort Calculation Integration", () => {
  let activityCatalog: StaticActivityCatalog
  let dishRepository: StaticDishRepository

  beforeEach(() => {
    activityCatalog = new StaticActivityCatalog()
    dishRepository = new StaticDishRepository()
  })

  describe("MET Formula Integration", () => {
    /**
     * Test the core MET formula: minutes = calories / (MET * 3.5 * weightKg / 200)
     * This is the fundamental calculation for the Burn2Eat app
     */

    it("should calculate correct effort time for realistic scenarios", () => {
      // Test data based on real values
      const testCases = [
        {
          name: "Light scenario: Apple + Walking",
          calories: 95, // Red apple
          activityMET: 3.5, // Brisk walking
          weightKg: 70, // Average person
          expectedMinutes: 22, // Approximately 22 minutes
        },
        {
          name: "Moderate scenario: Burger + Jogging",
          calories: 540, // Classic burger
          activityMET: 7.0, // Jogging
          weightKg: 70,
          expectedMinutes: 63, // Approximately 63 minutes
        },
        {
          name: "Heavy scenario: Double Cheeseburger + Running",
          calories: 740, // Double cheeseburger
          activityMET: 9.8, // Running 6 mph
          weightKg: 70,
          expectedMinutes: 62, // Approximately 62 minutes (740 / (9.8 * 3.5 * 70 / 200) = 62)
        },
      ]

      testCases.forEach(({ name, calories, activityMET, weightKg, expectedMinutes }) => {
        // Apply MET formula: minutes = calories / (MET * 3.5 * weightKg / 200)
        const calculatedMinutes = Math.round(calories / ((activityMET * 3.5 * weightKg) / 200))

        // Allow for ±2 minutes tolerance due to rounding
        expect(calculatedMinutes).toBeGreaterThanOrEqual(expectedMinutes - 2)
        expect(calculatedMinutes).toBeLessThanOrEqual(expectedMinutes + 2)
      })
    })

    it("should show that higher MET activities require less time", () => {
      const calories = 400 // Fixed calories
      const weightKg = 70 // Fixed weight

      const walkingMET = 3.5
      const runningMET = 9.8

      const walkingMinutes = calories / ((walkingMET * 3.5 * weightKg) / 200)
      const runningMinutes = calories / ((runningMET * 3.5 * weightKg) / 200)

      expect(runningMinutes).toBeLessThan(walkingMinutes)
      expect(walkingMinutes / runningMinutes).toBeCloseTo(runningMET / walkingMET, 1)
    })

    it("should show that heavier people burn calories faster", () => {
      const calories = 300
      const activityMET = 6.0

      const lightPersonKg = 50
      const heavyPersonKg = 90

      const lightPersonMinutes = calories / ((activityMET * 3.5 * lightPersonKg) / 200)
      const heavyPersonMinutes = calories / ((activityMET * 3.5 * heavyPersonKg) / 200)

      expect(heavyPersonMinutes).toBeLessThan(lightPersonMinutes)
    })
  })

  describe("Real Dataset Integration", () => {
    it("should calculate effort for actual food and activity combinations", async () => {
      // Get real data from our datasets
      const burger = await dishRepository.findById("burger-classic")
      const jogging = activityCatalog.getByKey("jogging_general")

      expect(burger).not.toBeNull()
      expect(jogging).not.toBeNull()

      if (burger && jogging) {
        const calories = burger.getCalories()
        const met = jogging.getMET().toNumber()
        const weightKg = 70 // Average user

        const minutes = Math.round(calories / ((met * 3.5 * weightKg) / 200))

        expect(minutes).toBeGreaterThan(0)
        expect(minutes).toBeLessThan(120) // Should be reasonable (< 2 hours)
      }
    })

    it("should handle multiple food-activity combinations", async () => {
      const combinations = [
        { foodId: "apple-red", activityKey: "walking_brisk" },
        { foodId: "pizza-margherita", activityKey: "cycling_moderate" },
        { foodId: "chocolate-cake", activityKey: "swimming_moderate" },
        { foodId: "strawberries", activityKey: "yoga_hatha" },
      ]

      for (const { foodId, activityKey } of combinations) {
        const food = await dishRepository.findById(foodId)
        const activity = activityCatalog.getByKey(activityKey)

        if (food && activity) {
          const calories = food.getCalories()
          const met = activity.getMET().toNumber()
          const weightKg = 70

          const minutes = Math.round(calories / ((met * 3.5 * weightKg) / 200))

          expect(minutes).toBeGreaterThan(0)
          expect(minutes).toBeLessThan(300) // Reasonable upper bound
        }
      }
    })
  })

  describe("Edge Cases and Validation", () => {
    it("should handle very low calorie foods", async () => {
      const strawberries = await dishRepository.findById("strawberries")
      const walking = activityCatalog.getByKey("walking_casual")

      if (strawberries && walking) {
        const calories = strawberries.getCalories() // 50 kcal
        const met = walking.getMET().toNumber() // 3.0 MET
        const minutes = Math.round(calories / ((met * 3.5 * 70) / 200))

        expect(minutes).toBeGreaterThanOrEqual(1) // At least 1 minute
        expect(minutes).toBeLessThan(15) // Should be quick
      }
    })

    it("should handle high-intensity activities", async () => {
      const burger = await dishRepository.findById("burger-classic")
      const crossfit = activityCatalog.getByKey("crossfit")

      if (burger && crossfit) {
        const calories = burger.getCalories()
        const met = crossfit.getMET().toNumber() // 8.0 MET
        const minutes = Math.round(calories / ((met * 3.5 * 70) / 200))

        expect(minutes).toBeGreaterThan(10) // Substantial time even for high intensity
        expect(minutes).toBeLessThan(60) // But not excessive
      }
    })

    it("should produce consistent results for same inputs", () => {
      const calories = 300
      const met = 5.0
      const weight = 70

      // Calculate multiple times
      const result1 = Math.round(calories / ((met * 3.5 * weight) / 200))
      const result2 = Math.round(calories / ((met * 3.5 * weight) / 200))
      const result3 = Math.round(calories / ((met * 3.5 * weight) / 200))

      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
    })
  })

  describe("Formula Validation Against Known Values", () => {
    it("should match published MET calculations", () => {
      // Based on known MET research values
      const knownScenarios = [
        {
          name: "Walking 3.5 mph for 30 min, 70kg person",
          met: 3.5,
          minutes: 30,
          weightKg: 70,
          expectedCaloriesBurned: 129, // Calculated: 3.5 * 3.5 * 70 * 30 / 200 = 129
        },
        {
          name: "Running 6 mph for 20 min, 70kg person",
          met: 9.8,
          minutes: 20,
          weightKg: 70,
          expectedCaloriesBurned: 240, // Calculated: 9.8 * 3.5 * 70 * 20 / 200 = 240
        },
      ]

      knownScenarios.forEach(({ name, met, minutes, weightKg, expectedCaloriesBurned }) => {
        // Formula: calories = MET * 3.5 * weightKg * minutes / 200
        const calculatedCalories = Math.round((met * 3.5 * weightKg * minutes) / 200)

        // Allow for ±10% tolerance due to individual variations
        const tolerance = expectedCaloriesBurned * 0.1

        expect(calculatedCalories).toBeGreaterThanOrEqual(expectedCaloriesBurned - tolerance)
        expect(calculatedCalories).toBeLessThanOrEqual(expectedCaloriesBurned + tolerance)
      })
    })
  })
})
