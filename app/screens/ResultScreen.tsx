import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, Linking } from "react-native"

import { Button } from "@/components/Button"
import { ChoiceModal } from "@/components/ChoiceModal"
import { FoodCard } from "@/components/FoodCard"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { SOCIAL_LINKS } from "@/config/social"
import { useRecordConsumption } from "@/hooks/useRecordConsumption"
import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
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
  const { themed, theme } = useAppTheme()
  const { multiplier } = useResponsiveSpacing()

  // Typography and spacing scaling for iPad - balanced for readability and viewport fit
  const typographyScale = multiplier > 1 ? 1.7 : 1
  const spacingScale = multiplier > 1 ? 1.3 : 1

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
    alternativeEfforts,
    suggestedServing,
    quantityText,
    primaryEffortMinutes,
    primaryEffortActivity,
    initializeFromFoodId,
    initializeFromSimpleDish,
  } = useResultEffort()

  // Hook for recording consumption to history
  const { recordConsumption } = useRecordConsumption()

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

  const handleAteItConfirm = async () => {
    // Record consumption to history before navigating away
    try {
      if (
        dish &&
        actualCalories !== null &&
        actualCalories !== undefined &&
        primaryEffortMinutes &&
        primaryEffortActivity
      ) {
        await recordConsumption({
          dish,
          calories: actualCalories,
          primaryEffort: {
            minutes: primaryEffortMinutes,
            activityLabel: primaryEffortActivity,
          },
          gramsConsumed: selectedGrams ?? undefined,
        })
        console.log("✅ Consumption recorded to history")
      }
    } catch (error) {
      console.error("❌ Failed to record consumption:", error)
      // Non-blocking error - don't interrupt user flow
    }

    setShowAteItModal(false)
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  const handleDidntEatConfirm = () => {
    setShowDidntEatModal(false)
    navigation.navigate("MainTabs", { screen: "Home" })
  }

  const handleOpenTikTok = async () => {
    try {
      const url = SOCIAL_LINKS.tiktok
      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        console.warn("Cannot open TikTok URL:", url)
      }
    } catch (error) {
      console.error("Error opening TikTok:", error)
    }
  }

  // Error state
  if (error) {
    return (
      <Screen preset="fixed" style={themed($screenContainer)}>
        <Header title="Erreur" leftIcon="back" onLeftPress={handleBack} />
        <View style={[themed($contentContainer), { padding: theme.spacing.lg * spacingScale }]}>
          <Text
            style={[
              themed($loadingText),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                fontSize: 18 * typographyScale,
                marginTop: theme.spacing.xl * spacingScale,
              },
            ]}
          >
            {simpleDish
              ? "Erreur lors du traitement du produit scanné..."
              : foodId
                ? "Produit non trouvé dans la base de données..."
                : "Aucune donnée de produit fournie..."}
          </Text>
          <Text
            style={[
              themed($errorText),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                fontSize: 14 * typographyScale,
                marginTop: theme.spacing.md * spacingScale,
                marginBottom: theme.spacing.md * spacingScale,
              },
            ]}
          >
            {error}
          </Text>
          <Button
            preset="default"
            style={[
              themed($retryButton),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                marginTop: theme.spacing.lg * spacingScale,
              },
            ]}
            onPress={handleBack}
          >
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
        <View style={[themed($contentContainer), { padding: theme.spacing.lg * spacingScale }]}>
          {/* Show dish info while calculating */}
          {dish && (
            <View
              style={[
                themed($loadingDishContainer),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  width: multiplier > 1 ? "95%" : "75%", // Wider on iPad to accommodate larger cards
                  marginBottom: theme.spacing.lg * spacingScale,
                },
              ]}
            >
              <FoodCard
                dish={dish}
                onPress={() => {}} // No action needed
                size="result"
              />
            </View>
          )}

          <View
            style={[
              themed($loadingContainer),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                padding: theme.spacing.xl * spacingScale,
              },
            ]}
          >
            <Text
              style={[
                themed($loadingTitle),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 20 * typographyScale,
                  marginBottom: theme.spacing.sm * spacingScale,
                },
              ]}
            >
              ⚡ Calcul en cours...
            </Text>
            <Text
              style={[
                themed($loadingSubtitle),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 16 * typographyScale,
                  marginBottom: theme.spacing.xl * spacingScale,
                },
              ]}
            >
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

        <View
          style={[
            themed($contentContainer),
            {
              padding: multiplier > 1 ? theme.spacing.sm * multiplier : theme.spacing.md,
            },
          ]}
        >
          {/* Food Card Display */}
          <View
            style={[
              themed($foodCardContainer),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                width: multiplier > 1 ? "95%" : "75%", // Wider on iPad to accommodate larger cards
                marginBottom: multiplier > 1 ? theme.spacing.md * spacingScale : theme.spacing.md,
              },
            ]}
          >
            <FoodCard
              dish={dish!}
              onPress={() => {}}
              size="result"
              displayCalories={actualCalories || 0}
              // quantityText removed - displayed in suggestedServing section below to avoid duplication
            />
          </View>

          {/* Suggested serving info */}
          <View
            style={[
              themed($suggestedServingSection),
              {
                marginBottom: multiplier > 1 ? theme.spacing.md * spacingScale : theme.spacing.md,
                padding: multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.sm,
              },
            ]}
          >
            <Text
              style={[
                themed($suggestedServingText),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 14 * typographyScale,
                  lineHeight: multiplier > 1 ? 26 * typographyScale : undefined,
                },
              ]}
            >
              💡 Portion suggérée: {suggestedServing}
              {quantityText && ` (${quantityText})`}
            </Text>
          </View>

          {/* Effort Results */}
          <View
            style={[
              themed($effortSection),
              {
                padding: multiplier > 1 ? theme.spacing.md * spacingScale : theme.spacing.md,
                marginBottom: multiplier > 1 ? theme.spacing.md * spacingScale : theme.spacing.md,
              },
            ]}
          >
            <Text
              style={[
                themed($sectionTitle),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 18 * typographyScale,
                  lineHeight: multiplier > 1 ? 32 * typographyScale : undefined,
                  marginBottom: multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.sm,
                },
              ]}
            >
              ⚡ Effort nécessaire
            </Text>

            <View style={themed($effortContent)}>
              <Text
                style={[
                  themed($primaryEffort),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 24 * typographyScale,
                    lineHeight: multiplier > 1 ? 36 * typographyScale : undefined,
                    marginBottom:
                      multiplier > 1 ? theme.spacing.xs * spacingScale : theme.spacing.xs,
                  },
                ]}
              >
                {primaryEffortMinutes} min
              </Text>
              <Text
                style={[
                  themed($primaryActivity),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 18 * typographyScale,
                    lineHeight: multiplier > 1 ? 32 * typographyScale : undefined,
                    marginBottom:
                      multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.sm,
                  },
                ]}
                numberOfLines={multiplier > 1 ? 2 : 1}
              >
                de {primaryEffortActivity}
              </Text>

              {alternativeEfforts.length > 0 && (
                <View
                  style={[
                    themed($alternativesList),
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      marginTop:
                        multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      themed($alternativesTitle),
                      // eslint-disable-next-line react-native/no-inline-styles
                      {
                        fontSize: 14 * typographyScale,
                        lineHeight: multiplier > 1 ? 26 * typographyScale : undefined,
                        marginBottom:
                          multiplier > 1 ? theme.spacing.xs * spacingScale : theme.spacing.xs,
                      },
                    ]}
                  >
                    Ou bien :
                  </Text>
                  {alternativeEfforts.slice(0, 2).map((alt, index) => (
                    <Text
                      key={index}
                      style={[
                        themed($alternativeItem),
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                          fontSize: 14 * typographyScale,
                          lineHeight: multiplier > 1 ? 26 * typographyScale : undefined,
                          marginBottom:
                            multiplier > 1 ? theme.spacing.xxs * spacingScale : theme.spacing.xxs,
                        },
                      ]}
                    >
                      • {alt.minutes} min de {alt.activityLabel}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Decision Section - Always visible */}
          <View
            style={[
              themed($decisionSection),
              // eslint-disable-next-line react-native/no-inline-styles
              {
                marginTop: multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.md,
              },
            ]}
          >
            <Text
              style={[
                themed($questionText),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontSize: 18 * typographyScale,
                  lineHeight: multiplier > 1 ? 32 * typographyScale : undefined,
                  marginBottom: multiplier > 1 ? theme.spacing.md * spacingScale : theme.spacing.lg,
                },
              ]}
            >
              Vas-tu manger ce plat ? 🤔
            </Text>

            <View
              style={[
                themed($choiceButtons),
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  gap: multiplier > 1 ? theme.spacing.sm * spacingScale : theme.spacing.md,
                },
              ]}
            >
              <Button
                preset="default"
                style={[
                  themed($eatButton),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    minHeight: multiplier > 1 ? 70 : 44,
                    paddingVertical:
                      multiplier > 1 ? theme.spacing.md * multiplier : theme.spacing.sm,
                    paddingHorizontal: multiplier > 1 ? theme.spacing.md : theme.spacing.md,
                  },
                ]}
                textStyle={
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 16 * typographyScale,
                    lineHeight: multiplier > 1 ? 32 * typographyScale : undefined,
                  }
                }
                onPress={() => handleDecisionMade("eat")}
              >
                😋 Oui, je mange !
              </Button>

              <Button
                preset="filled"
                style={[
                  themed($skipButton),
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    minHeight: multiplier > 1 ? 70 : 44,
                    paddingVertical:
                      multiplier > 1 ? theme.spacing.md * multiplier : theme.spacing.sm,
                    paddingHorizontal: multiplier > 1 ? theme.spacing.md : theme.spacing.md,
                    marginBottom: multiplier > 1 ? theme.spacing.sm * spacingScale : 0,
                  },
                ]}
                textStyle={
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    fontSize: 16 * typographyScale,
                    lineHeight: multiplier > 1 ? 32 * typographyScale : undefined,
                  }
                }
                onPress={() => handleDecisionMade("skip")}
              >
                💪 Non, je passe
              </Button>
              {/* Discrete TikTok link */}
              <Text size="xs" style={themed($tiktokLink)} onPress={handleOpenTikTok}>
                🎥 Besoin de motivation ? Suis-nous sur TikTok
              </Text>
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

