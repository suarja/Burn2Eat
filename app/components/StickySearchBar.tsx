import React, { useEffect } from "react"
import { View, ViewStyle, Platform } from "react-native"
import { BlurView } from "expo-blur"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Icon } from "./Icon"
import { TextField } from "./TextField"

export interface StickySearchBarProps {
  /**
   * Current search text value
   */
  value: string
  /**
   * Called when search text changes
   */
  onChangeText: (text: string) => void
  /**
   * Placeholder text for the search field
   */
  placeholder?: string
  /**
   * Whether the search bar should be in sticky mode
   */
  isSticky?: boolean
  /**
   * Scroll offset for controlling blur intensity
   */
  scrollOffset?: number
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Called when search field is focused
   */
  onFocus?: () => void
  /**
   * Called when search field is blurred
   */
  onBlur?: () => void
}

export const StickySearchBar: React.FC<StickySearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Rechercher un plat...",
  isSticky = false,
  scrollOffset = 0,
  style,
  onFocus,
  onBlur,
}) => {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()

  // Animation for blur and elevation
  const blurIntensity = useSharedValue(0)
  const elevation = useSharedValue(0)

  useEffect(() => {
    if (isSticky) {
      const intensity = Math.min(scrollOffset / 50, 1) * 20 // Max blur of 20
      const elevationValue = Math.min(scrollOffset / 20, 1) * 8 // Max elevation of 8

      blurIntensity.value = withTiming(intensity, { duration: 200 })
      elevation.value = withTiming(elevationValue, { duration: 200 })
    } else {
      blurIntensity.value = withTiming(0, { duration: 200 })
      elevation.value = withTiming(0, { duration: 200 })
    }
  }, [isSticky, scrollOffset, blurIntensity, elevation])

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      elevation: elevation.value,
      shadowOpacity: interpolate(elevation.value, [0, 8], [0, 0.15]),
    }
  })

  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(blurIntensity.value, [0, 20], [0, 0.9]),
    }
  })

  const containerStyle = [
    themed($container),
    { paddingTop: insets.top + 8 },
    isSticky && themed($stickyContainer),
    animatedContainerStyle,
    style,
  ]

  const SearchContent = (
    <View style={themed($content)}>
      <View style={themed($searchContainer)}>
        <Icon
          icon="view"
          size={20}
          containerStyle={themed($searchIcon)}
          color={theme.colors.textDim}
        />
        <TextField
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          containerStyle={themed($searchFieldContainer)}
          inputWrapperStyle={themed($searchInputWrapper)}
          style={themed($searchInput)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  )

  if (isSticky && Platform.OS === "ios") {
    return (
      <Animated.View style={containerStyle}>
        <BlurView intensity={20} style={themed($blurContainer)}>
          <Animated.View style={[themed($backdrop), animatedBackdropStyle]} />
          {SearchContent}
        </BlurView>
      </Animated.View>
    )
  }

  if (isSticky) {
    // Android fallback without blur
    return (
      <Animated.View style={containerStyle}>
        <View style={themed($androidStickyBackground)}>{SearchContent}</View>
      </Animated.View>
    )
  }

  return <Animated.View style={containerStyle}>{SearchContent}</Animated.View>
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  zIndex: 1000,
})

const $stickyContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 8,
})

const $blurContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $backdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.background,
})

const $androidStickyBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  paddingHorizontal: spacing.md,
  height: 50,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.sm,
})

const $searchFieldContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  marginVertical: 0,
})

const $searchInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 0,
  minHeight: 40,
  backgroundColor: "transparent",
})

const $searchInput: ThemedStyle<any> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  paddingVertical: 0,
})
