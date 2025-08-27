import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { CalculateEffortOutput } from "@/application/usecases"
import { Button } from "@/components/Button"
import { ChoiceModal } from "@/components/ChoiceModal"
import { FoodCard } from "@/components/FoodCard"
import { Header } from "@/components/Header"
import { QuantitySelector } from "@/components/QuantitySelector"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Kilocalories, Grams } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { DishId } from "@/domain/nutrition/DishId"
import { NutritionalInfo } from "@/domain/nutrition/NutritionalInfo"
import { useFoodCatalog } from "@/hooks/useFoodData"
import { getFoodById } from "@/infrastructure/data"
import type { AppStackScreenProps, SimpleDish } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

/**
 * Extract serving size from local food data using the food ID
 */
const extractServingSizeFromLocalDish = (foodId: string): string => {
  const foodData = getFoodById(foodId)
  if (!foodData) {
    console.warn(`Food data not found for ID: ${foodId}`)
    return "100g"
  }

  const { amount, unit } = foodData.portionSize

  // Convert portion size to human-readable string
  if (unit === "100g") {
    return `${amount * 100}g`
  } else if (unit === "piece") {
    return amount === 1 ? "1 pièce" : `${amount} pièces`
  } else if (unit === "slice") {
    return amount === 1 ? "1 tranche" : `${amount} tranches`
  } else if (unit === "cup") {
    return amount === 1 ? "1 tasse" : `${amount} tasses`
  } else if (unit === "serving") {
    return amount === 1 ? "1 portion" : `${amount} portions`
  } else if (unit === "bottle") {
    return amount === 1 ? "1 bouteille" : `${amount} bouteilles`
  } else if (unit === "can") {
    return amount === 1 ? "1 canette" : `${amount} canettes`
  }

  return `${amount} ${unit}`
}

/**
 * Parse serving size string to grams for quantity selector
 * Examples: "21.5g" -> 21.5, "1 slice" -> 50, "100 ml" -> 100
 */
const parseServingSizeToGrams = (servingSize: string): Grams => {
  if (!servingSize) return 100 as Grams

  // Clean and normalize the string
  const normalized = servingSize.toLowerCase().trim()

  // Extract numeric value
  const numMatch = normalized.match(/(\d+(?:\.\d+)?|\d+(?:,\d+)?)/)
  const numValue = numMatch ? parseFloat(numMatch[1].replace(",", ".")) : 100

  // If it already contains 'g' or 'gram', use the value directly
  if (normalized.includes("g")) {
    return Math.max(1, numValue) as Grams
  }

  // Convert common serving units to estimated grams
  if (
    normalized.includes("slice") ||
    normalized.includes("part") ||
    normalized.includes("tranche")
  ) {
    return Math.max(30, numValue * 30) as Grams // 1 slice ≈ 30g
  }

  if (normalized.includes("piece") || normalized.includes("pièce") || normalized.includes("unit")) {
    return Math.max(20, numValue * 20) as Grams // 1 piece ≈ 20g
  }

  if (normalized.includes("ml") || normalized.includes("l")) {
    return Math.max(1, numValue) as Grams // 1ml ≈ 1g for most foods
  }

  if (normalized.includes("cup") || normalized.includes("tasse")) {
    return Math.max(200, numValue * 200) as Grams // 1 cup ≈ 200g
  }

  if (normalized.includes("portion") || normalized.includes("serving")) {
    return Math.max(150, numValue * 150) as Grams // 1 serving ≈ 150g
  }

  if (normalized.includes("bottle") || normalized.includes("bouteille")) {
    return Math.max(330, numValue * 330) as Grams // 1 bottle ≈ 330ml ≈ 330g
  }

  if (normalized.includes("can") || normalized.includes("canette")) {
    return Math.max(250, numValue * 250) as Grams // 1 can ≈ 250ml ≈ 250g
  }

  // Default: assume the number is already in grams or use 100g
  return Math.max(1, numValue) as Grams
}

/**
 * Determine display context for food item based on serving size and food type
 * Returns appropriate quantity text for the FoodCard display
 */
