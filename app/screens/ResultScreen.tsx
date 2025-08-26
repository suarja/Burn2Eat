import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { useFoodCatalog } from "@/hooks/useFoodData"
import { CalculateEffortOutput } from "@/application/usecases"
import { Dish } from "@/domain/nutrition/Dish"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()

  const [dish, setDish] = useState<Dish | null>(null)
  const [computedEffort, setComputedEffort] = useState<CalculateEffortOutput | null>(null)
  
  // Get food ID from navigation params
  const { foodId } = route.params

  console.log("Food id param", foodId)
  const {
    data: {catalog},
    actions: {
      calculateEffort,
      findDish
    }
  } = useFoodCatalog()



  useEffect(() => {
    const getDish = () => {
      const dish = findDish(JSON.parse(JSON.stringify(foodId)).value)
      if (!dish) return
      setDish(dish)
    }

    getDish()
  }, [ foodId, findDish])

  useEffect(() => {
    if (!dish) return
    getCalculatedEffort()

  }, [ foodId, dish])


  const getCalculatedEffort = async () => {
    if (!dish) return
    const effort  = await calculateEffort(dish.getId().toString())
    if (!effort) throw new Error("No errror calculated");
    setComputedEffort(effort)

  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleChangeActivity = () => {
    console.log("Activity selector coming soon")
  }

  const handleAddToHistory = () => {

    navigation.navigate("MainTabs", { screen: "Home" }) // Go back to home tabs
  }


  if (!dish) return (
    <View style={themed($contentContainer)} >
      <Text>

      No dish
      </Text>
    </View>
  )
  if (!computedEffort) return (
    <View>
      <Text>

No effort
</Text>
    </View>
  )

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <Header 
        title={dish.getName()}
        leftIcon="back"
        onLeftPress={handleBack}
      />
      
      <View style={themed($contentContainer)}>
        {/* Food Info Card */}
        <Card
          style={themed($foodCard)}
          heading={`${dish.getName()}`}
          content={`${dish.getCalories()} kcal par portion`}
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
                {computedEffort.effort.primary.minutes} min de {computedEffort.effort.primary.activityLabel}
              </Text>
              {computedEffort.effort.alternatives.map((alt, index) => (
                <Text key={index} style={themed($effortItem)}>
                 {alt.minutes} min de {alt.activityLabel}
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