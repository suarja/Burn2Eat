import React from "react"
import { View, ViewStyle, TouchableOpacity, ActivityIndicator } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface LoadMoreButtonProps {
  /**
   * Called when button is pressed
   */
  onPress: () => void
  /**
   * Whether the button is in loading state
   */
  isLoading?: boolean
  /**
   * Custom text to display
   */
  text?: string
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Container style override
   */
  style?: ViewStyle
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onPress,
  isLoading = false,
  text = "Voir plus",
  disabled = false,
  style,
}) => {
  const { themed, theme } = useAppTheme()

  const handlePress = () => {
    if (!isLoading && !disabled) {
      onPress()
    }
  }

  return (
    <TouchableOpacity
      style={[themed($container), (isLoading || disabled) && themed($disabledContainer), style]}
      onPress={handlePress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
    >
      <View style={themed($content)}>
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color={theme.colors.textDim} style={themed($spinner)} />
            <Text style={themed($loadingText)}>Chargement...</Text>
          </>
        ) : (
          <>
            <Text style={themed($buttonText)}>{text}</Text>
            <Text style={themed($arrow)}>→</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  minWidth: 120,
})

const $disabledContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  opacity: 0.6,
  backgroundColor: colors.palette.neutral100,
})

const $content: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
})

const $buttonText: ThemedStyle<any> = ({ colors, typography, spacing }) => ({
  fontSize: 14,
  fontFamily: typography.primary.medium,
  color: colors.text,
  marginRight: spacing.xs,
})

const $loadingText: ThemedStyle<any> = ({ colors, typography, spacing }) => ({
  fontSize: 14,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  marginLeft: spacing.xs,
})

const $arrow: ThemedStyle<any> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $spinner: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.xs,
})
