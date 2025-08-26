import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Toast } from "toastify-react-native"

import { CalculateEffortOutput } from "@/application/usecases"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { ChoiceModal } from "@/components/ChoiceModal"
import { FoodCard } from "@/components/FoodCard"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Dish } from "@/domain/nutrition/Dish"
import { useFoodCatalog } from "@/hooks/useFoodData"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()

  const [dish, setDish] = useState<Dish | null>(null)
  const [computedEffort, setComputedEffort] = useState<CalculateEffortOutput | null>(null)

  // User choice states
  const [userChoice, setUserChoice] = useState<"eat" | "skip" | null>(null)
  const [showAteItModal, setShowAteItModal] = useState(false)
  const [showDidntEatModal, setShowDidntEatModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Get food ID from navigation params
  const { foodId } = route.params

  console.log("Food id param", foodId)
  const {
    data: { catalog },
    actions: { calculateEffort, findDish },
  } = useFoodCatalog()

  useEffect(() => {
    const getDish = () => {
      const dish = findDish(JSON.parse(JSON.stringify(foodId)).value)
      if (!dish) return
      setDish(dish)
    }

    getDish()
  }, [foodId, findDish])

  useEffect(() => {
    if (!dish) return
    getCalculatedEffort()
  }, [foodId, dish])

  const getCalculatedEffort = async () => {
    if (!dish) return
    const effort = await calculateEffort(dish.getId().toString())
    if (!effort) throw new Error("No error calculated")
    setComputedEffort(effort)
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleDecisionMade = (decision: "eat" | "skip") => {
    setUserChoice(decision)

    if (decision === "eat") {
      setShowAteItModal(true)
    } else {
      setShowDidntEatModal(true)
      // Déclencher les confettis pour la félicitation
      setShowConfetti(true)
    }
  }

  const handleAteItConfirm = () => {
    setShowAteItModal(false)
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  const handleDidntEatConfirm = () => {
    setShowDidntEatModal(false)
    setShowConfetti(false)
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  if (!dish)
    return (
      <Screen preset="fixed" style={themed($screenContainer)}>
        <View style={themed($contentContainer)}>
          <Text style={themed($loadingText)}>Plat non trouvé...</Text>
        </View>
      </Screen>
    )

  if (!computedEffort)
    return (
      <Screen preset="fixed" style={themed($screenContainer)}>
        <View style={themed($contentContainer)}>
          <Text style={themed($loadingText)}>Calcul en cours...</Text>
        </View>
      </Screen>
    )

  return (
    <>
      <Screen preset="scroll" style={themed($screenContainer)}>
        <Header title="Calcul d'Effort" leftIcon="back" onLeftPress={handleBack} />

        <View style={themed($contentContainer)}>
          {/* Food Card Display */}
          <View style={themed($foodCardContainer)}>
            <FoodCard
              dish={dish}
              onPress={() => {}} // No action needed in result view
              size="result"
            />
          </View>

          {/* Effort Results - Simplified without Card wrapper */}
          <View style={themed($effortSection)}>
            <Text style={themed($sectionTitle)}>🔥 Effort nécessaire</Text>

            <View style={themed($effortContent)}>
              <Text style={themed($primaryEffort)}>
                {computedEffort.effort.primary.minutes} min
              </Text>
              <Text style={themed($primaryActivity)}>
                de {computedEffort.effort.primary.activityLabel}
              </Text>

              {computedEffort.effort.alternatives.length > 0 && (
                <View style={themed($alternativesList)}>
                  <Text style={themed($alternativesTitle)}>Ou bien :</Text>
                  {computedEffort.effort.alternatives.slice(0, 2).map((alt, index) => (
                    <Text key={index} style={themed($alternativeItem)}>
                      • {alt.minutes} min de {alt.activityLabel}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Decision Section */}
          <View style={themed($decisionSection)}>
            <Text style={themed($questionText)}>Vas-tu manger ce plat ? 🤔</Text>

            <View style={themed($choiceButtons)}>
              <Button
                preset="filled"
                style={themed($eatButton)}
                onPress={() => handleDecisionMade("eat")}
              >
                😋 Oui, je mange !
              </Button>

              <Button
                preset="default"
                style={themed($skipButton)}
                onPress={() => handleDecisionMade("skip")}
              >
                💪 Non, je passe
              </Button>
            </View>
          </View>
        </View>
      </Screen>

      {/* Confirmation Modals only appear after choice */}
      <ChoiceModal
        visible={showAteItModal}
        title="Tu l'as mangé ! 🍽️"
        content="N'oublie pas de faire ton sport maintenant !"
        secondaryContent={`${computedEffort?.effort.primary.minutes} min de ${computedEffort?.effort.primary.activityLabel}`}
        icon="🏃‍♂️"
        primaryButtonText="Retourner à l'accueil"
        onPrimaryPress={handleAteItConfirm}
        onDismiss={() => setShowAteItModal(false)}
        variant="challenge"
      />

      <ChoiceModal
        visible={showDidntEatModal}
        title="Excellent self-control ! 🎉"
        content="Tu as résisté à la tentation !"
        secondaryContent="Continue comme ça, tu es sur la bonne voie ! 💪"
        icon="🏆"
        primaryButtonText="Retourner à l'accueil"
        onPrimaryPress={handleDidntEatConfirm}
        onDismiss={() => setShowDidntEatModal(false)}
        variant="success"
      />
    </>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg, // Reduced padding to fit more content
})

const $foodCardContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.lg, // Reduced spacing
  width: "75%", // Reduced width to prevent overflow
  alignSelf: "center",
})

const $effortSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.lg, // Reduced padding
  marginBottom: spacing.lg, // Reduced spacing
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.md,
})

const $effortContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
})

const $primaryEffort: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 24, // Increased from 24px for better hierarchy
  fontFamily: typography.primary.bold,
  color: colors.tint,
  textAlign: "center",
  marginBottom: spacing.xs,
})

const $primaryActivity: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18, // Increased from 16px for better hierarchy
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $alternativesList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.sm,
})

const $alternativesTitle: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  marginBottom: spacing.xs,
})

const $alternativeItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: spacing.xxxs,
  textAlign: "center",
})

const $decisionSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $questionText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.lg,
})

const $choiceButtons: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $eatButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.tint,
  marginBottom: spacing.sm,
})

const $skipButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
})

const $loadingText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.xl,
})
