// eslint-disable-next-line no-restricted-imports
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

// eslint-disable-next-line react/display-name
export const FoodCard: React.FC<FoodCardProps> = memo(
  ({ dish, onPress, style, disabled = false, size = "medium", displayCalories, quantityText }) => {
    const { themed, theme } = useAppTheme()
    const { multiplier } = useResponsiveSpacing()

    // Use single pastel color for all cards
    const lightColor = theme.colors.palette.primary500
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
      result: { minHeight: 200, maxHeight: 850, imageSize: 80, padding: theme.spacing.md },
    }

    // Increase card size on iPad - ensure enough space for all content
    const sizeMultiplier = multiplier > 1 ? 1.9 : 1
    const responsiveSizes = {
      minHeight: baseSizes[size].minHeight * sizeMultiplier,
      maxHeight: multiplier > 1 ? 999999 : baseSizes[size].maxHeight * sizeMultiplier, // Remove maxHeight constraint on iPad
      imageSize: baseSizes[size].imageSize * sizeMultiplier,
      padding: baseSizes[size].padding * multiplier,
    }

    // Typography scaling for iPad - balanced for visibility without overflow
    const typographyScale = multiplier > 1 ? 1.8 : 1
    const verticalSpacingScale = multiplier > 1 ? 1.5 : 1

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
        <View
          style={[
            themed($imageContainer),
            // eslint-disable-next-line react-native/no-inline-styles
            {
              marginBottom: 14 * verticalSpacingScale,
            },
          ]}
        >
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
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 24 * typographyScale,
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
              // eslint-disable-next-line react-native/no-inline-styles
              {
                fontSize: 14 * typographyScale,
                lineHeight: 18 * typographyScale,
                marginBottom: theme.spacing.xs * verticalSpacingScale,
              },
            ]}
            numberOfLines={size === "result" && multiplier > 1 ? 3 : 2}
            ellipsizeMode="tail"
          >
            {dish.getName()}
          </Text>

          {/* Show calories only for result variant */}
          {size === "result" && (
            <View
              style={[
                themed($caloriesContainer),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  paddingBottom: theme.spacing.xs * verticalSpacingScale,
                },
              ]}
            >
              <Text
                style={[
                  themed($caloriesText),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 18 * typographyScale,
                    lineHeight: 24 * typographyScale,
                  },
                ]}
              >
                {Math.round(displayCalories || dish.getCalories())}
              </Text>
              <Text
                style={[
                  themed($caloriesUnit),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 12 * typographyScale,
                  },
                ]}
              >
                kcal
              </Text>
            </View>
          )}

          {/* Show quantity text if provided */}
          {quantityText && size === "result" && (
            <Text
              style={[
                themed($quantityText),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 16 * typographyScale,
                },
              ]}
            >
              {quantityText}
            </Text>
          )}

          {/* High calorie indicator only for result variant */}
          {size === "result" && dish.isHighCalorie() && (
            <View
              style={[
                themed($highCalorieBadge),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  paddingHorizontal: theme.spacing.xs * verticalSpacingScale,
                  paddingVertical: theme.spacing.xxxs * verticalSpacingScale,
                },
              ]}
            >
              <Text
                style={[
                  themed($highCalorieText),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {

                    lineHeight: 24 * typographyScale,
                    fontSize: 16 * typographyScale,
                  },
                ]}
              >
                🔥 Intense
              </Text>
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
  // marginBottom is applied inline with responsive multiplier
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

const $dishName: ThemedStyle<TextStyle> = ({ colors }) => ({
  // fontSize, lineHeight and marginBottom are applied inline with responsive multiplier
  color: colors.text,
  textAlign: "center",
})

const $caloriesContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  alignItems: "baseline",
  // marginBottom is applied inline with responsive multiplier
})

const $caloriesText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.bold,
  color: colors.text,
  // fontSize and lineHeight are applied inline with responsive multiplier
})

const $caloriesUnit: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginLeft: spacing.xxxs,
  // fontSize is applied inline with responsive multiplier
})

const $highCalorieBadge: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
  borderRadius: 10,
  // paddingHorizontal and paddingVertical are applied inline with responsive multiplier
})

const $highCalorieText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.palette.neutral100,
  // fontSize is applied inline with responsive multiplier
})

const $quantityText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  fontStyle: "italic",
  // fontSize and marginBottom are applied inline with responsive multiplier
})

const $accentBorder: ThemedStyle<ViewStyle> = ({}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 3,
})
