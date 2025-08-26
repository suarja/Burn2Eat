import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { WeightHeightSelector, WeightHeightWheelSelector } from "@/components/NumberComponents"
import { ActivityWheelPicker } from "@/components/ActivityWheelPicker"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { Toast } from "toastify-react-native"

interface ProfileSetupScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileSetupScreen: FC<ProfileSetupScreenProps> = function ProfileSetupScreen(
  props,
) {
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
      Toast.warn(
        "⚠️ Sélectionne ton sport préféré !",
        'bottom',
        'warning',
        'Ionicons',
        false
      )
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
          'bottom',
          'checkmark-circle',
          'Ionicons',
          false
        )
        
        // Navigate to home after a delay
        setTimeout(() => {
          navigation.navigate("MainTabs", { screen: "Home" })
        }, 2000)
      } else {
        console.error("❌ ProfileSetupScreen: Failed to save profile via DDD:", result.error)
        Toast.error(
          "❌ Erreur lors de la sauvegarde",
          'bottom',
          'close-circle',
          'Ionicons',
          false
        )
      }
    } catch (error) {
      console.error("💥 ProfileSetupScreen: Exception during save:", error)
      Toast.error(
        "💥 Une erreur est survenue",
        'bottom',
        'alert-circle',
        'Ionicons',
        false
      )
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
          
          const primaryActivity = result.userProfile.preferredActivityKeys?.[0] || result.userProfile.primaryActivityKey
          
          if (primaryActivity) {
            setSelectedActivity(primaryActivity)
          }
          
          Toast.info(
            `👋 Salut ! Profil récupéré`,
            'top',
            'person-circle',
            'Ionicons',
            false
          )
        } else {
          console.log("🆕 ProfileSetupScreen: No existing profile via DDD, using defaults")
          Toast.info(
            `🆕 Créons ton profil !`,
            'top',
            'add-circle',
            'Ionicons',
            false
          )
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
      <Header 
        title="🏋️ Configuration"
        leftIcon="back"
        onLeftPress={handleBack}
      />
      
      <View style={themed($contentContainer)}>
        {/* Welcome Message */}
        <Card
          style={themed($welcomeCard)}
          heading="👋 Salut !"
          content="Configure ton profil pour des calculs d'effort personnalisés"
          footer="Quelques infos rapides..."
        />

        {error && (
          <Card
            style={themed($errorCard)}
            preset="reversed"
            heading="❌ Erreur"
            content={error}
          />
        )}

        {/* Physical Stats Card */}
        <Card
          style={themed($physicalCard)}
          heading="📏 Tes mesures"
          footer="Poids et taille pour des calculs précis"
          ContentComponent={
            <View style={themed($cardContent)}>
              {useWheelPicker ? (
                // Ne render le WheelPicker qu'après le chargement initial pour éviter les race conditions
                !isInitialLoad ? (
                  <WeightHeightWheelSelector
                    weight={weight}
                    height={height}
                    onWeightChange={handleWeightChange}
                    onHeightChange={handleHeightChange}
                    style={themed($selectorContainer)}
                  />
                ) : (
                  <Text style={themed($loadingText)}>
                    ⏳ Chargement...
                  </Text>
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

        {/* Activity Selection Card */}
        <Card
          style={themed($activityCard)}
          heading="🏃‍♂️ Ton sport préféré"
          footer="Pour personnaliser tes calculs d'effort"
          ContentComponent={
            <View style={themed($cardContent)}>
              {!isInitialLoad ? (
                <ActivityWheelPicker
                  selectedActivity={selectedActivity}
                  onActivitySelect={(activityKey) => {
                    setSelectedActivity(activityKey)
                  }}
                  height={180}
                />
              ) : (
                <Text style={themed($loadingText)}>
                  ⏳ Chargement des activités...
                </Text>
              )}
            </View>
          }
        />

        {/* Save Button */}
        <Button
          preset="filled"
          style={themed($saveButton)}
          onPress={handleSave}
          disabled={loading || !selectedActivity}
        >
          {loading ? "💾 Sauvegarde..." : "🚀 Commencer l'aventure !"}
        </Button>

        <Text style={themed($footerText)}>
          Tu pourras modifier ces infos plus tard ⚙️
        </Text>
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

const $welcomeCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.gamificationBackground,
  borderColor: colors.gamification,
  borderWidth: 1,
})

const $errorCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.errorBackground,
  borderColor: colors.error,
  borderWidth: 1,
})

const $physicalCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.accent100,
  borderColor: colors.palette.accent500,
  borderWidth: 1,
})

const $activityCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  backgroundColor: colors.successBackground,
  borderColor: colors.success,
  borderWidth: 1,
})

const $cardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
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
  marginTop: spacing.lg,
  marginBottom: spacing.md,
  backgroundColor: colors.gamification,
  borderRadius: 12,
  paddingVertical: spacing.md,
})

const $footerText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 12,
  fontStyle: "italic",
  marginBottom: spacing.lg,
})