# 🏗️ Burn2Eat MVP Architecture

**Domain-Driven Design (DDD) with Clean Architecture**  
*React Native + Ignite CLI + MMKV + TypeScript*

---

## 📁 Project Structure

```
/src
  /domain                           # 🧠 Pure Business Logic
    /common
      UnitTypes.ts                  # Branded types (Kilocalories, Kilograms, etc.)
    /nutrition
      Dish.ts                       # Entity
      DishId.ts                     # Value Object  
      NutritionalInfo.ts            # Value Object
      DishRepository.ts             # Port (Interface)
    /physiology  
      UserHealthInfo.ts             # Entity (with ID + update methods)
      UserHealthInfoId.ts           # Value Object (UUID-based)
      UserHealthInfoRepository.ts   # Port (Interface)
      Sex.ts                        # Type
      Met.ts                        # Value Object
      Activity.ts                   # Entity
      ActivityCatalog.ts            # Port (Interface)
    /effort
      EffortRequest.ts              # Value Object
      EffortBreakdown.ts            # Value Object + Entity
      EffortCalculator.ts           # Domain Service
      EffortPolicy.ts               # Policy Interface + Implementations
      
  /application                      # 🎛️ Use Cases (Orchestration)
    /usecases
      CalculateEffortUseCase.ts     # Food → Exercise calculation
      CreateUserProfileUseCase.ts   # User profile creation
      UpdateUserProfileUseCase.ts   # User profile updates  
      GetUserProfileUseCase.ts      # User profile retrieval
      
  /infrastructure                   # 🔌 External Concerns
    /adapters
      StaticDishRepository.ts       # Implements DishRepository
      StaticActivityCatalog.ts      # Implements ActivityCatalog
      MMKVUserHealthInfoRepository.ts # Implements UserHealthInfoRepository (MMKV)
    /data
      foods-dataset.ts              # 21 foods with images & nutrition
      activities-dataset.ts         # 28 activities with official MET values
    /types
      FoodData.ts                   # Infrastructure food types
      ActivityData.ts               # Infrastructure activity types
      UserHealthInfoData.ts         # Infrastructure user profile types
      
/app/utils/storage                  # 🗄️ Ignite MMKV Integration
  index.ts                          # MMKV storage utilities
  storage.test.ts                   # Storage tests
  
/test                              # 🧪 Comprehensive Testing
  /domain                          # Pure domain tests (102 tests)
    /nutrition
      Dish.spec.ts
      NutritionalInfo.spec.ts
    /physiology  
      UserHealthInfo.spec.ts        # 29 tests (with ID + updates)
      UserHealthInfoId.spec.ts      # 12 tests (UUID validation)
      Activity.spec.ts
      Met.spec.ts
    /effort
      EffortCalculator.spec.ts      # 18 tests (with mocks)
  /application                     # Use case tests (26 tests)
    /usecases
      CalculateEffortUseCase.spec.ts
      CreateUserProfileUseCase.spec.ts
  /infrastructure                  # Integration tests (16 tests) 
    /adapters
      StaticDishRepository.spec.ts
      StaticActivityCatalog.spec.ts
      MMKVUserHealthInfoRepository.spec.ts
  /integration                     # End-to-end tests (23 tests)
    effort-calculation.spec.ts
    FullEffortCalculationIntegration.spec.ts
    UserProfileManagement.spec.ts
```

---

## 🧠 Domain Layer (Pure Business Logic)

### Common Types & Utilities

```typescript
// /domain/common/UnitTypes.ts - Type Safety
export type Kilocalories = number & { readonly __brand: "kcal" };
export type Kilograms    = number & { readonly __brand: "kg" };
export type Centimeters  = number & { readonly __brand: "cm" };
export type Minutes      = number & { readonly __brand: "min" };
```

### 🥗 Nutrition Domain