const getDisplayContext = (
  servingSize: string,
  selectedQuantity: Grams,
): { quantityText: string; isPerProduct: boolean } => {
  const normalized = servingSize.toLowerCase().trim()

  // Items that should show "per product" (whole unit consumption)
  const isWholeProductConsumption =
    normalized.includes("piece") ||
    normalized.includes("pièce") ||
    normalized.includes("slice") ||
    normalized.includes("tranche") ||
    normalized.includes("bottle") ||
    normalized.includes("bouteille") ||
    normalized.includes("can") ||
    normalized.includes("canette") ||
    normalized.includes("serving") ||
    normalized.includes("portion")

  if (isWholeProductConsumption) {
    // For whole products, show "pour X pièce(s)/tranche(s)" based on quantity
    const estimatedGramsPerUnit = parseServingSizeToGrams(servingSize)
    const estimatedUnits = Math.round(selectedQuantity / estimatedGramsPerUnit)

    if (normalized.includes("slice") || normalized.includes("tranche")) {
      return {
        quantityText: estimatedUnits === 1 ? "pour 1 tranche" : `pour ${estimatedUnits} tranches`,
        isPerProduct: true,
      }
    } else if (normalized.includes("piece") || normalized.includes("pièce")) {
      return {
        quantityText: estimatedUnits === 1 ? "pour 1 pièce" : `pour ${estimatedUnits} pièces`,
        isPerProduct: true,
      }
    } else if (normalized.includes("bottle") || normalized.includes("bouteille")) {
      return {
        quantityText:
          estimatedUnits === 1 ? "pour 1 bouteille" : `pour ${estimatedUnits} bouteilles`,
        isPerProduct: true,
      }
    } else if (normalized.includes("can") || normalized.includes("canette")) {
      return {
        quantityText: estimatedUnits === 1 ? "pour 1 canette" : `pour ${estimatedUnits} canettes`,
        isPerProduct: true,
      }
    } else {
      return {
        quantityText: estimatedUnits === 1 ? "pour 1 portion" : `pour ${estimatedUnits} portions`,
        isPerProduct: true,
      }
    }
  }

  // Items measured in grams/weight show "per portion"
  return {
    quantityText: `pour ${selectedQuantity}g`,
    isPerProduct: false,
  }
}

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()

  const [dish, setDish] = useState<Dish | null>(null)
  const [computedEffort, setComputedEffort] = useState<CalculateEffortOutput | null>(null)

  // Quantity and calories states - Start with suggested serving
  const [selectedQuantity, setSelectedQuantity] = useState<Grams>(21.5 as Grams)
  const [actualCalories, setActualCalories] = useState<Kilocalories>(0 as Kilocalories)
  const [suggestedServing, setSuggestedServing] = useState<string>("21.5g")

  // User choice states
  const [showAteItModal, setShowAteItModal] = useState(false)
  const [showDidntEatModal, setShowDidntEatModal] = useState(false)

  // Get params from navigation - either foodId OR dish object
  const { foodId, dish: simpleDish } = route.params


  const {
    actions: { calculateEffortForDish, findDish },
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

        // Use actual serving size from OpenFoodFacts or default to 100g
        const actualServingSize = simpleDish.servingSize || "100g"
        console.log("📏 Using serving size from OpenFoodFacts:", actualServingSize)
        setSuggestedServing(actualServingSize)

        // Parse serving size to set initial quantity
        const parsedQuantity = parseServingSizeToGrams(actualServingSize)
        setSelectedQuantity(parsedQuantity)
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

        // Extract serving size from local food data
        const localServingSize = extractServingSizeFromLocalDish(
          JSON.parse(JSON.stringify(foodId)).value,
        )
        setSuggestedServing(localServingSize)
        setSelectedQuantity(parseServingSizeToGrams(localServingSize))
        return
      }

      console.log("⚠️ No dish object or foodId provided")
    }

    getDish()
  }, [foodId, simpleDish, findDish])

  // Calculate actual calories when dish or quantity changes
  useEffect(() => {
    if (!dish) return
    const calories = dish.getNutrition().calculateCaloriesForQuantity(selectedQuantity)
    setActualCalories(calories)
  }, [dish, selectedQuantity])

  useEffect(() => {
    if (!dish || !actualCalories) return

    const calculateEffort = async () => {
      try {
        // Create a temporary dish with adjusted calories for effort calculation
        const adjustedNutrition = NutritionalInfo.perServing(actualCalories)
        const adjustedDish = Dish.create({
          dishId: dish.getId(),
          name: dish.getName(),
          nutrition: adjustedNutrition,
          imageUrl: dish.getImageUrl(),
        })

        // Always use calculateEffortForDish since we have adjusted calories
        console.log(
          `🧮 Calculating effort for ${selectedQuantity}g of ${dish.getName()} (${actualCalories} kcal)`,
        )
        const effort = await calculateEffortForDish(adjustedDish)

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

    calculateEffort()
  }, [dish, actualCalories, selectedQuantity])

  const handleBack = () => {
    navigation.goBack()
  }

  const handleDecisionMade = (decision: "eat" | "skip") => {
    if (decision === "eat") {
      setShowAteItModal(true)
    } else {
      setShowDidntEatModal(true)
    }
  }

  const handleAteItConfirm = () => {
    setShowAteItModal(false)
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  const handleDidntEatConfirm = () => {
    setShowDidntEatModal(false)
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
              Calcul de l'effort nécessaire pour brûler {Math.round(actualCalories)} kcal (
              {selectedQuantity}g)
            </Text>

            <Button preset="default" style={themed($cancelButton)} onPress={handleBack}>
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
              displayCalories={actualCalories}
              quantityText={getDisplayContext(suggestedServing, selectedQuantity).quantityText}
            />
          </View>

          {/* Suggested serving info */}
          <View style={themed($suggestedServingSection)}>
            <Text style={themed($suggestedServingText)}>
              💡 Portion suggérée: {suggestedServing}
            </Text>
          </View>

          {/* Effort Results - Simplified without Card wrapper */}
          <View style={themed($effortSection)}>
            <Text style={themed($sectionTitle)}>⚡ Effort nécessaire</Text>

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

          {/* Decision Section - Always visible */}
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

          {/* Quantity Selector - At the end for advanced users */}
          <QuantitySelector
            quantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
            suggestedServing={suggestedServing}
            initiallyCollapsed={true}
          />
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

const $suggestedServingSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  alignItems: "center",
  marginBottom: spacing.md,
  backgroundColor: colors.palette.accent100,
  borderRadius: 8,
  padding: spacing.sm,
})

const $suggestedServingText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.medium,
  color: "black",
  textAlign: "center",
})

const $effortSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  padding: spacing.lg, // Reduced padding
  marginBottom: spacing.lg, // Reduced spacing
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ colors, typography, spacing }) => ({
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

const $questionText: ThemedStyle<ViewStyle> = ({ colors, typography, spacing }) => ({
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

const $loadingSubtitle: ThemedStyle<ViewStyle> = ({ colors, typography, spacing }) => ({
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
