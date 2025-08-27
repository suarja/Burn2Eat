import { FC, useEffect } from "react"
import { useState } from "react"
import { ViewStyle, ActivityIndicator } from "react-native"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from "expo-camera"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useBarcodeScanning } from "@/hooks/useBarcodeScanning"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface BarcodeScreenProps extends AppStackScreenProps<"Barcode"> {}

export const BarcodeScreen: FC<BarcodeScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const { themed } = useAppTheme()

  const { isScanning, isLoading, error, handleBarcodeScanned, startScanning, resetScanning } =
    useBarcodeScanning()

  // Start scanning when component mounts
  useEffect(() => {
    if (permission?.granted) {
      startScanning()
    }
  }, [permission?.granted, startScanning])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screenContainer)}>
        <View style={themed($permissionContainer)}>
          <Text style={themed($permissionText)}>📷</Text>
          <Text style={themed($permissionTitle)}>Accès à la caméra requis</Text>
          <Text style={themed($permissionMessage)}>
            Pour scanner les codes-barres, nous avons besoin d'accéder à votre caméra.
          </Text>
          <Button preset="filled" onPress={requestPermission} style={themed($permissionButton)}>
            Autoriser la caméra
          </Button>
          <Button preset="default" onPress={() => navigation.goBack()} style={themed($backButton)}>
            Retour
          </Button>
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
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screenContainer)}>
      {/* Camera View */}
      <View style={themed($cameraContainer)}>
        <CameraView
          style={themed($camera)}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a", "code128"],
          }}
          onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
        />

        {/* Scanning Overlay */}
        <View style={themed($overlay)}>
          <View style={themed($scanFrame)} />
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={themed($loadingOverlay)}>
            <ActivityIndicator size="large" color="white" />
            <Text style={themed($loadingText)}>Recherche du produit...</Text>
          </View>
        )}
      </View>

      {/* Status and Controls */}
      <View style={themed($controlsContainer)}>
        {error ? (
          <View style={themed($errorContainer)}>
            <Text style={themed($errorText)}>❌ {error}</Text>
            <Button preset="filled" onPress={handleRetry} style={themed($retryButton)}>
              Réessayer
            </Button>
          </View>
        ) : (
          <View style={themed($instructionContainer)}>
            <Text preset="default" style={{ textAlign: "center", fontSize: 16 }}>
              {isScanning
                ? "📱 Positionnez le code-barres dans le cadre"
                : "⏳ Scanning en cours..."}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={themed($buttonContainer)}>
          <Button preset="default" onPress={() => navigation.goBack()} style={themed($backButton)}>
            Retour
          </Button>

          <Button
            preset="default"
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
            style={themed($manualSearchButton)}
          >
            Recherche manuelle
          </Button>
        </View>
      </View>
    </Screen>
  )
}

// Themed Styles
const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $permissionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.xl,
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
  flex: 1,
  position: "relative",
})

const $camera: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $overlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
})

const $scanFrame: ThemedStyle<ViewStyle> = () => ({
  width: 250,
  height: 150,
  borderWidth: 2,
  borderColor: "white",
  borderRadius: 12,
  backgroundColor: "transparent",
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
  paddingVertical: spacing.md,
  minHeight: 120,
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

const $instructionText: ThemedStyle<ViewStyle> = ({ spacing, colors, typography }) => ({
  // Note: Text styles should use TextStyle, but we're using ViewStyle here
  // This is a limitation of the current typing system
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
