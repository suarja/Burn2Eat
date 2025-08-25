import { NutritionalInfo } from "../../../src/domain/nutrition/NutritionalInfo";
import { Kilocalories } from "../../../src/domain/common/UnitTypes";

describe('NutritionalInfo (Pure Domain)', () => {
  
  describe('Creation', () => {
    it('should create nutritional info with calories only', () => {
      // Arrange
      const calories = 250 as Kilocalories;

      // Act
      const nutrition = NutritionalInfo.perServing(calories);

      // Assert
      expect(nutrition).toBeInstanceOf(NutritionalInfo);
      expect(nutrition.getCalories()).toBe(calories);
    });

    it('should create nutritional info with full macros', () => {
      // Arrange
      const calories = 400 as Kilocalories;
      const protein = 25;
      const carbs = 30;
      const fat = 20;

      // Act
      const nutrition = NutritionalInfo.withMacros(calories, protein, carbs, fat);

      // Assert
      expect(nutrition.getCalories()).toBe(calories);
      expect(nutrition.getProtein()).toBe(protein);
      expect(nutrition.getCarbs()).toBe(carbs);
      expect(nutrition.getFat()).toBe(fat);
      expect(nutrition.hasMacros()).toBe(true);
    });
  });

  describe('Macronutrient Information', () => {
    it('should return undefined for macros when not provided', () => {
      // Arrange
      const calories = 200 as Kilocalories;

      // Act
      const nutrition = NutritionalInfo.perServing(calories);

      // Assert
      expect(nutrition.getProtein()).toBeUndefined();
      expect(nutrition.getCarbs()).toBeUndefined();
      expect(nutrition.getFat()).toBeUndefined();
      expect(nutrition.hasMacros()).toBe(false);
    });

    it('should return correct macro values when provided', () => {
      // Arrange
      const calories = 500 as Kilocalories;
      const protein = 30;
      const carbs = 45;
      const fat = 25;

      // Act
      const nutrition = NutritionalInfo.withMacros(calories, protein, carbs, fat);

      // Assert
      expect(nutrition.getProtein()).toBe(protein);
      expect(nutrition.getCarbs()).toBe(carbs);
      expect(nutrition.getFat()).toBe(fat);
    });

    it('should correctly identify when macros are available', () => {
      // Nutrition with macros
      const withMacros = NutritionalInfo.withMacros(
        400 as Kilocalories, 20, 30, 15
      );

      // Nutrition without macros
      const withoutMacros = NutritionalInfo.perServing(400 as Kilocalories);

      expect(withMacros.hasMacros()).toBe(true);
      expect(withoutMacros.hasMacros()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values for macros', () => {
      // Arrange
      const calories = 100 as Kilocalories;
      const protein = 0;
      const carbs = 0;
      const fat = 0;

      // Act
      const nutrition = NutritionalInfo.withMacros(calories, protein, carbs, fat);

      // Assert
      expect(nutrition.getProtein()).toBe(0);
      expect(nutrition.getCarbs()).toBe(0);
      expect(nutrition.getFat()).toBe(0);
      expect(nutrition.hasMacros()).toBe(true); // Zero is still "provided"
    });

    it('should handle very low calorie values', () => {
      // Arrange
      const calories = 1 as Kilocalories;

      // Act
      const nutrition = NutritionalInfo.perServing(calories);

      // Assert
      expect(nutrition.getCalories()).toBe(1);
    });

    it('should handle high calorie values', () => {
      // Arrange
      const calories = 999 as Kilocalories;

      // Act
      const nutrition = NutritionalInfo.perServing(calories);

      // Assert
      expect(nutrition.getCalories()).toBe(999);
    });
  });

  describe('Type Safety', () => {
    it('should maintain branded type for calories', () => {
      // Arrange
      const calories = 300 as Kilocalories;
      const nutrition = NutritionalInfo.perServing(calories);

      // Act
      const retrievedCalories = nutrition.getCalories();

      // Assert - The type should be preserved
      // This is more of a TypeScript compile-time check
      expect(typeof retrievedCalories).toBe('number');
      expect(retrievedCalories).toBe(300);
    });
  });
});