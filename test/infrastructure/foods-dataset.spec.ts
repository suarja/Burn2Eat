import {
  FOODS_DATASET,
  getFoodById,
  getFoodsByCategory,
  searchFoodsByName,
  validateFoodDataset,
  generateDatasetReport,
  DATASET_STATS
} from '../../app/infrastructure/data';

describe('Foods Dataset', () => {
  describe('Dataset Structure', () => {
    it('should have foods defined', () => {
      expect(FOODS_DATASET).toBeDefined();
      expect(Array.isArray(FOODS_DATASET)).toBe(true);
      expect(FOODS_DATASET.length).toBeGreaterThan(0);
    });

    it('should have valid structure for each food item', () => {
      FOODS_DATASET.forEach(food => {
        expect(food.id).toBeDefined();
        expect(food.names).toBeDefined();
        expect(food.names.en).toBeDefined();
        expect(food.names.fr).toBeDefined();
        expect(food.calories).toBeGreaterThan(0);
        expect(food.portionSize).toBeDefined();
        expect(food.portionSize.amount).toBeGreaterThan(0);
        expect(food.category).toBeDefined();
        expect(food.imageUrl).toMatch(/^https:\/\//);
      });
    });

    it('should have unique IDs', () => {
      const ids = FOODS_DATASET.map(food => food.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('Dataset Validation', () => {
    it('should pass validation', () => {
      const validation = validateFoodDataset();
      
      if (!validation.isValid) {
        console.log('Validation Report:');
        console.log(generateDatasetReport());
      }
      
      expect(validation.isValid).toBe(true);
      expect(validation.duplicateIds).toHaveLength(0);
      expect(validation.errors).toHaveLength(0);
    });

    it('should have proper Unsplash URLs format', () => {
      const unsplashFoods = FOODS_DATASET.filter(food => 
        food.imageUrl.includes('unsplash.com')
      );
      
      unsplashFoods.forEach(food => {
        expect(food.imageUrl).toMatch(/images\.unsplash\.com\/photo-/);
        expect(food.imageUrl).toMatch(/w=400&h=400&fit=crop/);
      });
    });
  });

  describe('Search Functions', () => {
    it('should find food by ID', () => {
      const burger = getFoodById('burger-classic');
      expect(burger).toBeDefined();
      expect(burger?.names.en).toBe('Classic Burger');
    });

    it('should return undefined for non-existent ID', () => {
      const nonExistent = getFoodById('non-existent-food');
      expect(nonExistent).toBeUndefined();
    });

    it('should filter foods by category', () => {
      const desserts = getFoodsByCategory('dessert');
      expect(desserts.length).toBeGreaterThan(0);
      desserts.forEach(food => {
        expect(food.category).toBe('dessert');
      });
    });

    it('should search foods by English name', () => {
      const results = searchFoodsByName('burger');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(food => 
        food.names.en.toLowerCase().includes('burger')
      )).toBe(true);
    });

    it('should search foods by French name', () => {
      const results = searchFoodsByName('gâteau');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(food => 
        food.names.fr.toLowerCase().includes('gâteau')
      )).toBe(true);
    });

    it('should search foods by tags', () => {
      const results = searchFoodsByName('chocolate');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(food => 
        food.tags?.includes('chocolate')
      )).toBe(true);
    });

    it('should handle case-insensitive search', () => {
      const lowerResults = searchFoodsByName('pizza');
      const upperResults = searchFoodsByName('PIZZA');
      expect(lowerResults.length).toBe(upperResults.length);
    });
  });

  describe('Dataset Statistics', () => {
    it('should provide correct stats', () => {
      expect(DATASET_STATS.totalFoods).toBe(FOODS_DATASET.length);
      expect(DATASET_STATS.categories.length).toBeGreaterThan(0);
      expect(DATASET_STATS.averageCalories).toBeGreaterThan(0);
    });

    it('should have all expected categories', () => {
      const expectedCategories = ['fast-food', 'dessert', 'beverage', 'snack', 'fruit'];
      const actualCategories = DATASET_STATS.categories;
      
      expectedCategories.forEach(category => {
        expect(actualCategories).toContain(category);
      });
    });

    it('should have balanced content across categories', () => {
      const categories = DATASET_STATS.categories;
      
      categories.forEach(category => {
        const count = getFoodsByCategory(category).length;
        expect(count).toBeGreaterThan(0);
      });
    });
  });

  describe('Content Quality', () => {
    it('should have multilingual support', () => {
      FOODS_DATASET.forEach(food => {
        expect(food.names.en).not.toBe(food.names.fr);
        expect(food.names.en.length).toBeGreaterThan(0);
        expect(food.names.fr.length).toBeGreaterThan(0);
      });
    });

    it('should have realistic calorie values', () => {
      FOODS_DATASET.forEach(food => {
        // Reasonable calorie range (10-1000 per portion)
        expect(food.calories).toBeGreaterThan(10);
        expect(food.calories).toBeLessThan(1000);
      });
    });

    it('should have proper portion sizes', () => {
      FOODS_DATASET.forEach(food => {
        expect(food.portionSize.amount).toBeGreaterThan(0);
        expect(['piece', '100g', 'cup', 'slice', 'serving', 'bottle', 'can']).toContain(food.portionSize.unit);
      });
    });
  });
});