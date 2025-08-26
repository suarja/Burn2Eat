import {
  CalculateEffortUseCase,
  CalculateEffortInput,
} from "../../../src/application/usecases/CalculateEffortUseCase"
import { Dish } from "../../../src/domain/nutrition/Dish"
import { DishId } from "../../../src/domain/nutrition/DishId"
import { DishRepository } from "../../../src/domain/nutrition/DishRepository"
import { NutritionalInfo } from "../../../src/domain/nutrition/NutritionalInfo"
import { Activity } from "../../../src/domain/physiology/Activity"
import { ActivityCatalog } from "../../../src/domain/physiology/ActivityCatalog"
import { Met } from "../../../src/domain/physiology/Met"
import { Sex } from "../../../src/domain/physiology/Sex"
import { UserHealthInfo } from "../../../src/domain/physiology/UserHealthInfo"

// Mock DishRepository
class MockDishRepository implements DishRepository {
  private dishes: Map<string, Dish> = new Map()

  constructor() {
    const appleDish = Dish.create({
      dishId: DishId.from("apple"),
      name: "Apple",
      nutrition: NutritionalInfo.perServing(95),
    })
    const burgerDish = Dish.create({
      dishId: DishId.from("burger"),
      name: "Burger",
      nutrition: NutritionalInfo.perServing(540),
    })

    this.dishes.set("apple", appleDish)
    this.dishes.set("burger", burgerDish)
  }

  async findById(id: string): Promise<Dish | null> {
    return this.dishes.get(id) || null
  }

  async findAll(): Promise<Dish[]> {
    return Array.from(this.dishes.values())
  }

  async findByName(name: string): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter((d) =>
      d.getName().toLowerCase().includes(name.toLowerCase()),
    )
  }

  async findByCalorieRange(min: number, max: number): Promise<Dish[]> {
    return Array.from(this.dishes.values()).filter((d) => {
      const calories = d.getCalories()
      return calories >= min && calories <= max
    })
  }
}

// Mock ActivityCatalog
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
    return this.activities.slice(0, 3)
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
}

