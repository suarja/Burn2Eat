import React, { useCallback, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { TextField } from "./TextField"
import { Text } from "./Text"
import { Icon } from "./Icon"

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

  const handleInputChange = useCallback((text: string) => {
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
  }, [min, max, value, onChange])

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
        <Button
          style={[themed($button), buttonStyle]}
          disabled={!canDecrement}
          onPress={handleDecrement}
          preset="default"
          LeftAccessory={() => (
            <Icon 
              icon="minus" 
              size={16}
            />
          )}
        />
        
        <View style={themed($inputContainer)}>
          <TextField
            style={[themed($input), inputStyle]}
            value={inputValue}
            onChangeText={handleInputChange}
            onBlur={handleInputBlur}
            keyboardType="numeric"
            textAlign="center"
            editable={!disabled}
            status={disabled ? "disabled" : undefined}
          />
          {suffix && (
            <Text style={themed($suffix)}>
              {suffix}
            </Text>
          )}
        </View>
        
        <Button
          style={[themed($button), buttonStyle]}
          disabled={!canIncrement}
          onPress={handleIncrement}
          preset="default"
          LeftAccessory={() => (
            <Icon 
              icon="plus" 
              size={16}
            />
          )}
        />
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

const $stepperContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  minHeight: 44,
  minWidth: 44,
  paddingHorizontal: spacing.sm,
  marginHorizontal: spacing.xxs,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
})


const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  marginHorizontal: spacing.xs,
})

const $input: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  textAlign: "center",
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.text,
})

const $suffix: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  marginLeft: spacing.xxs,
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
})