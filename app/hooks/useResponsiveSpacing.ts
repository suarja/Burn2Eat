import { useWindowDimensions } from "react-native"

/**
 * Hook to provide responsive spacing multiplier for tablet devices
 * Tablets (iPad) need larger spacing to prevent crowded UI
 *
 * @returns {Object} Object containing spacing multiplier and device detection
 * @property {number} multiplier - Spacing multiplier (1.0 for mobile, 1.2 for tablet)
 * @property {boolean} isTablet - Whether the device is a tablet (width >= 768)
 */
export function useResponsiveSpacing() {
  const { width } = useWindowDimensions()

  // iPad detection - standard iPad width is >= 768pt
  const isTablet = width >= 768

  // Multiply spacing values on tablets to prevent crowded UI
  // This addresses Apple's Guideline 4.0 feedback about crowded screens
  // Using 1.15x for subtle but noticeable increase on iPad
  const multiplier = isTablet ? 1.15 : 1.0

  // Debug log to verify detection
  console.log("📱 Responsive Spacing - Width:", width, "isTablet:", isTablet, "multiplier:", multiplier)

  return { multiplier, isTablet }
}