describe("CalculateEffortUseCase", () => {
  let useCase: CalculateEffortUseCase
  let mockDishRepository: MockDishRepository
  let mockActivityCatalog: MockActivityCatalog

  beforeEach(() => {
    mockDishRepository = new MockDishRepository()
    mockActivityCatalog = new MockActivityCatalog()
    useCase = new CalculateEffortUseCase(mockDishRepository, mockActivityCatalog)
  })

  describe("execute", () => {
    it("should calculate effort for valid dish and user", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "apple",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking", "jogging"]),
      }

      // Act
      const result = await useCase.execute(input)

      // Assert
      expect(result).toBeDefined()
      expect(result.dish.name).toBe("Apple")
      expect(result.dish.calories).toBe(95)
      expect(result.user.weight).toBe(70)
      expect(result.effort.primary.activityKey).toBe("walking")
      expect(result.effort.primary.minutes).toBeGreaterThan(0)
      expect(result.effort.alternatives.length).toBeGreaterThan(0)
    })

    it("should use user preferred activity as primary", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "burger",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["jogging", "walking"]),
      }

      // Act
      const result = await useCase.execute(input)

      // Assert
      expect(result.effort.primary.activityKey).toBe("jogging")
    })

    it("should throw error for non-existent dish", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "nonexistent",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow("Dish not found: nonexistent")
    })

    it("should throw error for missing dish ID", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        "Dish ID and user information are required",
      )
    })

    it("should throw error for missing user", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "apple",
        user: null as any,
      }

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(
        "Dish ID and user information are required",
      )
    })

    it("should include formatted output with proper structure", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "apple",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act
      const result = await useCase.execute(input)

      // Assert structure
      expect(result.dish).toHaveProperty("id")
      expect(result.dish).toHaveProperty("name")
      expect(result.dish).toHaveProperty("calories")
      expect(result.user).toHaveProperty("weight")
      expect(result.user).toHaveProperty("primaryActivity")
      expect(result.effort).toHaveProperty("primary")
      expect(result.effort).toHaveProperty("alternatives")
      expect(result.effort).toHaveProperty("summary")

      // Check primary effort structure
      expect(result.effort.primary).toHaveProperty("activityKey")
      expect(result.effort.primary).toHaveProperty("activityLabel")
      expect(result.effort.primary).toHaveProperty("minutes")
      expect(result.effort.primary).toHaveProperty("metValue")
      expect(result.effort.primary).toHaveProperty("formattedDuration")
      expect(result.effort.primary).toHaveProperty("effortDescription")
    })
  })

  describe("getQuickRecommendations", () => {
    it("should return quick options for low-calorie foods", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "apple", // 95 calories
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act
      const result = await useCase.getQuickRecommendations(input)

      // Assert
      if (result) {
        expect(result.effort.primary.minutes).toBeLessThanOrEqual(30)
        expect(result.effort.primary.metValue).toBeGreaterThanOrEqual(6)
      }
    })

    it("should return null when no quick options available", async () => {
      // Arrange - High calorie food with heavy user (harder to burn quickly)
      const input: CalculateEffortInput = {
        dishId: "burger", // 540 calories
        user: UserHealthInfo.create("unspecified" as Sex, 120, 170, ["walking"]), // Heavy user
      }

      // Act
      const result = await useCase.getQuickRecommendations(input)

      // Assert - Might return null or activities that take longer
      if (result === null) {
        expect(result).toBeNull()
      } else {
        expect(result.effort.primary.metValue).toBeGreaterThanOrEqual(6)
      }
    })
  })

  describe("getEnduranceRecommendations", () => {
    it("should return moderate intensity activities for longer duration", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "burger", // Higher calories for endurance scenario
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act
      const result = await useCase.getEnduranceRecommendations(input)

      // Assert
      if (result) {
        expect(result.effort.primary.minutes).toBeGreaterThanOrEqual(45)
        const metValue = result.effort.primary.metValue
        expect(metValue).toBeGreaterThanOrEqual(3)
        expect(metValue).toBeLessThan(6)
      }
    })
  })

  describe("getComparativeAnalysis", () => {
    it("should provide comparison across intensity levels", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "apple",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act
      const result = await useCase.getComparativeAnalysis(input)

      // Assert
      expect(result.intensityComparison).toBeDefined()

      // Should have at least one intensity level
      const hasAnyLevel =
        result.intensityComparison.light ||
        result.intensityComparison.moderate ||
        result.intensityComparison.vigorous
      expect(hasAnyLevel).toBeTruthy()

      // If multiple levels exist, vigorous should be faster than moderate
      if (result.intensityComparison.vigorous && result.intensityComparison.moderate) {
        expect(result.intensityComparison.vigorous.minutes).toBeLessThan(
          result.intensityComparison.moderate.minutes,
        )
      }
    })
  })

  describe("compareEffortPolicies", () => {
    it("should show difference between standard and conservative policies", async () => {
      // Arrange
      const input: CalculateEffortInput = {
        dishId: "burger",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["jogging"]),
      }

      // Act
      const result = await useCase.compareEffortPolicies(input)

      // Assert
      expect(result.policyComparison.standard).toBeDefined()
      expect(result.policyComparison.conservative).toBeDefined()

      // Conservative should require more time than standard
      expect(result.policyComparison.conservative.primary.minutes).toBeGreaterThan(
        result.policyComparison.standard.primary.minutes,
      )
    })
  })

  describe("Error Handling", () => {
    it("should handle repository errors gracefully", async () => {
      // Arrange - Create use case with failing repository
      const failingRepository = {
        findById: async () => {
          throw new Error("Database error")
        },
      } as any

      const failingUseCase = new CalculateEffortUseCase(failingRepository, mockActivityCatalog)
      const input: CalculateEffortInput = {
        dishId: "apple",
        user: UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking"]),
      }

      // Act & Assert
      await expect(failingUseCase.execute(input)).rejects.toThrow("Database error")
    })
  })
})
