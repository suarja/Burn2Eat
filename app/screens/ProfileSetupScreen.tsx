import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Linking } from "react-native"
import { Toast } from "toastify-react-native"

import { ActivityPickerButton } from "@/components/ActivityPickerButton"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Header } from "@/components/Header"
import { WeightHeightSelector, WeightHeightWheelSelector } from "@/components/NumberComponents"
import { Screen } from "@/components/Screen"
import { Text as TextIgnite } from "@/components/Text"
import { Text } from "@/components/Text"
import { SOCIAL_LINKS } from "@/config/social"
import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { colors } from "@/theme/colors"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ProfileSetupScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileSetupScreen: FC<ProfileSetupScreenProps> = function ProfileSetupScreen(props) {
  const { navigation } = props
  const { themed, theme } = useAppTheme()
  const { multiplier } = useResponsiveSpacing()

  const { createProfile, loadCurrentProfile, loading, error } = useUserProfile()

  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(175)
  const [useWheelPicker, setUseWheelPicker] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<string | null>("jogging") // Default activity
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isEditingExistingProfile, setIsEditingExistingProfile] = useState(false)

  const handleWeightChange = (newWeight: number) => {
    setWeight(newWeight)
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
  }

  const handleSave = async () => {
    if (!selectedActivity) {
      Toast.warn("⚠️ Sélectionne ton sport préféré !", "bottom", "warning", "Ionicons", false)
      return
    }

    try {
      const result = await createProfile({
        sex: "unspecified", // Default sex, can be enhanced later
        weight,
        height,
        preferredActivityKeys: [selectedActivity],
      })

      if (result.success && result.userProfile) {
        const successMessage = isEditingExistingProfile
          ? "✓ Profil mis à jour avec succès !"
          : "🎉 Profil sauvegardé avec succès !"

        Toast.success(successMessage, "bottom", "checkmark-circle", "Ionicons", false)

        if (isEditingExistingProfile) {
          // If editing existing profile, just go back to settings
          setTimeout(() => {
            navigation.goBack()
          }, 1000)
        } else {
          // If new profile (onboarding), navigate to home after a delay
          setTimeout(() => {
            navigation.navigate("MainTabs", { screen: "Home" })
          }, 2000)
        }
      } else {
        console.error("❌ ProfileSetupScreen: Failed to save profile via DDD:", result.error)
        Toast.error("❌ Erreur lors de la sauvegarde", "bottom", "close-circle", "Ionicons", false)
      }
    } catch (error) {
      console.error("💥 ProfileSetupScreen: Exception during save:", error)
      Toast.error("💥 Une erreur est survenue", "bottom", "alert-circle", "Ionicons", false)
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleOpenTikTok = async () => {
    try {
      const url = SOCIAL_LINKS.tiktok
      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        console.warn("Cannot open TikTok URL:", url)
      }
    } catch (error) {
      console.error("Error opening TikTok:", error)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await loadCurrentProfile()

        if (result.success && result.userProfile) {
          setWeight(result.userProfile.weight)
          setHeight(result.userProfile.height)

          const primaryActivity =
            result.userProfile.preferredActivityKeys?.[0] || result.userProfile.primaryActivityKey

          if (primaryActivity) {
            setSelectedActivity(primaryActivity)
          }

          // User has existing profile - they're editing, not creating
          setIsEditingExistingProfile(true)
        } else {
          console.log("🆕 ProfileSetupScreen: No existing profile via DDD, using defaults")
          Toast.info(`🆕 Créons ton profil !`, "top", "add-circle", "Ionicons", false)
          // New user - they're in onboarding
          setIsEditingExistingProfile(false)
        }
      } catch (error) {
        console.warn("❌ ProfileSetupScreen: Failed to load existing profile via DDD:", error)
      } finally {
        setIsInitialLoad(false)
      }
    }

    loadProfile()
  }, [loadCurrentProfile])

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <Header title="Configuration" leftIcon="back" onLeftPress={handleBack} />

      <View style={themed($contentContainer)}>
        {error && <Text style={themed($errorText)}>❌ {error}</Text>}

        {/* Physical Stats Section */}
        <Card
          style={[themed($section), { marginBottom: theme.spacing.xl * multiplier }]}
          ContentComponent={
            <View style={themed($cardContent)}>
              <Text style={themed($sectionTitle)}>📏 Tes mesures</Text>
              <Text style={themed($sectionSubtitle)}>Ajuste ton poids et ta taille</Text>

              {useWheelPicker ? (
                !isInitialLoad ? (
                  <WeightHeightWheelSelector
                    weight={weight}
                    height={height}
                    onWeightChange={handleWeightChange}
                    onHeightChange={handleHeightChange}
                    style={themed($selectorContainer)}
                  />
                ) : (
                  <Text style={themed($loadingText)}>⏳ Chargement...</Text>
                )
              ) : (
                <WeightHeightSelector
                  weight={weight}
                  height={height}
                  onWeightChange={handleWeightChange}
                  onHeightChange={handleHeightChange}
                  style={themed($selectorContainer)}
                />
              )}
            </View>
          }
        />

        {/* Activity Selection Section */}
        <Card
          style={[themed($section), { marginBottom: theme.spacing.xl * multiplier }]}
          ContentComponent={
            <View style={themed($cardContent)}>
              <Text style={themed($sectionTitle)}>🏃 Ton sport préféré</Text>
              <Text style={themed($sectionSubtitle)}>
                Choisis l'activité que tu pratiques le plus souvent
              </Text>

              {!isInitialLoad ? (
                <ActivityPickerButton
                  selectedActivity={selectedActivity}
                  onActivitySelect={(activityKey) => {
                    setSelectedActivity(activityKey)
                  }}
                />
              ) : (
                <Text style={themed($loadingText)}>⏳ Chargement des activités...</Text>
              )}
            </View>
          }
        />

        {/* Save Button */}
        <Button
          preset="filled"
          onPress={handleSave}
          disabled={loading || !selectedActivity}
          style={[themed($saveButtonStyle), { marginTop: theme.spacing.lg * multiplier }]}
        >
          <TextIgnite
            text={
              loading
                ? "💾 Sauvegarde..."
                : isEditingExistingProfile
                  ? "✓ Enregistrer les modifications"
                  : "🚀 Commencer l'aventure !"
            }
          />
        </Button>

        {!isEditingExistingProfile && (
          <Text style={[themed($footerText), { marginTop: theme.spacing.md * multiplier }]}>
            Modifiable dans les paramètres
          </Text>
        )}

        {/* TikTok Community Card */}
        <Card
          style={themed([$communityCard, { marginTop: theme.spacing.xl * multiplier }])}
          ContentComponent={
            <View style={themed($communityCardContent)}>
              <Text preset="subheading" style={themed($communityTitle)}>
                🌟 Rejoins la communauté
              </Text>
              <Text size="sm" style={themed($communityDescription)}>
                Suis-nous sur TikTok pour du contenu motivation, sport et nutrition
              </Text>
              <Button
                text="📱 Voir notre TikTok"
                onPress={handleOpenTikTok}
                style={themed($tiktokButton)}
                preset="default"
              />
            </View>
          }
        />
      </View>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  paddingTop: spacing.lg,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $cardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $mainButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.lg,
  borderRadius: 16,
})

const $saveButtonStyle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingVertical: spacing.lg,
  minHeight: 56,
  borderRadius: 16,
  backgroundColor: colors.palette.primary500,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginBottom: spacing.md,
  textAlign: "center",
})

const $sectionSubtitle: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  marginBottom: spacing.md,
  textAlign: "center",
})

const $selectorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginVertical: spacing.sm,
})

const $loadingText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 14,
  marginVertical: spacing.lg,
  fontStyle: "italic",
})

const $saveButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral600,
  marginBottom: spacing.sm, // Reduced from md to sm
})

const $errorText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  color: colors.error,
  textAlign: "center",
  marginBottom: spacing.lg,
})

const $footerText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 12,
  fontStyle: "italic",
  marginTop: spacing.xs, // Reduced from sm
  marginBottom: spacing.sm, // Reduced from lg
})

const $communityCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $communityCardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  alignItems: "center",
})

const $communityTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.xs,
  fontWeight: "600",
})

const $communityDescription: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.md,
  lineHeight: 20,
})

const $tiktokButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 200,
  marginTop: spacing.xs,
})
