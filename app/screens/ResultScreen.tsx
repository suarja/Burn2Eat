import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Card } from "@/components/Card"
import { ChoiceModal } from "@/components/ChoiceModal"
import ConfettiCannon from 'react-native-confetti-cannon'
import { FoodCard } from "@/components/FoodCard"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { useFoodCatalog } from "@/hooks/useFoodData"
import { CalculateEffortOutput } from "@/application/usecases"
import { Dish } from "@/domain/nutrition/Dish"
import { Toast } from "toastify-react-native"

interface ResultScreenProps extends AppStackScreenProps<"Result"> {}

export const ResultScreen: FC<ResultScreenProps> = function ResultScreen(props) {
  const { navigation, route } = props
  const { themed } = useAppTheme()

  const [dish, setDish] = useState<Dish | null>(null)
  const [computedEffort, setComputedEffort] = useState<CalculateEffortOutput | null>(null)
  
  // Modal states
  const [showDecisionModal, setShowDecisionModal] = useState(false)
  const [showAteItModal, setShowAteItModal] = useState(false)
  const [showDidntEatModal, setShowDidntEatModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
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

    // Afficher le toast initial puis la modale de décision
    showInitialToast(dish)
    setTimeout(() => {
      setShowDecisionModal(true)
    }, 1500)
  }

  const showInitialToast = (dish: Dish) => {
    const calories = dish.getCalories()
    
    // Messages d'info personnalisés selon les calories
    if (calories < 200) {
      Toast.info(
        `🌟 Choix léger !`,
        'bottom',
        'leaf',
        'Ionicons',
        false
      )
    } else if (calories < 400) {
      Toast.info(
        `⚡ Énergie modérée !`,
        'bottom', 
        'flash',
        'Ionicons',
        false
      )
    } else {
      Toast.info(
        `🔥 Gros apport énergétique !`,
        'bottom',
        'flame',
        'Ionicons', 
        false
      )
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const handleDecisionMade = (decision: 'eat' | 'skip') => {
    setShowDecisionModal(false)
    
    if (decision === 'eat') {
      setShowAteItModal(true)
      // Toast pour dire qu'il va falloir faire du sport
      setTimeout(() => {
        Toast.warn(
          `🏃‍♂️ C'est parti pour l'effort !`,
          'bottom',
          'fitness',
          'Ionicons',
          false
        )
      }, 500)
    } else {
      setShowDidntEatModal(true)
      // Déclencher les confettis pour la félicitation
      setShowConfetti(true)
      setTimeout(() => {
        Toast.success(
          `🎉 Bravo ! Excellent self-control !`,
          'bottom',
          'trophy',
          'Ionicons',
          false
        )
      }, 500)
    }
  }

  const handleAteItConfirm = () => {
    setShowAteItModal(false)
    Toast.info(
      `📝 Ajouté à ton journal !`,
      'bottom',
      'journal',
      'Ionicons',
      false
    )
    setTimeout(() => {
      navigation.navigate("MainTabs", { screen: "Home" })
    }, 1500)
  }

  const handleDidntEatConfirm = () => {
    setShowDidntEatModal(false)
    setShowConfetti(false)
    Toast.success(
      `💪 Continue comme ça !`,
      'bottom',
      'thumbs-up',
      'Ionicons',
      false
    )
    setTimeout(() => {
      navigation.navigate("MainTabs", { screen: "Home" })
    }, 1500)
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
    <>
      <Screen preset="scroll" style={themed($screenContainer)}>
        <Header 
          title="Calcul d'Effort"
          leftIcon="back"
          onLeftPress={handleBack}
        />
        
        <View style={themed($contentContainer)}>
          {/* Food Card Display */}
          <View style={themed($foodCardContainer)}>
            <FoodCard
              dish={dish}
              onPress={() => {}} // Disabled in result view
              size="large"
              disabled={true}
            />
          </View>

          {/* Effort Results Card */}
          <Card
            style={themed($effortCard)}
            preset="reversed"
            heading="🔥 EFFORT NÉCESSAIRE"
            ContentComponent={
              <View style={themed($effortContent)}>
                <Text style={themed($primaryEffort)}>
                  {computedEffort.effort.primary.minutes} min
                </Text>
                <Text style={themed($primaryActivity)}>
                  de {computedEffort.effort.primary.activityLabel}
                </Text>
                
                <View style={themed($alternativesList)}>
                  <Text style={themed($alternativesTitle)}>Ou bien :</Text>
                  {computedEffort.effort.alternatives.slice(0, 2).map((alt, index) => (
                    <Text key={index} style={themed($alternativeItem)}>
                      • {alt.minutes} min de {alt.activityLabel}
                    </Text>
                  ))}
                </View>
              </View>
            }
          />

          <Text style={themed($instruction)}>
            Maintenant, dis-nous : vas-tu manger ce plat ? 🤔
          </Text>
        </View>
      </Screen>

      {/* Decision Modal */}
      <ChoiceModal
        visible={showDecisionModal}
        title="Décision temps ⏰"
        content={`Vas-tu manger ce ${dish.getName()} ?`}
        secondaryContent={`${dish.getCalories()} kcal = ${computedEffort?.effort.primary.minutes} min de sport`}
        icon="🍽️"
        primaryButtonText="Oui, je mange ! 😋"
        secondaryButtonText="Non, je passe 💪"
        onPrimaryPress={() => handleDecisionMade('eat')}
        onSecondaryPress={() => handleDecisionMade('skip')}
        onDismiss={() => setShowDecisionModal(false)}
        variant="default"
      />

      {/* Ate It Modal */}
      <ChoiceModal
        visible={showAteItModal}
        title="Tu l'as mangé ! 🍽️"
        content={`Time to burn those ${dish.getCalories()} calories!`}
        secondaryContent="N'oublie pas de faire ton sport maintenant 💪"
        icon="🏃‍♂️"
        primaryButtonText="J'ajoute à mon journal"
        onPrimaryPress={handleAteItConfirm}
        onDismiss={() => setShowAteItModal(false)}
        variant="challenge"
      />

      {/* Didn't Eat Modal */}
      <ChoiceModal
        visible={showDidntEatModal}
        title="Excellent self-control ! 🎉"
        content="Tu as résisté à la tentation !"
        secondaryContent="Continue comme ça, tu es sur la bonne voie ! 💪"
        icon="🏆"
        primaryButtonText="Retour à l'accueil"
        onPrimaryPress={handleDidntEatConfirm}
        onDismiss={() => setShowDidntEatModal(false)}
        variant="success"
      />

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          fadeOut={true}
          fallSpeed={2500}
          explosionSpeed={350}
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.lg,
})

const $foodCardContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

const $effortCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xl,
  backgroundColor: colors.gamificationBackground,
  borderColor: colors.gamification,
  borderWidth: 2,
})

const $effortContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.md,
})

const $primaryEffort: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 32,
  fontFamily: typography.primary.bold,
  color: colors.gamification,
  textAlign: "center",
  marginBottom: spacing.xs,
})

const $primaryActivity: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.lg,
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

const $instruction: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.text,
  textAlign: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.xl,
  paddingHorizontal: spacing.md,
})