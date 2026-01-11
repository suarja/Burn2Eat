/* eslint-disable react-native/no-inline-styles */
import { View, ViewStyle, TextStyle, Modal, Pressable } from "react-native"

import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { Text } from "./Text"

export interface ChoiceModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean
  /**
   * Title of the modal
   */
  title: string
  /**
   * Main content text
   */
  content: string
  /**
   * Optional secondary content
   */
  secondaryContent?: string
  /**
   * Icon/emoji to display
   */
  icon?: string
  /**
   * Primary button text
   */
  primaryButtonText: string
  /**
   * Secondary button text (optional)
   */
  secondaryButtonText?: string
  /**
   * Primary button callback
   */
  onPrimaryPress: () => void
  /**
   * Secondary button callback
   */
  onSecondaryPress?: () => void
  /**
   * Callback when modal is dismissed by backdrop
   */
  onDismiss: () => void
  /**
   * Theme variant
   */
  variant?: "success" | "challenge" | "default"
}

export const ChoiceModal: React.FC<ChoiceModalProps> = ({
  visible,
  title,
  content,
  secondaryContent,
  icon,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  onDismiss,
  variant = "default",
}) => {
  const { themed, theme } = useAppTheme()

  const { multiplier } = useResponsiveSpacing()

  const getVariantColors = () => {
    switch (variant) {
      case "success":
        return {
          background: theme.colors.successBackground,
          accent: theme.colors.success,
        }
      case "challenge":
        return {
          background: theme.colors.tintInactive,
          accent: theme.colors.palette.secondary200,
        }
      default:
        return {
          background: theme.colors.palette.neutral100,
          accent: theme.colors.tint,
        }
    }
  }

  const typographyScale = multiplier > 1 ? 1.7 : 1
  const variantColors = getVariantColors()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={themed($backdrop)} onPress={onDismiss}>
        <Pressable
          style={[
            themed($modalContainer),
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: variantColors.background,
              maxWidth: multiplier > 1 ? 700 : 340,
              minHeight: multiplier > 1 ? 320 : 280,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          {icon && (
            <View style={themed($iconContainer)}>
              <Text
                style={[
                  themed($iconText),
                  {
                    fontSize: multiplier > 1 ? 64 : 42,
                    lineHeight: multiplier > 1 ? 72 : 48,
                  },
                ]}
              >
                {icon}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            preset="bold"
            style={[
              themed($title),
              {
                fontSize: multiplier > 1 ? 48 : 22,
                lineHeight: multiplier > 1 ? 48 : 28,
              },
            ]}
          >
            {title}
          </Text>

          {/* Main content */}
          <Text
            style={[
              themed($content),
              {
                fontSize: multiplier > 1 ? 28 : 16,
                lineHeight: multiplier > 1 ? 48 : 20,
              },
            ]}
          >
            {content}
          </Text>

          {/* Secondary content */}
          {secondaryContent && (
            <Text
              style={[
                themed($secondaryContent),
                {
                  fontSize: multiplier > 1 ? 24 : 16,
                  lineHeight: multiplier > 1 ? 28 : 20,
                },
              ]}
            >
              {secondaryContent}
            </Text>
          )}

          {/* Buttons */}
          <View style={themed($buttonContainer)}>
            <Button
              preset="filled"
              style={[
                themed($primaryButton),
                {
                  backgroundColor: variantColors.accent,
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
              onPress={onPrimaryPress}
            >
              {primaryButtonText}
            </Button>

            {secondaryButtonText && onSecondaryPress && (
              <Button
                preset="default"
                style={[
                  themed($secondaryButton),
                  {
                    backgroundColor: variantColors.accent,
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
                onPress={onSecondaryPress}
              >
                {secondaryButtonText}
              </Button>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const $backdrop: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.overlay50,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
})

const $modalContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "white",
  borderRadius: 20,
  padding: spacing.xl,
  maxWidth: 340,
  width: "100%",
  alignItems: "center",
  elevation: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $iconText: ThemedStyle<TextStyle> = ({}) => ({
  fontSize: 48,
  textAlign: "center",
})

const $title: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 22,
  textAlign: "center",
  marginBottom: spacing.sm,
  color: colors.text,
})

const $content: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 16,
  textAlign: "center",
  marginBottom: spacing.md,
  color: colors.text,
  lineHeight: 22,
})

const $secondaryContent: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  textAlign: "center",
  marginBottom: spacing.lg,
  color: colors.textDim,
  fontStyle: "italic",
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  gap: spacing.sm,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({}) => ({
  marginBottom: 0,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({}) => ({
  marginBottom: 0,
})