```typescript
// /domain/nutrition/Dish.ts - Food Entity
export class Dish {
  private constructor(
    private readonly id: DishId,
    private readonly name: string,
    private readonly nutrition: NutritionalInfo
  ) {}
  
  static create({ dishId, name, nutrition }: DishConfig): Dish
  getCalories(): Kilocalories
  isHighCalorie(): boolean  // >400 kcal business rule
}

// /domain/nutrition/NutritionalInfo.ts - Pure Value Object
export class NutritionalInfo {
  private constructor(
    private readonly calories: Kilocalories,
    private readonly protein?: number,
    private readonly carbs?: number,
    private readonly fat?: number
  ) {}
  
  static perServing(calories: Kilocalories): NutritionalInfo
  getCalories(): Kilocalories
}

// /domain/nutrition/DishRepository.ts - Port (Interface)
export interface DishRepository {
  findById(id: string): Promise<Dish | null>;
  findByName(name: string): Promise<Dish[]>;
  findByCalorieRange(min: number, max: number): Promise<Dish[]>;
}
```

### 🫀 Physiology Domain

```typescript
// /domain/physiology/UserHealthInfo.ts - Enhanced Entity with ID
export class UserHealthInfo {
  private constructor(
    public readonly id: UserHealthInfoId,
    public readonly sex: Sex,
    public readonly weight: Kilograms,
    public readonly height: Centimeters,
    public readonly preferredActivityKeys: string[]
  ) {}
  
  static create(sex: Sex, weight: Kilograms, height: Centimeters, activities: string[]): UserHealthInfo
  static createWithId(id: UserHealthInfoId, ...): UserHealthInfo
  
  // Getters
  getId(): UserHealthInfoId
  getWeight(): Kilograms
  getPrimaryActivityKey(): string | null
  
  // Business Logic
  calculateBMI(): number
  getBMICategory(): 'underweight' | 'normal' | 'overweight' | 'obese'
  hasHealthyWeight(): boolean
  
  // Update Methods (Immutable)
  withWeight(weight: Kilograms): UserHealthInfo
  withHeight(height: Centimeters): UserHealthInfo
  withSex(sex: Sex): UserHealthInfo
  withPreferredActivities(keys: string[]): UserHealthInfo
  withProfileData(sex?, weight?, height?, activities?): UserHealthInfo
}

// /domain/physiology/UserHealthInfoId.ts - UUID Value Object
export class UserHealthInfoId {
  private constructor(private readonly value: string) {}
  
  static generate(): UserHealthInfoId        // UUID v4
  static from(value: string): UserHealthInfoId  // With validation
  static primary(): UserHealthInfoId         // Primary user ID
  
  toString(): string
  equals(other: UserHealthInfoId): boolean
}

// /domain/physiology/UserHealthInfoRepository.ts - Port
export interface UserHealthInfoRepository {
  save(userProfile: UserHealthInfo): Promise<UserHealthInfo>;
  findById(id: UserHealthInfoId): Promise<UserHealthInfo | null>;
  getCurrent(): Promise<UserHealthInfo | null>;
  setCurrent(userProfile: UserHealthInfo): Promise<UserHealthInfo>;
  deleteById(id: UserHealthInfoId): Promise<boolean>;
  exists(id: UserHealthInfoId): Promise<boolean>;
}

// /domain/physiology/Activity.ts - Physical Activity Entity
export class Activity {
  private constructor(
    public readonly key: string,
    public readonly label: string, 
    public readonly met: Met
  ) {}
  
  static define(key: string, label: string, met: Met): Activity
  getMET(): Met
  isHighIntensity(): boolean  // ≥6 METs
}

// /domain/physiology/Met.ts - Metabolic Equivalent Value Object
export class Met {
  private constructor(public readonly value: number) {}
  
  static of(value: number): Met  // Validates 0-25 METs
  toNumber(): number
  isVigorousIntensity(): boolean  // ≥6 METs
}
```

### 🔥 Effort Calculation Domain

