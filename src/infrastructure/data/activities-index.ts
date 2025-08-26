/**
 * Activities infrastructure data layer exports
 * Centralized access to activities datasets and utilities
 */

import { ACTIVITIES_DATASET } from "./activities-dataset"

// Main dataset export
export {
  ACTIVITIES_DATASET,
  getActivityCount,
  getActivitiesByCategory,
  getActivityByKey,
  searchActivitiesByName,
  getActivitiesByIntensity,
  getActivitiesByMETRange,
} from "./activities-dataset"

// Type exports
export type {
  ActivityData,
  ActivityCategory,
  ActivityIntensity,
  ActivityNames,
  ActivityDescription,
  ActivityDataValidation,
} from "../types/ActivityData"

export { MET_INTENSITY_RANGES, getIntensityFromMET } from "../types/ActivityData"

// Validation utilities
export {
  validateActivityData,
  validateActivitiesDataset,
  validateMETRanges,
  generateActivitiesDatasetReport,
  validateNamingConventions,
} from "../utils/validateActivitiesDataset"

/**
 * Quick stats about the activities dataset
 */
export const ACTIVITIES_DATASET_STATS = {
  get totalActivities() {
    return ACTIVITIES_DATASET.length
  },
  get categories() {
    return [...new Set(ACTIVITIES_DATASET.map((a) => a.category))]
  },
  get averageMET() {
    return Number(
      (ACTIVITIES_DATASET.reduce((sum, a) => sum + a.met, 0) / ACTIVITIES_DATASET.length).toFixed(
        1,
      ),
    )
  },
  get intensityDistribution() {
    return ACTIVITIES_DATASET.reduce(
      (dist, activity) => {
        dist[activity.intensity]++
        return dist
      },
      { light: 0, moderate: 0, vigorous: 0 } as Record<string, number>,
    )
  },
} as const
