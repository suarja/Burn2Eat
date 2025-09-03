import { useCallback, useEffect, useState } from "react"

import type {
  CreateUserProfileInput,
  CreateUserProfileOutput,
} from "../../src/application/usecases/CreateUserProfileUseCase"
import type { GetUserProfileOutput } from "../../src/application/usecases/GetUserProfileUseCase"
import type {
  UpdateUserProfileInput,
  UpdateUserProfileOutput,
} from "../../src/application/usecases/UpdateUserProfileUseCase"
import { Dependencies } from "../services/Dependencies"

/**
 * Custom hook for user profile management using DDD use cases
 * Provides all CRUD operations for user profiles
 */
export const useUserProfile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentProfile, setCurrentProfile] = useState<GetUserProfileOutput["userProfile"] | null>(
    null,
  )

  const createUserUseCase = Dependencies.createUserUseCase()
  const getUserUseCase = Dependencies.getUserUseCase()
  const updateUserUseCase = Dependencies.updateUserUseCase()

  /**
   * Create a new user profile (primary profile for single-user app)
   */
  const createProfile = useCallback(
    async (input: CreateUserProfileInput): Promise<CreateUserProfileOutput> => {
      setLoading(true)
      setError(null)

      try {
        const result = await createUserUseCase.createPrimary(input)

        if (result.success && result.userProfile) {
          // Convert CreateUserProfileOutput to GetUserProfileOutput format by adding primaryActivityKey
          const profileWithPrimaryKey = {
            ...result.userProfile,
            primaryActivityKey: result.userProfile.preferredActivityKeys[0] || null,
          }
          setCurrentProfile(profileWithPrimaryKey)
        } else {
          console.warn("❌ useUserProfile: Failed to create profile:", result.error)
          setError(result.error || "Failed to create profile")
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("💥 useUserProfile: Exception during profile creation:", errorMessage)
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
          userProfile: null,
        }
      } finally {
        setLoading(false)
      }
    },
    [createUserUseCase],
  )

  /**
   * Load the current user profile or get default values for guest mode
   */
  const loadCurrentProfile = useCallback(async (): Promise<GetUserProfileOutput> => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserUseCase.getCurrentOrDefault()

      if (result.success && result.userProfile) {
        setCurrentProfile(result.userProfile)
      } else {
        setCurrentProfile(null)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error("💥 useUserProfile: Exception during profile loading:", errorMessage)
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage,
        userProfile: null,
      }
    } finally {
      setLoading(false)
    }
  }, [getUserUseCase])

  /**
   * Update the current user profile
   */
  const updateProfile = useCallback(
    async (input: UpdateUserProfileInput): Promise<UpdateUserProfileOutput> => {
      setLoading(true)
      setError(null)

      try {
        const result = await updateUserUseCase.updateCurrent(input)

        if (result.success && result.userProfile) {
          // Convert UpdateUserProfileOutput to GetUserProfileOutput format by adding primaryActivityKey
          const profileWithPrimaryKey = {
            ...result.userProfile,
            primaryActivityKey: result.userProfile.preferredActivityKeys[0] || null,
          }
          setCurrentProfile(profileWithPrimaryKey)
        } else {
          console.warn("❌ useUserProfile: Failed to update profile:", result.error)
          setError(result.error || "Failed to update profile")
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("💥 useUserProfile: Exception during profile update:", errorMessage)
        setError(errorMessage)
        return {
          success: false,
          error: errorMessage,
          userProfile: null,
        }
      } finally {
        setLoading(false)
      }
    },
    [updateUserUseCase],
  )

  /**
   * Check if a current profile exists
   */
  const hasCurrentProfile = useCallback(async (): Promise<boolean> => {
    try {
      const result = await getUserUseCase.currentExists()
      return result.success && result.exists
    } catch (error) {
      console.warn("⚠️ useUserProfile: Error checking profile existence:", error)
      return false
    }
  }, [getUserUseCase])

  /**
   * Clear current profile from state (not from storage)
   */
  const clearCurrentProfile = useCallback((): void => {
    setCurrentProfile(null)
    setError(null)
  }, [])

  return {
    // State
    loading,
    error,
    currentProfile,

    // Actions
    createProfile,
    loadCurrentProfile,
    updateProfile,
    hasCurrentProfile,
    clearCurrentProfile,
  }
}

/**
 * Hook for simple profile loading on component mount
 */
export const useCurrentProfile = () => {
  const { loadCurrentProfile, currentProfile, loading, error } = useUserProfile()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      await loadCurrentProfile()
      setIsInitialLoad(false)
    }
    loadProfile()
  }, [loadCurrentProfile])

  return {
    profile: currentProfile,
    loading,
    error,
    isInitialLoad,
  }
}
