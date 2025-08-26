import { FoodData } from "../../types/FoodData"

/**
 * Dessert Additions
 * Popular desserts and sweet treats people commonly track
 */
export const DESSERT_ADDITIONS: FoodData[] = [
  {
    id: "oreo-cookies",
    names: { en: "Oreo Cookies", fr: "Biscuits Oreo" },
    calories: 140,
    portionSize: { amount: 3, unit: "piece" },
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
    description: {
      en: "Classic Oreo chocolate sandwich cookies",
      fr: "Biscuits sandwich au chocolat Oreo classiques"
    },
    tags: ["cookies", "oreo", "chocolate", "cream", "classic"]
  },
  {
    id: "ben-jerry-ice-cream",
    names: { en: "Ben & Jerry's Ice Cream", fr: "Crème Glacée Ben & Jerry's" },
    calories: 250,
    portionSize: { amount: 100, unit: "100g" },
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=400&fit=crop",
    description: {
      en: "Premium Ben & Jerry's ice cream",
      fr: "Crème glacée premium Ben & Jerry's"
    },
    tags: ["ice-cream", "ben-jerry", "premium", "cold", "creamy"]
  },
  {
    id: "chocolate-brownie",
    names: { en: "Chocolate Brownie", fr: "Brownie au Chocolat" },
    calories: 365,
    portionSize: { amount: 1, unit: "piece" },
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop",
    description: {
      en: "Rich and fudgy chocolate brownie",
      fr: "Brownie au chocolat riche et fondant"
    },
    tags: ["brownie", "chocolate", "fudgy", "rich", "baked"]
  },
  {
    id: "apple-pie",
    names: { en: "Apple Pie", fr: "Tarte aux Pommes" },
    calories: 320,
    portionSize: { amount: 1, unit: "slice" },
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1535920527002-b35e96722406?w=400&h=400&fit=crop",
    description: {
      en: "Classic American apple pie slice",
      fr: "Part de tarte aux pommes américaine classique"
    },
    tags: ["pie", "apple", "american", "crust", "classic"]
  },
  {
    id: "cheesecake-slice",
    names: { en: "Cheesecake", fr: "Gâteau au Fromage" },
    calories: 400,
    portionSize: { amount: 1, unit: "slice" },
    category: "dessert",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop",
    description: {
      en: "Creamy New York style cheesecake",
      fr: "Gâteau au fromage crémeux style New York"
    },
    tags: ["cheesecake", "cream", "rich", "new-york", "dessert"]
  }
]