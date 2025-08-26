import * as storage from "../../app/utils/storage"
import { CreateUserProfileUseCase } from "../../src/application/usecases/CreateUserProfileUseCase"
import { GetUserProfileUseCase } from "../../src/application/usecases/GetUserProfileUseCase"
import { UpdateUserProfileUseCase } from "../../src/application/usecases/UpdateUserProfileUseCase"
import { Sex } from "../../src/domain/physiology/Sex"
import { MMKVUserHealthInfoRepository } from "../../src/infrastructure/adapters/MMKVUserHealthInfoRepository"

// Mock the storage utilities
jest.mock("../../app/utils/storage", () => ({
  load: jest.fn(),
  save: jest.fn().mockReturnValue(true),
  remove: jest.fn(),
  clear: jest.fn(),
}))

describe("User Profile Management Integration", () => {
  let repository: MMKVUserHealthInfoRepository
  let createUseCase: CreateUserProfileUseCase
  let updateUseCase: UpdateUserProfileUseCase
  let getUserCase: GetUserProfileUseCase

  let mockLoad: jest.MockedFunction<typeof storage.load>
  let mockSave: jest.MockedFunction<typeof storage.save>
  let mockRemove: jest.MockedFunction<typeof storage.remove>
  let mockClear: jest.MockedFunction<typeof storage.clear>

  beforeEach(() => {
    repository = new MMKVUserHealthInfoRepository()
    createUseCase = new CreateUserProfileUseCase(repository)
    updateUseCase = new UpdateUserProfileUseCase(repository)
    getUserCase = new GetUserProfileUseCase(repository)

    mockLoad = storage.load as jest.MockedFunction<typeof storage.load>
    mockSave = storage.save as jest.MockedFunction<typeof storage.save>
    mockRemove = storage.remove as jest.MockedFunction<typeof storage.remove>
    mockClear = storage.clear as jest.MockedFunction<typeof storage.clear>

    mockClear()
    jest.clearAllMocks()
    mockSave.mockReturnValue(true)
  })

  describe("Complete User Profile Workflow", () => {
    it("should create, retrieve, update, and verify user profile", async () => {
      const userId = "00000000-0000-4000-8000-000000000001"

      // Step 1: Create user profile
      const createResult = await createUseCase.createPrimary({
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking", "running"],
      })

      expect(createResult.success).toBe(true)
      expect(createResult.userProfile?.id).toBe(userId)
      expect(createResult.userProfile?.weight).toBe(75)

      // Mock storage for retrieval
      const savedProfileData = {
        id: userId,
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking", "running"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      mockLoad
        .mockReturnValueOnce(userId) // Current user ID
        .mockReturnValueOnce(savedProfileData) // Profile data

      // Step 2: Retrieve current user profile
      const getCurrentResult = await getUserCase.getCurrent()

      expect(getCurrentResult.success).toBe(true)
      expect(getCurrentResult.userProfile?.id).toBe(userId)
      expect(getCurrentResult.userProfile?.sex).toBe("male")
      expect(getCurrentResult.userProfile?.weight).toBe(75)
      expect(getCurrentResult.userProfile?.bmi).toBeCloseTo(23.1, 1)

      // Step 3: Update user profile weight
      const updatedProfileData = {
        ...savedProfileData,
        weight: 80,
      }

      mockLoad
        .mockReturnValueOnce(savedProfileData) // Find existing profile
        .mockReturnValueOnce(updatedProfileData) // Return updated profile

      const updateResult = await updateUseCase.updateWeight(80)

      expect(updateResult.success).toBe(true)
      expect(updateResult.userProfile?.weight).toBe(80)
      expect(updateResult.userProfile?.id).toBe(userId)

      // Step 4: Verify profile exists
      mockLoad.mockReturnValueOnce(updatedProfileData)

      const existsResult = await getUserCase.exists({ id: userId })
      expect(existsResult.success).toBe(true)
      expect(existsResult.exists).toBe(true)
    })

    it("should handle user profile not found scenarios", async () => {
      // Mock no current profile
      mockLoad.mockReturnValue(null)

      const getCurrentResult = await getUserCase.getCurrent()
      expect(getCurrentResult.success).toBe(false)
      expect(getCurrentResult.error).toBe("No current user profile found")

      // Try to update non-existent profile
      const updateResult = await updateUseCase.updateCurrent({
        weight: 80,
      })
      expect(updateResult.success).toBe(false)
      expect(updateResult.error).toBe("No current user profile found")
    })

    it("should provide default profile when none exists", async () => {
      // Mock no current profile
      mockLoad.mockReturnValue(null)

      const defaultResult = await getUserCase.getCurrentOrDefault()

      expect(defaultResult.success).toBe(true)
      expect(defaultResult.userProfile).not.toBeNull()
      expect(defaultResult.isDefault).toBe(true)
      expect(defaultResult.userProfile?.weight).toBe(70)
      expect(defaultResult.userProfile?.height).toBe(170)
      expect(defaultResult.userProfile?.sex).toBe("unspecified")
    })
  })

  describe("Profile Update Scenarios", () => {
    test("should update multiple profile fields at once", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"

      // Mock existing profile
      const existingData = {
        id: userId,
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedData = {
        ...existingData,
        sex: "female" as Sex,
        weight: 65,
        height: 165,
        preferredActivityKeys: ["yoga", "pilates"],
      }

      mockLoad
        .mockReturnValueOnce(existingData) // Find existing
        .mockReturnValueOnce(updatedData) // Return updated

      const updateResult = await updateUseCase.execute({
        id: userId,
        sex: "female" as Sex,
        weight: 65,
        height: 165,
        preferredActivityKeys: ["yoga", "pilates"],
      })

      expect(updateResult.success).toBe(true)
      expect(updateResult.userProfile?.sex).toBe("female")
      expect(updateResult.userProfile?.weight).toBe(65)
      expect(updateResult.userProfile?.height).toBe(165)
      expect(updateResult.userProfile?.preferredActivityKeys).toEqual(["yoga", "pilates"])
      expect(updateResult.userProfile?.bmi).toBeCloseTo(23.9, 1)
    })

    it("should update only specified fields", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174001"

      const existingData = {
        id: userId,
        sex: "male" as Sex,
        weight: 70,
        height: 185,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedData = {
        ...existingData,
        weight: 80, // Only weight changed
      }
      const tree = getUserCase.getCurrent()

      mockLoad.mockReturnValueOnce(existingData).mockReturnValueOnce(updatedData)

      const updateResult = await updateUseCase.execute({
        id: userId,
        weight: 80, // Only update weight
      })

      expect(updateResult.success).toBe(true)
      expect(updateResult.userProfile?.weight).toBe(80)
      // expect(updateResult.userProfile?.sex).toBe(existingData.sex); // Unchanged
      expect(updateResult.userProfile?.height).toBe(existingData.height) // Unchanged
      expect(updateResult.userProfile?.preferredActivityKeys).toEqual(["walking"]) // Unchanged
    })
  })

  describe("BMI and Health Calculations", () => {
    it("should calculate BMI and health status correctly for different profiles", async () => {
      const testCases = [
        {
          weight: 50,
          height: 170,
          expectedBMI: 17.3,
          expectedCategory: "underweight",
          expectedHealthy: false,
        },
        {
          weight: 70,
          height: 170,
          expectedBMI: 24.2,
          expectedCategory: "normal",
          expectedHealthy: true,
        },
        {
          weight: 85,
          height: 170,
          expectedBMI: 29.4,
          expectedCategory: "overweight",
          expectedHealthy: false,
        },
      ]

      for (const testCase of testCases) {
        const createResult = await createUseCase.execute({
          sex: "unspecified" as Sex,
          weight: testCase.weight,
          height: testCase.height,
          preferredActivityKeys: ["walking"],
        })

        expect(createResult.success).toBe(true)
        expect(createResult.userProfile?.bmi).toBeCloseTo(testCase.expectedBMI, 1)
        expect(createResult.userProfile?.bmiCategory).toBe(testCase.expectedCategory)
        expect(createResult.userProfile?.hasHealthyWeight).toBe(testCase.expectedHealthy)
      }
    })
  })

  describe("Error Handling", () => {
    it("should handle storage errors gracefully", async () => {
      // Mock save failure
      mockSave.mockReturnValue(false)

      const createResult = await createUseCase.execute({
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"],
      })

      expect(createResult.success).toBe(false)
      expect(createResult.error).toContain("Failed to save user profile to storage")
    })

    // it('should handle corrupted profile data', async () => {
    //   const corruptedData = {
    //     id: "123e4567-e89b-12d3-a456-426614174002",
    //     sex: "male" as Sex,
    //     weight: "not-a-number", // Invalid weight type
    //     height: null, // Invalid height
    //     preferredActivityKeys: ["walking"],
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString()
    //   };

    //   mockLoad.mockReturnValue(corruptedData);

    //   const userId = "123e4567-e89b-12d3-a456-426614174002";
    //   const getResult = await getUserCase.execute({ id: userId });

    //   expect(getResult.success).toBe(false);
    //   expect(getResult.error).toContain('Invalid user profile data');
    // });

    it("should validate profile data during updates", async () => {
      const updateResult = await updateUseCase.execute({
        weight: 25, // Below minimum
        height: 180,
      })

      expect(updateResult.success).toBe(false)
      expect(updateResult.error).toBe("Weight must be between 30 and 300 kg")
    })
  })

  describe("Activity Preferences Management", () => {
    it("should manage preferred activities correctly", async () => {
      const userId = "123e4567-e89b-12d3-a456-426614174000"

      // Create profile with initial activities
      const createResult = await createUseCase.execute({
        sex: "female" as Sex,
        weight: 60,
        height: 165,
        preferredActivityKeys: ["walking", "running"],
      })

      expect(createResult.success).toBe(true)
      expect(createResult.userProfile?.preferredActivityKeys).toEqual(["walking", "running"])

      // Mock existing profile for update
      const existingData = {
        id: createResult.userProfile!.id,
        sex: "female" as Sex,
        weight: 60,
        height: 165,
        preferredActivityKeys: ["walking", "running"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedData = {
        ...existingData,
        preferredActivityKeys: ["yoga", "pilates", "swimming"],
      }

      mockLoad.mockReturnValueOnce(existingData).mockReturnValueOnce(updatedData)

      // Update preferred activities
      const updateResult = await updateUseCase.updatePreferredActivities([
        "yoga",
        "pilates",
        "swimming",
      ])

      expect(updateResult.success).toBe(true)
      expect(updateResult.userProfile?.preferredActivityKeys).toEqual([
        "yoga",
        "pilates",
        "swimming",
      ])
    })
  })
})