```typescript
// /domain/effort/EffortCalculator.ts - Core Domain Service
export class EffortCalculator {
  constructor(
    private readonly activityCatalog: ActivityCatalog,
    private readonly effortPolicy: EffortPolicy
  ) {}
  
  calculateEffort(request: EffortRequest): EffortBreakdown
  getQuickRecommendations(request: EffortRequest): EffortBreakdown | null  // <30min
  getEnduranceRecommendations(request: EffortRequest): EffortBreakdown | null  // 45+min
  getComparativeBreakdown(request: EffortRequest): IntensityComparison
}

// /domain/effort/EffortPolicy.ts - Calculation Strategy
export interface EffortPolicy {
  minutesToBurn(calories: Kilocalories, userWeightKg: Kilograms, activityMET: number): Minutes;
}

export class StandardMETEffortPolicy implements EffortPolicy {
  // Formula: minutes = calories / (MET × 3.5 × weightKg / 200)
  minutesToBurn(calories, userWeightKg, activityMET): Minutes
  getCalorieBurnRate(userWeightKg, activityMET): number
}

export class ConservativeEffortPolicy implements EffortPolicy {
  // Adds 10% safety margin for beginners
}

// /domain/effort/EffortBreakdown.ts - Results Value Objects
export class EffortItem {
  constructor(
    public readonly activityKey: string,
    public readonly activityLabel: string, 
    public readonly minutes: Minutes,
    public readonly metValue: number
  ) {}
  
  getFormattedDuration(): string  // "1h 23min"
  getEffortDescription(): string  // "Quick", "Moderate", "Extended"
}

export class EffortBreakdown {
  constructor(
    public readonly primary: EffortItem,
    public readonly alternatives: EffortItem[]
  ) {}
  
  getQuickestActivity(): EffortItem
  getActivitiesByDuration(): EffortItem[]
  getSummary(): BreakdownSummary
}
```

---

## 🎛️ Application Layer (Use Cases)

### User Profile Management

```typescript
// /application/usecases/CreateUserProfileUseCase.ts
export class CreateUserProfileUseCase {
  constructor(private readonly userRepository: UserHealthInfoRepository) {}
  
  async execute(input: CreateUserProfileInput): Promise<CreateUserProfileOutput>
  async createPrimary(input: CreateUserProfileInput): Promise<CreateUserProfileOutput>
  
  private validateInput(input: CreateUserProfileInput): void  // Weight/height validation
}

// /application/usecases/UpdateUserProfileUseCase.ts  
export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserHealthInfoRepository) {}
  
  async execute(input: UpdateUserProfileInput): Promise<UpdateUserProfileOutput>
  async updateCurrent(input: Partial<UpdateUserProfileInput>): Promise<UpdateUserProfileOutput>
  async updateWeight(weight: number, userId?: string): Promise<UpdateUserProfileOutput>
  async updatePreferredActivities(keys: string[], userId?: string): Promise<UpdateUserProfileOutput>
}

// /application/usecases/GetUserProfileUseCase.ts
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserHealthInfoRepository) {}
  
  async execute(input: GetUserProfileInput): Promise<GetUserProfileOutput>
  async getCurrent(): Promise<GetUserProfileOutput>
  async getCurrentOrDefault(): Promise<GetUserProfileOutput>  // Returns defaults if none
  async exists(input: GetUserProfileInput): Promise<UserProfileExistsOutput>
}
```

### Effort Calculation

```typescript
// /application/usecases/CalculateEffortUseCase.ts
export class CalculateEffortUseCase {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly activityCatalog: ActivityCatalog,
    private readonly effortPolicy: EffortPolicy
  ) {}
  
  async execute(input: CalculateEffortInput): Promise<CalculateEffortOutput>
  async getQuickRecommendations(input: CalculateEffortInput): Promise<CalculateEffortOutput | null>
  async getComparativeAnalysis(input: CalculateEffortInput): Promise<EffortComparisonOutput>
  async compareEffortPolicies(input: CalculateEffortInput): Promise<PolicyComparisonOutput>
}
```

---

## 🔌 Infrastructure Layer

### MMKV User Profile Persistence

```typescript
// /infrastructure/adapters/MMKVUserHealthInfoRepository.ts
export class MMKVUserHealthInfoRepository implements UserHealthInfoRepository {
  private readonly CURRENT_USER_KEY = "current-user-profile";
  private readonly USER_PREFIX = "user-profile-";
  
  async save(userProfile: UserHealthInfo): Promise<UserHealthInfo>
  async findById(id: UserHealthInfoId): Promise<UserHealthInfo | null>
  async getCurrent(): Promise<UserHealthInfo | null>
  async setCurrent(userProfile: UserHealthInfo): Promise<UserHealthInfo>
  
  // Convenience Methods
  async createOrUpdatePrimary(sex, weight, height, activities): Promise<UserHealthInfo>
  async hasPrimaryProfile(): Promise<boolean>
  
  private toData(userProfile: UserHealthInfo): UserHealthInfoData      // Domain → Storage
  private toDomain(data: UserHealthInfoData): UserHealthInfo           // Storage → Domain
}

// Uses Ignite's MMKV storage utilities
import { load, save, remove } from "../../app/utils/storage";
```

