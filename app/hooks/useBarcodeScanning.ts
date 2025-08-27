import { useCallback, useState } from "react"
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

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      // Prevent multiple scans
      if (isLoading || scannedBarcode === barcode) {
        return
      }

      setIsScanning(false)
      setScannedBarcode(barcode)
      setIsLoading(true)
      setError(null)

      try {
        console.log("🔍 Scanning barcode:", barcode)

        const result: ScanBarcodeOutput = await scanBarcodeUseCase.execute({
          barcode,
        })

        if (result.success && result.dish) {
          console.log("✅ Product found:", result.dish.name)

          // Navigate to ResultScreen with the found dish
          navigation.navigate("Result", {
            foodId: JSON.stringify({ value: result.dish.id }),
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
        setIsLoading(false)
      }
    },
    [isLoading, scannedBarcode, scanBarcodeUseCase, navigation],
  )

  const resetScanning = useCallback(() => {
    setScannedBarcode(null)
    setIsLoading(false)
    setError(null)
    setIsScanning(true)
  }, [])

  const startScanning = useCallback(() => {
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
