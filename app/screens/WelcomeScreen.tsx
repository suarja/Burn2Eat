import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  const { themed } = useAppTheme()
  const { navigation } = _props
  const { loadCurrentProfile } = useUserProfile()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const [hasExistingProfile, setHasExistingProfile] = useState<boolean | null>(null)
  const [isCheckingProfile, setIsCheckingProfile] = useState(true)

  // Check for existing profile on component mount
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const result = await loadCurrentProfile()
        if (result.success && result.userProfile) {
          setHasExistingProfile(true)
          // If user has a profile, redirect directly to Home
          navigation.replace("MainTabs", { screen: "Home" })
        } else {
          setHasExistingProfile(false)
        }
      } catch (error) {
        console.warn("Failed to check existing profile:", error)
        setHasExistingProfile(false)
      } finally {
        setIsCheckingProfile(false)
      }
    }

    checkExistingProfile()
  }, [loadCurrentProfile, navigation])

  function handleStartOnboarding() {
    navigation.navigate("Profile")
  }

  function handleGuestMode() {
    // Navigate directly to Home with default profile
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  // Show loading state while checking profile
  if (isCheckingProfile) {
    return (
      <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
        <View style={themed($loadingContainer)}>
          <Text preset="heading" style={themed($loadingText)}>
            🔥 Burn2Eat
          </Text>
          <Text style={themed($loadingSubtext)}>Chargement...</Text>
        </View>
      </Screen>
    )
  }

  // If user has existing profile, they shouldn't see this screen
  // (they should be redirected to Home)
  if (hasExistingProfile) {
    return null
  }

  return (
    <Screen preset="scroll" contentContainerStyle={themed($screenContainer)}>
      <View style={themed($contentContainer)}>
        {/* App Title & Logo */}
        <View style={themed($headerSection)}>
          <Text testID="app-title" preset="heading" style={themed($appTitle)}>
            🔥 Burn2Eat 🍔
          </Text>
          <Text preset="subheading" style={themed($tagline)}>
            &quot;Born to eat. Burn to eat.&quot;
          </Text>
        </View>

        {/* Educational Content */}
        <Card
          style={themed($educationalCard)}
          heading="🎯 Découvre ton équilibre"
          content="Transforme ta façon de voir la nourriture ! Comprends l'impact énergétique de tes repas en les convertissant en temps d'exercice. Une approche ludique pour développer de saines habitudes alimentaires."
          verticalAlignment="top"
        />

        {/* Health Tips */}
        <Card
          style={themed($tipsCard)}
          heading="💡 Conseils bien-être"
          content="• Mange varié et équilibré\n• Reste hydraté(e) tout au long de la journée\n• Bouge au quotidien, même 10 minutes comptent\n• Écoute ton corps et ses besoins"
          verticalAlignment="top"
        />

        {/* Important Disclaimer */}
        <Card
          style={themed($disclaimerCard)}
          heading="⚠️ Information importante"
          content="Cette application fournit des estimations à des fins éducatives uniquement. Les calculs ne remplacent pas les conseils d'un professionnel de santé. Consulte toujours un médecin ou nutritionniste pour des recommandations personnalisées."
          verticalAlignment="top"
        />

        {/* Action Buttons */}
        <View style={themed($buttonContainer)}>
          <Button
            testID="start-button"
            preset="filled"
            style={themed($mainButton)}
            onPress={handleStartOnboarding}
          >
            Créer mon profil 🚀
          </Button>

          <Button
            testID="guest-mode-button"
            preset="default"
            style={themed($secondaryButton)}
            onPress={handleGuestMode}
          >
            Continuer en mode invité
          </Button>
        </View>

        <View style={themed([$bottomContainer, $bottomContainerInsets])}>
          <Text style={themed($footerText)}>
            Prêt(e) à découvrir l&apos;énergie de tes aliments ?
          </Text>
        </View>
      </View>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flexGrow: 1,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $headerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

const $appTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 32,
  textAlign: "center",
  marginBottom: spacing.sm,
  color: colors.palette.primary500,
})

const $tagline: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontStyle: "italic",
  fontSize: 16,
})

const $educationalCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.accent100,
  borderColor: colors.palette.accent200,
})

const $tipsCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.secondary100,
  borderColor: colors.palette.secondary200,
})

const $disclaimerCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  backgroundColor: colors.palette.angry100,
  borderColor: colors.palette.angry500,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
  gap: spacing.md,
})

const $mainButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.md,
  borderRadius: 12,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.palette.neutral400,
  borderWidth: 1,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingTop: spacing.md,
})

const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 14,
  fontStyle: "italic",
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  backgroundColor: colors.background,
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 28,
  textAlign: "center",
  marginBottom: spacing.md,
  color: colors.palette.primary500,
})

const $loadingSubtext: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 16,
})
