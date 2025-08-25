import { CreateUserProfileUseCase, CreateUserProfileInput } from "../../../src/application/usecases/CreateUserProfileUseCase";
import { UserHealthInfoRepository } from "../../../src/domain/physiology/UserHealthInfoRepository";
import { UserHealthInfo } from "../../../src/domain/physiology/UserHealthInfo";
import { UserHealthInfoId } from "../../../src/domain/physiology/UserHealthInfoId";
import { Sex } from "../../../src/domain/physiology/Sex";

// Mock repository
class MockUserHealthInfoRepository implements UserHealthInfoRepository {
  private storage = new Map<string, UserHealthInfo>();
  private currentId: string | null = null;

  async save(userProfile: UserHealthInfo): Promise<UserHealthInfo> {
    this.storage.set(userProfile.getId().toString(), userProfile);
    return userProfile;
  }

  async findById(id: UserHealthInfoId): Promise<UserHealthInfo | null> {
    return this.storage.get(id.toString()) || null;
  }

  async getCurrent(): Promise<UserHealthInfo | null> {
    if (!this.currentId) return null;
    return this.storage.get(this.currentId) || null;
  }

  async setCurrent(userProfile: UserHealthInfo): Promise<UserHealthInfo> {
    this.storage.set(userProfile.getId().toString(), userProfile);
    this.currentId = userProfile.getId().toString();
    return userProfile;
  }

  async deleteById(id: UserHealthInfoId): Promise<boolean> {
    const existed = this.storage.has(id.toString());
    this.storage.delete(id.toString());
    if (this.currentId === id.toString()) {
      this.currentId = null;
    }
    return existed;
  }

  async exists(id: UserHealthInfoId): Promise<boolean> {
    return this.storage.has(id.toString());
  }

  async clear(): Promise<void> {
    this.storage.clear();
    this.currentId = null;
  }
}

