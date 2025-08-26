import { ACTIVITIES_DATASET } from "../data/activities-dataset"
import { ActivityData, ActivityDataValidation, MET_INTENSITY_RANGES } from "../types/ActivityData"

/**
 * Validate a single activity data entry
 */
export function validateActivityData(activity: ActivityData): ActivityDataValidation {
  const errors: string[] = []

  // Required fields validation
  if (!activity.key || activity.key.trim() === "") {
    errors.push("Key is required and cannot be empty")
  }

  if (!activity.names.en || activity.names.en.trim() === "") {
    errors.push("English name is required")
  }

  if (!activity.names.fr || activity.names.fr.trim() === "") {
    errors.push("French name is required")
  }

  if (!activity.met || activity.met <= 0) {
    errors.push("MET value must be a positive number")
  }

  if (activity.met > 25) {
    errors.push("MET value too high (max 25 METs for realistic activities)")
  }

  // Category validation
  const validCategories = ["cardio", "sports", "dance", "daily", "gym", "water"]
  if (!validCategories.includes(activity.category)) {
    errors.push(
      `Invalid category: ${activity.category}. Must be one of: ${validCategories.join(", ")}`,
    )
  }

  // Intensity validation
  const validIntensities = ["light", "moderate", "vigorous"]
  if (!validIntensities.includes(activity.intensity)) {
    errors.push(
      `Invalid intensity: ${activity.intensity}. Must be one of: ${validIntensities.join(", ")}`,
    )
  }

  // MET-Intensity consistency validation
  if (activity.met && activity.intensity) {
    const expectedRange = MET_INTENSITY_RANGES[activity.intensity]
    if (activity.met < expectedRange.min || activity.met > expectedRange.max) {
      errors.push(
        `MET value ${activity.met} doesn't match intensity "${activity.intensity}" ` +
          `(expected ${expectedRange.min}-${expectedRange.max})`,
      )
    }
  }

  // Key format validation
  if (activity.key && !/^[a-z0-9_]+$/.test(activity.key)) {
    errors.push("Key should contain only lowercase letters, numbers, and underscores")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate the entire activities dataset
 */
export function validateActivitiesDataset(): {
  isValid: boolean
  totalItems: number
  validItems: number
  invalidItems: ActivityData[]
  duplicateKeys: string[]
  errors: Array<{ activityKey: string; errors: string[] }>
} {
  const errors: Array<{ activityKey: string; errors: string[] }> = []
  const invalidItems: ActivityData[] = []
  const seenKeys = new Set<string>()
  const duplicateKeys: string[] = []
  let validItems = 0

  // Check for duplicate keys
  ACTIVITIES_DATASET.forEach((activity) => {
    if (seenKeys.has(activity.key)) {
      duplicateKeys.push(activity.key)
    } else {
      seenKeys.add(activity.key)
    }
  })

  // Validate each activity item
  ACTIVITIES_DATASET.forEach((activity) => {
    const validation = validateActivityData(activity)

    if (!validation.isValid) {
      invalidItems.push(activity)
      errors.push({
        activityKey: activity.key,
        errors: validation.errors,
      })
    } else {
      validItems++
    }
  })

  return {
    isValid: errors.length === 0 && duplicateKeys.length === 0,
    totalItems: ACTIVITIES_DATASET.length,
    validItems,
    invalidItems,
    duplicateKeys,
    errors,
  }
}

/**
 * Validate MET values against known scientific ranges
 */
export function validateMETRanges(): {
  activities: Array<{
    key: string
    met: number
    warning?: string
  }>
  warnings: string[]
} {
  const activities: Array<{ key: string; met: number; warning?: string }> = []
  const warnings: string[] = []

  // Known MET ranges for common activities (from Compendium research)
  const knownRanges: Record<string, { min: number; max: number }> = {
    walking: { min: 2.0, max: 7.0 },
    running: { min: 6.0, max: 18.0 },
    cycling: { min: 3.0, max: 16.0 },
    swimming: { min: 4.0, max: 14.0 },
    weight_training: { min: 3.0, max: 8.0 },
    yoga: { min: 2.0, max: 4.0 },
    dance: { min: 3.0, max: 8.0 },
  }

  ACTIVITIES_DATASET.forEach((activity) => {
    const activityType = activity.key.split("_")[0] // e.g., 'walking' from 'walking_brisk'
    const knownRange = knownRanges[activityType]

    let warning: string | undefined

    if (knownRange) {
      if (activity.met < knownRange.min || activity.met > knownRange.max) {
        warning = `MET ${activity.met} outside typical range for ${activityType} (${knownRange.min}-${knownRange.max})`
      }
    }

    activities.push({
      key: activity.key,
      met: activity.met,
      warning,
    })

    if (warning) {
      warnings.push(`${activity.key}: ${warning}`)
    }
  })

  return { activities, warnings }
}

/**
 * Generate a comprehensive report of the activities dataset validation
 */
export function generateActivitiesDatasetReport(): string {
  const validation = validateActivitiesDataset()
  const metValidation = validateMETRanges()

  let report = `# Activities Dataset Validation Report\n\n`
  report += `**Total Items:** ${validation.totalItems}\n`
  report += `**Valid Items:** ${validation.validItems}\n`
  report += `**Invalid Items:** ${validation.invalidItems.length}\n`
  report += `**Overall Status:** ${validation.isValid ? "✅ VALID" : "❌ INVALID"}\n\n`

  if (validation.duplicateKeys.length > 0) {
    report += `## Duplicate Keys\n`
    validation.duplicateKeys.forEach((key) => {
      report += `- ${key}\n`
    })
    report += `\n`
  }

  if (validation.errors.length > 0) {
    report += `## Validation Errors\n\n`
    validation.errors.forEach(({ activityKey, errors }) => {
      report += `### ${activityKey}\n`
      errors.forEach((error) => {
        report += `- ${error}\n`
      })
      report += `\n`
    })
  }

  // MET validation warnings
  if (metValidation.warnings.length > 0) {
    report += `## MET Value Warnings\n\n`
    metValidation.warnings.forEach((warning) => {
      report += `- ${warning}\n`
    })
    report += `\n`
  }

  // Category breakdown
  const categories = [...new Set(ACTIVITIES_DATASET.map((a) => a.category))]
  report += `## Category Breakdown\n\n`
  categories.forEach((category) => {
    const count = ACTIVITIES_DATASET.filter((a) => a.category === category).length
    const avgMET = (
      ACTIVITIES_DATASET.filter((a) => a.category === category).reduce((sum, a) => sum + a.met, 0) /
      count
    ).toFixed(1)
    report += `- **${category}:** ${count} activities (avg ${avgMET} METs)\n`
  })
  report += `\n`

  // Intensity breakdown
  const intensities = [...new Set(ACTIVITIES_DATASET.map((a) => a.intensity))]
  report += `## Intensity Breakdown\n\n`
  intensities.forEach((intensity) => {
    const count = ACTIVITIES_DATASET.filter((a) => a.intensity === intensity).length
    const avgMET = (
      ACTIVITIES_DATASET.filter((a) => a.intensity === intensity).reduce(
        (sum, a) => sum + a.met,
        0,
      ) / count
    ).toFixed(1)
    report += `- **${intensity}:** ${count} activities (avg ${avgMET} METs)\n`
  })

  // Dataset coverage analysis
  report += `\n## Dataset Coverage Analysis\n\n`

  const metRanges = [
    { name: "Light (1-3 METs)", min: 1, max: 3 },
    { name: "Moderate (3-6 METs)", min: 3, max: 6 },
    { name: "Vigorous (6+ METs)", min: 6, max: 25 },
  ]

  metRanges.forEach((range) => {
    const count = ACTIVITIES_DATASET.filter((a) => a.met >= range.min && a.met < range.max).length
    const percentage = ((count / ACTIVITIES_DATASET.length) * 100).toFixed(1)
    report += `- **${range.name}:** ${count} activities (${percentage}%)\n`
  })

  return report
}

/**
 * Check if activity keys follow naming conventions
 */
export function validateNamingConventions(): {
  consistent: string[]
  inconsistent: Array<{ key: string; issues: string[] }>
} {
  const consistent: string[] = []
  const inconsistent: Array<{ key: string; issues: string[] }> = []

  ACTIVITIES_DATASET.forEach((activity) => {
    const issues: string[] = []

    // Key should be activity_type_modifier format
    const parts = activity.key.split("_")
    if (parts.length < 2) {
      issues.push("Key should have at least two parts separated by underscore")
    }

    // First part should match common activity types
    const commonTypes = ["walking", "running", "cycling", "swimming", "dance", "weight", "yoga"]
    if (
      parts.length >= 2 &&
      !commonTypes.some((type) => parts[0].includes(type) || type.includes(parts[0]))
    ) {
      // This is just a warning, not an error
    }

    if (issues.length > 0) {
      inconsistent.push({ key: activity.key, issues })
    } else {
      consistent.push(activity.key)
    }
  })

  return { consistent, inconsistent }
}
