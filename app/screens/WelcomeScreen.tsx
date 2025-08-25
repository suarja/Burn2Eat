import { FC } from "react"
import { ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(
  _props,
) {
  const { themed } = useAppTheme()
  const { navigation } = _props

  function handleStartOnboarding() {
    navigation.navigate("ProfileTab")
  }

  function handleGuestMode() {
    // Navigate directly to Home with default profile
    navigation.navigate("MainTabs", { screen: "HomeTab" })
  }

  function handleCreateProfile() {
    // Same as start onboarding - go to profile setup
    navigation.navigate("ProfileTab")
  }

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
      <View style={themed($topContainer)}>
        {/* App Title & Logo */}
        <Text 
          testID="app-title"
          preset="heading" 
          style={themed($appTitle)}
        >
          🔥 Burn2Eat 🍔
        </Text>
        
        <Text 
          preset="subheading" 
          style={themed($tagline)}
        >
          "Born to eat. Burn to eat."
        </Text>

        {/* Main CTA */}
        <Button
          testID="start-button" 
          preset="filled"
          style={themed($mainButton)}
          onPress={handleStartOnboarding}
        >
          Commencer 🚀
        </Button>
      </View>

      <View style={themed([$bottomContainer, $bottomContainerInsets])}>
        {/* Secondary Actions */}
        <View style={themed($secondaryActions)}>
          <Button
            testID="guest-mode-button"
            preset="default"
            style={themed($secondaryButton)}
            onPress={handleGuestMode}
          >
            Mode invité
          </Button>
          
          <Button
            testID="create-profile-button" 
            preset="default"
            style={themed($secondaryButton)}
            onPress={handleCreateProfile}
          >
            Créer profil
          </Button>
        </View>
      </View>
    </Screen>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
})

const $appTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 32,
  textAlign: "center",
  marginBottom: spacing.lg,
  color: colors.palette.primary500, // Orange énergique
})

const $tagline: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  marginBottom: spacing.xxxl,
  color: colors.textDim,
  fontStyle: "italic",
})

const $mainButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  backgroundColor: colors.palette.primary500, // Orange énergique
  paddingVertical: spacing.md,
  borderRadius: 12,
})

const $secondaryActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginHorizontal: spacing.xs,
})
