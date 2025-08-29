import { useCallback, useState, useRef } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { ScanBarcodeOutput } from "@/application/usecases"
// Removed unused imports
import { Dependencies } from "@/services/Dependencies"

/**
 * Custom hook for barcode scanning functionality
 * Encapsulates the logic for scanning, API calls, and navigation
 */
export const useBarcodeScanning = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isScanningLocked, setIsScanningLocked] = useState(false)

  const navigation = useNavigation<any>()
  const scanBarcodeUseCase = Dependencies.scanBarcodeUseCase()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeAlertRef = useRef<boolean>(false)

  /**
   * Dismiss any active alerts to prevent stacking
   */
  const dismissActiveAlerts = useCallback(() => {
    if (activeAlertRef.current) {
      console.log("🚨 Dismissing active alert to prevent stacking")
      // Note: React Native doesn't provide a direct way to dismiss alerts
      // But setting the flag helps prevent new ones from showing
      activeAlertRef.current = false
    }
  }, [])

  /**
   * Show alert with proper management to prevent stacking
   */
  const showManagedAlert = useCallback(
    (title: string, message: string, buttons: any[]) => {
      // Dismiss any existing alerts first
      dismissActiveAlerts()

      // Mark that we have an active alert
      activeAlertRef.current = true
      console.log("🚨 Showing managed alert:", title)

      // Add onPress callbacks to all buttons to clear the active flag
      const managedButtons = buttons.map((button) => ({
        ...button,
        onPress: () => {
          activeAlertRef.current = false
          console.log("🚨 Alert button pressed:", button.text)
          if (button.onPress) {
            button.onPress()
          }
        },
      }))

      Alert.alert(title, message, managedButtons)
    },
    [dismissActiveAlerts],
  )

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      // Prevent multiple scans or if scanning is locked
      if (isLoading || isScanningLocked || scannedBarcode === barcode || activeAlertRef.current) {
        console.log("⚠️ Ignoring scan - locked or duplicate:", {
          barcode,
          isLoading,
          isScanningLocked,
          isDuplicate: scannedBarcode === barcode,
          hasActiveAlert: activeAlertRef.current,
        })
        return
      }

      console.log("🔍 Starting barcode scan:", barcode)

      // Lock scanning to prevent concurrent operations
      setIsScanningLocked(true)
      dismissActiveAlerts()

      setIsScanning(false)
      setScannedBarcode(barcode)
      setIsLoading(true)
      setError(null)

      try {
        console.log("📡 Calling scanBarcodeUseCase with:", barcode)

        // Set a timeout to prevent getting stuck
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          console.log("⏰ Scan timeout - resetting")
          setError("Délai d'attente dépassé")
          setIsLoading(false)
          setIsScanning(true)
        }, 15000) // 15 second timeout

        const result: ScanBarcodeOutput = await scanBarcodeUseCase.execute({
          barcode,
        })

        console.log("📋 ScanBarcodeUseCase result:", {
          success: result.success,
          hasDish: !!result.dish,
        })

        if (result.success && result.dish) {
          console.log("✅ Product found:", result.dish.name)

          // Clear timeout and unlock before navigation
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
          setIsScanningLocked(false)

          // Navigate to ResultScreen with the dish object directly
          navigation.navigate("Result", {
            dish: result.dish, // Pass the dish object directly instead of foodId
          })
        } else {
          // Product not found
          console.log("❌ Product not found for barcode:", barcode)
          setError("Produit non trouvé dans la base de données")

          showManagedAlert(
            "Produit non trouvé",
            "Ce produit n'est pas disponible dans notre base de données. Voulez-vous essayer une recherche manuelle ?",
            [
              {
                text: "Réessayer",
                onPress: () => resetScanning(),
              },
              {
                text: "Recherche manuelle",
                onPress: () => navigation.navigate("MainTabs", { screen: "Home" }),
              },
            ],
          )
        }
      } catch (error) {
        console.error("❌ Error scanning barcode:", error)
        setError("Erreur lors de la recherche du produit")

        showManagedAlert(
          "Erreur de connexion",
          "Impossible de rechercher le produit. Vérifiez votre connexion internet.",
          [
            {
              text: "Réessayer",
              onPress: () => resetScanning(),
            },
            {
              text: "Annuler",
              onPress: () => navigation.goBack(),
            },
          ],
        )
      } finally {
        // Clear timeout on completion
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
        setIsLoading(false)
        setIsScanning(false)
        setIsScanningLocked(false)
      }
    },
    [
      isLoading,
      isScanningLocked,
      scannedBarcode,
      scanBarcodeUseCase,
      navigation,
      dismissActiveAlerts,
      showManagedAlert,
    ],
  )

  const resetScanning = useCallback(() => {
    console.log("🔄 Resetting scanning state")

    // First dismiss any active alerts
    dismissActiveAlerts()

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Reset all state
    setScannedBarcode(null)
    setIsLoading(false)
    setError(null)
    setIsScanningLocked(false)
    setIsScanning(true)
  }, [dismissActiveAlerts])

  const startScanning = useCallback(() => {
    console.log("▶️ Starting scanning")

    // Only start if not locked and no active alerts
    if (!isScanningLocked && !activeAlertRef.current) {
      setIsScanning(true)
      setScannedBarcode(null)
      setError(null)
    } else {
      console.log("⚠️ Cannot start scanning - locked or alert active:", {
        isScanningLocked,
        hasActiveAlert: activeAlertRef.current,
      })
    }
  }, [isScanningLocked])

  const stopScanning = useCallback(() => {
    console.log("⏹️ Stopping scanning")
    setIsScanning(false)
  }, [])

  /**
   * Complete cleanup for component unmounting
   * Should be called when the screen loses focus or unmounts
   */
  const dismountCleanup = useCallback(() => {
    console.log("🧹 Performing dismount cleanup")

    // Dismiss alerts first
    dismissActiveAlerts()

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Reset all state
    setIsScanning(false)
    setIsLoading(false)
    setError(null)
    setScannedBarcode(null)
    setIsScanningLocked(false)
  }, [dismissActiveAlerts])

  return {
    // State
    isScanning,
    isLoading,
    error,
    scannedBarcode,
    isScanningLocked,

    // Actions
    handleBarcodeScanned,
    startScanning,
    stopScanning,
    resetScanning,
    dismountCleanup,
  }
}
