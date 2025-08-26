import { FoodData } from "../../types/FoodData"

/**
 * Beverage Additions
 * Popular drinks and beverages people commonly track
 */
export const BEVERAGE_ADDITIONS: FoodData[] = [
  {
    id: "starbucks-coffee",
    names: { en: "Starbucks Coffee", fr: "Café Starbucks" },
    calories: 5,
    portionSize: { amount: 1, unit: "cup" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop",
    description: {
      en: "Black coffee from Starbucks",
      fr: "Café noir de Starbucks",
    },
    tags: ["coffee", "starbucks", "caffeine", "black", "hot"],
  },
  {
    id: "green-tea",
    names: { en: "Green Tea", fr: "Thé Vert" },
    calories: 2,
    portionSize: { amount: 1, unit: "cup" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1556881286-79542709c8bb?w=400&h=400&fit=crop",
    description: {
      en: "Healthy green tea with antioxidants",
      fr: "Thé vert sain avec antioxydants",
    },
    tags: ["tea", "green", "healthy", "antioxidants", "hot"],
  },
  {
    id: "red-bull-energy",
    names: { en: "Red Bull Energy Drink", fr: "Boisson Énergisante Red Bull" },
    calories: 110,
    portionSize: { amount: 250, unit: "can" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop",
    description: {
      en: "Popular energy drink with caffeine and taurine",
      fr: "Boisson énergisante populaire avec caféine et taurine",
    },
    tags: ["energy-drink", "red-bull", "caffeine", "taurine", "sports"],
  },
  {
    id: "apple-juice",
    names: { en: "Apple Juice", fr: "Jus de Pomme" },
    calories: 115,
    portionSize: { amount: 250, unit: "cup" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop",
    description: {
      en: "Natural apple juice rich in vitamin C",
      fr: "Jus de pomme naturel riche en vitamine C",
    },
    tags: ["juice", "apple", "vitamin-c", "natural", "sweet"],
  },
  {
    id: "protein-shake",
    names: { en: "Protein Shake", fr: "Shake Protéiné" },
    calories: 150,
    portionSize: { amount: 250, unit: "cup" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    description: {
      en: "Whey protein shake for muscle building",
      fr: "Shake de protéine de lactosérum pour la construction musculaire",
    },
    tags: ["protein", "shake", "workout", "muscle", "fitness"],
  },
  {
    id: "pepsi-cola",
    names: { en: "Pepsi Cola", fr: "Pepsi Cola" },
    calories: 150,
    portionSize: { amount: 330, unit: "can" },
    category: "beverage",
    imageUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop",
    description: {
      en: "Classic Pepsi cola soft drink",
      fr: "Boisson gazeuse Pepsi cola classique",
    },
    tags: ["soda", "pepsi", "cola", "carbonated", "sweet"],
  },
]
