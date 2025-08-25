import { ActivityCatalog } from "../physiology/ActivityCatalog";
import { Activity } from "../physiology/Activity";
import { EffortPolicy } from "./EffortPolicy";
import { EffortRequest } from "./EffortRequest";
import { EffortBreakdown } from "./EffortBreakdown";
import { EffortItem } from "./EffortBreakdown";

/**
 * Domain service that orchestrates effort calculation for burning food calories
 * 
 * This service combines:
 * - Food calories (from EffortRequest)
 * - User weight and preferences (from EffortRequest)
 * - Available activities (from ActivityCatalog)
 * - Calculation method (from EffortPolicy)
 * 
 * To produce a comprehensive effort breakdown with primary recommendation and alternatives.
 */
export class EffortCalculator {
  constructor(
    private readonly activityCatalog: ActivityCatalog,
    private readonly effortPolicy: EffortPolicy
  ) {}

  /**
   * Calculate effort breakdown for burning calories from consumed food
   * 
   * @param request - Contains dish and user information
   * @returns EffortBreakdown with primary activity and alternatives
   */
  calculateEffort(request: EffortRequest): EffortBreakdown {
    if (!request) {
      throw new Error('EffortRequest is required');
    }

    const calories = request.getCalories();
    const userWeight = request.getUserWeight();

    // Find primary activity based on user preferences
    const primaryActivity = this.findPrimaryActivity(request);
    if (!primaryActivity) {
      throw new Error('No suitable activity found for effort calculation');
    }

    // Calculate effort time for primary activity
    const primaryEffortItem = this.calculateEffortForActivity(
      primaryActivity, 
      calories, 
      userWeight
    );

    // Find alternative activities
    const alternatives = this.findAlternativeActivities(request, primaryActivity);
    const alternativeEffortItems = alternatives.map(activity =>
      this.calculateEffortForActivity(activity, calories, userWeight)
    );

    return EffortBreakdown.compose(primaryEffortItem, alternativeEffortItems);
  }

  /**
   * Calculate effort for multiple scenarios (different users or dishes)
   */
  calculateMultipleEfforts(requests: EffortRequest[]): EffortBreakdown[] {
    return requests.map(request => this.calculateEffort(request));
  }

  /**
   * Find best activity based on user preferences and available activities
   */
  private findPrimaryActivity(request: EffortRequest): Activity | null {
    const preferredKeys = request.getPreferredActivityKeys();
    
    // Try user's preferred activities in order
    for (const activityKey of preferredKeys) {
      const activity = this.activityCatalog.getByKey(activityKey);
      if (activity) {
        return activity;
      }
    }

    // Fallback to primary preferred activity
    const primaryKey = request.getPrimaryActivityKey();
    if (primaryKey) {
      const primaryActivity = this.activityCatalog.getByKey(primaryKey);
      if (primaryActivity) {
        return primaryActivity;
      }
    }

    // Final fallback to default activities
    const defaults = this.activityCatalog.listDefaults();
    return defaults.length > 0 ? defaults[0] : null;
  }

  /**
   * Find alternative activities that complement the primary choice
   */
  private findAlternativeActivities(request: EffortRequest, primaryActivity: Activity): Activity[] {
    const alternatives: Activity[] = [];
    const primaryMET = primaryActivity.getMET().toNumber();
    
    // Get all available activities (if catalog supports it)
    const allActivities = this.activityCatalog.getAll?.() || this.activityCatalog.listDefaults();
    
    // Filter out primary activity and find diverse alternatives
    const candidates = allActivities.filter(activity => 
      activity.getKey() !== primaryActivity.getKey()
    );

    // Strategy 1: Include activities from different intensity levels
    const lowerIntensity = candidates.find(activity => {
      const met = activity.getMET().toNumber();
      return met < primaryMET * 0.7; // Significantly lower intensity
    });
    
    const higherIntensity = candidates.find(activity => {
      const met = activity.getMET().toNumber();
      return met > primaryMET * 1.3; // Significantly higher intensity
    });

    // Strategy 2: Include user's other preferred activities
    const preferredKeys = request.getPreferredActivityKeys();
    const otherPreferred = candidates.filter(activity =>
      preferredKeys.includes(activity.getKey()) && 
      activity.getKey() !== primaryActivity.getKey()
    );

    // Strategy 3: Add popular/default activities if we need more options
    const defaultActivities = this.activityCatalog.listDefaults()
      .filter(activity => 
        activity.getKey() !== primaryActivity.getKey() &&
        !alternatives.some(alt => alt.getKey() === activity.getKey())
      );

    // Collect alternatives with priority
    if (lowerIntensity) alternatives.push(lowerIntensity);
    if (higherIntensity) alternatives.push(higherIntensity);
    
    // Add other preferred activities
    otherPreferred.slice(0, 2).forEach(activity => {
      if (!alternatives.some(alt => alt.getKey() === activity.getKey())) {
        alternatives.push(activity);
      }
    });

    // Add defaults to reach target of 3-5 alternatives
    defaultActivities.slice(0, 5 - alternatives.length).forEach(activity => {
      if (!alternatives.some(alt => alt.getKey() === activity.getKey())) {
        alternatives.push(activity);
      }
    });

    return alternatives.slice(0, 5); // Limit to 5 alternatives max
  }

