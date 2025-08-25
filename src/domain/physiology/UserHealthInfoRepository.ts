import { UserHealthInfo } from "./UserHealthInfo";
import { UserHealthInfoId } from "./UserHealthInfoId";

/**
 * Domain repository interface for UserHealthInfo persistence
 * Follows Clean Architecture - this is a port that will be implemented by infrastructure
 */
export interface UserHealthInfoRepository {
  /**
   * Save a user profile
   * @param userProfile - The user profile to save
   * @returns Promise resolving to the saved profile
   */
  save(userProfile: UserHealthInfo): Promise<UserHealthInfo>;

  /**
   * Find a user profile by ID
   * @param id - The user profile ID
   * @returns Promise resolving to the profile or null if not found
   */
  findById(id: UserHealthInfoId): Promise<UserHealthInfo | null>;

  /**
   * Get the current user profile (primary profile for single-user app)
   * @returns Promise resolving to the current profile or null if not set
   */
  getCurrent(): Promise<UserHealthInfo | null>;

  /**
   * Set the current user profile (primary profile for single-user app)
   * @param userProfile - The user profile to set as current
   * @returns Promise resolving to the saved profile
   */
  setCurrent(userProfile: UserHealthInfo): Promise<UserHealthInfo>;

  /**
   * Delete a user profile by ID
   * @param id - The user profile ID to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteById(id: UserHealthInfoId): Promise<boolean>;

  /**
   * Check if a user profile exists by ID
   * @param id - The user profile ID to check
   * @returns Promise resolving to true if exists, false otherwise
   */
  exists(id: UserHealthInfoId): Promise<boolean>;

  /**
   * Clear all stored user profiles (for testing/reset)
   * @returns Promise resolving when cleared
   */
  clear(): Promise<void>;
}