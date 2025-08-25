import { DishId } from "./DishId";
import { NutritionalInfo } from "./NutritionalInfo";

export interface DishConfig{dishId: DishId, name: string, nutrition: NutritionalInfo}
export class Dish {
    private constructor(private values: DishConfig ){}
    static create({
        dishId, name, nutrition
    }: DishConfig): Dish {
        return new Dish({dishId, name, nutrition})
    }

    public toObject() {
        return this.values
    }
}
