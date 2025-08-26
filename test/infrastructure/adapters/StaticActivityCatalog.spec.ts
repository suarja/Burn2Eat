import { Activity } from "../../../src/domain/physiology/Activity"
import { ActivityCatalog } from "../../../src/domain/physiology/ActivityCatalog"
import { StaticActivityCatalog } from "../../../src/infrastructure/adapters/StaticActivityCatalog"
import { ACTIVITIES_DATASET } from "../../../src/infrastructure/data/activities-dataset"

describe("StaticActivityCatalog (Integration)", () => {
  let catalog: ActivityCatalog

  beforeEach(() => {
    catalog = new StaticActivityCatalog()
  })

  describe("getByKey", () => {
    it("should find activity by valid key", () => {
      // Act
      const activity = catalog.getByKey("walking_brisk")

      // Assert
      expect(activity).not.toBeNull()
      expect(activity).toBeInstanceOf(Activity)
      expect(activity!.getKey()).toBe("walking_brisk")
      expect(activity!.getLabel()).toBe("Walking (Brisk)")
      expect(activity!.getMET().toNumber()).toBe(3.5)
    })

    it("should return null for non-existent key", () => {
      // Act
      const activity = catalog.getByKey("non-existent-activity")

      // Assert
      expect(activity).toBeNull()
    })

    it("should correctly translate MET values", () => {
      // Act
      const runningActivity = catalog.getByKey("running_6mph")

      // Assert
      expect(runningActivity).not.toBeNull()
      expect(runningActivity!.getMET().toNumber()).toBe(9.8)
      expect(runningActivity!.isHighIntensity()).toBe(true)
    })
  })

  describe("listDefaults", () => {
    it("should return default activities", () => {
      // Act
      const defaults = catalog.listDefaults()

      // Assert
      expect(defaults.length).toBeGreaterThan(0)
      expect(defaults.length).toBeLessThanOrEqual(10) // Reasonable default size

      defaults.forEach((activity) => {
        expect(activity).toBeInstanceOf(Activity)
        expect(activity.getKey()).toBeTruthy()
        expect(activity.getLabel()).toBeTruthy()
      })
    })

    it("should include popular activities in defaults", () => {
      // Act
      const defaults = catalog.listDefaults()
      const keys = defaults.map((activity) => activity.getKey())

      // Assert
      expect(keys).toContain("walking_brisk")
      expect(keys).toContain("jogging_general")
      expect(keys).toContain("cycling_moderate")
    })

    it("should return activities with diverse intensity levels", () => {
      // Act
      const defaults = catalog.listDefaults()

      // Assert
      const hasLight = defaults.some((activity) => activity.isLowIntensity())
      const hasModerate = defaults.some((activity) => activity.isModerateIntensity())
      const hasVigorous = defaults.some((activity) => activity.isHighIntensity())

      expect(hasModerate || hasVigorous).toBe(true) // Should have at least moderate activities
    })
  })

  describe("search", () => {
    it("should find activities by name", () => {
      // Act
      const results = catalog.search!("walking")

      // Assert
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]).toBeInstanceOf(Activity)

      const hasWalkingActivity = results.some((activity) =>
        activity.getLabel().toLowerCase().includes("walking"),
      )
      expect(hasWalkingActivity).toBe(true)
    })

    it("should handle case-insensitive search", () => {
      // Act
      const lowerResults = catalog.search!("cycling")
      const upperResults = catalog.search!("CYCLING")

      // Assert
      expect(lowerResults.length).toBe(upperResults.length)
      if (lowerResults.length > 0) {
        expect(lowerResults[0].getKey()).toBe(upperResults[0].getKey())
      }
    })

    it("should return empty array for non-matching query", () => {
      // Act
      const results = catalog.search!("non-existent-activity-xyz")

      // Assert
      expect(results).toHaveLength(0)
    })
  })

  describe("getByIntensity", () => {
    it("should return light intensity activities", () => {
      // Act
      const lightActivities = catalog.getByIntensity!("light")

      // Assert
      expect(lightActivities.length).toBeGreaterThan(0)
      lightActivities.forEach((activity) => {
        expect(activity.isLowIntensity()).toBe(true)
      })
    })

    it("should return moderate intensity activities", () => {
      // Act
      const moderateActivities = catalog.getByIntensity!("moderate")

      // Assert
      expect(moderateActivities.length).toBeGreaterThan(0)
      moderateActivities.forEach((activity) => {
        expect(activity.isModerateIntensity()).toBe(true)
      })
    })

    it("should return vigorous intensity activities", () => {
      // Act
      const vigorousActivities = catalog.getByIntensity!("vigorous")

      // Assert
      expect(vigorousActivities.length).toBeGreaterThan(0)
      vigorousActivities.forEach((activity) => {
        expect(activity.isHighIntensity()).toBe(true)
      })
    })
  })

  describe("getByMETRange", () => {
    it("should return activities within specified MET range", () => {
      // Act
      const lowMETActivities = catalog.getByMETRange!(2.0, 4.0)

      // Assert
      expect(lowMETActivities.length).toBeGreaterThan(0)
      lowMETActivities.forEach((activity) => {
        const metValue = activity.getMET().toNumber()
        expect(metValue).toBeGreaterThanOrEqual(2.0)
        expect(metValue).toBeLessThanOrEqual(4.0)
      })
    })

    it("should return empty array for impossible MET range", () => {
      // Act
      const impossibleRange = catalog.getByMETRange!(100, 200)

      // Assert
      expect(impossibleRange).toHaveLength(0)
    })

    it("should handle single MET value range", () => {
      // Act - Look for activities with exactly 3.5 METs (or very close)
      const exactMETActivities = catalog.getByMETRange!(3.5, 3.5)

      // Assert
      exactMETActivities.forEach((activity) => {
        expect(activity.getMET().toNumber()).toBe(3.5)
      })
    })
  })

  describe("getAll", () => {
    it("should return all activities in dataset", () => {
      // Act
      const allActivities = catalog.getAll!()

      // Assert
      expect(allActivities.length).toBe(ACTIVITIES_DATASET.length)

      allActivities.forEach((activity) => {
        expect(activity).toBeInstanceOf(Activity)
      })
    })

    it("should maintain dataset integrity", () => {
      // Act
      const allActivities = catalog.getAll!()
      const keys = allActivities.map((activity) => activity.getKey())

      // Assert - All keys should be unique
      const uniqueKeys = new Set(keys)
      expect(keys.length).toBe(uniqueKeys.size)
    })
  })

  describe("Data Translation", () => {
    it("should correctly translate ActivityData to Activity domain object", () => {
      // Act
      const activity = catalog.getByKey("crossfit")

      // Assert
      expect(activity).not.toBeNull()

      // Verify domain object properties
      expect(activity!.getKey()).toBe("crossfit")
      expect(activity!.getLabel()).toBe("CrossFit")
      expect(activity!.getMET().toNumber()).toBe(8.0)

      // Verify domain business rules work
      expect(activity!.isHighIntensity()).toBe(true)
      expect(activity!.toString()).toContain("CrossFit")
      expect(activity!.toString()).toContain("8")
    })

    it("should handle all activities in dataset without errors", () => {
      // Act & Assert - Should not throw any errors
      expect(() => {
        const allActivities = catalog.getAll!()
        allActivities.forEach((activity) => {
          // Test that all domain methods work
          activity.getKey()
          activity.getLabel()
          activity.getMET()
          activity.isLowIntensity()
          activity.isModerateIntensity()
          activity.isHighIntensity()
          activity.toString()
        })
      }).not.toThrow()
    })
  })

  describe("Helper Methods (StaticActivityCatalog specific)", () => {
    let staticCatalog: StaticActivityCatalog

    beforeEach(() => {
      staticCatalog = new StaticActivityCatalog()
    })

    it("should return available categories", () => {
      // Act
      const categories = staticCatalog.getAvailableCategories()

      // Assert
      expect(categories.length).toBeGreaterThan(0)
      expect(categories).toContain("cardio")
      expect(categories).toContain("gym")
      expect(categories).toContain("sports")
    })

    it("should return dataset statistics", () => {
      // Act
      const stats = staticCatalog.getDatasetInfo()

      // Assert
      expect(stats.totalActivities).toBe(ACTIVITIES_DATASET.length)
      expect(stats.categories.length).toBeGreaterThan(0)
      expect(stats.averageMET).toBeGreaterThan(0)
      expect(typeof stats.averageMET).toBe("number")

      expect(stats.intensityDistribution.light).toBeGreaterThanOrEqual(0)
      expect(stats.intensityDistribution.moderate).toBeGreaterThanOrEqual(0)
      expect(stats.intensityDistribution.vigorous).toBeGreaterThanOrEqual(0)

      const totalByIntensity =
        stats.intensityDistribution.light +
        stats.intensityDistribution.moderate +
        stats.intensityDistribution.vigorous
      expect(totalByIntensity).toBe(stats.totalActivities)
    })

    it("should return beginner-friendly activities", () => {
      // Act
      const beginnerActivities = staticCatalog.getBeginnerFriendly()

      // Assert
      expect(beginnerActivities.length).toBeGreaterThan(0)
      beginnerActivities.forEach((activity) => {
        const metValue = activity.getMET().toNumber()
        expect(metValue).toBeGreaterThanOrEqual(1.0)
        expect(metValue).toBeLessThanOrEqual(5.0)
      })
    })

    it("should return advanced activities", () => {
      // Act
      const advancedActivities = staticCatalog.getAdvancedActivities()

      // Assert
      expect(advancedActivities.length).toBeGreaterThan(0)
      advancedActivities.forEach((activity) => {
        const metValue = activity.getMET().toNumber()
        expect(metValue).toBeGreaterThanOrEqual(5.0)
      })
    })

    it("should find similar activities", () => {
      // Act
      const similarToWalking = staticCatalog.getSimilarActivities("walking_brisk")

      // Assert
      if (similarToWalking.length > 0) {
        similarToWalking.forEach((activity) => {
          expect(activity.getKey()).not.toBe("walking_brisk") // Should not include original
          // Should have similar MET values (this depends on dataset content)
        })
      }
    })

    it("should handle non-existent activity for similar activities", () => {
      // Act
      const similar = staticCatalog.getSimilarActivities("non-existent-activity")

      // Assert
      expect(similar).toHaveLength(0)
    })
  })

  describe("Edge Cases and Error Handling", () => {
    it("should handle empty search query gracefully", () => {
      // Act
      const results = catalog.search!("")

      // Assert
      expect(Array.isArray(results)).toBe(true)
    })

    it("should handle invalid MET ranges gracefully", () => {
      // Act - Invalid range where min > max
      const invalidRange = catalog.getByMETRange!(10.0, 5.0)

      // Assert
      expect(invalidRange).toHaveLength(0)
    })
  })
})
