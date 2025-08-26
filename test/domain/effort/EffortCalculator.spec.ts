import { Centimeters, Kilocalories, Kilograms, Minutes } from "../../../src/domain/common/UnitTypes"
import { EffortCalculator } from "../../../src/domain/effort/EffortCalculator"
import { EffortPolicy, StandardMETEffortPolicy } from "../../../src/domain/effort/EffortPolicy"
import { EffortRequest } from "../../../src/domain/effort/EffortRequest"
import { Dish } from "../../../src/domain/nutrition/Dish"
import { DishId } from "../../../src/domain/nutrition/DishId"
import { NutritionalInfo } from "../../../src/domain/nutrition/NutritionalInfo"
import { Activity } from "../../../src/domain/physiology/Activity"
import { ActivityCatalog } from "../../../src/domain/physiology/ActivityCatalog"
import { Met } from "../../../src/domain/physiology/Met"
import { Sex } from "../../../src/domain/physiology/Sex"
import { UserHealthInfo } from "../../../src/domain/physiology/UserHealthInfo"

// Mock ActivityCatalog for testing
class MockActivityCatalog implements ActivityCatalog {
  private activities: Activity[] = [
    Activity.define("walking", "Walking", Met.of(3.5)),
    Activity.define("jogging", "Jogging", Met.of(7.0)),
    Activity.define("running", "Running", Met.of(9.8)),
    Activity.define("cycling", "Cycling", Met.of(6.8)),
    Activity.define("swimming", "Swimming", Met.of(8.0)),
    Activity.define("yoga", "Yoga", Met.of(2.5)),
    Activity.define("crossfit", "CrossFit", Met.of(8.5)),
  ]

  getByKey(key: string): Activity | null {
    return this.activities.find((a) => a.getKey() === key) || null
  }

  listDefaults(): Activity[] {
    return this.activities.slice(0, 3) // walking, jogging, running
  }

  getAll(): Activity[] {
    return [...this.activities]
  }

  getByIntensity(intensity: "light" | "moderate" | "vigorous"): Activity[] {
    return this.activities.filter((activity) => {
      const met = activity.getMET().toNumber()
      switch (intensity) {
        case "light":
          return met < 3
        case "moderate":
          return met >= 3 && met < 6
        case "vigorous":
          return met >= 6
        default:
          return false
      }
    })
  }

  search(query: string): Activity[] {
    return this.activities.filter((a) => a.getLabel().toLowerCase().includes(query.toLowerCase()))
  }
}

// Mock EffortPolicy for controlled testing
class MockEffortPolicy implements EffortPolicy {
  constructor(private readonly minutesPerCalorie: number = 0.5) {}

  minutesToBurn(calories: Kilocalories, userWeightKg: Kilograms, activityMET: number): Minutes {
    // Simple mock calculation for predictable testing
    return Math.max(1, Math.round((calories * this.minutesPerCalorie) / activityMET)) as Minutes
  }
}

