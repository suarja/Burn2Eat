import { Centimeters, Kilograms } from "src/domain/common/UnitTypes"

import { load, save, remove, clear } from "../../../app/utils/storage"
import { Sex } from "../../domain/physiology/Sex"
import { UserHealthInfo } from "../../domain/physiology/UserHealthInfo"
import { UserHealthInfoId } from "../../domain/physiology/UserHealthInfoId"
import { UserHealthInfoRepository } from "../../domain/physiology/UserHealthInfoRepository"
import { UserHealthInfoData, isValidUserHealthInfoData } from "../types/UserHealthInfoData"

/**
 * MMKV implementation of UserHealthInfoRepository
 * Uses the existing Ignite MMKV storage utilities
 */
export class MMKVUserHealthInfoRepository implements UserHealthInfoRepository {
  private readonly CURRENT_USER_KEY = "current-user-profile"
  private readonly USER_PREFIX = "user-profile-"

  /**
   * Generate storage key for a user profile
   */
  private getUserKey(id: UserHealthInfoId): string {
    return `${this.USER_PREFIX}${id.toString()}`
  }

  /**
   * Convert domain UserHealthInfo to storage data
   */
  private toData(userProfile: UserHealthInfo): UserHealthInfoData {
    return {
      id: userProfile.getId().toString(),
      sex: userProfile.getSex(),
      weight: userProfile.getWeight(),
      height: userProfile.getHeight(),
      preferredActivityKeys: userProfile.getPreferredActivityKeys(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Convert storage data to domain UserHealthInfo
   */
  private toDomain(data: UserHealthInfoData): UserHealthInfo {
    try {
      const id = UserHealthInfoId.from(data.id)
      return UserHealthInfo.createWithId(
        id,
        data.sex,
        data.weight as Kilograms,
        data.height as Centimeters,
        data.preferredActivityKeys,
      )
    } catch (error) {
      throw new Error(
        `Failed to convert UserHealthInfoData to domain: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  /**
   * Save a user profile
   */
  async save(userProfile: UserHealthInfo): Promise<UserHealthInfo> {
    try {
      const data = this.toData(userProfile)
      const key = this.getUserKey(userProfile.getId())

      const success = save(key, data)
      if (!success) {
        throw new Error("Failed to save user profile to storage")
      }

      return userProfile
    } catch (error) {
      throw new Error(
        `Error saving user profile: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Find a user profile by ID
   */
  async findById(id: UserHealthInfoId): Promise<UserHealthInfo | null> {
    try {
      const key = this.getUserKey(id)
      const data = load<UserHealthInfoData>(key)

      if (!data) {
        return null
      }

      if (!isValidUserHealthInfoData(data)) {
        throw new Error("Invalid user profile data found in storage")
      }

      return this.toDomain(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid user profile data")) {
        throw error
      }
      // Return null for other errors (e.g., key not found)
      return null
    }
  }

  /**
   * Get the current user profile (primary profile for single-user app)
   */
  async getCurrent(): Promise<UserHealthInfo | null> {
    try {
      const currentIdData = load<string>(this.CURRENT_USER_KEY)

      if (!currentIdData) {
        return null
      }

      const currentId = UserHealthInfoId.from(currentIdData)
      return await this.findById(currentId)
    } catch (error) {
      // Return null if current user key is corrupted or invalid
      return null
    }
  }

  /**
   * Set the current user profile (primary profile for single-user app)
   */
  async setCurrent(userProfile: UserHealthInfo): Promise<UserHealthInfo> {
    try {
      // First save the profile
      const savedProfile = await this.save(userProfile)

      // Then set it as current
      const success = save(this.CURRENT_USER_KEY, userProfile.getId().toString())
      if (!success) {
        throw new Error("Failed to set current user profile")
      }

      return savedProfile
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error setting current user profile: ${error.message}`)
      } else {
        throw new Error("Error setting current user profile: Unknown error")
      }
    }
  }

  /**
   * Delete a user profile by ID
   */
  async deleteById(id: UserHealthInfoId): Promise<boolean> {
    try {
      const key = this.getUserKey(id)

      // Check if profile exists first
      const exists = await this.exists(id)
      if (!exists) {
        return false
      }

      // Remove the profile
      remove(key)

      // If this was the current user, clear current user key
      const currentProfile = await this.getCurrent()
      if (currentProfile && currentProfile.getId().equals(id)) {
        remove(this.CURRENT_USER_KEY)
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting user profile: ${error.message}`)
      } else {
        throw new Error("Error deleting user profile: Unknown error")
      }
    }
  }

  /**
   * Check if a user profile exists by ID
   */
  async exists(id: UserHealthInfoId): Promise<boolean> {
    try {
      const profile = await this.findById(id)
      return profile !== null
    } catch (error) {
      return false
    }
  }

  /**
   * Clear all stored user profiles (for testing/reset)
   */
  async clear(): Promise<void> {
    try {
      // Note: MMKV doesn't provide easy way to clear by prefix
      // For now, just clear the current user key
      // In production, you might want to keep a list of all user IDs
      remove(this.CURRENT_USER_KEY)

      // Clear common user profiles
      const commonIds = [
        UserHealthInfoId.primary(),
        // Add other known IDs if needed
      ]

      for (const id of commonIds) {
        try {
          await this.deleteById(id)
        } catch {
          // Ignore errors when deleting individual profiles
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error clearing user profiles: ${error.message}`)
      } else {
        throw new Error("Error clearing user profiles: Unknown error")
      }
    }
  }

  /**
   * Create or update the primary user profile (convenience method)
   */
  async createOrUpdatePrimary(
    sex: Sex,
    weight: number,
    height: number,
    preferredActivityKeys: string[],
  ): Promise<UserHealthInfo> {
    try {
      const primaryId = UserHealthInfoId.primary()
      const userProfile = UserHealthInfo.createWithId(
        primaryId,
        sex,
        weight as Kilograms,
        height as Centimeters,
        preferredActivityKeys,
      )

      return await this.setCurrent(userProfile)
    } catch (error) {
      throw new Error(
        `Error creating/updating primary user profile: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  /**
   * Check if primary user profile exists
   */
  async hasPrimaryProfile(): Promise<boolean> {
    try {
      const primaryId = UserHealthInfoId.primary()
      return await this.exists(primaryId)
    } catch (error) {
      return false
    }
  }
}
