import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { Toast } from "toastify-react-native"
import {Text as TextIgnite} from '@/components/Text'

import { ActivityWheelPicker } from "@/components/ActivityWheelPicker"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Header } from "@/components/Header"
import { WeightHeightSelector, WeightHeightWheelSelector } from "@/components/NumberComponents"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { colors } from "@/theme/colors"

interface ProfileSetupScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileSetupScreen: FC<ProfileSetupScreenProps> = function ProfileSetupScreen(props) {
  const { navigation } = props
  const { themed } = useAppTheme()

  const { createProfile, loadCurrentProfile, loading, error } = useUserProfile()

  const [weight, setWeight] = useState(75)
  const [height, setHeight] = useState(175)
  const [useWheelPicker, setUseWheelPicker] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState<string | null>("jogging") // Default activity
  const [isInitialLoad, setIsInitialLoad] = useState(true)

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
        Toast.success(
          "🎉 Profil sauvegardé avec succès !",
          "bottom",
          "checkmark-circle",
          "Ionicons",
          false,
        )

        // Navigate to home after a delay
        setTimeout(() => {
          navigation.navigate("MainTabs", { screen: "Home" })
        }, 2000)
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
        } else {
          console.log("🆕 ProfileSetupScreen: No existing profile via DDD, using defaults")
          Toast.info(`🆕 Créons ton profil !`, "top", "add-circle", "Ionicons", false)
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
        <View style={themed($section)}>
          <Text style={themed($sectionTitle)}>📏 Tes mesures</Text>

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

        {/* Activity Selection Section */}
        <View style={themed($section)}>
          {!isInitialLoad ? (
            <ActivityWheelPicker
              selectedActivity={selectedActivity}
              onActivitySelect={(activityKey) => {
                setSelectedActivity(activityKey)
              }}
              height={120} // Reduced height from 150
            />
          ) : (
            <Text style={themed($loadingText)}>⏳ Chargement des activités...</Text>
          )}
        </View>

        {/* Save Button */}
        <Button
          preset="filled"
          onPress={handleSave}
          disabled={loading || !selectedActivity}
        >
          <TextIgnite text={loading ? "💾 Sauvegarde..." : "🚀 Commencer l'aventure !"} />
        </Button>

        <Text style={themed($footerText)}>Modifiable dans les paramètres</Text>
      </View>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm, // Reduced from xl to lg
})

const $mainButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.primary500,
  paddingVertical: spacing.lg,
  borderRadius: 16,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
  marginBottom: spacing.sm,
})

const $sectionSubtitle: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: spacing.sm, // Reduced from md to sm
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
