import React from "react"
import { View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { Kilograms, Centimeters } from "@/domain/common/UnitTypes"

import { WheelPicker } from "./WheelPicker"
import { Text } from "./Text"

export interface WeightHeightWheelSelectorProps {
  /**
   * Current weight in kilograms
   */
  weight: number 
  /**
   * Current height in centimeters
   */
  height: number
  /**
   * Callback when weight changes
   */
  onWeightChange: (weight: Kilograms) => void
  /**
   * Callback when height changes
   */
  onHeightChange: (height: Centimeters) => void
  /**
   * Whether the selector is disabled
   */
  disabled?: boolean
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Show labels for weight and height
   */
  showLabels?: boolean
}

export const WeightHeightWheelSelector: React.FC<WeightHeightWheelSelectorProps> = ({
  weight,
  height,
  onWeightChange,
  onHeightChange,
  disabled = false,
  style,
  showLabels = true,
}) => {
  const { themed } = useAppTheme()

  const handleWeightChange = (newWeight: number) => {
    console.log(`⚖️ WeightHeightWheel: Weight changed from ${weight} to ${newWeight}`)
    onWeightChange(newWeight as Kilograms)
  }

  const handleHeightChange = (newHeight: number) => {
    console.log(`📏 WeightHeightWheel: Height changed from ${height} to ${newHeight}`)
    onHeightChange(newHeight as Centimeters)
  }

  return (
    <View style={[themed($container), style]}>
 
      
      <View style={themed($wheelContainer)}>
        <View style={themed($wheelSection)}>
          <Text preset="formLabel" style={themed($wheelLabel)}>
            Poids
          </Text>
          <WheelPicker
            value={weight}
            min={30} // Business rule: minimum 30kg
            max={200} // Business rule: maximum 200kg (reasonable for UI)
            step={1}
            suffix=" kg"
            onChange={handleWeightChange}
            disabled={disabled}
            height={120}
          />
        </View>

        <View style={themed($separator)} />

        <View style={themed($wheelSection)}>
          <Text preset="formLabel" style={themed($wheelLabel)}>
            Taille
          </Text>
          <WheelPicker
            value={height}
            min={120} // Business rule: minimum 120cm
            max={220} // Business rule: maximum 220cm (reasonable for UI)
            step={1}
            suffix=" cm"
            onChange={handleHeightChange}
            disabled={disabled}
            height={120}
          />
        </View>
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.md,
})

const $sectionLabel: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  textAlign: "center",
})

const $wheelContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  padding: spacing.md,
})

const $wheelSection: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  alignItems: "center",
})

const $wheelLabel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.sm,
  textAlign: "center",
  color: colors.text,
})

const $wheelPicker: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderRadius: 8,
})

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: spacing.md,
})