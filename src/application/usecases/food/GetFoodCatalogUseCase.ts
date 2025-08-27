import { CategoryInfo, DishRepository } from "@/domain/nutrition/DishRepository"
import { Dish } from "@/domain/nutrition/Dish"

export interface GetFoodCatalogRequest {
  category?: string
  limit?: number
  page?: number
}

export interface GetFoodCatalogByCategory {
  category: string
  limit?: number
  page?: number
}

export class GetFoodCatalogUseCase {
  constructor(private readonly dishRepository: DishRepository) {}

  async execute(): Promise<Dish[]>
  async execute(request: GetFoodCatalogRequest): Promise<Dish[]>
  async execute(request?: GetFoodCatalogRequest): Promise<Dish[]> {
    if (!request) {
      return this.dishRepository.getAll()
    }

    if (request.category) {
      return this.dishRepository.findByCategory?.(
        request.category,
        request.limit,
        request.page
      ) || []
    }

    return this.dishRepository.getAll()
  }

  async getCategories(): Promise<CategoryInfo[]> {
    return this.dishRepository.getCategories()
  }

  async getByCategoryPaginated(request: GetFoodCatalogByCategory): Promise<Dish[]> {
    return this.dishRepository.findByCategory?.(
      request.category,
      request.limit,
      request.page
    ) || []
  }
}
