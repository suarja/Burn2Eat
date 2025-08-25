📁 Folder architecture (MVP, hexagonal)

/src
  /domain
    /common
      UnitTypes.ts
      DomainError.ts
      Result.ts
    /nutrition
      Dish.ts
      NutritionalInfo.ts
      DishId.ts
      DishRepository.ts        // PORT
    /physiology
      UserHealthInfo.ts
      Sex.ts
      Met.ts
      Activity.ts
      ActivityCatalog.ts
    /effort
      EffortRequest.ts
      EffortBreakdown.ts
      EffortCalculator.ts     // DOMAIN SERVICE
      EffortPolicy.ts
  /application
    CalculateEffortUseCase.ts  // orchestrates domain
  /infrastructure
    OpenFoodFactsDishRepository.ts // ADAPTER (later)
  /tests
    /domain
      nutrition/Dish.spec.ts
      physiology/UserHealthInfo.spec.ts
      effort/EffortCalculator.spec.ts
    /application
      CalculateEffortUseCase.spec.ts


⸻

🧠 Domain — Common

// /domain/common/UnitTypes.ts
export type Kilocalories = number & { readonly __brand: "kcal" };
export type Kilograms    = number & { readonly __brand: "kg" };
export type Centimeters  = number & { readonly __brand: "cm" };
export type Minutes      = number & { readonly __brand: "min" };

// /domain/common/DomainError.ts
export abstract class DomainError extends Error {
  abstract readonly code: string;
}

// /domain/common/Result.ts
export type Ok<T> = { ok: true; value: T };
export type Err<E extends DomainError> = { ok: false; error: E };
export type Result<T, E extends DomainError> = Ok<T> | Err<E>;


⸻

🥗 Domain — Nutrition

// /domain/nutrition/DishId.ts
export class DishId {
  private constructor(private readonly value: string) {}
  static from(value: string): DishId { /* no impl */ throw new Error(); }
  toString(): string { /* no impl */ throw new Error(); }
}

// /domain/nutrition/NutritionalInfo.ts
import { Kilocalories } from "../common/UnitTypes";

export class NutritionalInfo {
  private constructor(
    public readonly calories: Kilocalories,
    // extend later: proteins, carbs, fats, per 100g vs per serving, etc.
  ) {}
  static perServing(calories: Kilocalories): NutritionalInfo { /* … */ throw new Error(); }
}

// /domain/nutrition/Dish.ts
import { DishId } from "./DishId";
import { NutritionalInfo } from "./NutritionalInfo";

export class Dish {
  private constructor(
    public readonly id: DishId,
    public readonly name: string,
    public readonly nutrition: NutritionalInfo
  ) {}
  static create(id: DishId, name: string, nutrition: NutritionalInfo): Dish { /* … */ throw new Error(); }
}

// /domain/nutrition/DishRepository.ts  // PORT
import { Dish } from "./Dish";

export interface DishRepository {
  // abstraction over OpenFoodFacts or local catalog
  findByName(query: string, limit?: number): Promise<Dish[]>;
  findByBarcode(barcode: string): Promise<Dish | null>;
  findPopular(limit?: number): Promise<Dish[]>;
}


⸻

🫀 Domain — Physiology

// /domain/physiology/Sex.ts
export type Sex = "male" | "female" | "unspecified";

// /domain/physiology/Met.ts
export class Met {
  private constructor(public readonly value: number) {}
  static of(value: number): Met { /* validate >0 */ throw new Error(); }
}

// /domain/physiology/Activity.ts
import { Met } from "./Met";

export class Activity {
  private constructor(
    public readonly key: string,     // "running_moderate", "walking", "crossfit", "salsa"
    public readonly label: string,   // "Running (moderate)", "Walking", …
    public readonly met: Met
  ) {}
  static define(key: string, label: string, met: Met): Activity { /* … */ throw new Error(); }
}

// /domain/physiology/ActivityCatalog.ts
import { Activity } from "./Activity";

export interface ActivityCatalog {
  getByKey(key: string): Activity | null;
  listDefaults(): Activity[];
}

// /domain/physiology/UserHealthInfo.ts
import { Kilograms, Centimeters } from "../common/UnitTypes";
import { Sex } from "./Sex";

export class UserHealthInfo {
  private constructor(
    public readonly sex: Sex,
    public readonly weight: Kilograms,
    public readonly height: Centimeters,
    public readonly preferredActivityKeys: string[] // order = priority for display
  ) {}
  static average(): UserHealthInfo { /* returns population-average profile */ throw new Error(); }
  static create(sex: Sex, weight: Kilograms, height: Centimeters, preferredActivities: string[]): UserHealthInfo {
    /* validate ranges */ throw new Error();
  }
}


⸻

🔥 Domain — Effort

