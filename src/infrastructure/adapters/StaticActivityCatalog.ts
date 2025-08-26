import { Activity } from "../../domain/physiology/Activity"
import { ActivityCatalog } from "../../domain/physiology/ActivityCatalog"
import { Met } from "../../domain/physiology/Met"
import {
  ACTIVITIES_DATASET,
  getActivityByKey,
  getActivitiesByCategory,
  searchActivitiesByName,
  getActivitiesByIntensity,
  getActivitiesByMETRange,
} from "../data/activities-dataset"
import { ActivityData } from "../types/ActivityData"

/**
 * Infrastructure adapter that implements ActivityCatalog using static activities dataset
 * Translates between infrastructure ActivityData and domain Activity entities
 */
export class StaticActivityCatalog implements ActivityCatalog {
  getByKey(key: string): Activity | null {
    const activityData = getActivityByKey(key)

    if (!activityData) {
      return null
    }

    return this.toDomainActivity(activityData)
  }

  listDefaults(): Activity[] {
    // Return popular/recommended activities for onboarding
    const defaultKeys = [
      "walking_brisk",
      "jogging_general",
      "cycling_moderate",
      "swimming_leisurely",
      "weight_training_general",
      "yoga_hatha",
      "dance_aerobic",
      "stair_climbing",
    ]

    const defaultActivities = defaultKeys
      .map((key) => getActivityByKey(key))
      .filter((activity) => activity !== undefined)
      .map((activity) => this.toDomainActivity(activity!))

    return defaultActivities
  }

  search(query: string): Activity[] {
    const activityDataList = searchActivitiesByName(query)
    return activityDataList.map((activityData) => this.toDomainActivity(activityData))
  }

  getByIntensity(intensity: "light" | "moderate" | "vigorous"): Activity[] {
    const activityDataList = getActivitiesByIntensity(intensity)
    return activityDataList.map((activityData) => this.toDomainActivity(activityData))
  }

  getByMETRange(minMET: number, maxMET: number): Activity[] {
    const activityDataList = getActivitiesByMETRange(minMET, maxMET)
    return activityDataList.map((activityData) => this.toDomainActivity(activityData))
  }

  getAll(): Activity[] {
    return ACTIVITIES_DATASET.map((activityData) => this.toDomainActivity(activityData))
  }

  /**
   * Get activities by category (infrastructure-specific method)
   */
  getByCategory(category: string): Activity[] {
    const activityDataList = getActivitiesByCategory(category)
    return activityDataList.map((activityData) => this.toDomainActivity(activityData))
  }

  /**
   * Private method to convert infrastructure ActivityData to domain Activity
   * This is where the translation happens between layers
   */
  private toDomainActivity(activityData: ActivityData): Activity {
    const met = Met.of(activityData.met)

    // Use English name as the label (could be made configurable for i18n)
    const label = activityData.names.fr

    return Activity.define(activityData.key, label, met)
  }

  /**
   * Helper method to get available categories
   * Useful for UI category filters
   */
  getAvailableCategories(): string[] {
    const categories = [...new Set(ACTIVITIES_DATASET.map((activity) => activity.category))]
    return categories
  }

  /**
   * Helper method to get dataset statistics
   * Useful for analytics or admin interfaces
   */
  getDatasetInfo(): {
    totalActivities: number
    categories: string[]
    averageMET: number
    intensityDistribution: {
      light: number
      moderate: number
      vigorous: number
    }
  } {
    const totalActivities = ACTIVITIES_DATASET.length
    const categories = this.getAvailableCategories()
    const averageMET = Number(
      (
        ACTIVITIES_DATASET.reduce((sum, activity) => sum + activity.met, 0) / totalActivities
      ).toFixed(1),
    )

    const intensityDistribution = ACTIVITIES_DATASET.reduce(
      (dist, activity) => {
        if (activity.intensity === "light") dist.light++
        else if (activity.intensity === "moderate") dist.moderate++
        else dist.vigorous++
        return dist
      },
      { light: 0, moderate: 0, vigorous: 0 },
    )

    return {
      totalActivities,
      categories,
      averageMET,
      intensityDistribution,
    }
  }

  /**
   * Get activities suitable for beginners (light to moderate intensity)
   */
  getBeginnerFriendly(): Activity[] {
    return this.getByMETRange(1.0, 5.0)
  }

  /**
   * Get activities for advanced users (moderate to vigorous intensity)
   */
  getAdvancedActivities(): Activity[] {
    return this.getByMETRange(5.0, 20.0)
  }

  /**
   * Get similar activities to a given activity (same category, similar MET)
   */
  getSimilarActivities(activityKey: string): Activity[] {
    const originalData = getActivityByKey(activityKey)

    if (!originalData) {
      return []
    }

    // Find activities in same category with similar MET values (±1 MET)
    const similarData = ACTIVITIES_DATASET.filter(
      (activity) =>
        activity.key !== activityKey &&
        activity.category === originalData.category &&
        Math.abs(activity.met - originalData.met) <= 1.0,
    )

    return similarData.map((activityData) => this.toDomainActivity(activityData))
  }
}
