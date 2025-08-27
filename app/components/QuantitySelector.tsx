import React, { FC, useState, useEffect } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Grams } from "@/domain/common/UnitTypes"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Text } from "./Text"
import { TextField } from "./TextField"

export interface QuantitySelectorProps {
  /**
   * Current quantity in grams
   */
  quantity: Grams

  /**
   * Callback when quantity changes
   */
  onQuantityChange: (quantity: Grams) => void

  /**
   * Suggested serving size (e.g. "21.5g" from OpenFoodFacts)
   */
  suggestedServing?: string

  /**
   * Optional styling
   */
  style?: ViewStyle
  
  /**
   * Whether the selector starts collapsed
   */
  initiallyCollapsed?: boolean
}

/**
 * Component for selecting food quantity in grams
 * Includes quick-action buttons and manual input
 */
export const QuantitySelector: FC<QuantitySelectorProps> = function QuantitySelector(props) {
  const { quantity, onQuantityChange, suggestedServing, style: $styleOverride, initiallyCollapsed = true } = props
  const { themed } = useAppTheme()

  const [inputValue, setInputValue] = useState(quantity.toString())
  const [isExpanded, setIsExpanded] = useState(!initiallyCollapsed)

  // Update input when quantity prop changes
  useEffect(() => {
    setInputValue(quantity.toString())
  }, [quantity])

  // Parse suggested serving size to extract grams
  const parseSuggestedGrams = (): Grams | null => {
    if (!suggestedServing) return null
    const match = suggestedServing.match(/(\d+(?:\.\d+)?)/)
    return match ? (parseFloat(match[1]) as Grams) : null
  }

  const suggestedGrams = parseSuggestedGrams()

  // Quick action buttons data
  const quickActions = [
    { label: "50g", value: 50 as Grams },
    { label: "100g", value: 100 as Grams },
    ...(suggestedGrams ? [{ label: suggestedServing!, value: suggestedGrams }] : []),
  ]

  // Handle manual input change
  const handleInputChange = (text: string) => {
    setInputValue(text)

    const numericValue = parseFloat(text)
    if (!isNaN(numericValue) && numericValue > 0 && numericValue <= 1000) {
      onQuantityChange(numericValue as Grams)
    }
  }

  // Handle quick action button press
  const handleQuickAction = (value: Grams) => {
    onQuantityChange(value)
  }

  return (
    <View style={[$container, themed($containerThemed), $styleOverride]}>
      {/* Toggle button */}
      <Button
        preset="default"
        style={themed($toggleButton)}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "⚙️ Réduire" : `⚙️ Ajuster (${quantity}g)`}
      </Button>
      
      {isExpanded && (
        <>
          {/* Quick action buttons */}
          <View style={themed($quickActionsContainer)}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                preset={quantity === action.value ? "filled" : "default"}
                style={themed($quickActionButton)}
                onPress={() => handleQuickAction(action.value)}
              >
                {action.label}
              </Button>
            ))}
          </View>
          
          {/* Manual input */}
          <View style={themed($inputContainer)}>
            <TextField
              value={inputValue}
              onChangeText={handleInputChange}
              placeholder="Ex: 25"
              keyboardType="numeric"
              style={themed($textField)}
              inputWrapperStyle={themed($textFieldWrapper)}
            />
            <Text style={themed($unitLabel)}>grammes</Text>
          </View>
          
          {/* Info text */}
          {suggestedServing && (
            <Text style={themed($infoText)}>
              💡 Portion suggérée: {suggestedServing}
            </Text>
          )}
        </>
      )}
    </View>
  )
}

const $container: ViewStyle = {
  marginVertical: 16,
}

const $containerThemed: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.md,
})

const $toggleButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral200,
  borderColor: colors.palette.neutral300,
  borderWidth: 1,
  marginBottom: spacing.sm,
  opacity: 0.8,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  fontSize: 16,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $quickActionsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-around",
  marginBottom: spacing.md,
  gap: spacing.xs,
})

const $quickActionButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral200,
  borderColor: colors.tint,
  borderWidth: 1,
  minHeight: 44,
})

const $inputContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.sm,
  gap: spacing.sm,
})

const $textField: ThemedStyle<ViewStyle> = () => ({
  width: 80,
  textAlign: "center",
})

const $textFieldWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.tint,
  alignItems: "center",
})

const $unitLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
})

const $infoText: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
  fontStyle: "italic",
})
