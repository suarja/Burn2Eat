import { Minutes } from "../common/UnitTypes";

/**
 * Domain value object representing effort time for a specific activity
 */
export class EffortItem {
  private constructor(
    public readonly activityKey: string,
    public readonly activityLabel: string,
    public readonly minutes: Minutes,
    public readonly metValue: number
  ) {}

  /**
   * Create an effort item
   */
  static of(activityKey: string, activityLabel: string, minutes: Minutes, metValue: number): EffortItem {
    if (!activityKey || activityKey.trim() === '') {
      throw new Error('Activity key cannot be empty');
    }
    if (!activityLabel || activityLabel.trim() === '') {
      throw new Error('Activity label cannot be empty');
    }
    if (minutes <= 0) {
      throw new Error('Minutes must be positive');
    }
    if (metValue <= 0) {
      throw new Error('MET value must be positive');
    }

    return new EffortItem(activityKey.trim(), activityLabel.trim(), minutes, metValue);
  }

  /**
   * Get effort time in minutes
   */
  getMinutes(): Minutes {
    return this.minutes;
  }

  /**
   * Get activity key
   */
  getActivityKey(): string {
    return this.activityKey;
  }

  /**
   * Get human-readable activity label
   */
  getActivityLabel(): string {
    return this.activityLabel;
  }

  /**
   * Get MET value for this activity
   */
  getMETValue(): number {
    return this.metValue;
  }

  /**
   * Check if this is a long duration activity (>60 minutes)
   */
  isLongDuration(): boolean {
    return this.minutes > 60;
  }

  /**
   * Check if this is a short duration activity (<15 minutes)
   */
  isShortDuration(): boolean {
    return this.minutes < 15;
  }

  /**
   * Get effort level description
   */
  getEffortDescription(): string {
    if (this.minutes < 10) return 'Quick';
    if (this.minutes < 30) return 'Moderate';
    if (this.minutes < 60) return 'Substantial';
    return 'Extended';
  }

  /**
   * Format duration as human-readable string
   */
  getFormattedDuration(): string {
    if (this.minutes < 60) {
      return `${this.minutes} min`;
    }
    
    const hours = Math.floor(this.minutes / 60);
    const remainingMinutes = this.minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.activityLabel}: ${this.getFormattedDuration()} (${this.metValue} METs)`;
  }

  /**
   * Equality comparison
   */
  equals(other: EffortItem): boolean {
    return this.activityKey === other.activityKey && 
           this.minutes === other.minutes;
  }
}

/**
 * Domain value object representing the complete effort breakdown for burning calories
 * Contains primary activity recommendation plus alternatives
 */
export class EffortBreakdown {
  private constructor(
    public readonly primary: EffortItem,
    public readonly alternatives: EffortItem[]
  ) {}

  /**
   * Create effort breakdown with primary activity and alternatives
   */
  static compose(primary: EffortItem, alternatives: EffortItem[]): EffortBreakdown {
    if (!primary) {
      throw new Error('Primary effort item is required');
    }
    if (!alternatives) {
      throw new Error('Alternatives array is required (can be empty)');
    }

    // Ensure alternatives don't include the primary activity
    const filteredAlternatives = alternatives.filter(alt => 
      alt.getActivityKey() !== primary.getActivityKey()
    );

    return new EffortBreakdown(primary, filteredAlternatives);
  }

  /**
   * Create breakdown with only primary activity (no alternatives)
   */
  static primaryOnly(primary: EffortItem): EffortBreakdown {
    return new EffortBreakdown(primary, []);
  }

  /**
   * Get the primary recommended activity
   */
  getPrimary(): EffortItem {
    return this.primary;
  }

  /**
   * Get alternative activities
   */
  getAlternatives(): EffortItem[] {
    return [...this.alternatives]; // Return copy to prevent mutation
  }

  /**
   * Get all activities (primary + alternatives)
   */
  getAllActivities(): EffortItem[] {
    return [this.primary, ...this.alternatives];
  }

  /**
   * Check if alternatives are available
   */
  hasAlternatives(): boolean {
    return this.alternatives.length > 0;
  }

  /**
   * Get number of alternative activities
   */
  getAlternativeCount(): number {
    return this.alternatives.length;
  }

  /**
   * Find the quickest activity (least time required)
   */
  getQuickestActivity(): EffortItem {
    const allActivities = this.getAllActivities();
    return allActivities.reduce((quickest, current) => 
      current.getMinutes() < quickest.getMinutes() ? current : quickest
    );
  }

  /**
   * Find the longest activity (most time required)
   */
  getLongestActivity(): EffortItem {
    const allActivities = this.getAllActivities();
    return allActivities.reduce((longest, current) => 
      current.getMinutes() > longest.getMinutes() ? current : longest
    );
  }

  /**
   * Get activities sorted by duration (shortest first)
   */
  getActivitiesByDuration(): EffortItem[] {
    return this.getAllActivities().sort((a, b) => a.getMinutes() - b.getMinutes());
  }

  /**
   * Get activities sorted by MET value (highest intensity first)
   */
  getActivitiesByIntensity(): EffortItem[] {
    return this.getAllActivities().sort((a, b) => b.getMETValue() - a.getMETValue());
  }

  /**
   * Filter activities by duration range
   */
  getActivitiesInDurationRange(minMinutes: number, maxMinutes: number): EffortItem[] {
    return this.getAllActivities().filter(activity => 
      activity.getMinutes() >= minMinutes && activity.getMinutes() <= maxMinutes
    );
  }

  /**
   * Get short duration activities (<30 minutes)
   */
  getShortDurationActivities(): EffortItem[] {
    return this.getAllActivities().filter(activity => activity.getMinutes() < 30);
  }

  /**
   * Check if any activities are feasible for a quick workout (<20 minutes)
   */
  hasQuickOptions(): boolean {
    return this.getAllActivities().some(activity => activity.getMinutes() < 20);
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    totalOptions: number;
    quickestTime: Minutes;
    longestTime: Minutes;
    averageTime: Minutes;
    primaryActivity: string;
  } {
    const allActivities = this.getAllActivities();
    const times = allActivities.map(a => a.getMinutes());
    
    return {
      totalOptions: allActivities.length,
      quickestTime: Math.min(...times) as Minutes,
      longestTime: Math.max(...times) as Minutes,
      averageTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) as Minutes,
      primaryActivity: this.primary.getActivityLabel()
    };
  }

  /**
   * Add more alternatives to existing breakdown
   */
  withAdditionalAlternatives(newAlternatives: EffortItem[]): EffortBreakdown {
    const combinedAlternatives = [...this.alternatives, ...newAlternatives]
      .filter(alt => alt.getActivityKey() !== this.primary.getActivityKey()) // Remove primary duplicates
      .filter((alt, index, array) => // Remove alternative duplicates
        array.findIndex(a => a.getActivityKey() === alt.getActivityKey()) === index
      );

    return new EffortBreakdown(this.primary, combinedAlternatives);
  }

  /**
   * String representation
   */
  toString(): string {
    const summary = this.getSummary();
    return `EffortBreakdown(Primary: ${this.primary.toString()}, ` +
           `${summary.totalOptions - 1} alternatives, ` +
           `Range: ${summary.quickestTime}-${summary.longestTime} min)`;
  }
}