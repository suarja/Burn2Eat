import React, { useCallback, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Icon } from "./Icon"
import { Text } from "./Text"
import { TextField } from "./TextField"

export interface NumberStepperProps {
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
   * Step increment/decrement amount
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
   * Whether the stepper is disabled
   */
  disabled?: boolean
  /**
   * Label text to display above the stepper
   */
  label?: string
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Input field style override
   */
  inputStyle?: TextStyle
  /**
   * Buttons style override
   */
  buttonStyle?: ViewStyle
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  disabled = false,
  label,
  style,
  inputStyle,
  buttonStyle,
}) => {
  const { themed } = useAppTheme()
  const [inputValue, setInputValue] = useState(value.toString())

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(value + step, max)
    if (newValue !== value) {
      onChange(newValue)
      setInputValue(newValue.toString())
    }
  }, [value, step, max, onChange])

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(value - step, min)
    if (newValue !== value) {
      onChange(newValue)
      setInputValue(newValue.toString())
    }
  }, [value, step, min, onChange])

  const handleInputChange = useCallback(
    (text: string) => {
      // Allow empty string for editing
      setInputValue(text)

      // Parse and validate numeric input
      const numericValue = parseFloat(text)
      if (!isNaN(numericValue)) {
        const clampedValue = Math.max(min, Math.min(max, numericValue))
        if (clampedValue !== value) {
          onChange(clampedValue)
        }
      }
    },
    [min, max, value, onChange],
  )

  const handleInputBlur = useCallback(() => {
    // Reset to current valid value if input is invalid
    const numericValue = parseFloat(inputValue)
    if (isNaN(numericValue)) {
      setInputValue(value.toString())
    } else {
      // Ensure the displayed value matches the clamped value
      const clampedValue = Math.max(min, Math.min(max, numericValue))
      setInputValue(clampedValue.toString())
      if (clampedValue !== value) {
        onChange(clampedValue)
      }
    }
  }, [inputValue, min, max, value, onChange])

  // Update input value when prop value changes
  React.useEffect(() => {
    setInputValue(value.toString())
  }, [value])

  const canDecrement = value > min && !disabled
  const canIncrement = value < max && !disabled

  return (
    <View style={[themed($container), style]}>
      {label && (
        <Text preset="formLabel" style={themed($label)}>
          {label}
        </Text>
      )}
      <View style={themed($stepperContainer)}>
        {/* Minus Button */}
        <Button
          style={[themed($button), buttonStyle]}
          textStyle={themed($buttonText)}
          disabled={!canDecrement}
          onPress={handleDecrement}
          preset="default"
        >
          -
        </Button>

        {/* Value Display */}
        <View style={themed($valueContainer)}>
          <Text style={themed($valueText)}>
            {value}
            {suffix}
          </Text>
        </View>

        {/* Plus Button */}
        <Button
          style={[themed($button), buttonStyle]}
          textStyle={themed($buttonText)}
          disabled={!canIncrement}
          onPress={handleIncrement}
          preset="default"
        >
          +
        </Button>
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.xs,
})

const $label: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxs,
})

const $stepperContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.xs,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.palette.primary500,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.palette.neutral100,
})

const $valueContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: spacing.sm,
  paddingVertical: spacing.sm,
  backgroundColor: colors.background,
  borderRadius: 8,
})

const $valueText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
})
