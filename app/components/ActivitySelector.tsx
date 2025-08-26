import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Text } from "./Text"

export interface Activity {
  key: string
  name: string
  emoji: string
  met: number
  category: "light" | "moderate" | "vigorous"
}

export interface ActivitySelectorProps {
  /**
   * Currently selected activity key
   */
  selectedActivity: string | null
  /**
   * Callback when activity is selected
   */
  onActivitySelect: (activityKey: string) => void
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean
}

// Mock activities data - later from StaticActivityCatalog
const ACTIVITIES: Activity[] = [
  // Light activities (1-3 MET)
  { key: "walking_slow", name: "Marche lente", emoji: "🚶‍♀️", met: 2.5, category: "light" },
  { key: "yoga", name: "Yoga", emoji: "🧘‍♀️", met: 2.5, category: "light" },

  // Moderate activities (3-6 MET)
  { key: "walking_brisk", name: "Marche rapide", emoji: "🚶‍♂️", met: 3.5, category: "moderate" },
  { key: "dancing", name: "Danse", emoji: "💃", met: 4.0, category: "moderate" },
  { key: "cycling_leisure", name: "Vélo loisir", emoji: "🚴‍♀️", met: 5.8, category: "moderate" },

  // Vigorous activities (6+ MET)
  { key: "jogging", name: "Course", emoji: "🏃‍♂️", met: 7.0, category: "vigorous" },
  { key: "swimming", name: "Natation", emoji: "🏊‍♀️", met: 8.0, category: "vigorous" },
  { key: "crossfit", name: "CrossFit", emoji: "💪", met: 10.0, category: "vigorous" },
]

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivity,
  onActivitySelect,
  style,
  disabled = false,
}) => {
  const { themed } = useAppTheme()

  // Group activities by category
  const lightActivities = ACTIVITIES.filter((a) => a.category === "light")
  const moderateActivities = ACTIVITIES.filter((a) => a.category === "moderate")
  const vigorousActivities = ACTIVITIES.filter((a) => a.category === "vigorous")

  const renderActivityGroup = (title: string, activities: Activity[]) => (
    <View key={title} style={themed($categorySection)}>
      <Text preset="formLabel" style={themed($categoryTitle)}>
        {title}
      </Text>
      <View style={themed($activitiesGrid)}>
        {activities.map((activity) => {
          const isSelected = selectedActivity === activity.key
          return (
            <Button
              key={activity.key}
              preset={isSelected ? "filled" : "default"}
              style={themed([$activityButton, isSelected && $selectedActivityButton])}
              disabled={disabled}
              onPress={() => onActivitySelect(activity.key)}
            >
              {activity.emoji} {activity.name}
            </Button>
          )
        })}
      </View>
    </View>
  )

  return (
    <View style={[themed($container), style]}>
      <Text preset="formLabel" style={themed($sectionLabel)}>
        Activité préférée:
      </Text>

      <View style={themed($selectorCard)}>
        {renderActivityGroup("Intensité faible (1-3 MET)", lightActivities)}
        {renderActivityGroup("Intensité modérée (3-6 MET)", moderateActivities)}
        {renderActivityGroup("Intensité élevée (6+ MET)", vigorousActivities)}
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.md,
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $selectorCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral200,
  padding: spacing.md,
})

const $categorySection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $categoryTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: spacing.sm,
})

const $activitiesGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.xs,
})

const $activityButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 0,
  minWidth: "45%",
  marginBottom: spacing.sm,
  marginRight: spacing.sm,
})

const $selectedActivityButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})

const $activityButtonContent: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
})

const $activityButtonText: ThemedStyle<ViewStyle> = ({}) => ({
  // Base text style handled by individual text components
})

const $selectedActivityButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $activityEmoji: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 20,
  marginBottom: spacing.xxxs,
})

const $activityName: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xxxs,
})

const $selectedActivityName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $activityMet: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 10,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
})

const $selectedActivityMet: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  opacity: 0.8,
})
