import { DishId } from "./DishId";
import { NutritionalInfo } from "./NutritionalInfo";
import { Kilocalories } from "../common/UnitTypes";

export interface DishConfig {
    dishId: DishId;
    name: string;
    nutrition: NutritionalInfo;
}

/**
 * Pure domain entity representing a food dish
 * Contains no infrastructure dependencies
 */
export class Dish {
    private constructor(
        private readonly id: DishId,
        private readonly name: string,
        private readonly nutrition: NutritionalInfo
    ) {}

    static create({ dishId, name, nutrition }: DishConfig): Dish {
        // Domain validation could go here
        if (!name || name.trim() === '') {
            throw new Error('Dish name cannot be empty');
        }
        
        return new Dish(dishId, name.trim(), nutrition);
    }

    /**
     * Get dish ID
     */
    public getId(): DishId {
        return this.id;
    }

    /**
     * Get dish name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Get nutritional information
     */
    public getNutrition(): NutritionalInfo {
        return this.nutrition;
    }

    /**
     * Get calories for this dish
     */
    public getCalories(): Kilocalories {
        return this.nutrition.getCalories();
    }

    /**
     * Check if dish is high in calories (>400 kcal)
     * Domain business rule example
     */
    public isHighCalorie(): boolean {
        return this.nutrition.getCalories() > 400;
    }

    /**
     * Legacy method for backward compatibility
     * @deprecated Use getId(), getName(), getNutrition() instead
     */
    public toObject(): DishConfig {
        return {
            dishId: this.id,
            name: this.name,
            nutrition: this.nutrition
        };
    }

    /**
     * Compare dishes by ID
     */
    public equals(other: Dish): boolean {
        return this.id.toString() === other.id.toString();
    }

    /**
     * String representation for debugging
     */
    public toString(): string {
        return `Dish(${this.id.toString()}: ${this.name}, ${this.nutrition.getCalories()} kcal)`;
    }
}
