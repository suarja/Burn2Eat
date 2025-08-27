import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { ChoiceModal } from "@/components/ChoiceModal"
import { FoodCard } from "@/components/FoodCard"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useResultEffort } from "@/hooks/useResultEffort"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

/**
 * Refactored ResultScreen following DDD principles
 * 
 * ✅ Clean Architecture Benefits:
 * - Business logic encapsulated in custom hooks
 * - UI layer focuses only on presentation
 * - Domain logic is testable independently
 * - Clear separation of concerns
 */

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()

  // User choice states
  const [showAteItModal, setShowAteItModal] = useState(false)
  const [showDidntEatModal, setShowDidntEatModal] = useState(false)

  // Get params from navigation - either foodId OR dish object
  const { foodId, dish: simpleDish } = route.params

  // Use custom hook that encapsulates all business logic
  const {
    loading,
    error,
    isReady,
    dish,
    actualCalories,
    selectedGrams,
    displayContext,
    effortResult,
    primaryEffort,
    alternativeEfforts,
    suggestedServing,
    quantityText,
    primaryEffortMinutes,
    primaryEffortActivity,
    initializeFromFoodId,
    initializeFromSimpleDish,
    updateQuantity
  } = useResultEffort()

  /**
   * Initialize calculation based on route params
   * This replaces the complex useEffect logic from the original
   */
  useEffect(() => {
    const initializeCalculation = async () => {
      try {
        if (simpleDish) {
          console.log("✅ Using dish object directly from barcode scan:", simpleDish.name)
          await initializeFromSimpleDish(simpleDish)
        } else if (foodId) {
          console.log("🔍 Searching dish by foodId in local database:", foodId)
          await initializeFromFoodId(JSON.parse(JSON.stringify(foodId)).value)
        } else {
          console.log("⚠️ No dish object or foodId provided")
        }
      } catch (error) {
        console.error("❌ Failed to initialize calculation:", error)
      }
    }

    initializeCalculation()
  }, [foodId, simpleDish, initializeFromFoodId, initializeFromSimpleDish])


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

  // Error state
  if (error) {
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
          <Text style={themed($errorText)}>
            {error}
          </Text>
          <Button preset="default" style={themed($retryButton)} onPress={handleBack}>
            Retour
          </Button>
        </View>
      </Screen>
    )
  }

  // Loading state
  if (loading || !isReady) {
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
              Calcul de l'effort nécessaire pour brûler {Math.round(actualCalories || 0)} kcal
              {selectedGrams && ` (${selectedGrams}g)`}
            </Text>

            <Button preset="default" style={themed($cancelButton)} onPress={handleBack}>
              Annuler
            </Button>
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <>
      <Screen preset="scroll" style={themed($screenContainer)}>
        <Header title="Calcul d'Effort" leftIcon="back" onLeftPress={handleBack} />

        <View style={themed($contentContainer)}>
          {/* Food Card Display */}
          <View style={themed($foodCardContainer)}>
            <FoodCard
              dish={dish!}
              onPress={() => {}} 
              size="result"
              displayCalories={actualCalories || 0}
              quantityText={quantityText || ""}
            />
          </View>

          {/* Suggested serving info */}
          <View style={themed($suggestedServingSection)}>
            <Text style={themed($suggestedServingText)}>
              💡 Portion suggérée: {suggestedServing}
            </Text>
          </View>

          {/* Effort Results */}
          <View style={themed($effortSection)}>
            <Text style={themed($sectionTitle)}>⚡ Effort nécessaire</Text>

            <View style={themed($effortContent)}>
              <Text style={themed($primaryEffort)}>
                {primaryEffortMinutes} min
              </Text>
              <Text style={themed($primaryActivity)}>
                de {primaryEffortActivity}
              </Text>

              {alternativeEfforts.length > 0 && (
                <View style={themed($alternativesList)}>
                  <Text style={themed($alternativesTitle)}>Ou bien :</Text>
                  {alternativeEfforts.slice(0, 2).map((alt, index) => (
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
                preset="default"
                style={themed($eatButton)}
                onPress={() => handleDecisionMade("eat")}
              >
                😋 Oui, je mange !
              </Button>

              <Button
                preset="filled"
                style={themed($skipButton)}
                onPress={() => handleDecisionMade("skip")}
              >
                💪 Non, je passe
              </Button>
            </View>
          </View>

          {/* Quantity Selector - At the end for advanced users */}
          {/* <QuantitySelector
            quantity={selectedQuantity}
            onQuantityChange={setSelectedQuantity}
            suggestedServing={suggestedServing}
            initiallyCollapsed={true}
          /> */}
        </View>
      </Screen>

      {/* Confirmation Modals only appear after choice */}
      <ChoiceModal
        visible={showAteItModal}
        title="Tu l'as mangé ! 🍽️"
        content="N'oublie pas de faire ton sport maintenant !"
        secondaryContent={`${primaryEffortMinutes} min de ${primaryEffortActivity}`}
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
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
})

const $skipButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.tint,
  marginBottom: spacing.sm,


})

const $loadingText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.xl,
})

const $errorText: ThemedStyle<TextStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 14,
  fontFamily: typography.primary.normal,
  color: colors.error,
  textAlign: "center",
  marginTop: spacing.md,
  marginBottom: spacing.md,
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
