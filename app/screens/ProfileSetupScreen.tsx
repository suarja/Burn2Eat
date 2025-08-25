import React, { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { WeightHeightSelector } from "@/components/WeightHeightSelector"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"
import { typography } from "@/theme/typography"

interface ProfileSetupScreenProps extends AppStackScreenProps<"ProfileSetup"> {}

export const ProfileSetupScreen: FC<ProfileSetupScreenProps> = function ProfileSetupScreen(
  props,
) {
  const { navigation } = props
  const { themed } = useAppTheme()
  
  // Temporary state - later will use domain entities
  const [weight, setWeight] = React.useState(75)
  const [height, setHeight] = React.useState(175)

  const handleSave = () => {
    // TODO: Save profile using CreateUserProfileUseCase
    console.log("Saving profile:", { weight, height })
    
    // Navigate to Home screen
    navigation.navigate("Home")
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const $topInsets = useSafeAreaInsetsStyle(["top"])

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <Header 
        title="📋 Ton profil"
        leftIcon="back"
        onLeftPress={handleBack}
        style={$topInsets}
      />
      
      <View style={themed($contentContainer)}>
        <Text preset="subheading" style={themed($welcomeText)}>
          Quelques infos pour personnaliser tes calculs !
        </Text>

        <WeightHeightSelector
          weight={weight}
          height={height}
          onWeightChange={(newWeight) => setWeight(newWeight)}
          onHeightChange={(newHeight) => setHeight(newHeight)}
          style={themed($selectorContainer)}
        />

        {/* Placeholder for activity selection */}
        <Text preset="formLabel" style={themed($sectionLabel)}>
          Activité préférée:
        </Text>
        
        <View style={themed($activityContainer)}>
          <Text style={themed($placeholderText)}>
            🏃‍♂️ Course (sélectionnée par défaut)
          </Text>
        
        </View>

        <Button
          preset="filled"
          style={themed($saveButton)}
          onPress={handleSave}
        >
          Sauvegarder ✅
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
  marginVertical: spacing.lg,
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



const $saveButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xl,
  backgroundColor: colors.palette.primary500,
})