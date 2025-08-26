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
      fr: "Nuggets de poulet panés croustillants",
    },
    tags: ["chicken", "nuggets", "crispy", "fast-food", "fried"],
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
      fr: "Poisson en pâte avec frites croustillantes",
    },
    tags: ["fish", "chips", "battered", "british", "fried"],
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
      fr: "Wrap au poulet grillé avec légumes",
    },
    tags: ["wrap", "chicken", "vegetables", "tortilla", "lunch"],
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
      fr: "Part de pizza au pepperoni classique",
    },
    tags: ["pizza", "pepperoni", "cheese", "italian", "spicy"],
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
      fr: "Taco au bœuf assaisonné avec garnitures",
    },
    tags: ["taco", "beef", "mexican", "spicy", "corn"],
  },
  {
    id: "mcdonalds-big-mac",
    names: { en: "Big Mac", fr: "Big Mac" },
    calories: 550,
    portionSize: { amount: 1, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400&h=400&fit=crop",
    description: {
      en: "McDonald's signature Big Mac burger",
      fr: "Burger Big Mac signature de McDonald's",
    },
    tags: ["burger", "mcdonalds", "big-mac", "fast-food", "iconic"],
  },
  {
    id: "subway-sandwich",
    names: { en: "Subway Sandwich", fr: "Sandwich Subway" },
    calories: 320,
    portionSize: { amount: 1, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400&h=400&fit=crop",
    description: {
      en: "6-inch turkey and ham submarine sandwich",
      fr: "Sandwich sous-marin de 6 pouces dinde et jambon",
    },
    tags: ["sandwich", "subway", "turkey", "ham", "healthy-fast-food"],
  },
  {
    id: "kfc-fried-chicken",
    names: { en: "KFC Fried Chicken", fr: "Poulet Frit KFC" },
    calories: 320,
    portionSize: { amount: 1, unit: "piece" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=400&fit=crop",
    description: {
      en: "Kentucky Fried Chicken original recipe piece",
      fr: "Pièce de poulet frit KFC recette originale",
    },
    tags: ["chicken", "kfc", "fried", "crispy", "southern"],
  },
  {
    id: "dominos-pizza",
    names: { en: "Domino's Pizza", fr: "Pizza Domino's" },
    calories: 290,
    portionSize: { amount: 1, unit: "slice" },
    category: "fast-food",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop",
    description: {
      en: "Domino's medium cheese pizza slice",
      fr: "Part de pizza au fromage moyenne Domino's",
    },
    tags: ["pizza", "dominos", "cheese", "delivery", "italian"],
  },
]
