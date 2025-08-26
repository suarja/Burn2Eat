#!/usr/bin/env ts-node

/**
 * Activities dataset validation script
 * Run with: npx ts-node scripts/validate-activities-dataset.ts
 */

import { ACTIVITIES_DATASET } from "../src/infrastructure/data/activities-dataset"
import {
  validateActivitiesDataset,
  generateActivitiesDatasetReport,
  validateMETRanges,
  validateNamingConventions,
} from "../src/infrastructure/utils/validateActivitiesDataset"

async function main() {
  console.log("🏃‍♂️ Burn2Eat Activities Dataset Validation\n")

  // Basic validation report
  console.log("📊 VALIDATION REPORT")
  console.log("==================")
  const report = generateActivitiesDatasetReport()
  console.log(report)

  // MET values validation
  console.log("⚡ MET VALUES VALIDATION")
  console.log("=======================")
  const metValidation = validateMETRanges()

  if (metValidation.warnings.length === 0) {
    console.log("✅ All MET values are within expected ranges")
  } else {
    console.log("⚠️  MET Value Warnings:")
    metValidation.warnings.forEach((warning: string) => {
      console.log(`  - ${warning}`)
    })
  }
  console.log("")

  // Naming conventions
  console.log("📝 NAMING CONVENTIONS")
  console.log("====================")
  const namingValidation = validateNamingConventions()
  console.log(`✅ Consistent naming: ${namingValidation.consistent.length} activities`)

  if (namingValidation.inconsistent.length > 0) {
    console.log(`⚠️  Naming issues: ${namingValidation.inconsistent.length} activities`)
    namingValidation.inconsistent.forEach(({ key, issues }: { key: string; issues: string[] }) => {
      console.log(`  - ${key}: ${issues.join(", ")}`)
    })
  }
  console.log("")

  // Dataset coverage analysis
  console.log("📈 COVERAGE ANALYSIS")
  console.log("===================")

  const intensityStats = ACTIVITIES_DATASET.reduce(
    (stats, activity) => {
      stats[activity.intensity]++
      return stats
    },
    { light: 0, moderate: 0, vigorous: 0 } as Record<string, number>,
  )

  console.log("Intensity Distribution:")
  Object.entries(intensityStats).forEach(([intensity, count]) => {
    const percentage = ((count / ACTIVITIES_DATASET.length) * 100).toFixed(1)
    console.log(`  - ${intensity}: ${count} activities (${percentage}%)`)
  })
  console.log("")

  const categoryStats: Record<string, number> = {}
  ACTIVITIES_DATASET.forEach((activity) => {
    categoryStats[activity.category] = (categoryStats[activity.category] || 0) + 1
  })

  console.log("Category Distribution:")
  Object.entries(categoryStats).forEach(([category, count]) => {
    const percentage = ((count / ACTIVITIES_DATASET.length) * 100).toFixed(1)
    console.log(`  - ${category}: ${count} activities (${percentage}%)`)
  })
  console.log("")

  // MET range analysis
  console.log("🎯 MET RANGE ANALYSIS")
  console.log("====================")

  const metRanges = [
    { name: "Very Light (1-2 METs)", min: 1, max: 2 },
    { name: "Light (2-3 METs)", min: 2, max: 3 },
    { name: "Moderate (3-6 METs)", min: 3, max: 6 },
    { name: "Vigorous (6-9 METs)", min: 6, max: 9 },
    { name: "Very Vigorous (9+ METs)", min: 9, max: 25 },
  ]

  metRanges.forEach((range) => {
    const count = ACTIVITIES_DATASET.filter((a) => a.met >= range.min && a.met < range.max).length
    const percentage = ((count / ACTIVITIES_DATASET.length) * 100).toFixed(1)
    console.log(`${range.name}: ${count} activities (${percentage}%)`)
  })
  console.log("")

  // Popular activities showcase
  console.log("🔥 POPULAR ACTIVITIES SHOWCASE")
  console.log("=============================")

  const showcaseActivities = [
    "walking_brisk",
    "jogging_general",
    "running_6mph",
    "cycling_moderate",
    "swimming_moderate",
    "crossfit",
  ]

  showcaseActivities.forEach((key) => {
    const activity = ACTIVITIES_DATASET.find((a) => a.key === key)
    if (activity) {
      console.log(`${activity.names.en}: ${activity.met} METs (${activity.intensity})`)
    }
  })
  console.log("")

  // Final validation status
  const validation = validateActivitiesDataset()
  console.log("✨ FINAL VALIDATION RESULT")
  console.log("=========================")
  console.log(`Status: ${validation.isValid ? "✅ VALID" : "❌ INVALID"}`)
  console.log(`Total Activities: ${validation.totalItems}`)
  console.log(`Valid Activities: ${validation.validItems}`)

  if (!validation.isValid) {
    console.log(`❌ Issues found: ${validation.errors.length} validation errors`)
    if (validation.duplicateKeys.length > 0) {
      console.log(`❌ Duplicate keys: ${validation.duplicateKeys.join(", ")}`)
    }
  } else {
    console.log("🎉 All activities passed validation!")
  }
}

main().catch(console.error)