// /domain/effort/EffortRequest.ts
import { Dish } from "../nutrition/Dish";
import { UserHealthInfo } from "../physiology/UserHealthInfo";

export class EffortRequest {
  private constructor(
    public readonly dish: Dish,
    public readonly user: UserHealthInfo
  ) {}
  static of(dish: Dish, user: UserHealthInfo): EffortRequest { /* … */ throw new Error(); }
}

// /domain/effort/EffortBreakdown.ts
import { Minutes } from "../common/UnitTypes";

export class EffortItem {
  private constructor(
    public readonly activityKey: string,
    public readonly minutes: Minutes
  ) {}
  static of(activityKey: string, minutes: Minutes): EffortItem { /* … */ throw new Error(); }
}

export class EffortBreakdown {
  private constructor(
    public readonly primary: EffortItem,
    public readonly alternatives: EffortItem[] // other activities
  ) {}
  static compose(primary: EffortItem, alternatives: EffortItem[]): EffortBreakdown { /* … */ throw new Error(); }
}

// /domain/effort/EffortPolicy.ts
// Encapsulate physiological equation choice (Harris–Benedict/Katch–McArdle not needed for MVP).
export interface EffortPolicy {
  // Given kcal, user attributes and an activity MET, compute minutes to burn.
  minutesToBurn(calories: number, userWeightKg: number, activityMet: number): number;
}

// /domain/effort/EffortCalculator.ts
import { EffortRequest } from "./EffortRequest";
import { EffortBreakdown } from "./EffortBreakdown";
import { ActivityCatalog } from "../physiology/ActivityCatalog";
import { EffortPolicy } from "./EffortPolicy";

export class EffortCalculator {
  constructor(
    private readonly activities: ActivityCatalog,
    private readonly policy: EffortPolicy
  ) {}
  calculate(req: EffortRequest): EffortBreakdown {
    /* 
      1) pick primary activity from user.preferredActivityKeys (fallback to catalog default)
      2) compute minutes via policy
      3) compute top-2 alternatives
      4) return EffortBreakdown
    */
    throw new Error();
  }
}


⸻

🎛️ Application (orchestration)

// /application/CalculateEffortUseCase.ts
import { DishRepository } from "../domain/nutrition/DishRepository";
import { EffortCalculator } from "../domain/effort/EffortCalculator";
import { UserHealthInfo } from "../domain/physiology/UserHealthInfo";
import { EffortBreakdown } from "../domain/effort/EffortBreakdown";

export class CalculateEffortUseCase {
  constructor(
    private readonly dishes: DishRepository,
    private readonly calculator: EffortCalculator
  ) {}
  async byDishName(query: string, user: UserHealthInfo): Promise<EffortBreakdown> {
    /* get first match dish, build EffortRequest, delegate to calculator */
    throw new Error();
  }
  async byBarcode(barcode: string, user: UserHealthInfo): Promise<EffortBreakdown> {
    /* similar, using findByBarcode */
    throw new Error();
  }
}


⸻

✅ TDD — Test skeletons (Jest-style, sans implémentations)

// /tests/domain/effort/EffortCalculator.spec.ts
import { EffortCalculator } from "../../../src/domain/effort/EffortCalculator";

describe("EffortCalculator", () => {
  it("computes minutes for primary preferred activity", () => {
    // arrange: dish(450 kcal), user(70kg), activity running=7 MET
    // act: calculate
    // assert: minutes close to expected
  });

  it("falls back to default activity when preferred missing", () => {
    // …
  });

  it("returns alternatives sorted by shortest time", () => {
    // …
  });

  it("handles average user profile when unspecified", () => {
    // …
  });
});

// /tests/domain/nutrition/Dish.spec.ts
describe("Dish", () => {
  it("creates a valid dish with per-serving calories", () => {
    // …
  });
});

// /tests/domain/physiology/UserHealthInfo.spec.ts
describe("UserHealthInfo", () => {
  it("rejects invalid weight/height ranges", () => {
    // …
  });
  it("provides a population-average profile", () => {
    // …
  });
});

// /tests/application/CalculateEffortUseCase.spec.ts
describe("CalculateEffortUseCase", () => {
  it("wires repository + calculator to produce breakdown by name", async () => {
    // stub DishRepository, assert calculator invoked
  });
});


⸻

🧩 Notes de domaine (formules, sans implémenter)
	•	MVP : minutes ≈ calories / (MET * 3.5 * weightKg / 200)
(équation standard kcal·min⁻¹; tu la caches dans EffortPolicy pour pouvoir la faire évoluer).
	•	Activités par défaut (catalogue) : "walking", "running_moderate", "cycling_moderate", "salsa", "crossfit".
	•	Profil moyen : UserHealthInfo.average() (poids/taille/sex neutre) pour usage sans onboarding.
	•	Ports/Adapters : DishRepository abstrait → OpenFoodFacts arrive plus tard côté infrastructure.

