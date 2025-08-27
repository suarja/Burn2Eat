import React, { useRef, useEffect } from "react"
import { View, ViewStyle, TextStyle, ScrollView } from "react-native"

import { useActivityCatalog } from "@/hooks/useActivityCatalog"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

const ITEM_HEIGHT = 60

export interface ActivityOption {
  key: string
  name: string
  met: number
}

export interface ActivityWheelPickerProps {
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
   * Whether the picker is disabled
   */
  disabled?: boolean
  /**
   * Height of the wheel picker
   */
  height?: number
}

/**
 * Internal ActivityWheel component for scrollable activity selection
 */
interface ActivityWheelProps {
  activities: ActivityOption[]
  selectedIndex: number
  onChange: (index: number) => void
  disabled?: boolean
  height?: number
  style?: ViewStyle
}

const ActivityWheel: React.FC<ActivityWheelProps> = ({
  activities,
  selectedIndex,
  onChange,
  disabled = false,
  height = 150,
  style,
}) => {
  const { themed } = useAppTheme()
  const scrollViewRef = useRef<ScrollView>(null)

  // Add padding items for centering
  const paddingCount = Math.floor(height / ITEM_HEIGHT / 2)
  const displayActivities = [
    ...Array(paddingCount).fill(null),
    ...activities,
    ...Array(paddingCount).fill(null),
  ]

  // Handle scroll and snap to activity
  const handleScroll = (event: any) => {
    if (disabled) return

    const offsetY = event.nativeEvent.contentOffset.y
    const index = Math.round(offsetY / ITEM_HEIGHT)
    const actualIndex = index - paddingCount

    console.log(
      `🎯 ActivityWheel SCROLL: offsetY=${offsetY}, index=${index}, actualIndex=${actualIndex}`,
    )

    if (actualIndex >= 0 && actualIndex < activities.length) {
      console.log(
        `🎯 ActivityWheel SCROLL: Selecting activity ${activities[actualIndex].name} at index ${actualIndex}`,
      )
      if (actualIndex !== selectedIndex) {
        onChange(actualIndex)
      }
    }
  }

  // Scroll to selected activity on mount or selection change
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < activities.length) {
      const targetOffset = (selectedIndex + paddingCount) * ITEM_HEIGHT
      console.log(
        `🎯 ActivityWheel SCROLL TO: selectedIndex=${selectedIndex}, targetOffset=${targetOffset}`,
      )
      scrollViewRef.current?.scrollTo({
        y: targetOffset,
        animated: false,
      })
    }
  }, [selectedIndex, paddingCount])

  return (
    <View style={[themed($wheelContainer), { height }, style]}>
      <ScrollView
        ref={scrollViewRef}
        style={themed($scrollView)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        scrollEnabled={!disabled}
        bounces={false}
        overScrollMode="never"
      >
        {displayActivities.map((activity, index) => {
          const isSelected =
            activity && activities[selectedIndex] && activity.key === activities[selectedIndex].key
          const isVisible = activity !== null

          return (
            <View key={index} style={themed($itemContainer)}>
              {isVisible && (
                <View style={themed($activityItem)}>
      
                  <Text
                    style={themed([
                      $activityText,
                      isSelected && $selectedActivityText,
                      disabled && $disabledText,
                    ])}
                  >
                    {activity.name}
                  </Text>
      
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export const ActivityWheelPicker: React.FC<ActivityWheelPickerProps> = ({
  selectedActivity,
  onActivitySelect,
  style,
  disabled = false,
  height = 250,
}) => {
  const { themed } = useAppTheme()

  const {
    data: { catalog },
  } = useActivityCatalog()

  // Find current activity index
  const currentActivityIndex = selectedActivity
    ? catalog?.findIndex((activity) => activity.key === selectedActivity)
    : catalog?.findIndex((activity) => activity.key === "jogging") // Default to jogging

  const validIndex = currentActivityIndex >= 0 ? currentActivityIndex : 0

  // Handle activity change - WheelPicker expects numeric values
  const handleActivityChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < catalog.length) {
      const selectedActivityData = catalog[newIndex]
      console.log(
        `🎯 ActivityWheelPicker: Activity changed to ${selectedActivityData.name} (${selectedActivityData.key})`,
      )
      onActivitySelect(selectedActivityData.key)
    }
  }

  return (
    <View style={[themed($container), style]}>
      <Text preset="formLabel" style={themed($sectionLabel)}>
        Activité préférée:
      </Text>

      <View style={themed($wheelContainer)}>
        <Text preset="formHelper" style={themed($helperText)}>
          Faites défiler pour choisir votre activité préférée
        </Text>

        <ActivityWheel
          activities={catalog}
          selectedIndex={validIndex}
          onChange={handleActivityChange}
          disabled={disabled}
          height={height}
          style={themed($wheelPickerStyle)}
        />

        {/* Show selected activity details */}
        {/* <View style={themed($selectedActivityInfo)}>
          <Text style={themed($selectedActivityPreviewText)}>
            {ACTIVITIES[validIndex].emoji} {ACTIVITIES[validIndex].name}
          </Text>
          <Text style={themed($metText)}>
            {ACTIVITIES[validIndex].met} MET - {getCategoryLabel(ACTIVITIES[validIndex].category)}
        </View>
          </Text> */}
      </View>
    </View>
  )
}

/**
 * Get category label in French
 */
const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "light":
      return "Intensité faible"
    case "moderate":
      return "Intensité modérée"
    case "vigorous":
      return "Intensité élevée"
    default:
      return "Intensité inconnue"
  }
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.sm,
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $wheelContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.md,
  alignItems: "center",
})

const $helperText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  marginBottom: spacing.sm,
  fontSize: 12,
})

const $wheelPickerStyle: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.accent300,
  borderRadius: 8,
  marginBottom: spacing.md,
})

const $selectedActivityInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
})

const $selectedActivityPreviewText: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xs,
})

const $metText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
})

// ActivityWheel specific styles
const $scrollView: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $itemContainer: ThemedStyle<ViewStyle> = ({}) => ({
  height: ITEM_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
})

const $activityItem: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
  justifyContent: "center",
})

const $activityEmoji: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 24,
  marginBottom: spacing.xxxs,
})

const $selectedActivityEmoji: ThemedStyle<TextStyle> = ({}) => ({
  fontSize: 28,
})

const $activityText: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.palette.overlay50,
  textAlign: "center",
  marginBottom: spacing.xxxs,
})

const $selectedActivityText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.bold,
  color: colors.palette.angry500,
})

const $activityMet: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 10,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
})

const $selectedActivityMet: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $disabledText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral400,
})
