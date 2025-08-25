import { UserHealthInfoRepository } from "../../domain/physiology/UserHealthInfoRepository";
import { UserHealthInfoId } from "../../domain/physiology/UserHealthInfoId";
import { Sex } from "../../domain/physiology/Sex";

/**
 * Use case for retrieving user profile information
 */
export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserHealthInfoRepository
  ) {}

  /**
   * Execute the use case to get a user profile by ID
   */
  async execute(input: GetUserProfileInput): Promise<GetUserProfileOutput> {
    try {
      // Validate input
      if (!input.id) {
        return {
          success: false,
          error: 'User ID is required',
          userProfile: null
        };
      }

      const userId = UserHealthInfoId.from(input.id);
      const userProfile = await this.userRepository.findById(userId);

      if (!userProfile) {
        return {
          success: false,
          error: `User profile with ID ${input.id} not found`,
          userProfile: null
        };
      }

      return {
        success: true,
        userProfile: {
          id: userProfile.getId().toString(),
          sex: userProfile.getSex(),
          weight: userProfile.getWeight(),
          height: userProfile.getHeight(),
          preferredActivityKeys: userProfile.getPreferredActivityKeys(),
          primaryActivityKey: userProfile.getPrimaryActivityKey(),
          bmi: userProfile.calculateBMI(),
          bmiCategory: userProfile.getBMICategory(),
          hasHealthyWeight: userProfile.hasHealthyWeight()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        userProfile: null
      };
    }
  }

  /**
   * Get the current user profile
   */
  async getCurrent(): Promise<GetUserProfileOutput> {
    try {
      const userProfile = await this.userRepository.getCurrent();

      if (!userProfile) {
        return {
          success: false,
          error: 'No current user profile found',
          userProfile: null
        };
      }

      return {
        success: true,
        userProfile: {
          id: userProfile.getId().toString(),
          sex: userProfile.getSex(),
          weight: userProfile.getWeight(),
          height: userProfile.getHeight(),
          preferredActivityKeys: userProfile.getPreferredActivityKeys(),
          primaryActivityKey: userProfile.getPrimaryActivityKey(),
          bmi: userProfile.calculateBMI(),
          bmiCategory: userProfile.getBMICategory(),
          hasHealthyWeight: userProfile.hasHealthyWeight()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        userProfile: null
      };
    }
  }

  /**
   * Get the primary user profile
   */
  async getPrimary(): Promise<GetUserProfileOutput> {
    try {
      const primaryId = UserHealthInfoId.primary();
      return await this.execute({ id: primaryId.toString() });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        userProfile: null
      };
    }
  }

  /**
   * Check if user profile exists by ID
   */
  async exists(input: GetUserProfileInput): Promise<UserProfileExistsOutput> {
    try {
      if (!input.id) {
        return {
          success: false,
          error: 'User ID is required',
          exists: false
        };
      }

      const userId = UserHealthInfoId.from(input.id);
      const exists = await this.userRepository.exists(userId);

      return {
        success: true,
        exists: exists
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        exists: false
      };
    }
  }

  /**
   * Check if current user profile exists
   */
  async currentExists(): Promise<UserProfileExistsOutput> {
    try {
      const currentProfile = await this.userRepository.getCurrent();
      
      return {
        success: true,
        exists: currentProfile !== null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        exists: false
      };
    }
  }

  /**
   * Get user profile or create default if none exists
   */
  async getCurrentOrDefault(): Promise<GetUserProfileOutput> {
    try {
      // Try to get current profile
      const currentResult = await this.getCurrent();
      
      if (currentResult.success && currentResult.userProfile) {
        return currentResult;
      }

      // If no current profile, return default data structure
      const defaultProfile = {
        id: UserHealthInfoId.primary().toString(),
        sex: 'unspecified' as Sex,
        weight: 70,
        height: 170,
        preferredActivityKeys: ['walking_brisk', 'jogging_general', 'cycling_moderate'],
        primaryActivityKey: 'walking_brisk',
        bmi: 24.2, // 70kg / (1.7m)^2
        bmiCategory: 'normal' as const,
        hasHealthyWeight: true
      };

      return {
        success: true,
        userProfile: defaultProfile,
        isDefault: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        userProfile: null
      };
    }
  }
}

/**
 * Input for getting a user profile
 */
export interface GetUserProfileInput {
  id: string;
}

/**
 * Output from getting a user profile
 */
export interface GetUserProfileOutput {
  success: boolean;
  error?: string;
  userProfile: {
    id: string;
    sex: Sex;
    weight: number;
    height: number;
    preferredActivityKeys: string[];
    primaryActivityKey: string | null;
    bmi: number;
    bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
    hasHealthyWeight: boolean;
  } | null;
  isDefault?: boolean; // Indicates if this is default data, not persisted
}

/**
 * Output for checking if user profile exists
 */
export interface UserProfileExistsOutput {
  success: boolean;
  error?: string;
  exists: boolean;
}