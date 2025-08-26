import { FoodData } from "../../types/FoodData"

/**
 * Fruit Additions
 * Popular fruits and berries people commonly track
 */
export const FRUIT_ADDITIONS: FoodData[] = [
  {
    id: "blueberries",
    names: { en: "Blueberries", fr: "Myrtilles" },
    calories: 85,
    portionSize: { amount: 150, unit: "cup" },
    category: "fruit",
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop",
    description: {
      en: "Fresh blueberries rich in antioxidants",
      fr: "Myrtilles fraîches riches en antioxydants",
    },
    tags: ["berries", "antioxidants", "healthy", "vitamin-c", "fresh"],
  },
  {
    id: "grapes-green",
    names: { en: "Green Grapes", fr: "Raisins Verts" },
    calories: 90,
    portionSize: { amount: 150, unit: "cup" },
    category: "fruit",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop",
    description: {
      en: "Sweet green grapes, perfect snack",
      fr: "Raisins verts sucrés, collation parfaite",
    },
    tags: ["grapes", "green", "sweet", "snack", "fresh"],
  },
  {
    id: "mango",
    names: { en: "Mango", fr: "Mangue" },
    calories: 135,
    portionSize: { amount: 1, unit: "piece" },
    category: "fruit",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop",
    description: {
      en: "Tropical mango fruit rich in vitamins",
      fr: "Fruit de mangue tropical riche en vitamines",
    },
    tags: ["mango", "tropical", "vitamin-a", "sweet", "juicy"],
  },
  {
    id: "pineapple",
    names: { en: "Pineapple", fr: "Ananas" },
    calories: 85,
    portionSize: { amount: 150, unit: "cup" },
    category: "fruit",
    imageUrl: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop",
    description: {
      en: "Sweet and tangy pineapple chunks",
      fr: "Morceaux d'ananas sucrés et acidulés",
    },
    tags: ["pineapple", "tropical", "vitamin-c", "tangy", "fresh"],
  },
  {
    id: "watermelon",
    names: { en: "Watermelon", fr: "Pastèque" },
    calories: 45,
    portionSize: { amount: 150, unit: "cup" },
    category: "fruit",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    description: {
      en: "Refreshing watermelon, perfect for summer",
      fr: "Pastèque rafraîchissante, parfaite pour l'été",
    },
    tags: ["watermelon", "summer", "refreshing", "low-calorie", "hydrating"],
  },
]
