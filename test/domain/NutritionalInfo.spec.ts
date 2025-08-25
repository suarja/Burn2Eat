
import {NutritionalInfo} from '../../src/domain/nutrition/NutritionalInfo'
import {searchFoodsByName} from '../../src/infrastructure/data'
import type {Kilocalories} from '../../src/domain/common/UnitTypes'

describe('[NutritionalInfospec] Test case', () => {
    const burgers = searchFoodsByName("burger")
    const foodFact = burgers[0]
    beforeEach(() => {
    expect(foodFact.id).toBe('burger-classic')
    });
    it('Should be able to create a new instance of NutritionalInfo', () => {

        expect(NutritionalInfo.from(foodFact)).toBeInstanceOf(NutritionalInfo);
    });

    it('Should return a Kilocalories when invoking `perServing` method', () => {
        const sut = NutritionalInfo.from(foodFact)
        const sutReturnType = sut.perServing()
        // Kilocalories is a branded type of number, so at runtime it's just a number.
        // We can only check that the value is a number.
        expect(typeof sutReturnType).toBe('number');
    });

    it('Should return the correct amount of Kilocalories', () => {
        const sut = NutritionalInfo.from(foodFact)
        const sutReturnType = sut.perServing()
        expect(sutReturnType).toBe(foodFact.calories);
    });
});