import { EffortBreakdown } from "../../domain/effort/EffortBreakdown"
import { EffortCalculator } from "../../domain/effort/EffortCalculator"
import { EffortPolicy, EffortPolicyFactory } from "../../domain/effort/EffortPolicy"
import { EffortRequest } from "../../domain/effort/EffortRequest"
// DishId import removed as unused
import { DishRepository } from "../../domain/nutrition/DishRepository"
import { ActivityCatalog } from "../../domain/physiology/ActivityCatalog"
import { UserHealthInfo } from "../../domain/physiology/UserHealthInfo"

/**
 * Application use case for calculating effort to burn food calories
 *
 * Orchestrates domain services and infrastructure adapters to provide
 * effort calculations for the presentation layer.
 */
export class CalculateEffortUseCase {
  private readonly effortCalculator: EffortCalculator

  constructor(
    private readonly dishRepository: DishRepository,
    private readonly activityCatalog: ActivityCatalog,
    private readonly effortPolicy: EffortPolicy = EffortPolicyFactory.standard(),
  ) {
    this.effortCalculator = new EffortCalculator(activityCatalog, effortPolicy)
  }

  /**
   * Calculate effort breakdown for a specific dish and user
   */
  async execute(input: CalculateEffortInput): Promise<CalculateEffortOutput> {
    // Validate input
    if (!input.dishId || !input.user) {
      throw new Error("Dish ID and user information are required")
    }

    // Get dish from repository
    const dish = await this.dishRepository.findById(input.dishId)
    if (!dish) {
      throw new Error(`Dish not found: ${input.dishId}`)
    }

    return this.calculateForDish(dish, input.user)
  }

  /**
   * Calculate effort breakdown for a dish object directly (for barcode scanned dishes)
   * This bypasses the repository lookup
   */
  async executeWithDish(input: CalculateEffortWithDishInput): Promise<CalculateEffortOutput> {
    // Validate input
    if (!input.dish || !input.user) {
      throw new Error("Dish object and user information are required")
    }

    return this.calculateForDish(input.dish, input.user)
  }

  /**
   * Common calculation logic for both ID-based and dish-object-based calculations
   */
  private calculateForDish(dish: any, user: any): CalculateEffortOutput {
    // Create effort request
    const request = EffortRequest.of(dish, user)

    // Calculate effort breakdown
    const breakdown = this.effortCalculator.calculateEffort(request)

    // Return formatted output
    return {
      dish: {
        id: dish.getId().toString(),
        name: dish.getName(),
        calories: dish.getCalories(),
      },
      user: {
        weight: user.getWeight(),
        primaryActivity: user.getPrimaryActivityKey(),
      },
      effort: {
        primary: {
          activityKey: breakdown.getPrimary().getActivityKey(),
          activityLabel: breakdown.getPrimary().getActivityLabel(),
          minutes: breakdown.getPrimary().getMinutes(),
          metValue: breakdown.getPrimary().getMETValue(),
          formattedDuration: breakdown.getPrimary().getFormattedDuration(),
          effortDescription: breakdown.getPrimary().getEffortDescription(),
        },
        alternatives: breakdown.getAlternatives().map((alt) => ({
          activityKey: alt.getActivityKey(),
          activityLabel: alt.getActivityLabel(),
          minutes: alt.getMinutes(),
          metValue: alt.getMETValue(),
          formattedDuration: alt.getFormattedDuration(),
          effortDescription: alt.getEffortDescription(),
        })),
        summary: breakdown.getSummary(),
      },
    }
  }

  /**
   * Get quick recommendations for time-constrained users
   */
  async getQuickRecommendations(
    input: CalculateEffortInput,
  ): Promise<CalculateEffortOutput | null> {
    const dish = await this.dishRepository.findById(input.dishId)
    if (!dish) {
      throw new Error(`Dish not found: ${input.dishId}`)
    }

    const request = EffortRequest.of(dish, input.user)
    const quickBreakdown = this.effortCalculator.getQuickRecommendations(request)

    if (!quickBreakdown) {
      return null
    }

    return this.formatBreakdownOutput(dish, input.user, quickBreakdown)
  }

  /**
   * Get endurance recommendations for users who prefer longer, less intense activities
   */
  async getEnduranceRecommendations(
    input: CalculateEffortInput,
  ): Promise<CalculateEffortOutput | null> {
    const dish = await this.dishRepository.findById(input.dishId)
    if (!dish) {
      throw new Error(`Dish not found: ${input.dishId}`)
    }

    const request = EffortRequest.of(dish, input.user)
    const enduranceBreakdown = this.effortCalculator.getEnduranceRecommendations(request)

    if (!enduranceBreakdown) {
      return null
    }

    return this.formatBreakdownOutput(dish, input.user, enduranceBreakdown)
  }

