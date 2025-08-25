import {Dish} from "../../src/domain/nutrition/Dish"
import { DishId } from "../../src/domain/nutrition/DishId";

import {NutritionalInfo} from '../../src/domain/nutrition/NutritionalInfo'
import {searchFoodsByName} from '../../src/infrastructure/data'
import type {Kilocalories} from '../../src/domain/common/UnitTypes'
describe('[Dishspec] Test case', () => {
    const burgers = searchFoodsByName("burger")
    const foodFact = burgers[0]
    const nutritionalInfo = NutritionalInfo.from(foodFact)
    const dishIdStr = "DishId"
        const dishId = DishId.from(dishIdStr)
       
        const dish = {
            dishId: dishId,
            name: "DishName",
            nutrition: nutritionalInfo 
        }

    beforeEach(() => {
    expect(foodFact.id).toBe('burger-classic')
    });

    it('Should be able to create a new instance of Dish class', () => {
        expect(Dish.create(dish)).toBeInstanceOf(Dish);
    });

    it('Should contain the correct dish values', () => {
        const sut =Dish.create(dish)
        expect(sut.toObject()).toEqual(dish);
    });
});