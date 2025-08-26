import { FoodData } from "../../types/FoodData"

/**
 * Breakfast Food Items
 * Add morning meal options here
 */
export const BREAKFAST_ADDITIONS: FoodData[] = [
  {
    id: "scrambled-eggs",
    names: { en: "Scrambled Eggs", fr: "Œufs Brouillés" },
    calories: 155,
    portionSize: { amount: 2, unit: "piece" },
    category: "main-course", // Using existing category
    imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop",
    description: {
      en: "Fluffy scrambled eggs, high in protein",
      fr: "Œufs brouillés moelleux, riches en protéines",
    },
    tags: ["eggs", "breakfast", "protein", "scrambled", "morning"],
  },
  {
    id: "pancakes-stack",
    names: { en: "Pancake Stack", fr: "Pile de Crêpes" },
    calories: 520,
    portionSize: { amount: 3, unit: "piece" },
    category: "dessert", // Using existing category
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop",
    description: {
      en: "Stack of fluffy pancakes with syrup",
      fr: "Pile de crêpes moelleuses au sirop",
    },
    tags: ["pancakes", "breakfast", "sweet", "syrup", "fluffy"],
  },
  {
    id: "oatmeal-bowl",
    names: { en: "Oatmeal Bowl", fr: "Bol d'Avoine" },
    calories: 150,
    portionSize: { amount: 1, unit: "cup" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&h=400&fit=crop",
    description: {
      en: "Healthy oatmeal with toppings",
      fr: "Avoine saine avec garnitures",
    },
    tags: ["oatmeal", "healthy", "breakfast", "fiber", "wholesome"],
  },
  {
    id: "avocado-toast",
    names: { en: "Avocado Toast", fr: "Toast à l'Avocat" },
    calories: 280,
    portionSize: { amount: 2, unit: "slice" },
    category: "main-course",
    imageUrl: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=400&fit=crop",
    description: {
      en: "Whole grain toast topped with fresh avocado",
      fr: "Toast de grains entiers garni d'avocat frais",
    },
    tags: ["avocado", "toast", "healthy", "breakfast", "whole-grain"],
  },
  {
    id: "greek-yogurt",
    names: { en: "Greek Yogurt", fr: "Yaourt Grec" },
    calories: 130,
    portionSize: { amount: 1, unit: "cup" },
    category: "snack", // Using existing category
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    description: {
      en: "Creamy Greek yogurt with berries",
      fr: "Yaourt grec crémeux aux baies",
    },
    tags: ["yogurt", "greek", "protein", "healthy", "berries"],
  },
]