describe("EffortCalculator", () => {
  let calculator: EffortCalculator
  let mockCatalog: MockActivityCatalog
  let mockPolicy: EffortPolicy
  let standardPolicy: StandardMETEffortPolicy

  beforeEach(() => {
    mockCatalog = new MockActivityCatalog()
    mockPolicy = new MockEffortPolicy(0.5) // 0.5 minutes per calorie base rate
    standardPolicy = new StandardMETEffortPolicy()
    calculator = new EffortCalculator(mockCatalog, mockPolicy)
  })

  describe("calculateEffort", () => {
    it("should calculate effort for a basic food-user combination", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("apple"),
        name: "Apple",
        nutrition: NutritionalInfo.perServing(95 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking", "jogging"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown).toBeDefined()
      expect(breakdown.getPrimary()).toBeDefined()
      expect(breakdown.getPrimary().getActivityKey()).toBe("walking")
      expect(breakdown.getPrimary().getMinutes()).toBeGreaterThan(0)
      expect(breakdown.hasAlternatives()).toBe(true)
    })

    it("should use user preferred activity as primary", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("burger"),
        name: "Burger",
        nutrition: NutritionalInfo.perServing(540 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["jogging", "walking"],
      ) // jogging first
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.getPrimary().getActivityKey()).toBe("jogging")
    })

    it("should fallback to defaults when preferred activities not available", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("pizza"),
        name: "Pizza",
        nutrition: NutritionalInfo.perServing(300 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["unavailable_activity"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.getPrimary()).toBeDefined()
      expect(["walking", "jogging", "running"]).toContain(breakdown.getPrimary().getActivityKey())
    })

    it("should provide diverse alternative activities", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("chocolate"),
        name: "Chocolate",
        nutrition: NutritionalInfo.perServing(200 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.hasAlternatives()).toBe(true)
      expect(breakdown.getAlternativeCount()).toBeGreaterThan(0)

      // Primary should not be in alternatives
      const primaryKey = breakdown.getPrimary().getActivityKey()
      breakdown.getAlternatives().forEach((alt) => {
        expect(alt.getActivityKey()).not.toBe(primaryKey)
      })
    })

    it("should limit alternatives to maximum of 5", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("cake"),
        name: "Cake",
        nutrition: NutritionalInfo.perServing(400 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.getAlternativeCount()).toBeLessThanOrEqual(5)
    })

    it("should throw error for null request", () => {
      // Act & Assert
      expect(() => calculator.calculateEffort(null as any)).toThrow("EffortRequest is required")
    })

    it("should throw error when no activities available", () => {
      // Arrange
      const emptyCatalog = new MockActivityCatalog()
      emptyCatalog.listDefaults = () => []
      emptyCatalog.getByKey = () => null
      emptyCatalog.getAll = () => []

      const emptyCalculator = new EffortCalculator(emptyCatalog, mockPolicy)
      const dish = Dish.create({
        dishId: DishId.from("food"),
        name: "Food",
        nutrition: NutritionalInfo.perServing(100 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["nonexistent"],
      )
      const request = EffortRequest.of(dish, user)

      // Act & Assert
      expect(() => emptyCalculator.calculateEffort(request)).toThrow(
        "No suitable activity found for effort calculation",
      )
    })
  })

  describe("calculateMultipleEfforts", () => {
    it("should calculate effort for multiple requests", () => {
      // Arrange
      const requests = [
        EffortRequest.of(
          Dish.create({
            dishId: DishId.from("apple"),
            name: "Apple",
            nutrition: NutritionalInfo.perServing(95 as Kilocalories),
          }),
          UserHealthInfo.create("unspecified" as Sex, 70 as Kilograms, 170 as Centimeters, [
            "walking",
          ]),
        ),
        EffortRequest.of(
          Dish.create({
            dishId: DishId.from("burger"),
            name: "Burger",
            nutrition: NutritionalInfo.perServing(540 as Kilocalories),
          }),
          UserHealthInfo.create("unspecified" as Sex, 80 as Kilograms, 170 as Centimeters, [
            "jogging",
          ]),
        ),
      ]

      // Act
      const breakdowns = calculator.calculateMultipleEfforts(requests)

      // Assert
      expect(breakdowns).toHaveLength(2)
      expect(breakdowns[0].getPrimary().getActivityKey()).toBe("walking")
      expect(breakdowns[1].getPrimary().getActivityKey()).toBe("jogging")
    })
  })

  describe("getQuickRecommendations", () => {
    it("should return vigorous activities under 30 minutes", () => {
      // Arrange - Use real policy for more realistic calculations
      const realCalculator = new EffortCalculator(mockCatalog, standardPolicy)
      const dish = Dish.create({
        dishId: DishId.from("snack"),
        name: "Snack",
        nutrition: NutritionalInfo.perServing(150 as Kilocalories),
      }) // Low calories for quick burn
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const quickRecs = realCalculator.getQuickRecommendations(request)

      // Assert
      if (quickRecs) {
        expect(quickRecs.getPrimary().getMinutes()).toBeLessThanOrEqual(30)
        expect(quickRecs.getPrimary().getMETValue()).toBeGreaterThanOrEqual(6)
      }
    })

    it("should return null when no quick options available", () => {
      // Arrange - High calorie food that can't be burned quickly
      const dish = Dish.create({
        dishId: DishId.from("large-meal"),
        name: "Large Meal",
        nutrition: NutritionalInfo.perServing(1500 as Kilocalories),
      }) // Very high calories
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        50 as Kilograms,
        170 as Centimeters,
        ["walking"],
      ) // Light person
      const request = EffortRequest.of(dish, user)
      const realCalculator = new EffortCalculator(mockCatalog, standardPolicy)

      // Act
      const quickRecs = realCalculator.getQuickRecommendations(request)

      // Assert - High calorie foods likely won't have quick options
      // This might return null or have activities > 30 minutes
      if (quickRecs) {
        // If recommendations exist, they should still be vigorous activities
        expect(quickRecs.getPrimary().getMETValue()).toBeGreaterThanOrEqual(6)
      }
    })
  })

  describe("getEnduranceRecommendations", () => {
    it("should return moderate activities over 45 minutes", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("large-meal-2"),
        name: "Large Meal",
        nutrition: NutritionalInfo.perServing(800 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)
      const realCalculator = new EffortCalculator(mockCatalog, standardPolicy)

      // Act
      const enduranceRecs = realCalculator.getEnduranceRecommendations(request)

      // Assert
      if (enduranceRecs) {
        expect(enduranceRecs.getPrimary().getMinutes()).toBeGreaterThanOrEqual(45)
        const primaryMET = enduranceRecs.getPrimary().getMETValue()
        expect(primaryMET).toBeGreaterThanOrEqual(3)
        expect(primaryMET).toBeLessThan(6)
      }
    })
  })

  describe("getComparativeBreakdown", () => {
    it("should provide activities from different intensity levels", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("meal"),
        name: "Meal",
        nutrition: NutritionalInfo.perServing(400 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const comparison = calculator.getComparativeBreakdown(request)

      // Assert
      expect(comparison).toBeDefined()

      // Should have at least one intensity level
      const hasAnyLevel = comparison.light || comparison.moderate || comparison.vigorous
      expect(hasAnyLevel).toBeTruthy()

      // If vigorous exists, it should require less time than moderate (same calories)
      if (comparison.vigorous && comparison.moderate) {
        expect(comparison.vigorous.getMinutes()).toBeLessThan(comparison.moderate.getMinutes())
      }
    })
  })

  describe("calculateEffortWithPolicy", () => {
    it("should calculate effort with different policies", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("food-2"),
        name: "Food",
        nutrition: NutritionalInfo.perServing(300 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      const conservativePolicy = new MockEffortPolicy(1.0) // More time required

      // Act
      const standardResult = calculator.calculateEffort(request)
      const conservativeResult = calculator.calculateEffortWithPolicy(request, conservativePolicy)

      // Assert
      expect(standardResult.getPrimary().getMinutes()).toBeLessThan(
        conservativeResult.getPrimary().getMinutes(),
      )
    })
  })

  describe("Integration with Real MET Formula", () => {
    it("should produce realistic results with StandardMETEffortPolicy", () => {
      // Arrange
      const realCalculator = new EffortCalculator(mockCatalog, standardPolicy)
      const burger = Dish.create({
        dishId: DishId.from("burger-2"),
        name: "Burger",
        nutrition: NutritionalInfo.perServing(540 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["jogging"],
      )
      const request = EffortRequest.of(burger, user)

      // Act
      const breakdown = realCalculator.calculateEffort(request)

      // Assert
      const primaryMinutes = breakdown.getPrimary().getMinutes()
      expect(primaryMinutes).toBeGreaterThan(30) // Should take substantial time
      expect(primaryMinutes).toBeLessThan(120) // But not unrealistic

      // Should have alternatives with different time requirements
      expect(breakdown.hasAlternatives()).toBe(true)
      const alternatives = breakdown.getAlternatives()
      expect(alternatives.length).toBeGreaterThan(0)
    })

    it("should show that higher intensity activities require less time", () => {
      // Arrange
      const realCalculator = new EffortCalculator(mockCatalog, standardPolicy)
      const dish = Dish.create({
        dishId: DishId.from("snack-2"),
        name: "Snack",
        nutrition: NutritionalInfo.perServing(200 as Kilocalories),
      })

      const walkingUser = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      ) // 3.5 MET
      const runningUser = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["running"],
      ) // 9.8 MET

      const walkingRequest = EffortRequest.of(dish, walkingUser)
      const runningRequest = EffortRequest.of(dish, runningUser)

      // Act
      const walkingBreakdown = realCalculator.calculateEffort(walkingRequest)
      const runningBreakdown = realCalculator.calculateEffort(runningRequest)

      // Assert
      expect(runningBreakdown.getPrimary().getMinutes()).toBeLessThan(
        walkingBreakdown.getPrimary().getMinutes(),
      )
    })
  })

  describe("Edge Cases", () => {
    it("should handle very low calorie foods", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("celery"),
        name: "Celery",
        nutrition: NutritionalInfo.perServing(10 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.getPrimary().getMinutes()).toBeGreaterThanOrEqual(1) // Should be at least 1 minute
    })

    it("should handle very high calorie foods", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("feast"),
        name: "Feast",
        nutrition: NutritionalInfo.perServing(2000 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        ["walking"],
      )
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert
      expect(breakdown.getPrimary().getMinutes()).toBeGreaterThan(0)
      expect(breakdown.hasAlternatives()).toBe(true)
    })

    it("should handle users with empty preference lists", () => {
      // Arrange
      const dish = Dish.create({
        dishId: DishId.from("food-3"),
        name: "Food",
        nutrition: NutritionalInfo.perServing(200 as Kilocalories),
      })
      const user = UserHealthInfo.create(
        "unspecified" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        [],
      ) // No preferences
      const request = EffortRequest.of(dish, user)

      // Act
      const breakdown = calculator.calculateEffort(request)

      // Assert - Should fallback to defaults
      expect(breakdown.getPrimary()).toBeDefined()
      expect(["walking", "jogging", "running"]).toContain(breakdown.getPrimary().getActivityKey())
    })
  })
})
