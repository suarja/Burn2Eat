import React, { useRef, useEffect } from "react"
import { View, ScrollView, ViewStyle, TextStyle, Dimensions } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface WheelPickerProps {
  /**
   * Current selected value
   */
  value: number
  /**
   * Minimum value
   */
  min: number
  /**
   * Maximum value
   */
  max: number
  /**
   * Step increment
   */
  step?: number
  /**
   * Suffix for display (e.g., "kg", "cm")
   */
  suffix?: string
  /**
   * Callback when value changes
   */
  onChange: (value: number) => void
  /**
   * Height of the picker
   */
  height?: number
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean
  /**
   * Container style override
   */
  style?: ViewStyle
}

const ITEM_HEIGHT = 50
const { width: SCREEN_WIDTH } = Dimensions.get("window")

export const WheelPicker: React.FC<WheelPickerProps> = ({
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  height = 150,
  disabled = false,
  style,
}) => {
  const { themed } = useAppTheme()
  const scrollViewRef = useRef<ScrollView>(null)
  
  // Generate values array
  const values = React.useMemo(() => {
    const vals: number[] = []
    for (let i = min; i <= max; i += step) {
      vals.push(i)
    }
    return vals
  }, [min, max, step])

  // Find current index
  const currentIndex = values.indexOf(value)
  
  // Add padding items for centering
  const paddingCount = Math.floor(height / ITEM_HEIGHT / 2)
  const displayValues = [
    ...Array(paddingCount).fill(null),
    ...values,
    ...Array(paddingCount).fill(null),
  ]

  // Handle scroll and snap to value
  const handleScroll = (event: any) => {
    if (disabled) return
    
    const offsetY = event.nativeEvent.contentOffset.y
    const index = Math.round(offsetY / ITEM_HEIGHT)
    const actualIndex = index - paddingCount
    
    if (actualIndex >= 0 && actualIndex < values.length) {
      const newValue = values[actualIndex]
      if (newValue !== value) {
        onChange(newValue)
      }
    }
  }

  // Scroll to current value on mount or value change
  useEffect(() => {
    if (currentIndex >= 0) {
      const targetOffset = (currentIndex + paddingCount) * ITEM_HEIGHT
      scrollViewRef.current?.scrollTo({
        y: targetOffset,
        animated: false,
      })
    }
  }, [currentIndex, paddingCount])

  return (
    <View style={[themed($container), { height }, style]}>
      {/* Selection indicator */}
      <View style={themed($selectionIndicator)} />
      
      <ScrollView
        ref={scrollViewRef}
        style={themed($scrollView)}
        contentContainerStyle={themed($contentContainer)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        scrollEnabled={!disabled}
      >
        {displayValues.map((val, index) => {
          const isSelected = val === value
          const isVisible = val !== null
          
          return (
            <View key={index} style={themed($itemContainer)}>
              {isVisible && (
                <Text
                  style={themed([
                    $itemText,
                    isSelected && $selectedItemText,
                    disabled && $disabledItemText,
                  ])}
                >
                  {val}{suffix}
                </Text>
              )}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "relative",
  backgroundColor: colors.background,
  borderRadius: 8,
  overflow: "hidden",
})

const $selectionIndicator: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  top: "50%",
  left: spacing.sm,
  right: spacing.sm,
  height: ITEM_HEIGHT,
  marginTop: -ITEM_HEIGHT / 2,
  backgroundColor: colors.palette.accent200,
  borderRadius: 8,
  zIndex: 1,
  opacity: 0.3,
})

const $scrollView: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({}) => ({
  paddingVertical: 0,
})

const $itemContainer: ThemedStyle<ViewStyle> = ({}) => ({
  height: ITEM_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
})

const $itemText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
})

const $selectedItemText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.text,
})

const $disabledItemText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral400,
})