import { DishRepository } from "@/domain/nutrition/DishRepository"

export class GetFoodCatalogUseCase {
  constructor(private readonly dishRepository: DishRepository) {}

  async execute() {
    return this.dishRepository.getAll()
  }
}
