import { StyleSheet } from "react-native"

export const SHARED_STYLE_COLORS = {
  background: "#000000", // Pure black
  backgroundSecondary: "#1a1a1a", // Elevated surface
  backgroundTertiary: "#2a2a2a", // Tertiary surface
  primary: "#FF0050", // Editia red
  primaryLight: "rgba(255, 0, 80, 0.6)",
  primaryOverlay: "rgba(255, 0, 80, 0.12)",
  primaryBorder: "rgba(255, 0, 80, 0.3)",
  secondary: "#007AFF", // System blue
  accent: "#FFD700", // Gold for premium
  text: "#FFFFFF", // Pure white
  textSecondary: "#E0E0E0", // Secondary text
  textTertiary: "#B0B0B0", // Tertiary text
  textMuted: "#666666", // Muted text
  border: "rgba(255, 255, 255, 0.2)", // Light border
  borderMuted: "rgba(255, 255, 255, 0.05)", // Very light border
  error: "#FF3B30", // System red
  warning: "#FF9500", // System orange
  success: "#00FF88", // Bright green
}

export const sharedStyles = StyleSheet.create({
  // Containers
  container: {
    backgroundColor: SHARED_STYLE_COLORS.background,
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: SHARED_STYLE_COLORS.backgroundSecondary,
    borderRadius: 16,
    elevation: 5,
    marginBottom: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: SHARED_STYLE_COLORS.backgroundSecondary,
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: SHARED_STYLE_COLORS.background,
    borderRadius: 20,
    padding: 24,
    width: "90%",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: SHARED_STYLE_COLORS.background,
    flex: 1,
    justifyContent: "center",
  },

  // Text
  title: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  bodyText: {
    color: SHARED_STYLE_COLORS.text,
    fontSize: 16,
  },
  secondaryText: {
    color: SHARED_STYLE_COLORS.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: SHARED_STYLE_COLORS.error,
    fontSize: 14,
    textAlign: "center",
  },

  // Buttons
  primaryButton: {
    alignItems: "center",
    backgroundColor: SHARED_STYLE_COLORS.primary,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: SHARED_STYLE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: SHARED_STYLE_COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Inputs
  input: {
    backgroundColor: SHARED_STYLE_COLORS.backgroundSecondary,
    borderColor: SHARED_STYLE_COLORS.border,
    borderRadius: 8,
    borderWidth: 1,
    color: SHARED_STYLE_COLORS.text,
    fontSize: 16,
    padding: 12,
    width: "100%",
  },
  inputLabel: {
    alignSelf: "flex-start",
    color: SHARED_STYLE_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },

  // Misc
  separator: {
    backgroundColor: SHARED_STYLE_COLORS.border,
    height: 1,
    marginVertical: 16,
  },
  avatar: {
    borderColor: SHARED_STYLE_COLORS.border,
    borderRadius: 30,
    borderWidth: 2,
    height: 60,
    width: 60,
  },
})