  /**
   * Calculate effort time for a specific activity
   */
  private calculateEffortForActivity(
    activity: Activity, 
    calories: number, 
    userWeight: number
  ): EffortItem {
    const activityMET = activity.getMET().toNumber();
    const minutes = this.effortPolicy.minutesToBurn(calories, userWeight, activityMET);

    return EffortItem.of(
      activity.getKey(),
      activity.getLabel(),
      minutes,
      activityMET
    );
  }

  /**
   * Get the effort policy being used
   */
  getEffortPolicy(): EffortPolicy {
    return this.effortPolicy;
  }

  /**
   * Calculate effort with different policy (useful for comparisons)
   */
  calculateEffortWithPolicy(request: EffortRequest, policy: EffortPolicy): EffortBreakdown {
    const temporaryCalculator = new EffortCalculator(this.activityCatalog, policy);
    return temporaryCalculator.calculateEffort(request);
  }

  /**
   * Get quick recommendations for time-constrained scenarios
   * Returns activities that can burn the calories in under 30 minutes
   */
  getQuickRecommendations(request: EffortRequest): EffortBreakdown | null {
    const calories = request.getCalories();
    const userWeight = request.getUserWeight();

    // Find high-intensity activities (>6 METs) that could work quickly
    const highIntensityActivities = this.activityCatalog.getByIntensity?.('vigorous') || [];
    
    if (highIntensityActivities.length === 0) {
      return null;
    }

    // Calculate effort for each high-intensity activity
    const quickOptions: EffortItem[] = highIntensityActivities
      .map(activity => this.calculateEffortForActivity(activity, calories, userWeight))
      .filter(effortItem => effortItem.getMinutes() <= 30)
      .sort((a, b) => a.getMinutes() - b.getMinutes()); // Shortest first

    if (quickOptions.length === 0) {
      return null;
    }

    // Return breakdown with quickest as primary and others as alternatives
    const [primary, ...alternatives] = quickOptions;
    return EffortBreakdown.compose(primary, alternatives);
  }

  /**
   * Get endurance recommendations for users who prefer longer, less intense activities
   * Returns activities that take 45+ minutes but are more comfortable
   */
  getEnduranceRecommendations(request: EffortRequest): EffortBreakdown | null {
    const calories = request.getCalories();
    const userWeight = request.getUserWeight();

    // Find moderate intensity activities (3-6 METs)
    const moderateActivities = this.activityCatalog.getByIntensity?.('moderate') || [];
    
    if (moderateActivities.length === 0) {
      return null;
    }

    // Calculate effort and filter for longer duration options
    const enduranceOptions: EffortItem[] = moderateActivities
      .map(activity => this.calculateEffortForActivity(activity, calories, userWeight))
      .filter(effortItem => effortItem.getMinutes() >= 45)
      .sort((a, b) => a.getMinutes() - b.getMinutes()); // Shorter duration first within endurance range

    if (enduranceOptions.length === 0) {
      return null;
    }

    const [primary, ...alternatives] = enduranceOptions;
    return EffortBreakdown.compose(primary, alternatives);
  }

  /**
   * Calculate comparative effort breakdown showing same food burned via different activity types
   * Useful for educational purposes ("see how activity intensity affects time needed")
   */
  getComparativeBreakdown(request: EffortRequest): {
    light: EffortItem | null;
    moderate: EffortItem | null;
    vigorous: EffortItem | null;
  } {
    const calories = request.getCalories();
    const userWeight = request.getUserWeight();

    const lightActivities = this.activityCatalog.getByIntensity?.('light') || [];
    const moderateActivities = this.activityCatalog.getByIntensity?.('moderate') || [];
    const vigorousActivities = this.activityCatalog.getByIntensity?.('vigorous') || [];

    return {
      light: lightActivities.length > 0 ? 
        this.calculateEffortForActivity(lightActivities[0], calories, userWeight) : null,
      moderate: moderateActivities.length > 0 ? 
        this.calculateEffortForActivity(moderateActivities[0], calories, userWeight) : null,
      vigorous: vigorousActivities.length > 0 ? 
        this.calculateEffortForActivity(vigorousActivities[0], calories, userWeight) : null,
    };
  }
}