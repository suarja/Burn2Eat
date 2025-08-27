import React, { useState } from "react"
import { View, ViewStyle, TouchableOpacity, LayoutAnimation, Platform, UIManager } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated"
import { Text } from "./Text"
import { FoodCard } from "./FoodCard"
import { LoadMoreButton } from "./LoadMoreButton"
import { Dish } from "@/domain/nutrition/Dish"
import { CategoryInfo } from "@/domain/nutrition/DishRepository"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export interface CollapsibleCategorySectionProps {
  /**
   * Category information with metadata
   */
  category: CategoryInfo
  /**
   * Dishes to display in this category
   */
  dishes: Dish[]
  /**
   * Whether this section is expanded
   */
  isExpanded: boolean
  /**
   * Whether there are more dishes to load
   */
  hasMore: boolean
  /**
   * Whether a load more operation is in progress
   */
  isLoadingMore: boolean
  /**
   * Called when section header is tapped to expand/collapse
   */
  onToggle: () => void
  /**
   * Called when a dish is selected
   */
  onDishSelect: (dish: Dish) => void
  /**
   * Called when load more is requested
   */
  onLoadMore: () => void
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Maximum number of columns for dish grid
   */
  numColumns?: number
}

export const CollapsibleCategorySection: React.FC<CollapsibleCategorySectionProps> = ({
  category,
  dishes,
  isExpanded,
  hasMore,
  isLoadingMore,
  onToggle,
  onDishSelect,
  onLoadMore,
  style,
  numColumns = 2,
}) => {
  const { themed } = useAppTheme()
  
  // Animation for chevron rotation
  const rotateAnim = useSharedValue(0)
  
  React.useEffect(() => {
    rotateAnim.value = withTiming(isExpanded ? 1 : 0, { duration: 300 })
  }, [isExpanded, rotateAnim])

  const animatedChevronStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rotateAnim.value, [0, 1], [0, 180])
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  const handleToggle = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    })
    onToggle()
  }

  const renderDishGrid = () => {
    if (!dishes.length) return null

    const rows: Dish[][] = []
    for (let i = 0; i < dishes.length; i += numColumns) {
      rows.push(dishes.slice(i, i + numColumns))
    }

    return (
      <View style={themed($dishGrid)}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={themed($dishRow)}>
            {row.map((dish, colIndex) => (
              <View key={dish.getId().toString()} style={themed($dishContainer)}>
                <FoodCard
                  dish={dish}
                  onPress={() => onDishSelect(dish)}
                  size="medium"
                  style={themed($dishCard)}
                />
              </View>
            ))}
            {/* Fill remaining columns with empty space */}
            {row.length < numColumns &&
              Array.from({ length: numColumns - row.length }).map((_, emptyIndex) => (
                <View key={`empty-${emptyIndex}`} style={themed($dishContainer)} />
              ))}
          </View>
        ))}
        
        {hasMore && (
          <View style={themed($loadMoreContainer)}>
            <LoadMoreButton
              onPress={onLoadMore}
              isLoading={isLoadingMore}
              text={`Voir plus de ${category.name.toLowerCase()}`}
            />
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={[themed($container), style]}>
      {/* Header */}
      <TouchableOpacity
        style={themed($header)}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={themed($headerContent)}>
          <View style={themed($categoryInfo)}>
            <Text style={themed($categoryIcon)}>{category.icon}</Text>
            <View style={themed($categoryText)}>
              <Text preset="bold" style={themed($categoryName)}>
                {category.name}
              </Text>
              <Text style={themed($categoryCount)}>
                {category.count} plat{category.count > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          
          <Animated.View style={[themed($chevron), animatedChevronStyle]}>
            <Text style={themed($chevronText)}>▼</Text>
          </Animated.View>
        </View>
        
        {category.description && !isExpanded && (
          <Text style={themed($categoryDescription)} numberOfLines={1}>
            {category.description}
          </Text>
        )}
      </TouchableOpacity>

      {/* Collapsible Content */}
      {isExpanded && (
        <View style={themed($content)}>
          {renderDishGrid()}
        </View>
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
  borderRadius: 12,
  backgroundColor: colors.background,
  overflow: "hidden",
  elevation: 2,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  backgroundColor: colors.palette.neutral100,
})

const $headerContent: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
})

const $categoryInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
})

const $categoryIcon: ThemedStyle<any> = ({ spacing }) => ({
  fontSize: 24,
  marginRight: spacing.sm,
})

const $categoryText: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $categoryName: ThemedStyle<any> = ({ colors }) => ({
  fontSize: 18,
  color: colors.text,
  marginBottom: 2,
})

const $categoryCount: ThemedStyle<any> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $categoryDescription: ThemedStyle<any> = ({ colors, spacing }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginTop: spacing.xs,
  fontStyle: "italic",
})

const $chevron: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 24,
  height: 24,
  justifyContent: "center",
  alignItems: "center",
})

const $chevronText: ThemedStyle<any> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.sm,
  paddingBottom: spacing.md,
  backgroundColor: colors.background,
})

const $dishGrid: ThemedStyle<ViewStyle> = ({}) => ({
  width: "100%",
})

const $dishRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  marginBottom: spacing.sm,
})

const $dishContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.xs,
})

const $dishCard: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $loadMoreContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.md,
})