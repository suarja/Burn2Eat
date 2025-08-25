import React, { FC } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()
  
  // Get food ID from navigation params
  const { foodId } = route.params

  // Mock data - later will come from use cases
  const mockFoodData = {
    pizza: { name: "Pizza Reine", emoji: "🍕", calories: 450 },
    burger: { name: "Burger Classique", emoji: "🍔", calories: 540 },
    frites: { name: "Frites", emoji: "🍟", calories: 365 },
    soda: { name: "Soda", emoji: "🥤", calories: 150 },
    glace: { name: "Glace Vanille", emoji: "🍦", calories: 280 },
    salade: { name: "Salade Verte", emoji: "🥗", calories: 120 },
  }

  const food = mockFoodData[foodId as keyof typeof mockFoodData] || mockFoodData.pizza

  // Mock effort calculations (later from EffortCalculator)
  const effortData = {
    primary: { activity: "course", time: Math.round(food.calories / 10), emoji: "🏃‍♂️" },
    alternatives: [
      { activity: "marche", time: Math.round(food.calories / 6), emoji: "🚶" },
      { activity: "crossfit", time: Math.round(food.calories / 18), emoji: "💪" },
    ]
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleChangeActivity = () => {
    console.log("Activity selector coming soon")
  }

  const handleAddToHistory = () => {
    console.log("Adding to history:", food.name)
    navigation.navigate("Home") // Go back to home for now
  }

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <Header 
        title={food.name}
        leftIcon="back"
        onLeftPress={handleBack}
      />
      
      <View style={themed($contentContainer)}>
        {/* Food Info Card */}
        <Card
          style={themed($foodCard)}
          heading={`${food.emoji} ${food.name}`}
          content={`${food.calories} kcal par portion`}
          footer="Informations nutritionnelles"
        />

        {/* Effort Results Card */}
        <Card
          style={themed($effortCard)}
          preset="reversed"
          heading="🔥 EFFORT NÉCESSAIRE:"
          ContentComponent={
            <View style={themed($effortContent)}>
              <Text style={themed($effortItem)}>
                {effortData.primary.emoji} {effortData.primary.time} min de {effortData.primary.activity}
              </Text>
              {effortData.alternatives.map((alt, index) => (
                <Text key={index} style={themed($effortItem)}>
                  {alt.emoji} {alt.time} min de {alt.activity}
                </Text>
              ))}
            </View>
          }
        />

        {/* Action Buttons */}
        <View style={themed($actionButtons)}>
          <Button
            preset="default"
            style={themed($actionButton)}
            onPress={handleChangeActivity}
          >
            Changer sport ⚡
          </Button>
          
          <Button
            preset="filled"
            style={themed($actionButton)}
            onPress={handleAddToHistory}
          >
            Ajouter à l'historique
          </Button>
        </View>

        <Text style={themed($comingSoon)}>
          Calculs réels et animation confettis à venir...
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

const $foodCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $effortCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  backgroundColor: colors.palette.accent200, // Gradient placeholder
})

const $effortContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
})

const $effortItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  fontSize: 16,
  color: colors.text,
  marginBottom: spacing.xs,
  textAlign: "center",
})

const $actionButtons: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.sm,
  marginBottom: spacing.xl,
})

const $actionButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginHorizontal: spacing.xs,
})

const $comingSoon: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 12,
  fontStyle: "italic",
  marginTop: spacing.md,
})