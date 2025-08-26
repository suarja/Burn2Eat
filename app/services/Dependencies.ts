import { MMKVUserHealthInfoRepository } from "../../src/infrastructure/adapters/MMKVUserHealthInfoRepository"
import { CreateUserProfileUseCase } from "../../src/application/usecases/CreateUserProfileUseCase"
import { GetUserProfileUseCase } from "../../src/application/usecases/GetUserProfileUseCase"
import { UpdateUserProfileUseCase } from "../../src/application/usecases/UpdateUserProfileUseCase"
import { StaticActivityCatalog } from "../../src/infrastructure/adapters/StaticActivityCatalog"
import { StaticDishRepository } from "../../src/infrastructure/adapters/StaticDishRepository"
import { CalculateEffortUseCase } from "../../src/application/usecases/CalculateEffortUseCase"
import { StandardMETEffortPolicy } from "../../src/domain/effort/EffortPolicy"

import type { UserHealthInfoRepository } from "../../src/domain/physiology/UserHealthInfoRepository"
import type { ActivityCatalog } from "../../src/domain/physiology/ActivityCatalog"
import type { DishRepository } from "../../src/domain/nutrition/DishRepository"
import type { EffortPolicy } from "../../src/domain/effort/EffortPolicy"
import { GetFoodCatalogUseCase } from "@/application/usecases/food/GetFoodCatalogUseCase"

/**
 * Singleton dependency injection container for DDD architecture
 * Provides centralized access to all use cases and repositories
 */
export class Dependencies {
  // Repositories (Infrastructure Layer)
  private static _userRepository: UserHealthInfoRepository | null = null
  private static _activityCatalog: ActivityCatalog | null = null
  private static _dishRepository: DishRepository | null = null
  private static _effortPolicy: EffortPolicy | null = null

  // Use Cases (Application Layer)
  private static _createUserUseCase: CreateUserProfileUseCase | null = null
  private static _getUserUseCase: GetUserProfileUseCase | null = null
  private static _updateUserUseCase: UpdateUserProfileUseCase | null = null
  private static _calculateEffortUseCase: CalculateEffortUseCase | null = null
  private static _getFoodCatalogUseCase: GetFoodCatalogUseCase | null = null

  /**
   * Initialize all dependencies (call once at app startup)
   */
  static initialize(): void {
    console.log("🏗️ Dependencies: Initializing DDD architecture...")

    // Infrastructure Layer
    this._userRepository = new MMKVUserHealthInfoRepository()
    this._activityCatalog = new StaticActivityCatalog()
    this._dishRepository = new StaticDishRepository()
    this._effortPolicy = new StandardMETEffortPolicy()

    // Application Layer (Inject dependencies)
    this._createUserUseCase = new CreateUserProfileUseCase(this._userRepository)
    this._getUserUseCase = new GetUserProfileUseCase(this._userRepository)
    this._updateUserUseCase = new UpdateUserProfileUseCase(this._userRepository)
    this._calculateEffortUseCase = new CalculateEffortUseCase(
      this._dishRepository,
      this._activityCatalog,
      this._effortPolicy
    )
    this._getFoodCatalogUseCase = new GetFoodCatalogUseCase(this._dishRepository)

    console.log("✅ Dependencies: DDD architecture initialized successfully")
  }

  /**
   * Reset all dependencies (for testing)
   */
  static reset(): void {
    this._userRepository = null
    this._activityCatalog = null
    this._dishRepository = null
    this._effortPolicy = null
    this._createUserUseCase = null
    this._getUserUseCase = null
    this._updateUserUseCase = null
    this._calculateEffortUseCase = null
  }

  // Repository Getters
  static userRepository(): UserHealthInfoRepository {
    if (!this._userRepository) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._userRepository
  }

  static activityCatalog(): ActivityCatalog {
    if (!this._activityCatalog) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._activityCatalog
  }

  static dishRepository(): DishRepository {
    if (!this._dishRepository) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._dishRepository
  }

  static effortPolicy(): EffortPolicy {
    if (!this._effortPolicy) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._effortPolicy
  }

  // Use Case Getters
  static createUserUseCase(): CreateUserProfileUseCase {
    if (!this._createUserUseCase) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._createUserUseCase
  }

  static getUserUseCase(): GetUserProfileUseCase {
    if (!this._getUserUseCase) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._getUserUseCase
  }

  static updateUserUseCase(): UpdateUserProfileUseCase {
    if (!this._updateUserUseCase) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._updateUserUseCase
  }

  static calculateEffortUseCase(): CalculateEffortUseCase {
    if (!this._calculateEffortUseCase) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._calculateEffortUseCase
  }
  static getFoodCatalogUseCase(): GetFoodCatalogUseCase {
    if (!this._getFoodCatalogUseCase) {
      throw new Error("Dependencies not initialized. Call Dependencies.initialize() first.")
    }
    return this._getFoodCatalogUseCase
  }
}

/**
 * Initialize dependencies at app startup
 * Call this once in your main App component
 */
export const initializeDependencies = (): void => {
  Dependencies.initialize()
}

/**
 * Convenience function to check if dependencies are initialized
 */
export const areDependenciesInitialized = (): boolean => {
  try {
    Dependencies.userRepository()
    return true
  } catch {
    return false
  }
}