### Static Data Repositories

```typescript
// /infrastructure/adapters/StaticDishRepository.ts
export class StaticDishRepository implements DishRepository {
  async findById(id: string): Promise<Dish | null>
  async findByName(name: string): Promise<Dish[]>
  
  private toDomainDish(foodData: FoodData): Dish  // Infrastructure → Domain translation
}

// /infrastructure/adapters/StaticActivityCatalog.ts  
export class StaticActivityCatalog implements ActivityCatalog {
  getByKey(key: string): Activity | null
  getByIntensity(intensity: 'light' | 'moderate' | 'vigorous'): Activity[]
  
  private toDomainActivity(activityData: ActivityData): Activity
}
```

### Datasets

```typescript
// /infrastructure/data/foods-dataset.ts
export const FOODS_DATASET: FoodData[] = [
  // 21 foods with Unsplash images, multilingual names, accurate nutrition
  { id: 'apple-red', names: { en: 'Red Apple', fr: 'Pomme Rouge' }, calories: 95, ... },
  { id: 'burger-classic', names: { en: 'Classic Burger', fr: 'Burger Classique' }, calories: 540, ... }
];

// /infrastructure/data/activities-dataset.ts  
export const ACTIVITIES_DATASET: ActivityData[] = [
  // 28 activities with official 2011 Compendium MET values
  { key: 'walking_brisk', names: { en: 'Walking (Brisk)', fr: 'Marche Rapide' }, met: 3.5, ... },
  { key: 'jogging_general', names: { en: 'Jogging (General)', fr: 'Jogging' }, met: 7.0, ... }
];
```

---

## 🗄️ Storage Layer (MMKV Integration)

```typescript
// /app/utils/storage/index.ts - Ignite's MMKV utilities
import { MMKV } from "react-native-mmkv"

export const storage = new MMKV()

export function save(key: string, value: unknown): boolean
export function load<T>(key: string): T | null
export function remove(key: string): void
export function clear(): void

// User profiles stored as:
// "current-user-profile" → "uuid"
// "user-profile-uuid" → { id, sex, weight, height, preferredActivityKeys, ... }
```

---

## 🧪 Testing Architecture

### Test Coverage Summary
- **Domain Tests**: 102 tests (Pure business logic)
- **Application Tests**: 26 tests (Use cases with mocks)  
- **Infrastructure Tests**: 16 tests (MMKV repository)
- **Integration Tests**: 23 tests (End-to-end workflows)
- **Total**: **167 tests** with comprehensive coverage

### Testing Strategy

```typescript
// Domain Tests (Pure, Fast, Isolated)
describe('UserHealthInfo', () => {
  it('should validate weight range', () => {
    expect(() => UserHealthInfo.create("male" as Sex, 25 as Kilograms, 180 as Centimeters, []))
      .toThrow('Weight must be between 30 and 300 kg');
  });
});

// Application Tests (Mocked Dependencies)
describe('CreateUserProfileUseCase', () => {
  let mockRepository: MockUserHealthInfoRepository;
  
  it('should create and save user profile successfully', async () => {
    const result = await useCase.execute({
      sex: "male", weight: 75, height: 180, preferredActivityKeys: ["walking"]
    });
    expect(result.success).toBe(true);
  });
});

// Infrastructure Tests (MMKV Mocked)
jest.mock("../../../app/utils/storage");

describe('MMKVUserHealthInfoRepository', () => {
  it('should save user profile to MMKV storage', async () => {
    mockSave.mockReturnValue(true);
    const result = await repository.save(userProfile);
    expect(mockSave).toHaveBeenCalledWith("user-profile-uuid", expect.objectContaining({
      id: userProfile.getId().toString(),
      weight: 75
    }));
  });
});

// Integration Tests (Real Datasets)
describe('User Profile Management Integration', () => {
  it('should create, retrieve, update workflow', async () => {
    const createResult = await createUseCase.createPrimary({ sex: "male", weight: 75, ... });
    const getResult = await getUserCase.getCurrent();
    const updateResult = await updateUseCase.updateWeight(80);
    
    expect(createResult.success && getResult.success && updateResult.success).toBe(true);
  });
});
```

