import React from "react"
import { memo } from "react"
import {
  View,
  ViewStyle,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated"

import { Dish } from "@/domain/nutrition/Dish"
import { CategoryInfo } from "@/domain/nutrition/DishRepository"
import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { FoodCard } from "./FoodCard"
import { LoadMoreButton } from "./LoadMoreButton"
import { Text } from "./Text"

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
  style?: ViewStyle | ViewStyle[]
  /**
   * Maximum number of columns for dish grid
   */
  numColumns?: number
}

export const CollapsibleCategorySection: React.FC<CollapsibleCategorySectionProps> = memo(
  ({
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
    const { themed, theme } = useAppTheme()
    const { multiplier } = useResponsiveSpacing()

    // Animation for chevron rotation
    const rotateAnim = useSharedValue(0)

    React.useEffect(() => {
      rotateAnim.value = withTiming(isExpanded ? 1 : 0, { duration: 200 })
    }, [isExpanded, rotateAnim])

    const animatedChevronStyle = useAnimatedStyle(() => {
      const rotation = interpolate(rotateAnim.value, [0, 1], [0, 180])
      return {
        transform: [{ rotate: `${rotation}deg` }],
      }
    })

    const handleToggle = () => {
      LayoutAnimation.configureNext({
        duration: 200,
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
            <View
              key={rowIndex}
              style={[
                themed($dishRow),
                {
                  marginBottom: theme.spacing.md * multiplier,
                },
              ]}
            >
              {row.map((dish, colIndex) => (
                <View
                  key={dish.getId().toString()}
                  style={[
                    themed($dishContainer),
                    {
                      paddingHorizontal: theme.spacing.sm * multiplier,
                    },
                  ]}
                >
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
                  <View
                    key={`empty-${emptyIndex}`}
                    style={[
                      themed($dishContainer),
                      {
                        paddingHorizontal: theme.spacing.sm * multiplier,
                      },
                    ]}
                  />
                ))}
            </View>
          ))}

          {hasMore && (
            <View
              style={[
                themed($loadMoreContainer),
                {
                  marginTop: theme.spacing.md * multiplier,
                },
              ]}
            >
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
      <View
        style={[
          themed($container),
          {
            borderRadius: 12 * multiplier,
          },
          style,
        ]}
      >
        {/* Header */}
        <TouchableOpacity
          style={[
            themed($header),
            {
              paddingHorizontal: theme.spacing.lg * multiplier,
              paddingVertical: theme.spacing.md * multiplier,
            },
          ]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <View style={themed($headerContent)}>
            <View style={themed($categoryInfo)}>
              <Text
                style={[
                  themed($categoryIcon),
                  {
                    fontSize: multiplier > 1 ? 28 : 24, // More moderate increase for iPad
                    marginRight: theme.spacing.sm * multiplier,
                  },
                ]}
              >
                {category.icon}
              </Text>
              <View style={themed($categoryText)}>
                <Text
                  preset="bold"
                  style={[
                    themed($categoryName),
                    {
                      fontSize: multiplier > 1 ? 20 : 18, // More moderate increase
                    },
                  ]}
                >
                  {category.name}
                </Text>
                <Text
                  style={[
                    themed($categoryCount),
                    {
                      fontSize: multiplier > 1 ? 16 : 14, // More moderate increase
                    },
                  ]}
                >
                  {category.count} plat{category.count > 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <Animated.View style={[themed($chevron), animatedChevronStyle]}>
              <Text
                style={[
                  themed($chevronText),
                  {
                    fontSize: multiplier > 1 ? 14 : 12, // More moderate increase
                  },
                ]}
              >
                ▼
              </Text>
            </Animated.View>
          </View>

          {category.description && !isExpanded && (
            <Text
              style={[
                themed($categoryDescription),
                {
                  fontSize: multiplier > 1 ? 14 : 12, // More moderate increase
                  marginTop: theme.spacing.xs * multiplier,
                },
              ]}
              numberOfLines={1}
            >
              {category.description}
            </Text>
          )}
        </TouchableOpacity>

        {/* Collapsible Content */}
        {isExpanded && (
          <View
            style={[
              themed($content),
              {
                paddingHorizontal: theme.spacing.md * multiplier,
                paddingTop: theme.spacing.sm * multiplier,
                paddingBottom: theme.spacing.md * multiplier,
              },
            ]}
          >
            {renderDishGrid()}
          </View>
        )}
      </View>
    )
  },
)

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
  // borderRadius is applied inline with responsive multiplier
  backgroundColor: colors.background,
  overflow: "hidden",
  elevation: 2,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  // paddingHorizontal and paddingVertical are applied inline with responsive multiplier
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
  // fontSize and marginRight are applied inline with responsive multiplier
})

const $categoryText: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $categoryName: ThemedStyle<any> = ({ colors }) => ({
  // fontSize is applied inline with responsive multiplier
  color: colors.text,
  marginBottom: 2,
})

const $categoryCount: ThemedStyle<any> = ({ colors }) => ({
  // fontSize is applied inline with responsive multiplier
  color: colors.textDim,
})

const $categoryDescription: ThemedStyle<any> = ({ colors, spacing }) => ({
  // fontSize and marginTop are applied inline with responsive multiplier
  color: colors.textDim,
  fontStyle: "italic",
})

const $chevron: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 24,
  height: 24,
  justifyContent: "center",
  alignItems: "center",
})

const $chevronText: ThemedStyle<any> = ({ colors }) => ({
  // fontSize is applied inline with responsive multiplier
  color: colors.textDim,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  // paddingHorizontal, paddingTop, and paddingBottom are applied inline with responsive multiplier
  backgroundColor: colors.background,
})

const $dishGrid: ThemedStyle<ViewStyle> = ({}) => ({
  width: "100%",
})

const $dishRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  // marginBottom is applied inline with responsive multiplier
})

const $dishContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  // paddingHorizontal is applied inline with responsive multiplier
})

const $dishCard: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $loadMoreContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  // marginTop is applied inline with responsive multiplier
})
