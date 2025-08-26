import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity, Dimensions } from "react-native"

import type { Dish } from "@/domain/nutrition/Dish"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { AutoImage } from "./AutoImage"
import { Text } from "./Text"

export interface FoodCardProps {
  /**
   * The dish to display
   */
  dish: Dish
  /**
   * Callback when card is pressed
   */
  onPress: () => void
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Whether the card is disabled
   */
  disabled?: boolean
  /**
   * Size variant
   */
  size?: "small" | "medium" | "large" | "result"
}

export const FoodCard: React.FC<FoodCardProps> = ({
  dish,
  onPress,
  style,
  disabled = false,
  size = "medium",
}) => {
  const { themed, theme } = useAppTheme()

  // Use single pastel color for all cards
  const lightColor = theme.colors.palette.secondary100
  const strongColor = theme.colors.palette.accent500

  // Get emoji fallback for food
  const getFoodEmoji = (dishName: string): string => {
    const name = dishName.toLowerCase()
    if (name.includes("burger") || name.includes("sandwich")) return "🍔"
    if (name.includes("pizza")) return "🍕"
    if (name.includes("frites") || name.includes("fries")) return "🍟"
    if (name.includes("soda") || name.includes("coca")) return "🥤"
    if (name.includes("glace") || name.includes("ice")) return "🍦"
    if (name.includes("salade") || name.includes("salad")) return "🥗"
    if (name.includes("pomme") || name.includes("apple")) return "🍎"
    if (name.includes("banane") || name.includes("banana")) return "🍌"
    if (name.includes("orange")) return "🍊"
    if (name.includes("pain") || name.includes("bread")) return "🍞"
    if (name.includes("pâtes") || name.includes("pasta")) return "🍝"
    if (name.includes("riz") || name.includes("rice")) return "🍚"
    if (name.includes("poulet") || name.includes("chicken")) return "🍗"
    if (name.includes("poisson") || name.includes("fish") || name.includes("saumon")) return "🐟"
    if (name.includes("œuf") || name.includes("egg")) return "🍳"
    if (name.includes("chocolat") || name.includes("chocolate")) return "🍫"
    if (name.includes("gâteau") || name.includes("cake")) return "🍰"
    if (name.includes("croissant")) return "🥐"
    if (name.includes("hot") && name.includes("dog")) return "🌭"
    if (name.includes("donut")) return "🍩"
    return "🍽️" // Generic food emoji
  }

  const cardSizeStyle = themed($cardSizes[size])
  const imageSizeStyle = themed($imageSizes[size])

  return (
    <TouchableOpacity
      style={[
        themed($container),
        cardSizeStyle,
        { backgroundColor: lightColor }, // Gradient background simulation
        disabled && themed($disabledContainer),
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {/* Image/Emoji Section */}
      <View style={themed($imageContainer)}>
        {dish.hasImage() ? (
          <AutoImage
            source={{ uri: dish.getImageUrl()! }}
            style={[themed($image), imageSizeStyle]}
          />
        ) : (
          <View style={[themed($emojiContainer), imageSizeStyle]}>
            <Text style={themed($emojiText)}>{getFoodEmoji(dish.getName())}</Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={themed($contentContainer)}>
        <Text preset="bold" style={themed($dishName)} numberOfLines={2} ellipsizeMode="tail">
          {dish.getName()}
        </Text>

        {/* Show calories only for result variant */}
        {size === "result" && (
          <View style={themed($caloriesContainer)}>
            <Text style={themed($caloriesText)}>{dish.getCalories()}</Text>
            <Text style={themed($caloriesUnit)}>kcal</Text>
          </View>
        )}

        {/* High calorie indicator only for result variant */}
        {size === "result" && dish.isHighCalorie() && (
          <View style={themed($highCalorieBadge)}>
            <Text style={themed($highCalorieText)}>🔥 Intense</Text>
          </View>
        )}
      </View>

      {/* Accent border */}
      <View style={[themed($accentBorder), { backgroundColor: strongColor }]} />
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  overflow: "hidden",
  elevation: 4, // Android shadow
  shadowColor: colors.palette.neutral800, // iOS shadow
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  marginBottom: spacing.sm,
  position: "relative",
})

const $disabledContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.6,
  backgroundColor: colors.palette.neutral300,
})

const $cardSizes: Record<string, ThemedStyle<ViewStyle>> = {
  small: ({ spacing }) => ({
    padding: spacing.xs,
    minHeight: 100,
    maxHeight: 120, // Prevent overflow
  }),
  medium: ({ spacing }) => ({
    padding: spacing.sm,
    minHeight: 120,
    maxHeight: 150, // Prevent overflow
  }),
  large: ({ spacing }) => ({
    padding: spacing.md,
    minHeight: 140,
    maxHeight: 180, // Prevent overflow
  }),
  result: ({ spacing }) => ({
    padding: spacing.md, // Reduced padding to prevent overflow
    minHeight: 160, // Reduced minimum height
    maxHeight: 200, // Added maxHeight to prevent overflow
  }),
}

const $imageContainer: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
  marginBottom: 8,
})

const $image: ThemedStyle<any> = ({}) => ({
  borderRadius: 8,
})

const $emojiContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
})

const $imageSizes: Record<string, ThemedStyle<any>> = {
  small: ({}) => ({
    width: 40,
    height: 40,
  }),
  medium: ({}) => ({
    width: 50,
    height: 50,
  }),
  large: ({}) => ({
    width: 60,
    height: 60,
  }),
  result: ({}) => ({
    width: 80, // Reduced image size to prevent overflow
    height: 80,
  }),
}

const $emojiText: ThemedStyle<TextStyle> = ({}) => ({
  fontSize: 24,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  alignItems: "center",
})

const $dishName: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 14,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xs,
  lineHeight: 18,
})

const $caloriesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "baseline",
  marginBottom: spacing.xs,
})

const $caloriesText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
})

const $caloriesUnit: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginLeft: spacing.xxxs,
})

const $highCalorieBadge: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 10,
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
})

const $highCalorieText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 10,
  fontFamily: typography.primary.medium,
  color: colors.palette.neutral100,
})

const $accentBorder: ThemedStyle<ViewStyle> = ({}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
})