---

## 🔄 DDD Principles Applied

### ✅ Dependency Inversion
- **Domain** defines interfaces (ports): `UserHealthInfoRepository`, `ActivityCatalog`
- **Infrastructure** implements adapters: `MMKVUserHealthInfoRepository`, `StaticActivityCatalog`  
- **Application** depends on domain abstractions, not concrete implementations

### ✅ Clean Architecture Layers
```
🎯 Domain    ←─── Application ←─── Infrastructure
    ↑                ↑                 ↑
   Pure         Orchestration    External Systems
 Business        Use Cases        (MMKV, Files)
  Logic
```

### ✅ Entity Design Patterns
- **Immutable Value Objects**: `UserHealthInfoId`, `Met`, `EffortItem`
- **Rich Domain Entities**: `UserHealthInfo` with business logic (BMI, validation)
- **Domain Services**: `EffortCalculator` for complex business operations
- **Repository Pattern**: Abstracted data access via interfaces

### ✅ Ubiquitous Language
- **MET** (Metabolic Equivalent): Standard exercise physiology term
- **Effort Breakdown**: Business concept of exercise alternatives  
- **Primary Activity**: User's preferred exercise choice
- **BMI Category**: Health classification business rule

---

## 🚀 Key Features Implemented

### 🔥 Effort Calculation Engine
- **Formula**: Standard MET equation (minutes = calories / (MET × 3.5 × weight / 200))
- **Realistic Results**: Apple (95 kcal) + Walking = 22 min, Burger (540 kcal) + Jogging = 1h 3min
- **Multiple Strategies**: Standard, Conservative (with safety margins)
- **Smart Recommendations**: Quick (<30min), Endurance (45+min), Intensity comparisons

### 👤 User Profile Management  
- **Complete CRUD**: Create, Read, Update with validation
- **MMKV Persistence**: Fast local storage using Ignite's existing setup
- **Health Calculations**: BMI, BMI categories, healthy weight detection
- **Immutable Updates**: Type-safe profile modifications
- **Primary User Pattern**: Single-user app with primary profile concept

### 📊 Rich Datasets
- **21 Foods**: With Unsplash images, multilingual names, accurate nutrition
- **28 Activities**: Official 2011 Compendium MET values, categorized by intensity  
- **Type-Safe**: Full TypeScript interfaces with validation
- **Search & Filter**: By name, calorie range, activity intensity

### 🏗️ Enterprise Architecture
- **Domain-Driven Design**: Clean separation of business logic
- **SOLID Principles**: Single responsibility, dependency inversion  
- **Testability**: 167 tests across all layers
- **Extensibility**: Easy to add new data sources, calculation methods
- **Type Safety**: Branded types prevent unit confusion

---

## 🎯 Next Steps for UI Implementation

The architecture is now **ready for UI integration**. You have:

1. ✅ **Complete Domain Models** with business logic
2. ✅ **Use Cases** for all user interactions  
3. ✅ **MMKV Persistence** via repository pattern
4. ✅ **Comprehensive Testing** ensuring reliability
5. ✅ **Type Safety** throughout the stack

### UI Integration Points:

```typescript
// Screens will use these use cases:
const createProfileUseCase = new CreateUserProfileUseCase(userRepository);
const calculateEffortUseCase = new CalculateEffortUseCase(dishRepo, activityCatalog);

// Example screen logic:
const handleSaveProfile = async (formData) => {
  const result = await createProfileUseCase.execute({
    sex: formData.sex,
    weight: formData.weight,
    height: formData.height, 
    preferredActivityKeys: formData.activities
  });
  
  if (result.success) {
    navigation.navigate('Home');
  } else {
    showError(result.error);
  }
};
```

The **domain is completely decoupled** from UI concerns, making it easy to build React Native screens that interact with a robust, tested business layer.

---

*This architecture provides a **solid foundation** for the Burn2Eat MVP with room to evolve as business requirements grow.* 🎉