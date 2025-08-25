import { UserHealthInfoRepository } from "../../domain/physiology/UserHealthInfoRepository";
import { UserHealthInfoId } from "../../domain/physiology/UserHealthInfoId";
import { Sex } from "../../domain/physiology/Sex";
import { Centimeters, Kilograms } from "src/domain/common/UnitTypes";

/**
 * Use case for updating an existing user profile
 */
export class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserHealthInfoRepository
  ) {}

  /**
   * Execute the use case to update a user profile
   */
  async execute(input: UpdateUserProfileInput): Promise<UpdateUserProfileOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Get the user ID (use primary if not specified)
      const userId = input.id ? UserHealthInfoId.from(input.id) : UserHealthInfoId.primary();

      // Find the existing profile
      const existingProfile = await this.userRepository.findById(userId);
      if (!existingProfile) {
        return {
          success: false,
          error: `User profile with ID ${userId.toString()} not found`,
          userProfile: null
        };
      }

      // Update the profile with new data
      const updatedProfile = existingProfile.withProfileData(
        input.sex,
        input.weight as Kilograms,
        input.height as Centimeters,
        input.preferredActivityKeys
      );

      // Save the updated profile
      const savedProfile = await this.userRepository.save(updatedProfile);

      return {
        success: true,
        userProfile: {
          id: savedProfile.getId().toString(),
          sex: savedProfile.getSex(),
          weight: savedProfile.getWeight(),
          height: savedProfile.getHeight(),
          preferredActivityKeys: savedProfile.getPreferredActivityKeys(),
          bmi: savedProfile.calculateBMI(),
          bmiCategory: savedProfile.getBMICategory(),
          hasHealthyWeight: savedProfile.hasHealthyWeight()
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
   * Update the current user profile (convenience method)
   */
  async updateCurrent(input: Omit<UpdateUserProfileInput, 'id'>): Promise<UpdateUserProfileOutput> {
    try {
      // Get the current profile
      const currentProfile = await this.userRepository.getCurrent();
      if (!currentProfile) {
        return {
          success: false,
          error: 'No current user profile found',
          userProfile: null
        };
      }

      // Update with the current profile's ID
      return await this.execute({
        ...input,
        id: currentProfile.getId().toString()
      });
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        userProfile: null
      };
    }
  }

  /**
   * Update only weight (convenience method)
   */
  async updateWeight(weight: number, userId?: string): Promise<UpdateUserProfileOutput> {
    return await this.execute({
      id: userId,
      weight: weight
    });
  }

  /**
   * Update only height (convenience method)
   */
  async updateHeight(height: number, userId?: string): Promise<UpdateUserProfileOutput> {
    return await this.execute({
      id: userId,
      height: height
    });
  }

  /**
   * Update only preferred activities (convenience method)
   */
  async updatePreferredActivities(activityKeys: string[], userId?: string): Promise<UpdateUserProfileOutput> {
    return await this.execute({
      id: userId,
      preferredActivityKeys: activityKeys
    });
  }

  /**
   * Validate input data
   */
  private validateInput(input: UpdateUserProfileInput): void {
    if (!input) {
      throw new Error('Input data is required');
    }

    // At least one field must be provided for update
    if (
      input.sex === undefined &&
      input.weight === undefined &&
      input.height === undefined &&
      input.preferredActivityKeys === undefined
    ) {
      throw new Error('At least one field must be provided for update');
    }

    if (input.sex !== undefined && !['male', 'female', 'unspecified'].includes(input.sex)) {
      throw new Error('Valid sex is required (male, female, or unspecified)');
    }

    if (input.weight !== undefined && (input.weight < 30 || input.weight > 300)) {
      throw new Error('Weight must be between 30 and 300 kg');
    }

    if (input.height !== undefined && (input.height < 120 || input.height > 250)) {
      throw new Error('Height must be between 120 and 250 cm');
    }

    if (input.preferredActivityKeys !== undefined) {
      if (!Array.isArray(input.preferredActivityKeys)) {
        throw new Error('Preferred activity keys must be an array');
      }

      if (input.preferredActivityKeys.some(key => typeof key !== 'string' || key.trim() === '')) {
        throw new Error('All preferred activity keys must be non-empty strings');
      }
    }
  }
}

/**
 * Input for updating a user profile
 */
export interface UpdateUserProfileInput {
  id?: string; // If not provided, updates current user
  sex?: Sex;
  weight?: number; // Kilograms
  height?: number; // Centimeters
  preferredActivityKeys?: string[];
}

/**
 * Output from updating a user profile
 */
export interface UpdateUserProfileOutput {
  success: boolean;
  error?: string;
  userProfile: {
    id: string;
    sex: Sex;
    weight: number;
    height: number;
    preferredActivityKeys: string[];
    bmi: number;
    bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
    hasHealthyWeight: boolean;
  } | null;
}