import { FoodData } from "../../types/FoodData"

/**
 * Main Course Food Items
 * Add hearty meals and dinner options here
 */
export const MAIN_COURSE_ADDITIONS: FoodData[] = [
  {
    id: "grilled-chicken-breast",
    names: { en: "Grilled Chicken Breast", fr: "Blanc de Poulet Grillé" },
    calories: 185,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop",
    unsplashId: "1532550907401-a500c9a57435",
    description: {
      en: "Lean grilled chicken breast, high in protein",
      fr: "Blanc de poulet grillé maigre, riche en protéines",
    },
    tags: ["chicken", "protein", "healthy", "grilled", "lean"],
  },
  {
    id: "beef-steak",
    names: { en: "Beef Steak", fr: "Steak de Bœuf" },
    calories: 250,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=400&fit=crop",
    description: {
      en: "Grilled beef steak, rich in protein and iron",
      fr: "Steak de bœuf grillé, riche en protéines et fer",
    },
    tags: ["beef", "steak", "protein", "grilled", "iron"],
  },
  {
    id: "salmon-fillet",
    names: { en: "Salmon Fillet", fr: "Filet de Saumon" },
    calories: 200,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
    description: {
      en: "Fresh salmon fillet, rich in omega-3",
      fr: "Filet de saumon frais, riche en oméga-3",
    },
    tags: ["salmon", "fish", "omega-3", "healthy", "protein"],
  },
  {
    id: "spaghetti-carbonara",
    names: { en: "Spaghetti Carbonara", fr: "Spaghetti à la Carbonara" },
    calories: 450,
    portionSize: { amount: 1, unit: "serving" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=400&fit=crop",
    description: {
      en: "Classic Italian pasta with eggs and cheese",
      fr: "Pâtes italiennes classiques aux œufs et fromage",
    },
    tags: ["pasta", "italian", "carbonara", "cheese", "comfort-food"],
  },
  {
    id: "chicken-caesar-salad",
    names: { en: "Chicken Caesar Salad", fr: "Salade César au Poulet" },
    calories: 320,
    portionSize: { amount: 1, unit: "serving" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop",
    description: {
      en: "Fresh caesar salad with grilled chicken",
      fr: "Salade césar fraîche au poulet grillé",
    },
    tags: ["salad", "chicken", "caesar", "healthy", "lettuce"],
  },
  {
    id: "white-rice",
    names: { en: "White Rice", fr: "Riz Blanc" },
    calories: 130,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    description: {
      en: "Cooked white jasmine rice",
      fr: "Riz jasmin blanc cuit",
    },
    tags: ["rice", "white", "staple", "carbs", "asian"],
  },
  {
    id: "spaghetti-marinara",
    names: { en: "Spaghetti Marinara", fr: "Spaghetti à la Marinara" },
    calories: 220,
    portionSize: { amount: 1, unit: "cup" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=400&fit=crop",
    description: {
      en: "Classic spaghetti with marinara sauce",
      fr: "Spaghetti classique avec sauce marinara",
    },
    tags: ["pasta", "spaghetti", "marinara", "italian", "tomato"],
  },
  {
    id: "chicken-breast-grilled",
    names: { en: "Grilled Chicken Breast", fr: "Poitrine de Poulet Grillée" },
    calories: 165,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop",
    description: {
      en: "Lean grilled chicken breast without skin",
      fr: "Poitrine de poulet grillée maigre sans peau",
    },
    tags: ["chicken", "grilled", "lean", "protein", "healthy"],
  },
  {
    id: "brown-rice",
    names: { en: "Brown Rice", fr: "Riz Brun" },
    calories: 110,
    portionSize: { amount: 100, unit: "100g" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    description: {
      en: "Nutritious brown rice with fiber",
      fr: "Riz brun nutritif avec fibres",
    },
    tags: ["rice", "brown", "whole-grain", "fiber", "healthy"],
  },
  {
    id: "tuna-sandwich",
    names: { en: "Tuna Sandwich", fr: "Sandwich au Thon" },
    calories: 280,
    portionSize: { amount: 1, unit: "piece" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=400&fit=crop",
    description: {
      en: "Tuna salad sandwich on whole wheat bread",
      fr: "Sandwich à la salade de thon sur pain complet",
    },
    tags: ["sandwich", "tuna", "fish", "protein", "lunch"],
  },
]
