import { useEffect, useState } from "react"

import { useUserProfile } from "./useUserProfile"

/**
 * Custom hook to detect if the user is in guest mode
 * 
 * Guest mode is determined by checking if a real user profile exists.
 * If hasCurrentProfile() returns false, the user is in guest mode.
 */
export const useGuestMode = () => {
  const { hasCurrentProfile } = useUserProfile()
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkGuestMode = async () => {
      try {
        const hasProfile = await hasCurrentProfile()
        setIsGuest(!hasProfile) // Guest mode if NO persisted profile
      } catch (error) {
        console.warn("⚠️ useGuestMode: Error checking guest mode:", error)
        setIsGuest(true) // Default to guest mode on error
      } finally {
        setLoading(false)
      }
    }

    checkGuestMode()
  }, [hasCurrentProfile])

  return {
    isGuest,
    loading,
  }
}