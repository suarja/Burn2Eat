import { Centimeters, Kilograms } from "../../../src/domain/common/UnitTypes"
import { Sex } from "../../../src/domain/physiology/Sex"
import { UserHealthInfo } from "../../../src/domain/physiology/UserHealthInfo"
import { UserHealthInfoId } from "../../../src/domain/physiology/UserHealthInfoId"

describe("UserHealthInfo", () => {
  describe("create", () => {
    it("should create user health info with generated ID", () => {
      const user = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, [
        "walking",
        "running",
      ])

      expect(user.getSex()).toBe("male")
      expect(user.getWeight()).toBe(75)
      expect(user.getHeight()).toBe(180)
      expect(user.getPreferredActivityKeys()).toEqual(["walking", "running"])
      expect(user.getId()).toBeDefined()
      expect(user.getId().toString()).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      )
    })

    it("should validate weight range", () => {
      expect(() =>
        UserHealthInfo.create("male" as Sex, 25 as Kilograms, 180 as Centimeters, []),
      ).toThrow("Weight must be between 30 and 300 kg")
      expect(() =>
        UserHealthInfo.create("male" as Sex, 350 as Kilograms, 180 as Centimeters, []),
      ).toThrow("Weight must be between 30 and 300 kg")
    })

    it("should validate height range", () => {
      expect(() =>
        UserHealthInfo.create("male" as Sex, 75 as Kilograms, 100 as Centimeters, []),
      ).toThrow("Height must be between 120 and 250 cm")
      expect(() =>
        UserHealthInfo.create("male" as Sex, 75 as Kilograms, 300 as Centimeters, []),
      ).toThrow("Height must be between 120 and 250 cm")
    })

    it("should accept valid boundary values", () => {
      expect(() =>
        UserHealthInfo.create("male" as Sex, 30 as Kilograms, 120 as Centimeters, []),
      ).not.toThrow()
      expect(() =>
        UserHealthInfo.create("male" as Sex, 300 as Kilograms, 250 as Centimeters, []),
      ).not.toThrow()
    })
  })

  describe("createWithId", () => {
    it("should create user health info with specific ID", () => {
      const id = UserHealthInfoId.generate()
      const user = UserHealthInfo.createWithId(
        id,
        "female" as Sex,
        65 as Kilograms,
        165 as Centimeters,
        ["yoga"],
      )

      expect(user.getId().equals(id)).toBe(true)
      expect(user.getSex()).toBe("female")
      expect(user.getWeight()).toBe(65)
      expect(user.getHeight()).toBe(165)
      expect(user.getPreferredActivityKeys()).toEqual(["yoga"])
    })
  })

  describe("average", () => {
    it("should create average user profile", () => {
      const user = UserHealthInfo.average()

      expect(user.getSex()).toBe("unspecified")
      expect(user.getWeight()).toBe(70)
      expect(user.getHeight()).toBe(170)
      expect(user.getPreferredActivityKeys()).toEqual([
        "walking_brisk",
        "jogging_general",
        "cycling_moderate",
        "swimming_leisurely",
        "weight_training_general",
      ])
      expect(user.getId().equals(UserHealthInfoId.primary())).toBe(true)
    })
  })

  describe("getters", () => {
    let user: UserHealthInfo
    let userId: UserHealthInfoId

    beforeEach(() => {
      userId = UserHealthInfoId.generate()
      user = UserHealthInfo.createWithId(
        userId,
        "male" as Sex,
        80 as Kilograms,
        175 as Centimeters,
        ["swimming", "cycling"],
      )
    })

    it("should return ID", () => {
      expect(user.getId().equals(userId)).toBe(true)
    })

    it("should return sex", () => {
      expect(user.getSex()).toBe("male")
    })

    it("should return weight", () => {
      expect(user.getWeight()).toBe(80)
    })

    it("should return height", () => {
      expect(user.getHeight()).toBe(175)
    })

    it("should return preferred activity keys copy", () => {
      const activities = user.getPreferredActivityKeys()
      expect(activities).toEqual(["swimming", "cycling"])

      // Should be a copy, not reference
      activities.push("running")
      expect(user.getPreferredActivityKeys()).toEqual(["swimming", "cycling"])
    })

    it("should return primary activity key", () => {
      expect(user.getPrimaryActivityKey()).toBe("swimming")

      const userWithoutActivities = UserHealthInfo.createWithId(
        userId,
        "male" as Sex,
        80 as Kilograms,
        175 as Centimeters,
        [],
      )
      expect(userWithoutActivities.getPrimaryActivityKey()).toBeNull()
    })
  })

  describe("BMI calculations", () => {
    it("should calculate BMI correctly", () => {
      const user = UserHealthInfo.createWithId(
        UserHealthInfoId.generate(),
        "male" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        [],
      )

      expect(user.calculateBMI()).toBeCloseTo(24.2, 1)
    })

    it("should categorize BMI correctly", () => {
      const testCases = [
        { weight: 50, height: 170, expectedCategory: "underweight" },
        { weight: 70, height: 170, expectedCategory: "normal" },
        { weight: 85, height: 170, expectedCategory: "overweight" },
        { weight: 105, height: 170, expectedCategory: "obese" },
      ]

      testCases.forEach(({ weight, height, expectedCategory }) => {
        const user = UserHealthInfo.createWithId(
          UserHealthInfoId.generate(),
          "unspecified" as Sex,
          weight as Kilograms,
          height as Centimeters,
          [],
        )
        expect(user.getBMICategory()).toBe(expectedCategory)
      })
    })

    it("should identify healthy weight", () => {
      const healthyUser = UserHealthInfo.createWithId(
        UserHealthInfoId.generate(),
        "male" as Sex,
        70 as Kilograms,
        170 as Centimeters,
        [],
      )
      expect(healthyUser.hasHealthyWeight()).toBe(true)

      const unhealthyUser = UserHealthInfo.createWithId(
        UserHealthInfoId.generate(),
        "male" as Sex,
        105 as Kilograms,
        170 as Centimeters,
        [],
      )
      expect(unhealthyUser.hasHealthyWeight()).toBe(false)
    })
  })

  describe("update methods", () => {
    let user: UserHealthInfo
    let userId: UserHealthInfoId

    beforeEach(() => {
      userId = UserHealthInfoId.generate()
      user = UserHealthInfo.createWithId(
        userId,
        "male" as Sex,
        75 as Kilograms,
        180 as Centimeters,
        ["walking", "running"],
      )
    })

    describe("withWeight", () => {
      it("should create new instance with updated weight", () => {
        const updatedUser = user.withWeight(80 as Kilograms)

        expect(updatedUser.getWeight()).toBe(80)
        expect(updatedUser.getId().equals(userId)).toBe(true)
        expect(updatedUser.getSex()).toBe(user.getSex())
        expect(updatedUser.getHeight()).toBe(user.getHeight())
        expect(updatedUser.getPreferredActivityKeys()).toEqual(user.getPreferredActivityKeys())

        // Original should be unchanged
        expect(user.getWeight()).toBe(75)
      })

      it("should validate weight range", () => {
        expect(() => user.withWeight(25 as Kilograms)).toThrow(
          "Weight must be between 30 and 300 kg",
        )
        expect(() => user.withWeight(350 as Kilograms)).toThrow(
          "Weight must be between 30 and 300 kg",
        )
      })
    })

    describe("withHeight", () => {
      it("should create new instance with updated height", () => {
        const updatedUser = user.withHeight(185 as Centimeters)

        expect(updatedUser.getHeight()).toBe(185)
        expect(updatedUser.getId().equals(userId)).toBe(true)
        expect(user.getHeight()).toBe(180) // Original unchanged
      })

      it("should validate height range", () => {
        expect(() => user.withHeight(100 as Centimeters)).toThrow(
          "Height must be between 120 and 250 cm",
        )
        expect(() => user.withHeight(300 as Centimeters)).toThrow(
          "Height must be between 120 and 250 cm",
        )
      })
    })

    describe("withSex", () => {
      it("should create new instance with updated sex", () => {
        const updatedUser = user.withSex("female" as Sex)

        expect(updatedUser.getSex()).toBe("female")
        expect(updatedUser.getId().equals(userId)).toBe(true)
        expect(user.getSex()).toBe("male") // Original unchanged
      })
    })

    describe("withPreferredActivities", () => {
      it("should create new instance with updated activities", () => {
        const newActivities = ["swimming", "cycling", "yoga"]
        const updatedUser = user.withPreferredActivities(newActivities)

        expect(updatedUser.getPreferredActivityKeys()).toEqual(newActivities)
        expect(updatedUser.getId().equals(userId)).toBe(true)
        expect(user.getPreferredActivityKeys()).toEqual(["walking", "running"]) // Original unchanged
      })

      it("should create a copy of activities array", () => {
        const activities = ["swimming"]
        const updatedUser = user.withPreferredActivities(activities)

        activities.push("cycling") // Modify original array
        expect(updatedUser.getPreferredActivityKeys()).toEqual(["swimming"]) // Should not be affected
      })
    })

    describe("withProfileData", () => {
      it("should update all provided fields", () => {
        const updatedUser = user.withProfileData(
          "female" as Sex,
          85 as Kilograms,
          175 as Centimeters,
          ["yoga", "pilates"],
        )

        expect(updatedUser.getSex()).toBe("female")
        expect(updatedUser.getWeight()).toBe(85)
        expect(updatedUser.getHeight()).toBe(175)
        expect(updatedUser.getPreferredActivityKeys()).toEqual(["yoga", "pilates"])
        expect(updatedUser.getId().equals(userId)).toBe(true)
      })

      it("should update only specified fields", () => {
        const updatedUser = user.withProfileData(
          undefined, // Keep current sex
          80 as Kilograms, // Update weight
          undefined, // Keep current height
          ["swimming"], // Update activities
        )

        expect(updatedUser.getSex()).toBe("male")
        expect(updatedUser.getWeight()).toBe(80)
        expect(updatedUser.getHeight()).toBe(180)
        expect(updatedUser.getPreferredActivityKeys()).toEqual(["swimming"])
      })

      it("should validate weight when provided", () => {
        expect(() => user.withProfileData(undefined, 25 as Kilograms)).toThrow(
          "Weight must be between 30 and 300 kg",
        )
      })

      it("should validate height when provided", () => {
        expect(() => user.withProfileData(undefined, undefined, 100 as Centimeters)).toThrow(
          "Height must be between 120 and 250 cm",
        )
      })
    })
  })

  describe("equals", () => {
    it("should return true for users with same ID", () => {
      const id = UserHealthInfoId.generate()
      const user1 = UserHealthInfo.createWithId(
        id,
        "male" as Sex,
        75 as Kilograms,
        180 as Centimeters,
        [],
      )
      const user2 = UserHealthInfo.createWithId(
        id,
        "female" as Sex,
        60 as Kilograms,
        165 as Centimeters,
        ["running"],
      )

      expect(user1.equals(user2)).toBe(true)
    })

    it("should return false for users with different ID", () => {
      const user1 = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, [])
      const user2 = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, [])

      expect(user1.equals(user2)).toBe(false)
    })
  })

  describe("toString", () => {
    it("should include ID in string representation", () => {
      const user = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, [])
      const str = user.toString()

      expect(str).toContain(user.getId().toString())
      expect(str).toContain("male")
      expect(str).toContain("75kg")
      expect(str).toContain("180cm")
      expect(str).toContain("BMI:")
    })
  })
})
