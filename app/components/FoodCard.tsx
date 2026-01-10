import React, { memo } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { Image } from "expo-image"

import type { Dish } from "@/domain/nutrition/Dish"
import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

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
  /**
   * Override calories display (for result screen with custom portions)
   */
  displayCalories?: number
  /**
   * Custom quantity text (e.g. "pour 21g")
   */
  quantityText?: string
}

export const FoodCard: React.FC<FoodCardProps> = memo(
  ({ dish, onPress, style, disabled = false, size = "medium", displayCalories, quantityText }) => {
    const { themed, theme } = useAppTheme()
    const { multiplier } = useResponsiveSpacing()

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

    const baseSizes = {
      small: { minHeight: 100, maxHeight: 120, imageSize: 40, padding: theme.spacing.xs },
      medium: { minHeight: 120, maxHeight: 150, imageSize: 50, padding: theme.spacing.sm },
      large: { minHeight: 140, maxHeight: 180, imageSize: 60, padding: theme.spacing.md },
      result: { minHeight: 160, maxHeight: 200, imageSize: 80, padding: theme.spacing.md },
    }

    const responsiveSizes = {
      minHeight: baseSizes[size].minHeight * multiplier,
      maxHeight: baseSizes[size].maxHeight * multiplier,
      imageSize: baseSizes[size].imageSize * multiplier,
      padding: baseSizes[size].padding * multiplier,
    }

    return (
      <TouchableOpacity
        style={[
          themed($container),
          {
            minHeight: responsiveSizes.minHeight,
            maxHeight: responsiveSizes.maxHeight,
            padding: responsiveSizes.padding,
          },
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
            <Image
              source={{ uri: dish.getImageUrl()! }}
              style={[
                themed($image),
                {
                  width: responsiveSizes.imageSize,
                  height: responsiveSizes.imageSize,
                },
              ]}
              contentFit="cover"
              transition={200}
              placeholder={getFoodEmoji(dish.getName())}
              cachePolicy="memory-disk"
              recyclingKey={dish.getId().toString()}
              priority="high"
              allowDownscaling={true}
            />
          ) : (
            <View
              style={[
                themed($emojiContainer),
                {
                  width: responsiveSizes.imageSize,
                  height: responsiveSizes.imageSize,
                },
              ]}
            >
              <Text
                style={[
                  themed($emojiText),
                  {
                    fontSize: 24 * multiplier,
                  },
                ]}
              >
                {getFoodEmoji(dish.getName())}
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={themed($contentContainer)}>
          <Text
            preset="bold"
            style={[
              themed($dishName),
              {
                fontSize: 14 * multiplier,
                lineHeight: 18 * multiplier,
              },
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {dish.getName()}
          </Text>

          {/* Show calories only for result variant */}
          {size === "result" && (
            <View style={themed($caloriesContainer)}>
              <Text style={themed($caloriesText)}>
                {Math.round(displayCalories || dish.getCalories())}
              </Text>
              <Text style={themed($caloriesUnit)}>kcal</Text>
            </View>
          )}

          {/* Show quantity text if provided */}
          {quantityText && size === "result" && (
            <Text style={themed($quantityText)}>{quantityText}</Text>
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
  },
)

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
  // minHeight, maxHeight, and padding are applied inline with responsive multiplier
})

const $disabledContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.6,
  backgroundColor: colors.palette.neutral300,
})

// $cardSizes removed - now applied inline with responsive multiplier

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
  // width and height are applied inline with responsive multiplier
})

// $imageSizes removed - now applied inline with responsive multiplier

const $emojiText: ThemedStyle<TextStyle> = ({}) => ({
  // fontSize is applied inline with responsive multiplier
})

const $contentContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  alignItems: "center",
})

const $dishName: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  // fontSize and lineHeight are applied inline with responsive multiplier
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xs,
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

const $quantityText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.xs,
  fontStyle: "italic",
})

const $accentBorder: ThemedStyle<ViewStyle> = ({}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
})
