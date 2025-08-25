import { StaticDishRepository } from "../../../src/infrastructure/adapters/StaticDishRepository";
import { DishRepository } from "../../../src/domain/nutrition/DishRepository";
import { Dish } from "../../../src/domain/nutrition/Dish";
import { FOODS_DATASET } from "../../../src/infrastructure/data";

describe('StaticDishRepository (Integration)', () => {
  let repository: DishRepository;

  beforeEach(() => {
    repository = new StaticDishRepository();
  });

  describe('findByName', () => {
    it('should find dishes by name query', async () => {
      // Act
      const results = await repository.findByName('burger');

      // Assert
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toBeInstanceOf(Dish);
      
      const firstResult = results[0];
      expect(firstResult.getName().toLowerCase()).toContain('burger');
    });

    it('should return empty array for non-existent food', async () => {
      // Act
      const results = await repository.findByName('non-existent-food-xyz');

      // Assert
      expect(results).toHaveLength(0);
    });

    it('should respect limit parameter', async () => {
      // Act
      const results = await repository.findByName('a', 2); // Generic query that should match multiple

      // Assert
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should handle case-insensitive search', async () => {
      // Act
      const lowerCaseResults = await repository.findByName('pizza');
      const upperCaseResults = await repository.findByName('PIZZA');

      // Assert
      expect(lowerCaseResults.length).toBe(upperCaseResults.length);
      if (lowerCaseResults.length > 0) {
        expect(lowerCaseResults[0].getName()).toBe(upperCaseResults[0].getName());
      }
    });
  });

  describe('findById', () => {
    it('should find dish by valid ID', async () => {
      // Act
      const dish = await repository.findById('burger-classic');

      // Assert
      expect(dish).not.toBeNull();
      expect(dish).toBeInstanceOf(Dish);
      expect(dish!.getId().toString()).toBe('burger-classic');
      expect(dish!.getName()).toBe('Classic Burger');
    });

    it('should return null for non-existent ID', async () => {
      // Act
      const dish = await repository.findById('non-existent-id');

      // Assert
      expect(dish).toBeNull();
    });

    it('should return dish with correct nutritional information', async () => {
      // Act
      const dish = await repository.findById('burger-classic');

      // Assert
      expect(dish).not.toBeNull();
      expect(dish!.getCalories()).toBe(540); // From our dataset
    });
  });

  describe('findPopular', () => {
    it('should return popular dishes', async () => {
      // Act
      const dishes = await repository.findPopular(5);

      // Assert
      expect(dishes).toHaveLength(5);
      dishes.forEach(dish => {
        expect(dish).toBeInstanceOf(Dish);
      });
    });

    it('should default to 10 dishes when no limit specified', async () => {
      // Act
      const dishes = await repository.findPopular();

      // Assert
      expect(dishes).toHaveLength(10);
    });

    it('should not exceed total available dishes', async () => {
      // Act
      const dishes = await repository.findPopular(1000);

      // Assert
      expect(dishes.length).toBeLessThanOrEqual(FOODS_DATASET.length);
    });
  });

  describe('findByCategory', () => {
    it('should find dishes by valid category', async () => {
      // Act
      const desserts = await repository.findByCategory?.('dessert');

      // Assert
      expect(desserts?.length).toBeGreaterThan(0);
      // Note: We can't directly verify category since it's not exposed in Dish domain
      // This tests the translation layer works
    });

    it('should return empty array for non-existent category', async () => {
      // Act
      const results = await repository.findByCategory?.('non-existent-category');

      // Assert
      expect(results).toHaveLength(0);
    });

    it('should respect limit parameter in category search', async () => {
      // Act
      const results = await repository.findByCategory?.('dessert', 2);

      // Assert
      expect(results?.length).toBeLessThanOrEqual(2);
    });
  });

  describe('search', () => {
    it('should search with basic query', async () => {
      // Act
      const results = await repository.search?.('burger');

      // Assert
      expect(results?.length).toBeGreaterThan(0);
      expect(results?.[0]).toBeInstanceOf(Dish);
    });

    it('should filter by category', async () => {
      // Act
      const results = await repository.search?.('', {
        category: 'dessert'
      });

      // Assert
      expect(results?.length).toBeGreaterThan(0);
      // All results should be desserts (we can't verify directly, but count should match findByCategory)
      const allDesserts = await repository.findByCategory?.('dessert');
      expect(results?.length).toBe(allDesserts?.length);
    });

    it('should filter by max calories', async () => {
      // Act
      const results = await repository.search?.('', {
        maxCalories: 200
      });

      // Assert
      expect(results?.length).toBeGreaterThan(0);
      results?.forEach(dish => {
        expect(dish.getCalories()).toBeLessThanOrEqual(200);
      });
    });

    it('should filter by min calories', async () => {
      // Act
      const results = await repository.search?.('', {
        minCalories: 400
      });

      // Assert
      expect(results?.length).toBeGreaterThan(0);
      results?.forEach(dish => {
        expect(dish.getCalories()).toBeGreaterThanOrEqual(400);
      });
    });

    it('should combine multiple filters', async () => {
      // Act
      const results = await repository.search?.('', {
        category: 'fast-food',
        maxCalories: 600,
        minCalories: 300
      });

      // Assert
      results?.forEach(dish => {
        expect(dish.getCalories()).toBeGreaterThanOrEqual(300);
        expect(dish.getCalories()).toBeLessThanOrEqual(600);
      });
    });
  });

  describe('Data Translation', () => {
    it('should correctly translate FoodData to Dish domain object', async () => {
      // Act
      const dish = await repository.findById('burger-classic');

      // Assert
      expect(dish).not.toBeNull();
      
      // Verify domain object properties
      expect(dish!.getId()).toBeDefined();
      expect(dish!.getName()).toBe('Classic Burger');
      expect(dish!.getNutrition()).toBeDefined();
      expect(dish!.getCalories()).toBe(540);
      
      // Verify domain business rules work
      expect(dish!.isHighCalorie()).toBe(true); // 540 > 400
    });

    it('should handle all dishes in dataset', async () => {
      // Act - Get all dishes via popular (large limit)
      const allDishes = await repository.findPopular(1000);

      // Assert
      expect(allDishes.length).toBe(FOODS_DATASET.length);
      
      allDishes.forEach(dish => {
        expect(dish).toBeInstanceOf(Dish);
        expect(dish.getId().toString()).toBeTruthy();
        expect(dish.getName()).toBeTruthy();
        expect(dish.getCalories()).toBeGreaterThan(0);
      });
    });
  });

  describe('Helper Methods', () => {
    let staticRepo: StaticDishRepository;

    beforeEach(() => {
      staticRepo = new StaticDishRepository();
    });

    it('should return available categories', async () => {
      // Act
      const categories = await staticRepo.getAvailableCategories();

      // Assert
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('fast-food');
      expect(categories).toContain('dessert');
      expect(categories).toContain('fruit');
    });

    it('should return dataset statistics', async () => {
      // Act
      const stats = await staticRepo.getDatasetInfo();

      // Assert
      expect(stats.totalDishes).toBe(FOODS_DATASET.length);
      expect(stats.categories.length).toBeGreaterThan(0);
      expect(stats.averageCalories).toBeGreaterThan(0);
      expect(typeof stats.averageCalories).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle empty query gracefully', async () => {
      // Act
      const results = await repository.findByName('');

      // Assert - Should not throw, behavior depends on implementation
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle whitespace-only query', async () => {
      // Act
      const results = await repository.findByName('   ');

      // Assert
      expect(Array.isArray(results)).toBe(true);
    });
  });
});