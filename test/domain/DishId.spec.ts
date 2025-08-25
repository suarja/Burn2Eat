import {DishId} from '../../app/domain/nutrition/DishId'
describe('[DishIdspec] Test case', () => {
    beforeEach(() => {});
    const dishIdStr = "DishId"

    it('Should be able to create an instance of DishId from a string', () => {
        expect(DishId.from(dishIdStr)).toBeInstanceOf(DishId);
    });

    it('Should be able to get the string version of a DishId instance', () => {
        const sut = DishId.from(dishIdStr)
        expect(sut.toString()).toBe(dishIdStr);
    });
});