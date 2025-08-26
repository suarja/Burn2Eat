import React, { FC, useEffect } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { WeightHeightSelector, WeightHeightWheelSelector } from "@/components/NumberComponents"
import { ActivitySelector } from "@/components/ActivitySelector"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { UserProfileService } from "@/services/UserProfileService"

interface ProfileSetupScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileSetupScreen: FC<ProfileSetupScreenProps> = function ProfileSetupScreen(
  props,
) {
  const { navigation } = props
  const { themed } = useAppTheme()
  
  // State with persistence support
  const [weight, setWeight] = React.useState(75)
  const [height, setHeight] = React.useState(175)
  const [useWheelPicker, setUseWheelPicker] = React.useState(true) // Toggle between picker types
  const [selectedActivity, setSelectedActivity] = React.useState<string | null>("jogging") // Default activity
  const [loading, setLoading] = React.useState(false)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)


  const handleSave = async () => {
    if (!selectedActivity) return
    
    setLoading(true)
    try {
      await UserProfileService.saveProfile({
        weight,
        height,
        preferredActivityKey: selectedActivity,
      })
      
      // Navigate to Main Tabs (Home)
      navigation.navigate("MainTabs", { screen: "Home" })
    } catch (error) {
      console.error("Failed to save profile:", error)
      // TODO: Show error toast/alert
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  // Load existing profile on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      console.log("🚀 ProfileSetupScreen: Starting to load profile...")
      try {
        const existingProfile = await UserProfileService.getProfile()
        console.log("📋 ProfileSetupScreen: Loaded profile:", existingProfile)
        
        if (existingProfile) {
          console.log("✨ ProfileSetupScreen: Setting state from loaded profile")
          setWeight(existingProfile.weight)
          setHeight(existingProfile.height)
          setSelectedActivity(existingProfile.preferredActivityKey)
        } else {
          console.log("🆕 ProfileSetupScreen: No existing profile, using defaults")
        }
      } catch (error) {
        console.warn("❌ ProfileSetupScreen: Failed to load existing profile:", error)
      } finally {
        setLoading(false)
        setIsInitialLoad(false)
      }
    }

    loadProfile()
  }, [])


  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <Header 
        title="📋 Ton profil"
        leftIcon="back"
        onLeftPress={handleBack}
      />
      
      <View style={themed($contentContainer)}>
        <Text preset="subheading" style={themed($welcomeText)}>
          Quelques infos pour personnaliser tes calculs !
        </Text>

        {/* Debug info */}
        {isInitialLoad && (
          <Text style={themed($debugText)}>
            Chargement du profil...
          </Text>
        )}

        {/* Toggle between picker types
        <Button
          preset="default"
          style={themed($toggleButton)}
          onPress={() => setUseWheelPicker(!useWheelPicker)}
        >
          {useWheelPicker ? "Utiliser steppers" : "Utiliser roue"}
        </Button> */}

        {useWheelPicker ? (
          <WeightHeightWheelSelector
            weight={weight}
            height={height}
            onWeightChange={(newWeight) => setWeight(newWeight)}
            onHeightChange={(newHeight) => setHeight(newHeight)}
            style={themed($selectorContainer)}
          />
        ) : (
          <WeightHeightSelector
            weight={weight}
            height={height}
            onWeightChange={(newWeight) => setWeight(newWeight)}
            onHeightChange={(newHeight) => setHeight(newHeight)}
            style={themed($selectorContainer)}
          />
        )}

        {/* Activity Selection */}
        <ActivitySelector
          selectedActivity={selectedActivity}
          onActivitySelect={setSelectedActivity}
        />

        <Button
          preset="filled"
          style={themed($saveButton)}
          onPress={handleSave}
          disabled={loading || !selectedActivity}
        >
          {loading ? "Sauvegarde..." : "Sauvegarder ✅"}
        </Button>
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

const $welcomeText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  marginBottom: spacing.xl,
  color: colors.textDim,
})

const $selectorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  marginBottom: spacing.md,
})

const $activityContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  padding: spacing.md,
  borderRadius: 8,
  backgroundColor: colors.palette.neutral200,
  marginBottom: spacing.xl,
})

const $placeholderText: ThemedStyle<ViewStyle> = ({ colors }) => ({
  color: colors.text,
  marginBottom: 4,
})



const $toggleButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginVertical: spacing.md,
  backgroundColor: colors.palette.neutral300,
  alignSelf: "center",
})

const $debugText: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 12,
  marginBottom: spacing.md,
})

const $saveButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xl,
  backgroundColor: colors.palette.primary500,
})