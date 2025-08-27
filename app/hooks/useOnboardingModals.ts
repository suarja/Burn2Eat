import { useState, useCallback } from "react"

export interface OnboardingModalData {
  id: string
  title: string
  content: string
  emoji: string
}

const ONBOARDING_MODALS: OnboardingModalData[] = [
  {
    id: "welcome",
    title: "Découvre ton équilibre",
    content:
      "Transforme ta façon de voir la nourriture ! Comprends l'impact énergétique de tes repas en les convertissant en temps d'exercice.",
    emoji: "🎯",
  },
  {
    id: "tips",
    title: "Conseils bien-être",
    content:
      "• Mange varié et équilibré\n• Reste hydraté(e) tout au long de la journée\n• Bouge au quotidien, même 10 minutes comptent\n• Écoute ton corps et ses besoins",
    emoji: "💡",
  },
  {
    id: "disclaimer",
    title: "Information importante",
    content:
      "Cette application fournit des estimations à des fins éducatives uniquement. Les calculs ne remplacent pas les conseils d'un professionnel de santé. Consulte toujours un médecin ou nutritionniste pour des recommandations personnalisées.",
    emoji: "⚠️",
  },
]

export function useOnboardingModals() {
  const [currentModalIndex, setCurrentModalIndex] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  const currentModal = ONBOARDING_MODALS[currentModalIndex]
  const isLastModal = currentModalIndex === ONBOARDING_MODALS.length - 1
  const totalModals = ONBOARDING_MODALS.length

  const startOnboarding = useCallback(() => {
    setCurrentModalIndex(0)
    setIsModalVisible(true)
    setHasSeenOnboarding(false)
  }, [])

  const nextModal = useCallback(() => {
    if (currentModalIndex < ONBOARDING_MODALS.length - 1) {
      setCurrentModalIndex((prev) => prev + 1)
    }
  }, [currentModalIndex])

  const skipOnboarding = useCallback(() => {
    setIsModalVisible(false)
    setHasSeenOnboarding(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalVisible(false)
    setHasSeenOnboarding(true)
  }, [])

  const resetOnboarding = useCallback(() => {
    setCurrentModalIndex(0)
    setIsModalVisible(false)
    setHasSeenOnboarding(false)
  }, [])

  return {
    // State
    currentModal,
    isModalVisible,
    hasSeenOnboarding,
    currentStep: currentModalIndex + 1,
    totalSteps: totalModals,
    isLastModal,

    // Actions
    startOnboarding,
    nextModal,
    skipOnboarding,
    closeModal,
    resetOnboarding,
  }
}
