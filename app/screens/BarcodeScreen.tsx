import React, { FC, useCallback, useEffect, useRef } from "react"
import { useState } from "react"
import { ViewStyle, TextStyle, ActivityIndicator } from "react-native"
import { View } from "react-native"
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from "expo-camera"
import { useFocusEffect } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useBarcodeScanning } from "@/hooks/useBarcodeScanning"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { typography } from "@/theme/typography"

interface BarcodeScreenProps extends AppStackScreenProps<"Barcode"> {}

export const BarcodeScreen: FC<BarcodeScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const [shouldShowCamera, setShouldShowCamera] = useState(false)
  const cameraRef = useRef<CameraView>(null)
  const { themed } = useAppTheme()

  const {
    isScanning,
    isLoading,
    error,
    scannedBarcode,
    handleBarcodeScanned,
    startScanning,
    resetScanning,
  } = useBarcodeScanning()

  // Handle camera lifecycle with focus/blur - mount/unmount approach
  useFocusEffect(
    useCallback(() => {
      // Screen is focused - mount camera and start scanning
      if (permission?.granted) {
        setShouldShowCamera(true)
        // Small delay to ensure camera is mounted before scanning
        const timeoutId = setTimeout(() => {
          startScanning()
        }, 100)

        // Cleanup timeout if component unmounts quickly
        return () => {
          clearTimeout(timeoutId)
          setShouldShowCamera(false)
          resetScanning()
        }
      }

      // If no permission, ensure camera is not shown
      return () => {
        console.log("🎥 Unmounting camera (screen blurred)")
        setShouldShowCamera(false)
        resetScanning()
      }
    }, [permission?.granted, startScanning, resetScanning]),
  )

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($styles.container)}>
        <View style={themed($permissionWrapper)}>
          <View style={themed($permissionContent)}>
            <Text style={themed($permissionText)}>📷</Text>
            <Text style={themed($permissionTitle)}>Accès à la caméra requis</Text>
            <Text style={themed($permissionMessage)}>
              Pour scanner les codes-barres des aliments, nous avons besoin d'accéder à votre
              caméra.
            </Text>
            <Button preset="filled" onPress={requestPermission} style={themed($permissionButton)}>
              Autoriser la caméra
            </Button>
            <Button
              preset="default"
              onPress={() => navigation.goBack()}
              style={themed($backButton)}
            >
              Retour
            </Button>
          </View>
        </View>
      </Screen>
    )
  }

  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    if (isScanning && result.data) {
      handleBarcodeScanned(result.data)
    }
  }

  const handleRetry = () => {
    resetScanning()
  }

  return (
    <View style={themed($mainContainer)}>
      {/* Camera takes the full screen */}
      {shouldShowCamera ? (
        <CameraView
          ref={cameraRef}
          style={themed($fullScreenCamera)}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "code128"],
          }}
          onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
        />
      ) : (
        <View style={themed($cameraLoadingContainer)}>
          <Text style={themed($cameraLoadingText)}>📷 Activation de la caméra...</Text>
        </View>
      )}

      {/* Scanning Frame Overlay */}
      <View style={themed($scanningOverlay)}>
        <View style={themed($scanFrame)} />
      </View>

      {/* Loading Indicator */}
      {isLoading && (
        <View style={themed($loadingOverlay)}>
          <ActivityIndicator size="large" color="white" />
          <Text style={themed($loadingText)}>Recherche du produit...</Text>
        </View>
      )}

      {/* Top Safe Area with instruction */}
      <View style={themed($topSafeArea)}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: typography.primary.medium,
            color: "white", // White text on dark background
            textAlign: "center",
            textShadowColor: "rgba(0, 0, 0, 0.8)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}
        >
          {error
            ? `❌ ${error}`
            : isScanning
              ? "📱 Positionnez le code-barres dans le cadre"
              : "⏳ Scanning en cours..."}
        </Text>
      </View>

      {/* Bottom Controls with safe area */}
      <View style={themed($bottomSafeArea)}>
        <View style={themed($controlsWrapper)}>
          {error && (
            <View style={themed($errorButtonContainer)}>
              <Button preset="filled" onPress={handleRetry} style={themed($retryButton)}>
                Réessayer
              </Button>
              <Button
                preset="default"
                onPress={() => {
                  console.log("🔧 Force reset triggered")
                  resetScanning()
                }}
                style={themed($resetButton)}
              >
                Reset
              </Button>
            </View>
          )}

          {/* Action Buttons */}
          {/* <View style={themed($buttonContainer)}>
            <Button
              preset="default"
              onPress={() => navigation.goBack()}
              style={themed($backButton)}
            >
              Retour
            </Button>

            <Button
              preset="default"
              onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
              style={themed($manualSearchButton)}
            >
              Recherche manuelle
            </Button>

            {__DEV__ && (
              <Button
                preset="default"
                onPress={() => {
                  console.log("🔧 Debug Info:", { isScanning, isLoading, error, scannedBarcode })
                  handleRetry()
                }}
                style={themed($debugButton)}
              >
                Debug Reset
              </Button>
            )}
          </View> */}
          
        </View>
      </View>
    </View>
  )
}

