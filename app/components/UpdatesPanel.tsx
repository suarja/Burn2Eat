import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import * as Updates from "expo-updates"
import { Download, RefreshCw, ChevronDown, CheckCircle, AlertCircle } from "lucide-react-native"

import { SHARED_STYLE_COLORS, sharedStyles } from "./sharedStyles"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const UpdatesPanel: React.FC = () => {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } = Updates.useUpdates()

  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false)
  const [isDownloadingUpdate, setIsDownloadingUpdate] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Auto-reload when update is pending
  useEffect(() => {
    if (isUpdatePending) {
      Updates.reloadAsync()
    }
  }, [isUpdatePending])

  const toggleSection = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsExpanded(!isExpanded)
  }

  const handleCheckForUpdates = async () => {
    try {
      setIsCheckingForUpdates(true)
      setUpdateError(null)
      setUpdateSuccess(null)
      const update = await Updates.checkForUpdateAsync()
      if (!update.isAvailable) {
        setUpdateSuccess("Votre application est déjà à jour !")
      } else {
        setUpdateSuccess("Mise à jour disponible ! Appuyez pour télécharger.")
      }
    } catch (error) {
      console.error("Error checking for updates:", error)
      setUpdateError("Impossible de vérifier les mises à jour. Vérifiez votre connexion.")
    } finally {
      setIsCheckingForUpdates(false)
    }
  }

  const handleDownloadUpdate = async () => {
    try {
      setIsDownloadingUpdate(true)
      setUpdateError(null)
      setUpdateSuccess(null)
      await Updates.fetchUpdateAsync()
      setUpdateSuccess("Mise à jour téléchargée ! L'application va redémarrer...")
      // The useEffect will handle the reload
    } catch (error) {
      console.error("Error downloading update:", error)
      setUpdateError("Impossible de télécharger la mise à jour. Réessayez plus tard.")
      setIsDownloadingUpdate(false)
    }
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.header} onPress={toggleSection}>
        <Text style={styles.sectionTitle}>Mise à Jour de l'Application</Text>
        <ChevronDown size={24} />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.contentContainer}>
          <View style={styles.statusMessageContainer}>
            <Text style={styles.statusMessage}>
              {currentlyRunning.isEmbeddedLaunch
                ? "📱 Version intégrée installée"
                : "🔄 Version mise à jour installée"}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.settingItem, isCheckingForUpdates && styles.settingItemDisabled]}
            onPress={handleCheckForUpdates}
            disabled={isCheckingForUpdates}
          >
            <View style={styles.settingInfo}>
              <RefreshCw size={24} />
              <Text style={styles.settingText}>Vérifier les mises à jour</Text>
            </View>
            {isCheckingForUpdates && (
              <ActivityIndicator size="small" color={SHARED_STYLE_COLORS.primary} />
            )}
          </TouchableOpacity>

          {isUpdateAvailable && (
            <TouchableOpacity
              style={[
                styles.settingItem,
                styles.updateAvailableItem,
                isDownloadingUpdate && styles.settingItemDisabled,
              ]}
              onPress={handleDownloadUpdate}
              disabled={isDownloadingUpdate}
            >
              <View style={styles.settingInfo}>
                <Download size={24} />
                <Text style={[styles.settingText, styles.updateAvailableText]}>
                  {isDownloadingUpdate ? "Téléchargement..." : "Télécharger la mise à jour"}
                </Text>
              </View>
              {isDownloadingUpdate && (
                <ActivityIndicator size="small" color={SHARED_STYLE_COLORS.primary} />
              )}
            </TouchableOpacity>
          )}

          {updateSuccess && (
            <View style={styles.updateSuccessContainer}>
              <CheckCircle size={16} />
              <Text style={styles.updateSuccessText}>{updateSuccess}</Text>
            </View>
          )}

          {updateError && (
            <View style={styles.updateErrorContainer}>
              <AlertCircle size={16} />
              <Text style={styles.updateErrorText}>{updateError}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 8,
    paddingTop: 16,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    backgroundColor: sharedStyles.sectionContainer.backgroundColor,
    borderRadius: 12,
    color: SHARED_STYLE_COLORS.text,
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  settingInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  settingItem: {
    alignItems: "center",
    backgroundColor: sharedStyles.container.backgroundColor,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItemDisabled: {
    opacity: 0.6,
  },
  settingText: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 16,
  },
  statusMessage: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  statusMessageContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  updateAvailableItem: {
    borderColor: SHARED_STYLE_COLORS.primary,
    borderWidth: 1,
  },
  updateAvailableText: {
    color: SHARED_STYLE_COLORS.primary,
    fontWeight: "600",
  },
  updateErrorContainer: {
    alignItems: "center",
    backgroundColor: SHARED_STYLE_COLORS.primaryOverlay,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    padding: 12,
  },
  updateErrorText: {
    color: SHARED_STYLE_COLORS.error,
    flex: 1,
    fontSize: 14,
  },
  updateSuccessContainer: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    padding: 12,
  },
  updateSuccessText: {
    color: SHARED_STYLE_COLORS.success,
    flex: 1,
    fontSize: 14,
  },
})

export default UpdatesPanel
