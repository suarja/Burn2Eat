import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"

import { Text } from "./Text"

export interface GuestModeIndicatorProps {
  /**
   * Container style override
   */
  style?: ViewStyle
}

export const GuestModeIndicator: React.FC<GuestModeIndicatorProps> = ({ style }) => {
  const { themed } = useAppTheme()
  const navigation = useNavigation<AppStackScreenProps<"Home">["navigation"]>()

  const handlePress = () => {
    // Navigate to Profile setup screen
    navigation.navigate("MainTabs", { screen: "Profile" })
  }

  return (
    <TouchableOpacity
      style={[themed($container), style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={themed($icon)}>👤</Text>
      <Text style={themed($text)}>Invité</Text>
    </TouchableOpacity>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  position: "absolute",
  top: spacing.md,
  right: spacing.lg,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.primary600,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.accent300,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  zIndex: 1000,
})

const $icon: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 14,
  marginRight: spacing.xs,
})

const $text: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  color: colors.palette.angry500,
})