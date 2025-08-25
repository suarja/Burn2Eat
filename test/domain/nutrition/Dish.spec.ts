import { Dish } from "../../../src/domain/nutrition/Dish";
import { DishId } from "../../../src/domain/nutrition/DishId";
import { NutritionalInfo } from "../../../src/domain/nutrition/NutritionalInfo";
import { Kilocalories } from "../../../src/domain/common/UnitTypes";

describe('Dish (Pure Domain)', () => {
  
  describe('Creation', () => {
    it('should create a dish with valid parameters', () => {
      // Arrange
      const dishId = DishId.from('test-dish-id');
      const name = 'Test Burger';
      const calories = 450 as Kilocalories;
      const nutrition = NutritionalInfo.perServing(calories);

      // Act
      const dish = Dish.create({ dishId, name, nutrition });

      // Assert
      expect(dish).toBeInstanceOf(Dish);
      expect(dish.getId().toString()).toBe('test-dish-id');
      expect(dish.getName()).toBe('Test Burger');
      expect(dish.getCalories()).toBe(calories);
    });

    it('should throw error for empty dish name', () => {
      // Arrange
      const dishId = DishId.from('test-dish-id');
      const name = '';
      const calories = 450 as Kilocalories;
      const nutrition = NutritionalInfo.perServing(calories);

      // Act & Assert
      expect(() => {
        Dish.create({ dishId, name, nutrition });
      }).toThrow('Dish name cannot be empty');
    });

    it('should trim whitespace from dish name', () => {
      // Arrange
      const dishId = DishId.from('test-dish-id');
      const name = '  Test Burger  ';
      const calories = 450 as Kilocalories;
      const nutrition = NutritionalInfo.perServing(calories);

      // Act
      const dish = Dish.create({ dishId, name, nutrition });

      // Assert
      expect(dish.getName()).toBe('Test Burger');
    });
  });

  describe('Accessors', () => {
    let dish: Dish;

    beforeEach(() => {
      const dishId = DishId.from('burger-classic');
      const name = 'Classic Burger';
      const calories = 540 as Kilocalories;
      const nutrition = NutritionalInfo.perServing(calories);
      
      dish = Dish.create({ dishId, name, nutrition });
    });

    it('should return correct ID', () => {
      expect(dish.getId().toString()).toBe('burger-classic');
    });

    it('should return correct name', () => {
      expect(dish.getName()).toBe('Classic Burger');
    });

    it('should return nutritional information', () => {
      const nutrition = dish.getNutrition();
      expect(nutrition).toBeInstanceOf(NutritionalInfo);
      expect(nutrition.getCalories()).toBe(540);
    });

    it('should return calories directly', () => {
      expect(dish.getCalories()).toBe(540);
    });
  });

  describe('Business Rules', () => {
    it('should identify high-calorie dishes correctly', () => {
      // High calorie dish (>400)
      const highCalorieDish = Dish.create({
        dishId: DishId.from('high-cal'),
        name: 'Double Burger',
        nutrition: NutritionalInfo.perServing(500 as Kilocalories)
      });

      // Low calorie dish (<=400)
      const lowCalorieDish = Dish.create({
        dishId: DishId.from('low-cal'),
        name: 'Salad',
        nutrition: NutritionalInfo.perServing(200 as Kilocalories)
      });

      expect(highCalorieDish.isHighCalorie()).toBe(true);
      expect(lowCalorieDish.isHighCalorie()).toBe(false);
    });

    it('should handle edge case for high-calorie threshold', () => {
      // Exactly 400 calories should NOT be high-calorie
      const edgeCaseDish = Dish.create({
        dishId: DishId.from('edge-case'),
        name: 'Edge Case Dish',
        nutrition: NutritionalInfo.perServing(400 as Kilocalories)
      });

      expect(edgeCaseDish.isHighCalorie()).toBe(false);
    });
  });

  describe('Equality and Comparison', () => {
    it('should consider dishes with same ID as equal', () => {
      const dish1 = Dish.create({
        dishId: DishId.from('same-id'),
        name: 'Dish One',
        nutrition: NutritionalInfo.perServing(300 as Kilocalories)
      });

      const dish2 = Dish.create({
        dishId: DishId.from('same-id'),
        name: 'Dish Two', // Different name
        nutrition: NutritionalInfo.perServing(400 as Kilocalories) // Different calories
      });

      expect(dish1.equals(dish2)).toBe(true);
    });

    it('should consider dishes with different IDs as not equal', () => {
      const dish1 = Dish.create({
        dishId: DishId.from('id-one'),
        name: 'Same Name',
        nutrition: NutritionalInfo.perServing(300 as Kilocalories)
      });

      const dish2 = Dish.create({
        dishId: DishId.from('id-two'),
        name: 'Same Name', // Same name
        nutrition: NutritionalInfo.perServing(300 as Kilocalories) // Same calories
      });

      expect(dish1.equals(dish2)).toBe(false);
    });
  });

  describe('String Representation', () => {
    it('should provide meaningful toString output', () => {
      const dish = Dish.create({
        dishId: DishId.from('test-burger'),
        name: 'Test Burger',
        nutrition: NutritionalInfo.perServing(450 as Kilocalories)
      });

      const stringRepresentation = dish.toString();
      
      expect(stringRepresentation).toContain('test-burger');
      expect(stringRepresentation).toContain('Test Burger');
      expect(stringRepresentation).toContain('450');
      expect(stringRepresentation).toContain('kcal');
    });
  });

  describe('Legacy Compatibility', () => {
    it('should maintain backward compatibility with toObject()', () => {
      const dishId = DishId.from('legacy-test');
      const name = 'Legacy Dish';
      const nutrition = NutritionalInfo.perServing(300 as Kilocalories);
      
      const dish = Dish.create({ dishId, name, nutrition });
      const objectForm = dish.toObject();

      expect(objectForm.dishId).toBe(dishId);
      expect(objectForm.name).toBe(name);
      expect(objectForm.nutrition).toBe(nutrition);
    });
  });
});