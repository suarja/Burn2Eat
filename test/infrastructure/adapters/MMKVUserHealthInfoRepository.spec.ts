import { MMKVUserHealthInfoRepository } from "../../../src/infrastructure/adapters/MMKVUserHealthInfoRepository";
import { UserHealthInfo } from "../../../src/domain/physiology/UserHealthInfo";
import { UserHealthInfoId } from "../../../src/domain/physiology/UserHealthInfoId";
import { Sex } from "../../../src/domain/physiology/Sex";
import * as storage from "../../../app/utils/storage";
import { Centimeters, Kilograms } from "../../../src/domain/common/UnitTypes";

// Mock the storage utilities
jest.mock("../../../app/utils/storage", () => ({
  load: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  clear: jest.fn()
}));

describe('MMKVUserHealthInfoRepository', () => {
  let repository: MMKVUserHealthInfoRepository;
  let mockLoad: jest.MockedFunction<typeof storage.load>;
  let mockSave: jest.MockedFunction<typeof storage.save>;
  let mockRemove: jest.MockedFunction<typeof storage.remove>;
  let mockClear: jest.MockedFunction<typeof storage.clear>;

  beforeEach(() => {
    repository = new MMKVUserHealthInfoRepository();
    mockLoad = storage.load as jest.MockedFunction<typeof storage.load>;
    mockSave = storage.save as jest.MockedFunction<typeof storage.save>;
    mockRemove = storage.remove as jest.MockedFunction<typeof storage.remove>;
    mockClear = storage.clear as jest.MockedFunction<typeof storage.clear>;
    
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save user profile successfully', async () => {
      // Arrange
      const userProfile = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, ["walking"]);
      mockSave.mockReturnValue(true);

      // Act
      const result = await repository.save(userProfile);

      // Assert
      expect(result).toBe(userProfile);
      expect(mockSave).toHaveBeenCalledWith(
        `user-profile-${userProfile.getId().toString()}`,
        expect.objectContaining({
          id: userProfile.getId().toString(),
          sex: "male",
          weight: 75,
          height: 180,
          preferredActivityKeys: ["walking"]
        })
      );
    });

    it('should throw error when storage save fails', async () => {
      // Arrange
      const userProfile = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, ["walking"]);
      mockSave.mockReturnValue(false);

      // Act & Assert
      await expect(repository.save(userProfile)).rejects.toThrow('Failed to save user profile to storage');
    });
  });

  describe('findById', () => {
    it('should return user profile when found', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      const mockData = {
        id: id.toString(),
        sex: "female" as Sex,
        weight: 60,
        height: 165,
        preferredActivityKeys: ["yoga"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockLoad.mockReturnValue(mockData);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.getId().toString()).toBe(id.toString());
      expect(result?.getSex()).toBe("female");
      expect(result?.getWeight()).toBe(60);
      expect(mockLoad).toHaveBeenCalledWith(`user-profile-${id.toString()}`);
    });

    it('should return null when profile not found', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      mockLoad.mockReturnValue(null);

      // Act
      const result = await repository.findById(id);

      // Assert
      expect(result).toBeNull();
    });

    it('should throw error for invalid data', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      const invalidData = { id: "invalid", weight: "not-a-number" };
      mockLoad.mockReturnValue(invalidData);

      // Act & Assert
      await expect(repository.findById(id)).rejects.toThrow('Invalid user profile data found in storage');
    });
  });

  describe('setCurrent', () => {
    it('should save profile and set as current', async () => {
      // Arrange
      const userProfile = UserHealthInfo.create("male" as Sex, 75 as Kilograms, 180 as Centimeters, ["walking"]);
      mockSave.mockReturnValue(true);

      // Act
      const result = await repository.setCurrent(userProfile);

      // Assert
      expect(result).toBe(userProfile);
      expect(mockSave).toHaveBeenCalledTimes(2); // Profile + current ID
      expect(mockSave).toHaveBeenCalledWith(
        "current-user-profile",
        userProfile.getId().toString()
      );
    });
  });

  describe('getCurrent', () => {
    it('should return current user profile', async () => {
      // Arrange
      const id = UserHealthInfoId.primary();
      const mockData = {
        id: id.toString(),
        sex: "unspecified" as Sex,
        weight: 70,
        height: 170,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockLoad
        .mockReturnValueOnce(id.toString()) // Current ID
        .mockReturnValueOnce(mockData);     // Profile data

      // Act
      const result = await repository.getCurrent();

      // Assert
      expect(result).not.toBeNull();
      expect(result?.getId().toString()).toBe(id.toString());
    });

    it('should return null when no current profile set', async () => {
      // Arrange
      mockLoad.mockReturnValue(null);

      // Act
      const result = await repository.getCurrent();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteById', () => {
    it('should delete existing profile', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      const mockData = {
        id: id.toString(),
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockLoad.mockReturnValue(mockData);

      // Act
      const result = await repository.deleteById(id);

      // Assert
      expect(result).toBe(true);
      expect(mockRemove).toHaveBeenCalledWith(`user-profile-${id.toString()}`);
    });

    it('should return false for non-existent profile', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      mockLoad.mockReturnValue(null);

      // Act
      const result = await repository.deleteById(id);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true when profile exists', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      const mockData = {
        id: id.toString(),
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockLoad.mockReturnValue(mockData);

      // Act
      const result = await repository.exists(id);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when profile does not exist', async () => {
      // Arrange
      const id = UserHealthInfoId.generate();
      mockLoad.mockReturnValue(null);

      // Act
      const result = await repository.exists(id);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear current user and primary profile', async () => {
      // Act
      await repository.clear();

      // Assert
      expect(mockRemove).toHaveBeenCalledWith("current-user-profile");
    });
  });

  describe('createOrUpdatePrimary', () => {
    it('should create primary profile and set as current', async () => {
      // Arrange
      mockSave.mockReturnValue(true);

      // Act
      const result = await repository.createOrUpdatePrimary(
        "male" as Sex,
        75,
        180,
        ["walking"]
      );

      // Assert
      expect(result.getId().toString()).toBe("00000000-0000-4000-8000-000000000001");
      expect(result.getSex()).toBe("male");
      expect(result.getWeight()).toBe(75);
      expect(mockSave).toHaveBeenCalledTimes(2); // Profile + current
    });
  });

  describe('hasPrimaryProfile', () => {
    it('should return true when primary profile exists', async () => {
      // Arrange
      const mockData = {
        id: "00000000-0000-4000-8000-000000000001",
        sex: "male" as Sex,
        weight: 75,
        height: 180,
        preferredActivityKeys: ["walking"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockLoad.mockReturnValue(mockData);

      // Act
      const result = await repository.hasPrimaryProfile();

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when primary profile does not exist', async () => {
      // Arrange
      mockLoad.mockReturnValue(null);

      // Act
      const result = await repository.hasPrimaryProfile();

      // Assert
      expect(result).toBe(false);
    });
  });
});