import { FoodData } from "../../types/FoodData"

/**
 * Snack Additions
 * Popular snacks and small meals people commonly track
 */
export const SNACK_ADDITIONS: FoodData[] = [
  {
    id: "granola-bar",
    names: { en: "Granola Bar", fr: "Barre de Granola" },
    calories: 140,
    portionSize: { amount: 1, unit: "piece" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1571212515416-8c4b5d1de3cc?w=400&h=400&fit=crop",
    description: {
      en: "Healthy granola bar with oats and nuts",
      fr: "Barre de granola saine avec avoine et noix",
    },
    tags: ["granola", "healthy", "oats", "nuts", "energy"],
  },
  {
    id: "cottage-cheese",
    names: { en: "Cottage Cheese", fr: "Fromage Cottage" },
    calories: 110,
    portionSize: { amount: 100, unit: "100g" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
    description: {
      en: "High-protein cottage cheese",
      fr: "Fromage cottage riche en protéines",
    },
    tags: ["cottage-cheese", "protein", "healthy", "dairy", "low-fat"],
  },
  {
    id: "trail-mix",
    names: { en: "Trail Mix", fr: "Mélange Montagnard" },
    calories: 180,
    portionSize: { amount: 30, unit: "100g" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=400&fit=crop",
    description: {
      en: "Mixed nuts, dried fruits and seeds",
      fr: "Noix mélangées, fruits secs et graines",
    },
    tags: ["nuts", "dried-fruit", "healthy", "energy", "hiking"],
  },
  {
    id: "protein-bar",
    names: { en: "Protein Bar", fr: "Barre Protéinée" },
    calories: 200,
    portionSize: { amount: 1, unit: "piece" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1571212515416-8c4b5d1de3cc?w=400&h=400&fit=crop",
    description: {
      en: "High-protein fitness bar",
      fr: "Barre de fitness riche en protéines",
    },
    tags: ["protein", "bar", "fitness", "workout", "muscle"],
  },
  {
    id: "rice-cakes",
    names: { en: "Rice Cakes", fr: "Galettes de Riz" },
    calories: 70,
    portionSize: { amount: 2, unit: "piece" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    description: {
      en: "Light and crispy rice cakes",
      fr: "Galettes de riz légères et croustillantes",
    },
    tags: ["rice", "light", "crispy", "healthy", "low-calorie"],
  },
  {
    id: "string-cheese",
    names: { en: "String Cheese", fr: "Fromage en Bâtonnet" },
    calories: 80,
    portionSize: { amount: 1, unit: "piece" },
    category: "snack",
    imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop",
    description: {
      en: "Mozzarella string cheese stick",
      fr: "Bâtonnet de fromage mozzarella",
    },
    tags: ["cheese", "mozzarella", "protein", "dairy", "portable"],
  },
]
