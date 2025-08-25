import React from "react"
import { View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { Kilograms, Centimeters } from "@/domain/common/UnitTypes"

import { NumberStepper } from "./NumberStepper"
import { Text } from "./Text"

export interface WeightHeightSelectorProps {
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

export const WeightHeightSelector: React.FC<WeightHeightSelectorProps> = ({
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
    onWeightChange(newWeight as Kilograms)
  }

  const handleHeightChange = (newHeight: number) => {
    onHeightChange(newHeight as Centimeters)
  }

  return (
    <View style={[themed($container), style]}>
      {showLabels && (
        <Text preset="formHelper" style={themed($sectionLabel)}>
          Informations physiques
        </Text>
      )}
      
      <View style={themed($selectorsContainer)}>
        <View style={themed($selectorWrapper)}>
          <NumberStepper
            label={showLabels ? "Poids" : undefined}
            value={weight}
            min={30} // Business rule: minimum 30kg
            max={300} // Business rule: maximum 300kg
            step={1}
            suffix="kg"
            onChange={handleWeightChange}
            disabled={disabled}
            style={themed($stepper)}
          />
        </View>

        <View style={themed($separator)} />

        <View style={themed($selectorWrapper)}>
          <NumberStepper
            label={showLabels ? "Taille" : undefined}
            value={height}
            min={100} // Business rule: minimum 100cm
            max={250} // Business rule: maximum 250cm
            step={1}
            suffix="cm"
            onChange={handleHeightChange}
            disabled={disabled}
            style={themed($stepper)}
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

const $selectorsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
})

const $selectorWrapper: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: spacing.md,
})

const $stepper: ThemedStyle<ViewStyle> = ({}) => ({
  // Let NumberStepper handle its own styling
})