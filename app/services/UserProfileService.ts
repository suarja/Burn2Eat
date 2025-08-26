import { load, save } from "@/utils/storage"

export interface UserProfile {
  id: string
  weight: number // kg
  height: number // cm
  preferredActivityKey: string
  createdAt: string
  updatedAt: string
}

export interface CreateProfileInput {
  weight: number
  height: number
  preferredActivityKey: string
}

export interface UpdateProfileInput {
  weight?: number
  height?: number
  preferredActivityKey?: string
}

const USER_PROFILE_KEY = "burn2eat-user-profile"
const DEFAULT_PROFILE_ID = "primary-user"

/**
 * Simple user profile service using MMKV storage
 * This is a simplified version before full DDD implementation
 */
export class UserProfileService {
  /**
   * Create or update the user profile
   */
  static async saveProfile(input: CreateProfileInput): Promise<UserProfile> {
    const now = new Date().toISOString()
    const existingProfile = await this.getProfile()

    const profile: UserProfile = {
      id: existingProfile?.id || DEFAULT_PROFILE_ID,
      weight: input.weight,
      height: input.height,
      preferredActivityKey: input.preferredActivityKey,
      createdAt: existingProfile?.createdAt || now,
      updatedAt: now,
    }

    console.log("🔄 Attempting to save profile:", profile)
    const success = save(USER_PROFILE_KEY, profile)
    console.log("💾 Save result:", success)

    if (!success) {
      throw new Error("Failed to save user profile")
    }

    // Verify save by reading back
    const savedProfile = load(USER_PROFILE_KEY)
    console.log("✅ Profile verified after save:", savedProfile)

    return profile
  }

  /**
   * Update existing profile
   */
  static async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const existingProfile = await this.getProfile()
    if (!existingProfile) {
      throw new Error("No profile exists to update")
    }

    const updatedProfile: UserProfile = {
      ...existingProfile,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    const success = save(USER_PROFILE_KEY, updatedProfile)
    if (!success) {
      throw new Error("Failed to update user profile")
    }

    console.log("✅ User profile updated:", updatedProfile)
    return updatedProfile
  }

  /**
   * Get the current user profile
   */
  static async getProfile(): Promise<UserProfile | null> {
    try {
      const profile = load<UserProfile>(USER_PROFILE_KEY)
      return profile
    } catch (error) {
      console.warn("⚠️ Failed to load user profile:", error)
      return null
    }
  }

  /**
   * Check if user profile exists
   */
  static async hasProfile(): Promise<boolean> {
    const profile = await this.getProfile()
    return profile !== null
  }

  /**
   * Delete the user profile
   */
  static async deleteProfile(): Promise<boolean> {
    try {
      save(USER_PROFILE_KEY, null)
      console.log("🗑️ User profile deleted")
      return true
    } catch (error) {
      console.warn("⚠️ Failed to delete user profile:", error)
      return false
    }
  }

  /**
   * Get default profile values
   */
  static getDefaultProfile(): CreateProfileInput {
    return {
      weight: 75,
      height: 175,
      preferredActivityKey: "jogging",
    }
  }

  /**
   * Calculate BMI from profile
   */
  static calculateBMI(profile: UserProfile): number {
    const heightInMeters = profile.height / 100
    return profile.weight / (heightInMeters * heightInMeters)
  }

  /**
   * Get BMI category
   */
  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return "underweight"
    if (bmi < 25) return "normal"
    if (bmi < 30) return "overweight"
    return "obese"
  }
}
