import { Activity } from "../../../src/domain/physiology/Activity";
import { Met } from "../../../src/domain/physiology/Met";

describe('Activity (Pure Domain)', () => {
  
  describe('Creation', () => {
    it('should create activity with valid parameters', () => {
      // Arrange
      const key = 'running_moderate';
      const label = 'Running (Moderate)';
      const met = Met.of(8.0);

      // Act
      const activity = Activity.define(key, label, met);

      // Assert
      expect(activity).toBeInstanceOf(Activity);
      expect(activity.getKey()).toBe(key);
      expect(activity.getLabel()).toBe(label);
      expect(activity.getMET().equals(met)).toBe(true);
    });

    it('should throw error for empty key', () => {
      // Arrange
      const met = Met.of(5.0);

      // Act & Assert
      expect(() => Activity.define('', 'Valid Label', met)).toThrow('Activity key cannot be empty');
      expect(() => Activity.define('   ', 'Valid Label', met)).toThrow('Activity key cannot be empty');
    });

    it('should throw error for empty label', () => {
      // Arrange
      const met = Met.of(5.0);

      // Act & Assert
      expect(() => Activity.define('valid_key', '', met)).toThrow('Activity label cannot be empty');
      expect(() => Activity.define('valid_key', '   ', met)).toThrow('Activity label cannot be empty');
    });

    it('should trim whitespace from key and label', () => {
      // Arrange
      const key = '  running_moderate  ';
      const label = '  Running (Moderate)  ';
      const met = Met.of(8.0);

      // Act
      const activity = Activity.define(key, label, met);

      // Assert
      expect(activity.getKey()).toBe('running_moderate');
      expect(activity.getLabel()).toBe('Running (Moderate)');
    });
  });

  describe('Intensity Methods', () => {
    it('should identify low intensity activities correctly', () => {
      const lowActivity = Activity.define('yoga', 'Yoga', Met.of(2.5));
      const moderateActivity = Activity.define('walking', 'Walking', Met.of(3.5));

      expect(lowActivity.isLowIntensity()).toBe(true);
      expect(lowActivity.isModerateIntensity()).toBe(false);
      expect(lowActivity.isHighIntensity()).toBe(false);

      expect(moderateActivity.isLowIntensity()).toBe(false);
    });

    it('should identify moderate intensity activities correctly', () => {
      const moderateActivity = Activity.define('brisk_walking', 'Brisk Walking', Met.of(4.0));
      const lowActivity = Activity.define('yoga', 'Yoga', Met.of(2.0));
      const highActivity = Activity.define('running', 'Running', Met.of(8.0));

      expect(moderateActivity.isModerateIntensity()).toBe(true);
      expect(moderateActivity.isLowIntensity()).toBe(false);
      expect(moderateActivity.isHighIntensity()).toBe(false);

      expect(lowActivity.isModerateIntensity()).toBe(false);
      expect(highActivity.isModerateIntensity()).toBe(false);
    });

    it('should identify high intensity activities correctly', () => {
      const highActivity = Activity.define('running', 'Running', Met.of(10.0));
      const moderateActivity = Activity.define('walking', 'Walking', Met.of(4.0));

      expect(highActivity.isHighIntensity()).toBe(true);
      expect(highActivity.isLowIntensity()).toBe(false);
      expect(highActivity.isModerateIntensity()).toBe(false);

      expect(moderateActivity.isHighIntensity()).toBe(false);
    });
  });

  describe('Comparison Methods', () => {
    it('should compare activities by intensity correctly', () => {
      const lowActivity = Activity.define('walking', 'Walking', Met.of(3.0));
      const moderateActivity = Activity.define('jogging', 'Jogging', Met.of(7.0));
      const highActivity = Activity.define('running', 'Running', Met.of(11.0));

      expect(moderateActivity.isMoreIntense(lowActivity)).toBe(true);
      expect(highActivity.isMoreIntense(moderateActivity)).toBe(true);
      expect(highActivity.isMoreIntense(lowActivity)).toBe(true);

      expect(lowActivity.isMoreIntense(moderateActivity)).toBe(false);
      expect(moderateActivity.isMoreIntense(highActivity)).toBe(false);
    });

    it('should handle equal intensity comparison', () => {
      const activity1 = Activity.define('cycling1', 'Cycling 1', Met.of(6.0));
      const activity2 = Activity.define('cycling2', 'Cycling 2', Met.of(6.0));

      expect(activity1.isMoreIntense(activity2)).toBe(false);
      expect(activity2.isMoreIntense(activity1)).toBe(false);
    });
  });

  describe('Equality and Comparison', () => {
    it('should consider activities with same key as equal', () => {
      const activity1 = Activity.define('running', 'Running Fast', Met.of(10.0));
      const activity2 = Activity.define('running', 'Running Slow', Met.of(8.0)); // Same key, different properties

      expect(activity1.equals(activity2)).toBe(true);
    });

    it('should consider activities with different keys as not equal', () => {
      const activity1 = Activity.define('running', 'Running', Met.of(8.0));
      const activity2 = Activity.define('jogging', 'Running', Met.of(8.0)); // Same properties, different key

      expect(activity1.equals(activity2)).toBe(false);
    });
  });

  describe('String Representation', () => {
    it('should provide meaningful toString output', () => {
      const activity = Activity.define('cycling_moderate', 'Cycling (Moderate)', Met.of(6.8));
      const stringRepresentation = activity.toString();

      expect(stringRepresentation).toContain('Cycling (Moderate)');
      expect(stringRepresentation).toContain('6.8');
      expect(stringRepresentation).toContain('METs');
    });
  });

  describe('Real-world Activity Examples', () => {
    it('should correctly classify walking activities', () => {
      const casualWalking = Activity.define('walking_casual', 'Casual Walking', Met.of(3.0));
      const briskWalking = Activity.define('walking_brisk', 'Brisk Walking', Met.of(4.5));

      expect(casualWalking.isModerateIntensity()).toBe(true);
      expect(briskWalking.isModerateIntensity()).toBe(true);
      expect(briskWalking.isMoreIntense(casualWalking)).toBe(true);
    });

    it('should correctly classify running activities', () => {
      const jogging = Activity.define('jogging', 'Jogging', Met.of(7.0));
      const fastRunning = Activity.define('running_fast', 'Fast Running', Met.of(12.0));

      expect(jogging.isHighIntensity()).toBe(true);
      expect(fastRunning.isHighIntensity()).toBe(true);
      expect(fastRunning.isMoreIntense(jogging)).toBe(true);
    });

    it('should correctly classify gym activities', () => {
      const yoga = Activity.define('yoga', 'Yoga', Met.of(2.5));
      const weightTraining = Activity.define('weight_training', 'Weight Training', Met.of(6.0));
      const crossfit = Activity.define('crossfit', 'CrossFit', Met.of(8.0));

      expect(yoga.isLowIntensity()).toBe(true);
      expect(weightTraining.isHighIntensity()).toBe(true);
      expect(crossfit.isHighIntensity()).toBe(true);
      
      expect(crossfit.isMoreIntense(weightTraining)).toBe(true);
      expect(weightTraining.isMoreIntense(yoga)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary MET values correctly', () => {
      const lightModeBoundary = Activity.define('boundary1', 'Boundary Activity', Met.of(3.0));
      const modeVigorBoundary = Activity.define('boundary2', 'Boundary Activity', Met.of(6.0));

      expect(lightModeBoundary.isModerateIntensity()).toBe(true);
      expect(lightModeBoundary.isLowIntensity()).toBe(false);

      expect(modeVigorBoundary.isHighIntensity()).toBe(true);
      expect(modeVigorBoundary.isModerateIntensity()).toBe(false);
    });

    it('should handle activities with very high MET values', () => {
      const extremeActivity = Activity.define('extreme_sport', 'Extreme Sport', Met.of(20.0));

      expect(extremeActivity.isHighIntensity()).toBe(true);
      expect(extremeActivity.getMET().toNumber()).toBe(20.0);
    });
  });
});