  /**
   * Compare effort across different intensity levels for educational purposes
   */
  async getComparativeAnalysis(input: CalculateEffortInput): Promise<EffortComparisonOutput> {
    const dish = await this.dishRepository.findById(input.dishId)
    if (!dish) {
      throw new Error(`Dish not found: ${input.dishId}`)
    }

    const request = EffortRequest.of(dish, input.user)
    const comparison = this.effortCalculator.getComparativeBreakdown(request)

    return {
      dish: {
        id: dish.getId().toString(),
        name: dish.getName(),
        calories: dish.getCalories(),
      },
      user: {
        weight: input.user.getWeight(),
      },
      intensityComparison: {
        light: comparison.light
          ? {
              activityLabel: comparison.light.getActivityLabel(),
              minutes: comparison.light.getMinutes(),
              metValue: comparison.light.getMETValue(),
              formattedDuration: comparison.light.getFormattedDuration(),
            }
          : null,
        moderate: comparison.moderate
          ? {
              activityLabel: comparison.moderate.getActivityLabel(),
              minutes: comparison.moderate.getMinutes(),
              metValue: comparison.moderate.getMETValue(),
              formattedDuration: comparison.moderate.getFormattedDuration(),
            }
          : null,
        vigorous: comparison.vigorous
          ? {
              activityLabel: comparison.vigorous.getActivityLabel(),
              minutes: comparison.vigorous.getMinutes(),
              metValue: comparison.vigorous.getMETValue(),
              formattedDuration: comparison.vigorous.getFormattedDuration(),
            }
          : null,
      },
    }
  }

  /**
   * Calculate effort with different policies for comparison
   */
  async compareEffortPolicies(input: CalculateEffortInput): Promise<PolicyComparisonOutput> {
    const dish = await this.dishRepository.findById(input.dishId)
    if (!dish) {
      throw new Error(`Dish not found: ${input.dishId}`)
    }

    const request = EffortRequest.of(dish, input.user)

    const standardBreakdown = this.effortCalculator.calculateEffort(request)
    const conservativeBreakdown = this.effortCalculator.calculateEffortWithPolicy(
      request,
      EffortPolicyFactory.conservative(),
    )

    return {
      dish: {
        id: dish.getId().toString(),
        name: dish.getName(),
        calories: dish.getCalories(),
      },
      user: {
        weight: input.user.getWeight(),
      },
      policyComparison: {
        standard: {
          primary: {
            activityLabel: standardBreakdown.getPrimary().getActivityLabel(),
            minutes: standardBreakdown.getPrimary().getMinutes(),
            formattedDuration: standardBreakdown.getPrimary().getFormattedDuration(),
          },
        },
        conservative: {
          primary: {
            activityLabel: conservativeBreakdown.getPrimary().getActivityLabel(),
            minutes: conservativeBreakdown.getPrimary().getMinutes(),
            formattedDuration: conservativeBreakdown.getPrimary().getFormattedDuration(),
          },
        },
      },
    }
  }

  /**
   * Helper method to format breakdown output consistently
   */
  private formatBreakdownOutput(
    dish: any,
    user: UserHealthInfo,
    breakdown: EffortBreakdown,
  ): CalculateEffortOutput {
    return {
      dish: {
        id: dish.getId().toString(),
        name: dish.getName(),
        calories: dish.getCalories(),
      },
      user: {
        weight: user.getWeight(),
        primaryActivity: user.getPrimaryActivityKey(),
      },
      effort: {
        primary: {
          activityKey: breakdown.getPrimary().getActivityKey(),
          activityLabel: breakdown.getPrimary().getActivityLabel(),
          minutes: breakdown.getPrimary().getMinutes(),
          metValue: breakdown.getPrimary().getMETValue(),
          formattedDuration: breakdown.getPrimary().getFormattedDuration(),
          effortDescription: breakdown.getPrimary().getEffortDescription(),
        },
        alternatives: breakdown.getAlternatives().map((alt) => ({
          activityKey: alt.getActivityKey(),
          activityLabel: alt.getActivityLabel(),
          minutes: alt.getMinutes(),
          metValue: alt.getMETValue(),
          formattedDuration: alt.getFormattedDuration(),
          effortDescription: alt.getEffortDescription(),
        })),
        summary: breakdown.getSummary(),
      },
    }
  }
}

/**
 * Input data for effort calculation use case
 */
export interface CalculateEffortInput {
  dishId: string
  user: UserHealthInfo
}

/**
 * Input data for effort calculation with dish object (for barcode scanning)
 */
export interface CalculateEffortWithDishInput {
  dish: any // Using any to avoid circular import with Dish type
  user: UserHealthInfo
}

/**
 * Output data for effort calculation use case
 */
export interface CalculateEffortOutput {
  dish: {
    id: string
    name: string
    calories: number
  }
  user: {
    weight: number
    primaryActivity: string | null
  }
  effort: {
    primary: {
      activityKey: string
      activityLabel: string
      minutes: number
      metValue: number
      formattedDuration: string
      effortDescription: string
    }
    alternatives: Array<{
      activityKey: string
      activityLabel: string
      minutes: number
      metValue: number
      formattedDuration: string
      effortDescription: string
    }>
    summary: {
      totalOptions: number
      quickestTime: number
      longestTime: number
      averageTime: number
      primaryActivity: string
    }
  }
}

/**
 * Output for effort comparison across intensity levels
 */
export interface EffortComparisonOutput {
  dish: {
    id: string
    name: string
    calories: number
  }
  user: {
    weight: number
  }
  intensityComparison: {
    light: {
      activityLabel: string
      minutes: number
      metValue: number
      formattedDuration: string
    } | null
    moderate: {
      activityLabel: string
      minutes: number
      metValue: number
      formattedDuration: string
    } | null
    vigorous: {
      activityLabel: string
      minutes: number
      metValue: number
      formattedDuration: string
    } | null
  }
}

/**
 * Output for policy comparison
 */
export interface PolicyComparisonOutput {
  dish: {
    id: string
    name: string
    calories: number
  }
  user: {
    weight: number
  }
  policyComparison: {
    standard: {
      primary: {
        activityLabel: string
        minutes: number
        formattedDuration: string
      }
    }
    conservative: {
      primary: {
        activityLabel: string
        minutes: number
        formattedDuration: string
      }
    }
  }
}
