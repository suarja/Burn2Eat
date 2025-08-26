import { FoodData } from "../../types/FoodData"

/**
 * Fast Food Additions
 * Expand the fast food category with more popular items
 */
export const FAST_FOOD_ADDITIONS: FoodData[] = [
  {
    id: "chicken-nuggets",
    names: { en: "Chicken Nuggets", fr: "Nuggets de Poulet" },
    calories: 280,
    portionSize: { amount: 6, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&h=400&fit=crop",
    description: {
      en: "Crispy breaded chicken nuggets",
      fr: "Nuggets de poulet panés croustillants"
    },
    tags: ["chicken", "nuggets", "crispy", "fast-food", "fried"]
  },
  {
    id: "fish-and-chips",
    names: { en: "Fish and Chips", fr: "Poisson-Frites" },
    calories: 650,
    portionSize: { amount: 1, unit: "serving" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=400&fit=crop",
    description: {
      en: "Battered fish with crispy chips",
      fr: "Poisson en pâte avec frites croustillantes"
    },
    tags: ["fish", "chips", "battered", "british", "fried"]
  },
  {
    id: "chicken-wrap",
    names: { en: "Chicken Wrap", fr: "Wrap au Poulet" },
    calories: 380,
    portionSize: { amount: 1, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c13a6d0?w=400&h=400&fit=crop",
    description: {
      en: "Grilled chicken wrap with vegetables",
      fr: "Wrap au poulet grillé avec légumes"
    },
    tags: ["wrap", "chicken", "vegetables", "tortilla", "lunch"]
  },
  {
    id: "pepperoni-pizza",
    names: { en: "Pepperoni Pizza", fr: "Pizza au Pepperoni" },
    calories: 380,
    portionSize: { amount: 1, unit: "slice" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
    description: {
      en: "Classic pepperoni pizza slice",
      fr: "Part de pizza au pepperoni classique"
    },
    tags: ["pizza", "pepperoni", "cheese", "italian", "spicy"]
  },
  {
    id: "taco-beef",
    names: { en: "Beef Taco", fr: "Taco au Bœuf" },
    calories: 220,
    portionSize: { amount: 1, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=400&fit=crop",
    description: {
      en: "Seasoned beef taco with toppings",
      fr: "Taco au bœuf assaisonné avec garnitures"
    },
    tags: ["taco", "beef", "mexican", "spicy", "corn"]
  }
]