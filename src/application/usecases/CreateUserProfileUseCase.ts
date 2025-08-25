import { UserHealthInfoRepository } from "../../domain/physiology/UserHealthInfoRepository";
import { UserHealthInfo } from "../../domain/physiology/UserHealthInfo";
import { UserHealthInfoId } from "../../domain/physiology/UserHealthInfoId";
import { Sex } from "../../domain/physiology/Sex";
import { Centimeters, Kilograms } from "src/domain/common/UnitTypes";

/**
 * Use case for creating a new user profile
 */
export class CreateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserHealthInfoRepository
  ) {}

  /**
   * Execute the use case to create a user profile
   */
  async execute(input: CreateUserProfileInput): Promise<CreateUserProfileOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Create the user profile
      const userProfile = UserHealthInfo.create(
        input.sex,
        input.weight as Kilograms,
        input.height as Centimeters,
        input.preferredActivityKeys
      );

      // Save the profile and set as current (for single-user app)
      const savedProfile = await this.userRepository.setCurrent(userProfile);

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
   * Create the primary user profile (convenience method)
   */
  async createPrimary(input: CreateUserProfileInput): Promise<CreateUserProfileOutput> {
    try {
      // Validate input
      this.validateInput(input);

      // Create the user profile with primary ID
      const primaryId = UserHealthInfoId.primary();
      const userProfile = UserHealthInfo.createWithId(
        primaryId,
        input.sex,
        input.weight as Kilograms,
        input.height as Centimeters,
        input.preferredActivityKeys
      );

      // Save the profile and set as current
      const savedProfile = await this.userRepository.setCurrent(userProfile);

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
   * Validate input data
   */
  private validateInput(input: CreateUserProfileInput): void {
    if (!input) {
      throw new Error('Input data is required');
    }

    if (!input.sex || !['male', 'female', 'unspecified'].includes(input.sex)) {
      throw new Error('Valid sex is required (male, female, or unspecified)');
    }

    if (!input.weight || input.weight < 30 || input.weight > 300) {
      throw new Error('Weight must be between 30 and 300 kg');
    }

    if (!input.height || input.height < 120 || input.height > 250) {
      throw new Error('Height must be between 120 and 250 cm');
    }

    if (!Array.isArray(input.preferredActivityKeys)) {
      throw new Error('Preferred activity keys must be an array');
    }

    if (input.preferredActivityKeys.some(key => typeof key !== 'string' || key.trim() === '')) {
      throw new Error('All preferred activity keys must be non-empty strings');
    }
  }
}

/**
 * Input for creating a user profile
 */
export interface CreateUserProfileInput {
  sex: Sex;
  weight: number; // Kilograms
  height: number; // Centimeters
  preferredActivityKeys: string[];
}

/**
 * Output from creating a user profile
 */
export interface CreateUserProfileOutput {
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