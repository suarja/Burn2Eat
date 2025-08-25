export interface FoodItem {
  id: string
  name: string
  emoji: string
  calories: number
  category: string
}

// Mock food data - later will come from StaticDishRepository
const FOOD_DATABASE: FoodItem[] = [
  // Popular foods
  { id: 'pizza', name: 'Pizza Reine', emoji: '🍕', calories: 450, category: 'popular' },
  { id: 'burger', name: 'Burger Classique', emoji: '🍔', calories: 540, category: 'popular' },
  { id: 'frites', name: 'Frites', emoji: '🍟', calories: 365, category: 'popular' },
  { id: 'soda', name: 'Soda', emoji: '🥤', calories: 150, category: 'popular' },
  { id: 'glace', name: 'Glace Vanille', emoji: '🍦', calories: 280, category: 'popular' },
  { id: 'salade', name: 'Salade Verte', emoji: '🥗', calories: 120, category: 'popular' },
  
  // Additional foods for search
  { id: 'apple', name: 'Pomme Rouge', emoji: '🍎', calories: 95, category: 'fruit' },
  { id: 'banana', name: 'Banane', emoji: '🍌', calories: 105, category: 'fruit' },
  { id: 'orange', name: 'Orange', emoji: '🍊', calories: 85, category: 'fruit' },
  { id: 'bread', name: 'Pain de Mie', emoji: '🍞', calories: 80, category: 'carbs' },
  { id: 'pasta', name: 'Pâtes Bolognaise', emoji: '🍝', calories: 380, category: 'carbs' },
  { id: 'rice', name: 'Riz Blanc', emoji: '🍚', calories: 205, category: 'carbs' },
  { id: 'chicken', name: 'Poulet Grillé', emoji: '🍗', calories: 250, category: 'protein' },
  { id: 'fish', name: 'Saumon Grillé', emoji: '🐟', calories: 280, category: 'protein' },
  { id: 'egg', name: 'Œuf au Plat', emoji: '🍳', calories: 90, category: 'protein' },
  { id: 'chocolate', name: 'Chocolat Noir', emoji: '🍫', calories: 150, category: 'dessert' },
  { id: 'cake', name: 'Gâteau au Chocolat', emoji: '🍰', calories: 320, category: 'dessert' },
  { id: 'croissant', name: 'Croissant', emoji: '🥐', calories: 180, category: 'bakery' },
]

export class FoodDataService {
  /**
   * Get popular foods for home screen
   */
  static getPopularFoods(): FoodItem[] {
    return FOOD_DATABASE.filter(food => food.category === 'popular')
  }

  /**
   * Search foods by name
   */
  static searchFoods(query: string): FoodItem[] {
    if (!query.trim()) {
      return []
    }

    const normalizedQuery = query.toLowerCase().trim()
    
    return FOOD_DATABASE.filter(food => 
      food.name.toLowerCase().includes(normalizedQuery) ||
      food.category.toLowerCase().includes(normalizedQuery)
    )
  }

  /**
   * Get all foods
   */
  static getAllFoods(): FoodItem[] {
    return FOOD_DATABASE
  }

  /**
   * Get food by ID
   */
  static getFoodById(id: string): FoodItem | null {
    return FOOD_DATABASE.find(food => food.id === id) || null
  }

  /**
   * Get foods by category
   */
  static getFoodsByCategory(category: string): FoodItem[] {
    return FOOD_DATABASE.filter(food => food.category === category)
  }

  /**
   * Get food categories
   */
  static getCategories(): string[] {
    const categories = new Set(FOOD_DATABASE.map(food => food.category))
    return Array.from(categories)
  }
}