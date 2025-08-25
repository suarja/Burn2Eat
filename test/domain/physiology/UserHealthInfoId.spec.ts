import { UserHealthInfoId } from "../../../src/domain/physiology/UserHealthInfoId";

describe('UserHealthInfoId', () => {
  describe('from', () => {
    it('should create UserHealthInfoId from valid UUID', () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const id = UserHealthInfoId.from(uuid);
      
      expect(id.toString()).toBe(uuid);
      expect(id.getValue()).toBe(uuid);
    });

    it('should throw error for empty string', () => {
      expect(() => UserHealthInfoId.from("")).toThrow('UserHealthInfoId cannot be empty');
      expect(() => UserHealthInfoId.from("   ")).toThrow('UserHealthInfoId cannot be empty');
    });

    it('should throw error for invalid UUID format', () => {
      const invalidUuids = [
        "not-a-uuid",
        "550e8400-e29b-41d4-a716", // Too short
        "550e8400-e29b-41d4-a716-446655440000-extra", // Too long
        "550e8400-e29b-41d4-a716-446655440000".replace('-', ''), // No hyphens
        "ggge8400-e29b-41d4-a716-446655440000" // Invalid characters
      ];

      invalidUuids.forEach(uuid => {
        expect(() => UserHealthInfoId.from(uuid)).toThrow('UserHealthInfoId must be a valid UUID format');
      });
    });

    it('should accept different UUID versions', () => {
      const uuidVersions = [
        "550e8400-e29b-11d4-a716-446655440000", // Version 1
        "550e8400-e29b-21d4-a716-446655440000", // Version 2
        "550e8400-e29b-31d4-a716-446655440000", // Version 3
        "550e8400-e29b-41d4-a716-446655440000", // Version 4
        "550e8400-e29b-51d4-a716-446655440000"  // Version 5
      ];

      uuidVersions.forEach(uuid => {
        expect(() => UserHealthInfoId.from(uuid)).not.toThrow();
      });
    });
  });

  describe('generate', () => {
    it('should generate unique IDs', () => {
      const id1 = UserHealthInfoId.generate();
      const id2 = UserHealthInfoId.generate();
      
      expect(id1.toString()).not.toBe(id2.toString());
      expect(id1.equals(id2)).toBe(false);
    });

    it('should generate valid UUID format', () => {
      const id = UserHealthInfoId.generate();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(id.toString())).toBe(true);
    });

    it('should generate multiple unique IDs', () => {
      const ids = new Set();
      const numberOfIds = 100;

      for (let i = 0; i < numberOfIds; i++) {
        ids.add(UserHealthInfoId.generate().toString());
      }

      expect(ids.size).toBe(numberOfIds);
    });
  });

  describe('primary', () => {
    it('should return consistent primary ID', () => {
      const primary1 = UserHealthInfoId.primary();
      const primary2 = UserHealthInfoId.primary();
      
      expect(primary1.toString()).toBe(primary2.toString());
      expect(primary1.equals(primary2)).toBe(true);
    });

    it('should return specific primary UUID', () => {
      const primary = UserHealthInfoId.primary();
      expect(primary.toString()).toBe("00000000-0000-4000-8000-000000000001");
    });
  });

  describe('equals', () => {
    it('should return true for same ID values', () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const id1 = UserHealthInfoId.from(uuid);
      const id2 = UserHealthInfoId.from(uuid);
      
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false for different ID values', () => {
      const id1 = UserHealthInfoId.from("550e8400-e29b-41d4-a716-446655440000");
      const id2 = UserHealthInfoId.from("660e8400-e29b-41d4-a716-446655440000");
      
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('toString and getValue', () => {
    it('should return original UUID string', () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const id = UserHealthInfoId.from(uuid);
      
      expect(id.toString()).toBe(uuid);
      expect(id.getValue()).toBe(uuid);
      expect(id.toString()).toBe(id.getValue());
    });
  });
});