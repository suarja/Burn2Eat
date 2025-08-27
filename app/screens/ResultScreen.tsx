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
import { Kilocalories } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"
import { useFoodCatalog } from "@/hooks/useFoodData"
import type { AppStackScreenProps, SimpleDish } from "@/navigators/AppNavigator"
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

  // Get params from navigation - either foodId OR dish object
  const { foodId, dish: simpleDish } = route.params

  console.log("Result params:", { foodId, dish: simpleDish })

  const {
    data: { catalog },
    actions: { calculateEffort, calculateEffortForDish, findDish },
  } = useFoodCatalog()

  /**
   * Convert SimpleDish from barcode scanning to full Dish domain object
   */
  const convertSimpleDishToDish = (simpleDish: SimpleDish): Dish => {
    return Dish.create({
      dishId: DishId.from(simpleDish.id),
      name: simpleDish.name,
      nutrition: NutritionalInfo.perServing(simpleDish.calories as Kilocalories),
      imageUrl: undefined, // OpenFoodFacts images not handled yet
    })
  }

  useEffect(() => {
    const getDish = () => {
      // Case 1: Dish object provided directly (from barcode scanning)
      if (simpleDish) {
        console.log("✅ Using dish object directly from barcode scan:", simpleDish.name)
        const domainDish = convertSimpleDishToDish(simpleDish)
        setDish(domainDish)
        return
      }

      // Case 2: Search by foodId in local database (from manual search)
      if (foodId) {
        console.log("🔍 Searching dish by foodId in local database:", foodId)
        const dish = findDish(JSON.parse(JSON.stringify(foodId)).value)
        if (!dish) {
          console.log("❌ Dish not found in local database for foodId:", foodId)
          return
        }
        console.log("✅ Found dish in local database:", dish.getName())
        setDish(dish)
        return
      }

      console.log("⚠️ No dish object or foodId provided")
    }

    getDish()
  }, [foodId, simpleDish, findDish])

  useEffect(() => {
    if (!dish) return
    getCalculatedEffort()
  }, [dish])

  const getCalculatedEffort = async () => {
    if (!dish) return
    
    try {
      let effort
      
      // Use different calculation method based on source
      if (simpleDish) {
        // For barcode scanned dishes, use direct dish calculation
        console.log("🧮 Calculating effort for barcode scanned dish:", dish.getName())
        effort = await calculateEffortForDish(dish)
      } else {
        // For local database dishes, use ID-based calculation  
        console.log("🧮 Calculating effort for local database dish:", dish.getName())
        effort = await calculateEffort(dish.getId().toString())
      }
      
      if (!effort) {
        console.log("❌ No effort calculated for dish:", dish.getName())
        throw new Error("No effort calculated")
      }
      
      console.log("✅ Effort calculated successfully:", effort.effort.primary.minutes, "min")
      setComputedEffort(effort)
    } catch (error) {
      console.error("❌ Error calculating effort:", error)
      throw error
    }
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
        <Header title="Erreur" leftIcon="back" onLeftPress={handleBack} />
        <View style={themed($contentContainer)}>
          <Text style={themed($loadingText)}>
            {simpleDish
              ? "Erreur lors du traitement du produit scanné..."
              : foodId
                ? "Produit non trouvé dans la base de données..."
                : "Aucune donnée de produit fournie..."}
          </Text>
          <Button preset="default" style={themed($retryButton)} onPress={handleBack}>
            Retour
          </Button>
        </View>
      </Screen>
    )

  if (!computedEffort)
    return (
      <Screen preset="fixed" style={themed($screenContainer)}>
        <Header title="Calcul d'Effort" leftIcon="back" onLeftPress={handleBack} />
        <View style={themed($contentContainer)}>
          {/* Show dish info while calculating */}
          {dish && (
            <View style={themed($loadingDishContainer)}>
              <FoodCard
                dish={dish}
                onPress={() => {}} // No action needed
                size="result"
              />
            </View>
          )}
          
          <View style={themed($loadingContainer)}>
            <Text style={themed($loadingTitle)}>⚡ Calcul en cours...</Text>
            <Text style={themed($loadingSubtitle)}>
              Calcul de l'effort nécessaire pour brûler {dish?.getCalories()} kcal
            </Text>
            
            <Button 
              preset="default" 
              style={themed($cancelButton)} 
              onPress={handleBack}
            >
              Annuler
            </Button>
          </View>
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

const $retryButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
  marginTop: spacing.lg,
  alignSelf: "center",
  minWidth: 120,
})

const $loadingDishContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
  width: "75%",
  alignSelf: "center",
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.xl,
  alignItems: "center",
})

const $loadingTitle: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $loadingSubtitle: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.xl,
})

const $cancelButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
  minWidth: 120,
})
