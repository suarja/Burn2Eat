/**
 * Type definitions for physical activity dataset infrastructure
 */

export type ActivityCategory = 'cardio' | 'sports' | 'dance' | 'daily' | 'gym' | 'water';

export type ActivityIntensity = 'light' | 'moderate' | 'vigorous';

export interface ActivityNames {
  en: string;
  fr: string;
}

export interface ActivityDescription {
  en?: string;
  fr?: string;
}

/**
 * Core activity data structure for the static dataset
 * Contains all information needed for physiology domain
 */
export interface ActivityData {
  /** Unique key identifier for the activity */
  key: string;
  
  /** Localized names */
  names: ActivityNames;
  
  /** MET value from Compendium of Physical Activities */
  met: number;
  
  /** Activity category for organization */
  category: ActivityCategory;
  
  /** Exercise intensity level based on MET value */
  intensity: ActivityIntensity;
  
  /** Optional Compendium activity code for reference */
  compendiumCode?: string;
  
  /** Optional localized descriptions */
  description?: ActivityDescription;
  
  /** Tags for search functionality */
  tags?: string[];
  
  /** Optional icon name for UI */
  iconName?: string;
  
  /** Equipment needed (if any) */
  equipment?: string[];
}

/**
 * Validation result for activity data
 */
export interface ActivityDataValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * Helper type for MET ranges based on intensity
 */
export const MET_INTENSITY_RANGES = {
  light: { min: 1.0, max: 2.9 },
  moderate: { min: 3.0, max: 5.9 },
  vigorous: { min: 6.0, max: 20.0 }
} as const;

/**
 * Helper function to determine intensity from MET value
 */
export function getIntensityFromMET(met: number): ActivityIntensity {
  if (met < 3.0) return 'light';
  if (met < 6.0) return 'moderate';
  return 'vigorous';
}