import { CalculateEffortUseCase } from "../../src/application/usecases/CalculateEffortUseCase";
import { StaticDishRepository } from "../../src/infrastructure/adapters/StaticDishRepository";
import { StaticActivityCatalog } from "../../src/infrastructure/adapters/StaticActivityCatalog";
import { EffortPolicyFactory } from "../../src/domain/effort/EffortPolicy";
import { UserHealthInfo } from "../../src/domain/physiology/UserHealthInfo";
import { Sex } from "../../src/domain/physiology/Sex";

describe('Full Effort Calculation Integration', () => {
  let useCase: CalculateEffortUseCase;
  let dishRepository: StaticDishRepository;
  let activityCatalog: StaticActivityCatalog;

  beforeEach(() => {
    dishRepository = new StaticDishRepository();
    activityCatalog = new StaticActivityCatalog();
    useCase = new CalculateEffortUseCase(dishRepository, activityCatalog);
  });

  describe('Real Food + Real Activities Integration', () => {
    it('should calculate realistic effort for apple with walking', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking_brisk"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'apple-red',
        user: user
      });

      // Assert
      expect(result.dish.name).toBe('Red Apple');
      expect(result.dish.calories).toBe(95);
      expect(result.effort.primary.activityLabel).toContain('Walk');
      expect(result.effort.primary.minutes).toBeGreaterThan(15);
      expect(result.effort.primary.minutes).toBeLessThan(45);
      expect(result.effort.alternatives.length).toBeGreaterThan(0);

      console.log(`${result.dish.name} (${result.dish.calories} kcal) + ${result.effort.primary.activityLabel} = ${result.effort.primary.formattedDuration}`);
    });

    it('should calculate realistic effort for burger with jogging', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["jogging_general"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'burger-classic',
        user: user
      });

      // Assert
      expect(result.dish.name).toBe('Classic Burger');
      expect(result.dish.calories).toBe(540);
      expect(result.effort.primary.activityLabel).toContain('Jogging');
      expect(result.effort.primary.minutes).toBeGreaterThan(45);
      expect(result.effort.primary.minutes).toBeLessThan(100);

      console.log(`${result.dish.name} (${result.dish.calories} kcal) + ${result.effort.primary.activityLabel} = ${result.effort.primary.formattedDuration}`);
    });

    it('should calculate effort for pizza with cycling', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["cycling_moderate"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'pizza-margherita',
        user: user
      });

      // Assert
      expect(result.dish.name).toBe('Margherita Pizza');
      expect(result.dish.calories).toBe(320);
      expect(result.effort.primary.activityLabel).toContain('Cycling');
      expect(result.effort.primary.minutes).toBeGreaterThan(25);
      expect(result.effort.primary.minutes).toBeLessThan(70);

      console.log(`${result.dish.name} (${result.dish.calories} kcal) + ${result.effort.primary.activityLabel} = ${result.effort.primary.formattedDuration}`);
    });

    it('should calculate effort for high-calorie chocolate cake with swimming', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["swimming_moderate"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'chocolate-cake',
        user: user
      });

      // Assert
      expect(result.dish.name).toBe('Chocolate Cake');
      expect(result.dish.calories).toBe(410);
      expect(result.effort.primary.activityLabel).toContain('Swimming');
      expect(result.effort.primary.minutes).toBeGreaterThan(35);
      expect(result.effort.primary.minutes).toBeLessThan(85);

      console.log(`${result.dish.name} (${result.dish.calories} kcal) + ${result.effort.primary.activityLabel} = ${result.effort.primary.formattedDuration}`);
    });

    it('should handle low-calorie food with low-intensity activity', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["yoga_hatha"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'strawberries',
        user: user
      });

      // Assert
      expect(result.dish.name).toBe('Strawberries');
      expect(result.dish.calories).toBe(50);
      expect(result.effort.primary.activityLabel).toContain('Yoga');
      expect(result.effort.primary.minutes).toBeGreaterThan(1);
      expect(result.effort.primary.minutes).toBeLessThan(30);

      console.log(`${result.dish.name} (${result.dish.calories} kcal) + ${result.effort.primary.activityLabel} = ${result.effort.primary.formattedDuration}`);
    });
  });

  describe('Quick Recommendations Integration', () => {
    it('should provide vigorous activities for quick burn scenarios', async () => {
      // Arrange - Use moderate calorie food
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking_casual"]);
      
      // Act
      const result = await useCase.getQuickRecommendations({
        dishId: 'banana',
        user: user
      });

      // Assert
      if (result) {
        expect(result.effort.primary.minutes).toBeLessThanOrEqual(30);
        expect(result.effort.primary.metValue).toBeGreaterThanOrEqual(6);
        console.log(`Quick burn for ${result.dish.name}: ${result.effort.primary.activityLabel} for ${result.effort.primary.formattedDuration}`);
      }
    });
  });

  describe('Endurance Recommendations Integration', () => {
    it('should provide moderate activities for endurance scenarios', async () => {
      // Arrange - Use high calorie food
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["crossfit"]);
      
      // Act
      const result = await useCase.getEnduranceRecommendations({
        dishId: 'cheeseburger-double',
        user: user
      });

      // Assert
      if (result) {
        expect(result.effort.primary.minutes).toBeGreaterThanOrEqual(45);
        const metValue = result.effort.primary.metValue;
        expect(metValue).toBeGreaterThanOrEqual(3);
        expect(metValue).toBeLessThan(6);
        console.log(`Endurance for ${result.dish.name}: ${result.effort.primary.activityLabel} for ${result.effort.primary.formattedDuration}`);
      }
    });
  });

  describe('Comparative Analysis Integration', () => {
    it('should show intensity differences for real food', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking_casual"]);
      
      // Act
      const result = await useCase.getComparativeAnalysis({
        dishId: 'avocado',
        user: user
      });

      // Assert
      expect(result.intensityComparison).toBeDefined();
      
      console.log(`\nIntensity comparison for ${result.dish.name} (${result.dish.calories} kcal):`);
      
      if (result.intensityComparison.light) {
        console.log(`  Light: ${result.intensityComparison.light.activityLabel} - ${result.intensityComparison.light.formattedDuration}`);
      }
      
      if (result.intensityComparison.moderate) {
        console.log(`  Moderate: ${result.intensityComparison.moderate.activityLabel} - ${result.intensityComparison.moderate.formattedDuration}`);
      }
      
      if (result.intensityComparison.vigorous) {
        console.log(`  Vigorous: ${result.intensityComparison.vigorous.activityLabel} - ${result.intensityComparison.vigorous.formattedDuration}`);
      }

      // Verify intensity ordering if multiple exist
      if (result.intensityComparison.vigorous && result.intensityComparison.moderate) {
        expect(result.intensityComparison.vigorous.minutes)
          .toBeLessThan(result.intensityComparison.moderate.minutes);
      }
    });
  });

  describe('Policy Comparison Integration', () => {
    it('should show policy differences with real data', async () => {
      // Arrange
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["weight_training_general"]);
      
      // Act
      const result = await useCase.compareEffortPolicies({
        dishId: 'french-fries',
        user: user
      });

      // Assert
      expect(result.policyComparison.standard).toBeDefined();
      expect(result.policyComparison.conservative).toBeDefined();
      
      console.log(`\nPolicy comparison for ${result.dish.name}:`);
      console.log(`  Standard: ${result.policyComparison.standard.primary.formattedDuration}`);
      console.log(`  Conservative: ${result.policyComparison.conservative.primary.formattedDuration}`);
      
      // Conservative should require more time
      expect(result.policyComparison.conservative.primary.minutes)
        .toBeGreaterThan(result.policyComparison.standard.primary.minutes);
    });
  });

  describe('User Weight Variation Integration', () => {
    it('should show different effort times for different user weights', async () => {
      // Arrange
      const lightUser = UserHealthInfo.create("female" as Sex, 50, 165, ["jogging_general"]);
      const heavyUser = UserHealthInfo.create("male" as Sex, 90, 180, ["jogging_general"]);
      
      // Act
      const lightResult = await useCase.execute({
        dishId: 'vanilla-ice-cream',
        user: lightUser
      });
      
      const heavyResult = await useCase.execute({
        dishId: 'vanilla-ice-cream',
        user: heavyUser
      });

      // Assert
      expect(lightResult.effort.primary.activityLabel)
        .toBe(heavyResult.effort.primary.activityLabel);
      
      // Heavier person should need less time for same activity
      expect(heavyResult.effort.primary.minutes)
        .toBeLessThan(lightResult.effort.primary.minutes);

      console.log(`\nWeight comparison for ${lightResult.dish.name}:`);
      console.log(`  50kg user: ${lightResult.effort.primary.formattedDuration}`);
      console.log(`  90kg user: ${heavyResult.effort.primary.formattedDuration}`);
    });
  });

  describe('Multiple Food Scenarios Integration', () => {
    it('should handle diverse food-activity combinations correctly', async () => {
      // Arrange
      const scenarios = [
        { foodId: 'apple-red', activityKeys: ['walking_brisk'], expectedRange: [15, 35] },
        { foodId: 'banana', activityKeys: ['cycling_moderate'], expectedRange: [10, 25] },
        { foodId: 'burger-classic', activityKeys: ['running_6mph'], expectedRange: [40, 70] },
        { foodId: 'pizza-margherita', activityKeys: ['swimming_moderate'], expectedRange: [20, 50] },
        { foodId: 'chocolate-cake', activityKeys: ['crossfit'], expectedRange: [25, 65] }
      ];

      console.log('\nDiverse food-activity combinations:');

      // Act & Assert
      for (const scenario of scenarios) {
        const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, scenario.activityKeys);
        const result = await useCase.execute({
          dishId: scenario.foodId,
          user: user
        });

        const minutes = result.effort.primary.minutes;
        expect(minutes).toBeGreaterThanOrEqual(scenario.expectedRange[0]);
        expect(minutes).toBeLessThanOrEqual(scenario.expectedRange[1]);

        console.log(`  ${result.dish.name} → ${result.effort.primary.activityLabel}: ${result.effort.primary.formattedDuration}`);
      }
    });
  });

  describe('Edge Cases with Real Data', () => {
    it('should handle very low calorie foods appropriately', async () => {
      // Arrange - Very low calorie food
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking_casual"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'strawberries',
        user: user
      });

      // Assert
      expect(result.dish.calories).toBeLessThan(60);
      expect(result.effort.primary.minutes).toBeGreaterThanOrEqual(1);
      expect(result.effort.primary.minutes).toBeLessThan(20);
      
      console.log(`Low-calorie scenario: ${result.dish.name} (${result.dish.calories} kcal) = ${result.effort.primary.formattedDuration} of ${result.effort.primary.activityLabel}`);
    });

    it('should handle high calorie foods with reasonable time requirements', async () => {
      // Arrange - High calorie food
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["walking_brisk"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'cheeseburger-double',
        user: user
      });

      // Assert
      expect(result.dish.calories).toBeGreaterThan(600);
      expect(result.effort.primary.minutes).toBeGreaterThan(60);
      expect(result.effort.primary.minutes).toBeLessThan(300); // Should be reasonable
      
      console.log(`High-calorie scenario: ${result.dish.name} (${result.dish.calories} kcal) = ${result.effort.primary.formattedDuration} of ${result.effort.primary.activityLabel}`);
    });
  });

  describe('Activity Fallback Integration', () => {
    it('should fallback to defaults when preferred activities not available', async () => {
      // Arrange - User with non-existent preferred activities
      const user = UserHealthInfo.create("unspecified" as Sex, 70, 170, ["nonexistent_activity", "another_fake_activity"]);
      
      // Act
      const result = await useCase.execute({
        dishId: 'apple-red',
        user: user
      });

      // Assert - Should use default activities
      expect(result).toBeDefined();
      expect(result.effort.primary.activityLabel).toBeDefined();
      
      console.log(`Fallback scenario: Used ${result.effort.primary.activityLabel} when preferred activities unavailable`);
    });
  });
});