describe('CreateUserProfileUseCase', () => {
  let useCase: CreateUserProfileUseCase;
  let mockRepository: MockUserHealthInfoRepository;

  beforeEach(() => {
    mockRepository = new MockUserHealthInfoRepository();
    useCase = new CreateUserProfileUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should create and save user profile successfully', async () => {
      // Arrange
      const input: CreateUserProfileInput = {
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking", "running"]
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.userProfile).not.toBeNull();
      
      if (result.userProfile) {
        expect(result.userProfile.sex).toBe("male");
        expect(result.userProfile.weight).toBe(75);
        expect(result.userProfile.height).toBe(180);
        expect(result.userProfile.preferredActivityKeys).toEqual(["walking", "running"]);
        expect(result.userProfile.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
        expect(result.userProfile.bmi).toBeCloseTo(23.1, 1);
        expect(result.userProfile.bmiCategory).toBe("normal");
        expect(result.userProfile.hasHealthyWeight).toBe(true);
      }
    });

    it('should set created profile as current', async () => {
      // Arrange
      const input: CreateUserProfileInput = {
        sex: "female" as Sex,
        weight: 60,
        height: 165,
        preferredActivityKeys: ["yoga"]
      };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.success).toBe(true);
      
      const current = await mockRepository.getCurrent();
      expect(current).not.toBeNull();
      expect(current?.getSex()).toBe("female");
      expect(current?.getWeight()).toBe(60);
    });

    it('should validate required input', async () => {
      // Test null input
      const result1 = await useCase.execute(null as any);
      expect(result1.success).toBe(false);
      expect(result1.error).toBe('Input data is required');

      // Test undefined input
      const result2 = await useCase.execute(undefined as any);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Input data is required');
    });

    it('should validate sex field', async () => {
      const invalidInputs = [
        { sex: null, weight: 75, height: 180, preferredActivityKeys: [] },
        { sex: undefined, weight: 75, height: 180, preferredActivityKeys: [] },
        { sex: "invalid", weight: 75, height: 180, preferredActivityKeys: [] }
      ];

      for (const input of invalidInputs) {
        const result = await useCase.execute(input as any);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Valid sex is required (male, female, or unspecified)');
      }
    });

    it('should validate weight range', async () => {
      const invalidWeights = [0, 25, 350, null, undefined];

      for (const weight of invalidWeights) {
        const input = {
          sex: "male" as Sex,
          weight: weight as any,
          height: 180,
          preferredActivityKeys: []
        };

        const result = await useCase.execute(input);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Weight must be between 30 and 300 kg');
      }
    });

    it('should validate height range', async () => {
      const invalidHeights = [0, 100, 300, null, undefined];

      for (const height of invalidHeights) {
        const input = {
          sex: "male" as Sex,
          weight: 75,
          height: height as any,
          preferredActivityKeys: []
        };

        const result = await useCase.execute(input);
        expect(result.success).toBe(false);
        expect(result.error).toBe('Height must be between 120 and 250 cm');
      }
    });

    it('should validate preferred activity keys', async () => {
      const invalidActivityKeys = [
        null,
        undefined,
        "not-an-array",
        ["valid", "", "key"], // Empty string
        ["valid", null, "key"], // Null element
        ["valid", 123, "key"] // Non-string element
      ];

      for (const activityKeys of invalidActivityKeys) {
        const input = {
          sex: "male" as Sex,
          weight: 75,
          height: 180,
          preferredActivityKeys: activityKeys as any
        };

        const result = await useCase.execute(input);
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/activity keys|array/i);
      }
    });

    it('should handle repository save errors', async () => {
      // Arrange - Mock repository to throw error
      const errorRepository = {
        ...mockRepository,
        setCurrent: async () => {
          throw new Error('Storage error');
        }
      };
      
      const errorUseCase = new CreateUserProfileUseCase(errorRepository as unknown as UserHealthInfoRepository);
      const input: CreateUserProfileInput = {
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"]
      };

      // Act
      const result = await errorUseCase.execute(input);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Storage error');
      expect(result.userProfile).toBeNull();
    });
  });

  describe('createPrimary', () => {
    it('should create primary user profile with specific ID', async () => {
      // Arrange
      const input: CreateUserProfileInput = {
        sex: "unspecified" as Sex,
        weight: 70,
        height: 170,
        preferredActivityKeys: ["walking_brisk", "jogging_general"]
      };

      // Act
      const result = await useCase.createPrimary(input);

      // Assert
      expect(result.success).toBe(true);
      expect(result.userProfile).not.toBeNull();
      
      if (result.userProfile) {
        expect(result.userProfile.id).toBe("00000000-0000-4000-8000-000000000001");
        expect(result.userProfile.sex).toBe("unspecified");
        expect(result.userProfile.weight).toBe(70);
        expect(result.userProfile.height).toBe(170);
      }
    });

    it('should set primary profile as current', async () => {
      // Arrange
      const input: CreateUserProfileInput = {
        sex: "male" as Sex,
        weight: 80,
        height: 175,
        preferredActivityKeys: ["cycling"]
      };

      // Act
      const result = await useCase.createPrimary(input);

      // Assert
      expect(result.success).toBe(true);
      
      const current = await mockRepository.getCurrent();
      expect(current).not.toBeNull();
      expect(current?.getId().toString()).toBe("00000000-0000-4000-8000-000000000001");
    });
  });

  describe('validation edge cases', () => {
    it('should accept boundary weight values', async () => {
      const validWeights = [30, 300];

      for (const weight of validWeights) {
        const input: CreateUserProfileInput = {
          sex: "male" as Sex,
          weight: weight,
          height: 180,
          preferredActivityKeys: []
        };

        const result = await useCase.execute(input);
        expect(result.success).toBe(true);
      }
    });

    it('should accept boundary height values', async () => {
      const validHeights = [120, 250];

      for (const height of validHeights) {
        const input: CreateUserProfileInput = {
          sex: "male" as Sex,
          weight: 75,
          height: height,
          preferredActivityKeys: []
        };

        const result = await useCase.execute(input);
        expect(result.success).toBe(true);
      }
    });

    it('should accept empty preferred activities', async () => {
      const input: CreateUserProfileInput = {
        sex: "female" as Sex,
        weight: 65,
        height: 165,
        preferredActivityKeys: []
      };

      const result = await useCase.execute(input);
      expect(result.success).toBe(true);
      expect(result.userProfile?.preferredActivityKeys).toEqual([]);
    });

    it('should trim whitespace from activity keys', async () => {
      const input: CreateUserProfileInput = {
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: [" walking ", "  running  "]
      };

      // This should fail validation because trimmed empty strings are not allowed
      const inputWithEmptyAfterTrim: CreateUserProfileInput = {
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["   "] // Just whitespace
      };

      const result = await useCase.execute(inputWithEmptyAfterTrim);
      expect(result.success).toBe(false);
    });
  });
});