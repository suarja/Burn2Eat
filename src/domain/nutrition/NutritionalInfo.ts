import { FoodData } from "src/infrastructure/data";
import { Kilocalories } from "../common/UnitTypes";

export class NutritionalInfo {
    private constructor(private value : FoodData) {

    }
    static from(value: FoodData): NutritionalInfo {
        return new NutritionalInfo(value)
    }

    public perServing(): Kilocalories {
        // To return a branded type, we need to cast the number to Kilocalories
        return this.value.calories as Kilocalories;
    }
}