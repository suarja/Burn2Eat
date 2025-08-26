import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { WeightHeightSelector, WeightHeightWheelSelector } from "@/components/NumberComponents"
import { ActivityWheelPicker } from "@/components/ActivityWheelPicker"
import { useUserProfile } from "@/hooks/useUserProfile"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"

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
    if (!selectedActivity) return
    
    try {
      const result = await createProfile({
        sex: "unspecified", // Default sex, can be enhanced later
        weight,
        height,
        preferredActivityKeys: [selectedActivity], 
      })
      
      if (result.success && result.userProfile) {
        navigation.navigate("MainTabs", { screen: "Home" })
      } else {
        console.error("❌ ProfileSetupScreen: Failed to save profile via DDD:", result.error)
        // TODO: Show error toast/alert with result.error
      }
    } catch (error) {
      console.error("💥 ProfileSetupScreen: Exception during save:", error)
      // TODO: Show error toast/alert
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  useEffect(() => {
    const loadProfile = async () => {
      console.log("🚀 ProfileSetupScreen: Starting to load profile with DDD...")
      try {
        const result = await loadCurrentProfile()
        
        if (result.success && result.userProfile) {
          setWeight(result.userProfile.weight)
          setHeight(result.userProfile.height)
          
          const primaryActivity = result.userProfile.preferredActivityKeys?.[0] || result.userProfile.primaryActivityKey
          
          if (primaryActivity) {
            setSelectedActivity(primaryActivity)
          }
          
        } else {
          console.log("🆕 ProfileSetupScreen: No existing profile via DDD, using defaults")
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
        title="📋 Ton profil"
        leftIcon="back"
        onLeftPress={handleBack}
      />
      
      <View style={themed($contentContainer)}>
  

        {/* Debug info */}
        {(isInitialLoad || loading) && (
          <Text style={themed($debugText)}>
            Chargement du profil...
          </Text>
        )}

        {error && (
          <Text style={themed($errorText)}>
            ❌ Erreur: {error}
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
            <Text style={themed($debugText)}>
              Chargement des wheel pickers...
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

        {/* Activity Selection */}
        {!isInitialLoad ? (
          <ActivityWheelPicker
            selectedActivity={selectedActivity}
            onActivitySelect={(activityKey) => {
              setSelectedActivity(activityKey)
            }}
            height={180}
          />
        ) : (
          <Text style={themed($debugText)}>
            Chargement de l'activité...
          </Text>
        )}

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

const $errorText: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.error,
  fontSize: 12,
  marginBottom: spacing.md,
})

const $saveButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xl,
  backgroundColor: colors.palette.primary500,
})