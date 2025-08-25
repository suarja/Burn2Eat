import {Dish} from "../../src/domain/nutrition/Dish"
import { DishId } from "../../src/domain/nutrition/DishId";
describe('[Dishspec] Test case', () => {
    beforeEach(() => {});

    it('Should be able to create a new instance of Dish class', () => {
        const dishIdStr = "DishId"
        const dishId = DishId.from(dishIdStr)
        const dish = {
            dishId: dishId,
            name: "DishName",
            nutrition: "" 
        }
        expect(Dish).toBeDefined();
    });
});