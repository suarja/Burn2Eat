import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useAppTheme } from "../theme/context"
import { spacing } from "../theme/spacing"
import type { ThemedStyle } from "../theme/types"
import type { AppNavigatorParamList } from "../navigators/AppNavigator"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Button } from "./Button"
import { Text } from "./Text"

export interface EmptyHistoryViewProps {
  style?: ViewStyle
}

/**
 * Empty state component shown when no consumption records exist for today
 * Encourages user to scan a product to start tracking
 */
export const EmptyHistoryView: FC<EmptyHistoryViewProps> = ({ style }) => {
  const { themed } = useAppTheme()
  const navigation = useNavigation<NativeStackNavigationProp<AppNavigatorParamList>>()

  const handleGoToScanner = () => {
    navigation.navigate("MainTabs", { screen: "Barcode" })
  }

  return (
    <View style={[themed($container), style]}>
      {/* Icon/Emoji */}
      <Text style={themed($icon)}>🍽️</Text>

      {/* Message */}
      <Text preset="subheading" style={themed($title)}>
        Aucun repas aujourd'hui
      </Text>

      <Text size="sm" style={themed($description)}>
        Scanne un produit pour commencer à suivre ton alimentation !
      </Text>

      {/* Action button */}
      <Button text="Aller scanner" onPress={handleGoToScanner} style={themed($button)} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xxl,
})

const $icon: ThemedStyle<TextStyle> = () => ({
  fontSize: 64,
  marginBottom: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xs,
})

const $description: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.lg,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
  minWidth: 200,
})
