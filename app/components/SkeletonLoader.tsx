import React from "react"
import { View, ViewStyle, DimensionValue } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export interface SkeletonLoaderProps {
  /**
   * Width of the skeleton
   */
  width?: DimensionValue
  /**
   * Height of the skeleton
   */
  height?: DimensionValue
  /**
   * Border radius
   */
  borderRadius?: number
  /**
   * Container style override
   */
  style?: ViewStyle
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { themed, theme } = useAppTheme()
  
  const shimmerValue = useSharedValue(0)
  
  React.useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    )
  }, [shimmerValue])

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3])
    return {
      opacity,
    }
  })

  return (
    <View style={[themed($container), { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          themed($shimmer),
          { borderRadius },
          animatedStyle,
        ]}
      />
    </View>
  )
}

/**
 * Food Card Skeleton - matches FoodCard dimensions
 */
export const FoodCardSkeleton: React.FC<{ size?: "small" | "medium" | "large" }> = ({
  size = "medium",
}) => {
  const { themed } = useAppTheme()
  
  const imageSize = size === "small" ? 40 : size === "medium" ? 50 : 60
  const cardHeight = size === "small" ? 100 : size === "medium" ? 120 : 140

  return (
    <View style={[themed($cardContainer), { height: cardHeight }]}>
      {/* Image Skeleton */}
      <View style={themed($imageSection)}>
        <SkeletonLoader
          width={imageSize}
          height={imageSize}
          borderRadius={8}
        />
      </View>
      
      {/* Text Skeletons */}
      <View style={themed($textSection)}>
        <SkeletonLoader
          width="80%"
          height={14}
          borderRadius={2}
          style={themed($titleSkeleton)}
        />
        <SkeletonLoader
          width="60%"
          height={12}
          borderRadius={2}
        />
      </View>
    </View>
  )
}

/**
 * Category Section Skeleton - matches CollapsibleCategorySection
 */
export const CategorySectionSkeleton: React.FC = () => {
  const { themed } = useAppTheme()

  return (
    <View style={themed($categorySectionContainer)}>
      {/* Header Skeleton */}
      <View style={themed($categoryHeader)}>
        <View style={themed($categoryInfo)}>
          <SkeletonLoader width={24} height={24} borderRadius={12} />
          <View style={themed($categoryText)}>
            <SkeletonLoader
              width={120}
              height={16}
              borderRadius={2}
              style={themed($categoryNameSkeleton)}
            />
            <SkeletonLoader width={80} height={12} borderRadius={2} />
          </View>
        </View>
        <SkeletonLoader width={24} height={24} borderRadius={2} />
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  overflow: "hidden",
})

const $shimmer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.palette.neutral300,
})

const $cardContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.sm,
  marginBottom: spacing.sm,
  elevation: 2,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
})

const $imageSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $textSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
})

const $titleSkeleton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $categorySectionContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  borderRadius: 12,
  marginBottom: spacing.md,
  elevation: 2,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
})

const $categoryHeader: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.palette.neutral100,
})

const $categoryInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
})

const $categoryText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginLeft: spacing.sm,
})

const $categoryNameSkeleton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxxs,
})