const $contentContainer: ThemedStyle<ViewStyle> = ({}) => ({
  // padding is applied inline with responsive scaling
})

const $foodCardContainer: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
  alignSelf: "center",
  // width and marginBottom are applied inline with responsive scaling
})

const $suggestedServingSection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  alignItems: "center",
  backgroundColor: colors.palette.accent100,
  borderRadius: 8,
  // padding and marginBottom are applied inline with responsive scaling
})

const $suggestedServingText: ThemedStyle<TextStyle> = ({ typography }) => ({
  fontFamily: typography.primary.medium,
  color: "black",
  textAlign: "center",
  // fontSize is applied inline with responsive scaling
})

const $effortSection: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  // padding and marginBottom are applied inline with responsive scaling
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $effortContent: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
})

const $primaryEffort: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.bold,
  color: colors.tint,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $primaryActivity: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $alternativesList: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
  // marginTop is applied inline with responsive scaling
})

const $alternativesTitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $alternativeItem: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $decisionSection: ThemedStyle<ViewStyle> = ({}) => ({
  // marginTop is applied inline with responsive scaling
})

const $questionText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $choiceButtons: ThemedStyle<ViewStyle> = ({}) => ({
  // gap is applied inline with responsive scaling
})

const $eatButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
})

const $skipButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
  // marginBottom is applied inline with responsive scaling
})

const $loadingText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  textAlign: "center",
  // fontSize and marginTop are applied inline with responsive scaling
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.normal,
  color: colors.error,
  textAlign: "center",
  // fontSize, marginTop and marginBottom are applied inline with responsive scaling
})

const $retryButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
  alignSelf: "center",
  minWidth: 120,
  // marginTop is applied inline with responsive scaling
})

const $loadingDishContainer: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
  alignSelf: "center",
  // width and marginBottom are applied inline with responsive scaling
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 12,
  alignItems: "center",
  // padding is applied inline with responsive scaling
})

const $loadingTitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $loadingSubtitle: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontFamily: typography.primary.medium,
  color: colors.textDim,
  textAlign: "center",
  // fontSize and marginBottom are applied inline with responsive scaling
})

const $cancelButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
  minWidth: 120,
})

const $tiktokLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
  fontSize: 12,
})
