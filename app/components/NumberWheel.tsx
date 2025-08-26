import React from "react"
import { View, ViewStyle, Text as RNText } from "react-native"

// TODO: Install @react-native-picker/picker for full wheel functionality
// For now, this is a placeholder implementation

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface NumberWheelProps {
  /**
   * Current numeric value
   */
  value: number
  /**
   * Minimum allowed value
   */
  min: number
  /**
   * Maximum allowed value
   */
  max: number
  /**
   * Step increment amount
   */
  step?: number
  /**
   * Suffix text to display after number (e.g., "kg", "cm")
   */
  suffix?: string
  /**
   * Callback when value changes
   */
  onChange: (value: number) => void
  /**
   * Whether the wheel is disabled
   */
  disabled?: boolean
  /**
   * Label text to display above the wheel
   */
  label?: string
  /**
   * Container style override
   */
  style?: ViewStyle
}

export const NumberWheel: React.FC<NumberWheelProps> = ({
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  disabled = false,
  label,
  style,
}) => {
  const { themed, theme } = useAppTheme()

  // Generate array of values from min to max with step
  const values = React.useMemo(() => {
    const vals: number[] = []
    for (let i = min; i <= max; i += step) {
      vals.push(i)
    }
    return vals
  }, [min, max, step])

  const handleValueChange = (selectedValue: string) => {
    const numericValue = parseFloat(selectedValue)
    if (!isNaN(numericValue) && numericValue !== value) {
      onChange(numericValue)
    }
  }

  return (
    <View style={[themed($container), style]}>
      {label && (
        <Text preset="formLabel" style={themed($label)}>
          {label}
        </Text>
      )}

      <View style={themed($pickerContainer)}>
        {/* Placeholder implementation - requires @react-native-picker/picker */}
        <Text style={themed($placeholderText)}>
          NumberWheel: {value}
          {suffix}
        </Text>
        <Text style={themed($instructionText)}>
          Install @react-native-picker/picker for wheel picker functionality
        </Text>
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.xs,
})

const $label: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxs,
})

const $pickerContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  backgroundColor: colors.background,
  marginVertical: spacing.xs,
})

const $picker: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 150,
  marginHorizontal: spacing.sm,
})

const $placeholderText: ThemedStyle<ViewStyle> = ({ typography, colors }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  textAlign: "center",
  paddingVertical: 20,
})

const $instructionText: ThemedStyle<ViewStyle> = ({ typography, colors, spacing }) => ({
  fontSize: 12,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
  paddingBottom: spacing.sm,
})
