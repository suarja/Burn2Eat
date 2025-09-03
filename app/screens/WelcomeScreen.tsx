import { FC, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { ChoiceModal } from "@/components/ChoiceModal"
import { OnboardingModal } from "@/components/OnboardingModal"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useOnboardingModals } from "@/hooks/useOnboardingModals"
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
  const { hasCurrentProfile } = useUserProfile()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const [hasExistingProfile, setHasExistingProfile] = useState<boolean | null>(null)
  const [isCheckingProfile, setIsCheckingProfile] = useState(true)
  const [showGuestWarning, setShowGuestWarning] = useState(false)

  // Onboarding modals management
  const {
    currentModal,
    isModalVisible,
    hasSeenOnboarding,
    currentStep,
    totalSteps,
    isLastModal,
    startOnboarding,
    nextModal,
    skipOnboarding,
    closeModal,
  } = useOnboardingModals()

  // Check for existing profile on component mount
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const result = await hasCurrentProfile()
        if (result) {
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
  }, [hasCurrentProfile, navigation])

  function handleStartOnboarding() {
    if (!hasSeenOnboarding) {
      startOnboarding()
    } else {
      navigation.navigate("Profile")
    }
  }

  function handleGuestMode() {
    // Show warning modal before proceeding
    setShowGuestWarning(true)
  }

  function handleGuestWarningConfirm() {
    setShowGuestWarning(false)
    // Navigate directly to Home with default profile
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  function handleGuestWarningCancel() {
    setShowGuestWarning(false)
    // User wants to create a profile, trigger onboarding
    handleStartOnboarding()
  }

  function handleModalClose() {
    closeModal()
    // After closing modals, go to profile setup
    navigation.navigate("Profile")
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
    <>
      <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
        <View style={themed($container)}>
          {/* App Title & Logo */}
          <View style={themed($heroSection)}>
            <Text testID="app-title" preset="heading" style={themed($appTitle)}>
              🔥 Burn2Eat 🍔
            </Text>
            <Text preset="subheading" style={themed($tagline)}>
              &quot;Born to eat. Burn to eat.&quot;
            </Text>
            <Text style={themed($subtitle)}>Découvre l&apos;énergie de tes aliments</Text>
          </View>

          {/* Action Buttons */}
          <View style={themed($buttonContainer)}>
            <Button
              testID="start-button"
              preset="filled"
              style={themed($mainButton)}
              onPress={handleStartOnboarding}
            >
              Commencer 🚀
            </Button>

            <Button
              testID="guest-mode-button"
              preset="default"
              style={themed($secondaryButton)}
              onPress={handleGuestMode}
            >
              Mode invité
            </Button>
          </View>

          <View style={themed([$bottomContainer, $bottomContainerInsets])}>
            <Text style={themed($footerText)}>
              Appuie sur &quot;Commencer&quot; pour découvrir nos conseils !
            </Text>
          </View>
        </View>
      </Screen>

      {/* Onboarding Modals */}
      {currentModal && (
        <OnboardingModal
          visible={isModalVisible}
          onClose={isLastModal ? handleModalClose : closeModal}
          onNext={nextModal}
          onSkip={skipOnboarding}
          title={currentModal.title}
          content={currentModal.content}
          emoji={currentModal.emoji}
          isLastModal={isLastModal}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
      )}

      {/* Guest Mode Warning Modal */}
      <ChoiceModal
        visible={showGuestWarning}
        title="Mode invité ⚠️"
        content="Le mode invité utilise un profil par défaut (70kg, 170cm). Pour des résultats personnalisés, créez votre profil."
        secondaryContent="Vous pourrez créer votre profil plus tard dans les paramètres."
        icon="👤"
        primaryButtonText="Continuer en invité"
        secondaryButtonText="Créer mon profil"
        onPrimaryPress={handleGuestWarningConfirm}
        onSecondaryPress={handleGuestWarningCancel}
        onDismiss={handleGuestWarningCancel}
        variant="default"
      />
    </>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.background,
  justifyContent: "space-between",
  paddingHorizontal: spacing.lg,
})

const $heroSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingTop: spacing.xxxl,
})

const $appTitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 36,
  textAlign: "center",
  marginBottom: spacing.xs,
  color: colors.palette.primary500,
})

const $tagline: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontStyle: "italic",
  fontSize: 18,
  marginBottom: spacing.sm,
})

const $subtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.text,
  fontSize: 16,
  opacity: 0.8,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xl,
  gap: spacing.md,
})

const $mainButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.lg,
  borderRadius: 16,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderColor: colors.palette.neutral400,
  borderWidth: 1,
  paddingVertical: spacing.md,
  borderRadius: 12,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingBottom: spacing.md,
})

const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 13,
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