// Themed Styles
const $mainContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "black",
})

const $fullScreenCamera: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const $scanningOverlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
})

const $topSafeArea: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  paddingTop: spacing.xl + 20, // Extra space for notch/status bar
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
})

const $bottomSafeArea: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  paddingBottom: spacing.xl + 10, // Extra space for home indicator
})

const $controlsWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
})

const $permissionWrapper: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
})

const $permissionContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingHorizontal: spacing.xl,
  maxWidth: 400,
  width: "100%",
})

const $permissionText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 64,
  textAlign: "center",
  marginBottom: spacing.md,
})

const $permissionTitle: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 20,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $permissionMessage: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
  textAlign: "center",
  lineHeight: 24,
  marginBottom: spacing.xl,
})

const $permissionButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
  minWidth: 200,
})

const $cameraContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1, // Take most of the available space
  position: "relative",
  backgroundColor: "black",
})

const $camera: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "black",
})

const $overlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent", // Keep camera fully visible
})

const $scanFrame: ThemedStyle<ViewStyle> = () => ({
  width: 280,
  height: 160,
  borderWidth: 3,
  borderColor: "#00FF00", // Bright green for visibility
  borderRadius: 12,
  backgroundColor: "transparent",
  shadowColor: "#00FF00",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 8,
})

const $loadingOverlay: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.xl,
})

const $loadingText: ThemedStyle<ViewStyle> = ({ spacing, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: "white",
  textAlign: "center",
  marginTop: spacing.md,
})

const $controlsContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  minHeight: 120, // Fixed height for bottom controls
  maxHeight: 140,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.md,
})

const $errorText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.error,
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $instructionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.md,
})

const $buttonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.sm,
})

const $backButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
})

const $manualSearchButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
})

const $retryButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.tint,
  minWidth: 120,
})

// New styles for improved scanning interface
const $scanFrameCorner: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  width: 20,
  height: 20,
  borderWidth: 3,
  borderColor: "#00FF00", // Bright green for visibility
})

const $scanFrameCornerTopRight: ThemedStyle<ViewStyle> = () => ({
  top: 0,
  right: 0,
  borderLeftWidth: 0,
  borderBottomWidth: 0,
})

const $scanFrameCornerBottomLeft: ThemedStyle<ViewStyle> = () => ({
  bottom: 0,
  left: 0,
  borderRightWidth: 0,
  borderTopWidth: 0,
})

const $scanFrameCornerBottomRight: ThemedStyle<ViewStyle> = () => ({
  bottom: 0,
  right: 0,
  borderLeftWidth: 0,
  borderTopWidth: 0,
})

const $overlayInstructionText: ThemedStyle<ViewStyle> = ({ spacing, typography }) => ({
  position: "absolute",
  bottom: -60,
  left: 0,
  right: 0,
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: "white",
  textAlign: "center",
  textShadowColor: "rgba(0, 0, 0, 0.8)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 3,
})

const $debugButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.angry500,
  borderColor: colors.palette.angry500,
  borderWidth: 1,
})

const $errorButtonContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  justifyContent: "center",
  marginTop: spacing.sm,
})

const $resetButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.tint,
  borderWidth: 1,
  minWidth: 80,
})

const $headerContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.sm,
  minHeight: 50,
  justifyContent: "center",
})

const $cameraLoadingContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.palette.neutral900,
  justifyContent: "center",
  alignItems: "center",
})

const $cameraLoadingText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 18,
  fontFamily: typography.primary.medium,
  color: colors.palette.neutral100,
  textAlign: "center",
})
