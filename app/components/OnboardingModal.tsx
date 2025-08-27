import { FC } from "react"
import { Modal, View, ViewStyle, TextStyle, TouchableOpacity, Animated } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Icon } from "./Icon"
import { Text } from "./Text"

interface OnboardingModalProps {
  visible: boolean
  onClose: () => void
  onNext?: () => void
  onSkip?: () => void
  title: string
  content: string
  emoji: string
  isLastModal?: boolean
  currentStep?: number
  totalSteps?: number
}

export const OnboardingModal: FC<OnboardingModalProps> = function OnboardingModal({
  visible,
  onClose,
  onNext,
  onSkip,
  title,
  content,
  emoji,
  isLastModal = false,
  currentStep = 1,
  totalSteps = 1,
}) {
  const { themed } = useAppTheme()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={themed($overlay)}>
        <View style={themed($modalContainer)}>
          {/* Close Button */}
          <TouchableOpacity
            style={themed($closeButton)}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon icon="x" size={20} />
          </TouchableOpacity>

          {/* Progress Indicator */}
          <View style={themed($progressContainer)}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={themed([
                  $progressDot,
                  index < currentStep ? $progressDotActive : $progressDotInactive,
                ])}
              />
            ))}
          </View>

          {/* Content */}
          <View style={themed($contentContainer)}>
            <Text style={themed($emoji)}>{emoji}</Text>
            <Text preset="heading" style={themed($title)}>
              {title}
            </Text>
            <Text style={themed($content)}>{content}</Text>
          </View>

          {/* Action Buttons */}
          <View style={themed($buttonContainer)}>
            {!isLastModal ? (
              <View style={themed($buttonRow)}>
                <Button preset="default" style={themed($skipButton)} onPress={onSkip}>
                  Passer
                </Button>
                <Button preset="filled" style={themed($nextButton)} onPress={onNext}>
                  Suivant
                </Button>
              </View>
            ) : (
              <Button preset="filled" style={themed($finalButton)} onPress={onClose}>
                C&apos;est parti ! 🚀
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const $overlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay20,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderRadius: 16,
  padding: spacing.lg,
  width: "100%",
  maxWidth: 400,
  maxHeight: "80%",
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  elevation: 24,
})

const $closeButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 1,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 16,
  width: 32,
  height: 32,
  alignItems: "center",
  justifyContent: "center",
})

const $progressContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.md,
  gap: spacing.xs,
})

const $progressDot: ThemedStyle<ViewStyle> = () => ({
  width: 8,
  height: 8,
  borderRadius: 4,
})

const $progressDotActive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})

const $progressDotInactive: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
})

const $contentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

const $emoji: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 48,
  textAlign: "center",
  marginBottom: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 24,
  textAlign: "center",
  marginBottom: spacing.md,
  color: colors.text,
})

const $content: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 16,
  textAlign: "center",
  lineHeight: 24,
  color: colors.textDim,
  marginBottom: spacing.lg,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $buttonRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.md,
})

const $skipButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  borderColor: colors.palette.neutral400,
  borderWidth: 1,
})

const $nextButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.primary500,
})

const $finalButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})
