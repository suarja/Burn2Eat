import React, { useEffect, useRef } from "react"
import { View, Animated, ViewStyle, Dimensions } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ConfettiPiece {
  id: string
  x: Animated.Value
  y: Animated.Value
  rotation: Animated.Value
  opacity: Animated.Value
  color: string
}

export interface SimpleConfettiProps {
  /**
   * Whether to show confetti animation
   */
  active: boolean
  /**
   * Duration of the animation in ms
   */
  duration?: number
  /**
   * Number of confetti pieces
   */
  count?: number
  /**
   * Callback when animation completes
   */
  onComplete?: () => void
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export const SimpleConfetti: React.FC<SimpleConfettiProps> = ({
  active,
  duration = 3000,
  count = 50,
  onComplete,
}) => {
  const { theme } = useAppTheme()
  const confettiRef = useRef<ConfettiPiece[]>([])

  // Colors for confetti pieces
  const confettiColors = [
    theme.colors.success,
    theme.colors.gamification,
    theme.colors.palette.accent500,
    theme.colors.palette.primary500,
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
  ]

  useEffect(() => {
    if (!active) return

    // Create confetti pieces
    confettiRef.current = Array.from({ length: count }, (_, index) => ({
      id: `confetti-${index}`,
      x: new Animated.Value(Math.random() * SCREEN_WIDTH),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    }))

    // Start animations
    const animations = confettiRef.current.map((piece) => {
      return Animated.parallel([
        // Falling animation
        Animated.timing(piece.y, {
          toValue: SCREEN_HEIGHT + 50,
          duration: duration + Math.random() * 1000, // Vary fall speed
          useNativeDriver: false,
        }),
        // Rotation animation
        Animated.loop(
          Animated.timing(piece.rotation, {
            toValue: 360,
            duration: 1000 + Math.random() * 500,
            useNativeDriver: false,
          }),
        ),
        // Fade out animation
        Animated.sequence([
          Animated.delay(duration * 0.7), // Start fading at 70% of duration
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: duration * 0.3,
            useNativeDriver: false,
          }),
        ]),
        // Horizontal drift (simplified)
        Animated.loop(
          Animated.sequence([
            Animated.timing(piece.x, {
              toValue: Math.random() * SCREEN_WIDTH * 0.8 + SCREEN_WIDTH * 0.1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(piece.x, {
              toValue: Math.random() * SCREEN_WIDTH * 0.8 + SCREEN_WIDTH * 0.1,
              duration: 2000,
              useNativeDriver: false,
            }),
          ]),
        ),
      ])
    })

    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete()
    })

    // Cleanup function
    return () => {
      confettiRef.current.forEach((piece) => {
        piece.x.stopAnimation()
        piece.y.stopAnimation()
        piece.rotation.stopAnimation()
        piece.opacity.stopAnimation()
      })
    }
  }, [active, count, duration, onComplete, theme.colors])

  if (!active || confettiRef.current.length === 0) {
    return null
  }

  return (
    <View style={$container as any} pointerEvents="none">
      {confettiRef.current.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            $confettiPiece,
            {
              left: piece.x,
              top: piece.y,
              backgroundColor: piece.color,
              opacity: piece.opacity,
              transform: [
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({}) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000, // Make sure confetti appears on top
})

const $confettiPiece: ViewStyle = {
  position: "absolute",
  width: 8,
  height: 8,
  borderRadius: 4,
}
