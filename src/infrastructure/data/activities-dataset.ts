// Import activities from separate category files
import { CARDIO_ACTIVITIES } from "./activities-cardio"
import { DAILY_ACTIVITIES } from "./activities-daily"
import { DANCE_ACTIVITIES } from "./activities-dance"
import { GYM_ACTIVITIES } from "./activities-gym"
import { SPORTS_ACTIVITIES } from "./activities-sports"
import { WATER_ACTIVITIES } from "./activities-water"
import { ActivityData } from "../types/ActivityData"

/**
 * Complete static physical activities dataset with official MET values
 * Based on 2011 Compendium of Physical Activities
 * All MET values are from published research or official compendium
 *
 * Activities are organized by category in separate files for better maintainability:
 * - activities-cardio.ts: Walking, running, cycling, cardio machines
 * - activities-water.ts: Swimming and water-based activities
 * - activities-sports.ts: Team sports and competitive activities
 * - activities-dance.ts: Dance and rhythmic movement
 * - activities-gym.ts: Gym, strength training, yoga, fitness classes
 * - activities-daily.ts: Daily life and household activities
 *
 * See ACTIVITIES_MANAGEMENT.md for detailed documentation on adding new activities
 */
export const ACTIVITIES_DATASET: ActivityData[] = [
  ...CARDIO_ACTIVITIES,
  ...WATER_ACTIVITIES,
  ...SPORTS_ACTIVITIES,
  ...DANCE_ACTIVITIES,
  ...GYM_ACTIVITIES,
  ...DAILY_ACTIVITIES,
]

/**
 * Get total number of activities in dataset
 */
export const getActivityCount = (): number => ACTIVITIES_DATASET.length

/**
 * Get activities by category
 */
export const getActivitiesByCategory = (category: string): ActivityData[] => {
  return ACTIVITIES_DATASET.filter((activity) => activity.category === category)
}

/**
 * Get activity by key
 */
export const getActivityByKey = (key: string): ActivityData | undefined => {
  return ACTIVITIES_DATASET.find((activity) => activity.key === key)
}

/**
 * Search activities by name (English or French)
 */
export const searchActivitiesByName = (query: string): ActivityData[] => {
  const lowerQuery = query.toLowerCase()
  return ACTIVITIES_DATASET.filter(
    (activity) =>
      activity.names.fr.toLowerCase().includes(lowerQuery) ||
      activity.names.en.toLowerCase().includes(lowerQuery) ||
      activity.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  )
}

/**
 * Get activities by intensity level
 */
export const getActivitiesByIntensity = (intensity: string): ActivityData[] => {
  return ACTIVITIES_DATASET.filter((activity) => activity.intensity === intensity)
}

/**
 * Get activities within MET range
 */
export const getActivitiesByMETRange = (minMET: number, maxMET: number): ActivityData[] => {
  return ACTIVITIES_DATASET.filter((activity) => activity.met >= minMET && activity.met <= maxMET)
}
