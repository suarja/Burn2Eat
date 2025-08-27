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

  const navigation = useNavigation<any>()
  const scanBarcodeUseCase = Dependencies.scanBarcodeUseCase()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      // Prevent multiple scans
      if (isLoading || scannedBarcode === barcode) {
        console.log("⚠️ Ignoring duplicate scan:", barcode)
        return
      }

      console.log("🔍 Starting barcode scan:", barcode)
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

          // Navigate to ResultScreen with the dish object directly
          navigation.navigate("Result", {
            dish: result.dish, // Pass the dish object directly instead of foodId
          })
        } else {
          // Product not found
          console.log("❌ Product not found for barcode:", barcode)
          setError("Produit non trouvé dans la base de données")

          Alert.alert(
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

        Alert.alert(
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
      }
    },
    [isLoading, scannedBarcode, scanBarcodeUseCase, navigation],
  )

  const resetScanning = useCallback(() => {
    console.log("🔄 Resetting scanning state")

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    setScannedBarcode(null)
    setIsLoading(false)
    setError(null)
    setIsScanning(true)
  }, [])

  const startScanning = useCallback(() => {
    console.log("▶️ Starting scanning")
    setIsScanning(true)
    setScannedBarcode(null)
    setError(null)
  }, [])

  const stopScanning = useCallback(() => {
    setIsScanning(false)
  }, [])

  return {
    // State
    isScanning,
    isLoading,
    error,
    scannedBarcode,

    // Actions
    handleBarcodeScanned,
    startScanning,
    stopScanning,
    resetScanning,
  }
}
