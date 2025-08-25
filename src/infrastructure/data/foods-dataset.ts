import { FoodData } from '../types/FoodData';

/**
 * Static food dataset with Unsplash images
 * All images are free to use under Unsplash License
 */
export const FOODS_DATASET: FoodData[] = [
  // FAST FOOD
  {
    id: 'burger-classic',
    names: { en: 'Classic Burger', fr: 'Burger Classique' },
    calories: 540,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fast-food',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    unsplashId: 'sc5sTPMrVfk',
    description: { 
      en: 'Classic beef burger with lettuce and tomato', 
      fr: 'Burger de bœuf classique avec salade et tomate' 
    },
    tags: ['burger', 'beef', 'fast-food', 'american']
  },
  {
    id: 'cheeseburger-double',
    names: { en: 'Double Cheeseburger', fr: 'Double Cheeseburger avec Fromage' },
    calories: 740,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fast-food',
    imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=400&fit=crop',
    unsplashId: 'jh5XyK4Rr3Y',
    description: { 
      en: 'Double patty cheeseburger with cheese', 
      fr: 'Double cheeseburger avec fromage' 
    },
    tags: ['burger', 'cheese', 'double', 'fast-food']
  },
  {
    id: 'pizza-margherita',
    names: { en: 'Margherita Pizza', fr: 'Pizza Margherita' },
    calories: 320,
    portionSize: { amount: 1, unit: 'slice' },
    category: 'fast-food',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
    description: { 
      en: 'Classic margherita pizza slice', 
      fr: 'Part de pizza margherita classique' 
    },
    tags: ['pizza', 'italian', 'margherita', 'cheese']
  },
  {
    id: 'french-fries',
    names: { en: 'French Fries', fr: 'Frites' },
    calories: 365,
    portionSize: { amount: 100, unit: '100g' },
    category: 'fast-food',
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=400&fit=crop',
    description: { 
      en: 'Crispy golden french fries', 
      fr: 'Frites dorées et croustillantes' 
    },
    tags: ['fries', 'potato', 'crispy', 'side-dish']
  },
  {
    id: 'hot-dog',
    names: { en: 'Hot Dog', fr: 'Hot-Dog' },
    calories: 290,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fast-food',
    imageUrl: 'https://images.unsplash.com/photo-1612392062798-2dbaa18fbfcb?w=400&h=400&fit=crop',
    description: { 
      en: 'Classic hot dog with mustard', 
      fr: 'Hot dog classique avec moutarde' 
    },
    tags: ['hot-dog', 'sausage', 'american', 'fast-food']
  },

  // DESSERTS
  {
    id: 'chocolate-cake',
    names: { en: 'Chocolate Cake', fr: 'Gâteau au Chocolat' },
    calories: 410,
    portionSize: { amount: 1, unit: 'slice' },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    unsplashId: '2UeBOL7UD34',
    description: { 
      en: 'Rich chocolate cake slice', 
      fr: 'Part de gâteau au chocolat riche' 
    },
    tags: ['cake', 'chocolate', 'dessert', 'sweet']
  },
  {
    id: 'glazed-donut',
    names: { en: 'Glazed Donut', fr: 'Donut Glacé' },
    calories: 250,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop',
    unsplashId: 'q54Oxq44MZs',
    description: { 
      en: 'Classic glazed donut', 
      fr: 'Donut glacé classique' 
    },
    tags: ['donut', 'glazed', 'sweet', 'breakfast']
  },
  {
    id: 'vanilla-ice-cream',
    names: { en: 'Vanilla Ice Cream', fr: 'Glace à la Vanille' },
    calories: 210,
    portionSize: { amount: 1, unit: 'serving' },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=400&fit=crop',
    unsplashId: 'idTwDKt2j2o',
    description: { 
      en: 'Creamy vanilla ice cream', 
      fr: 'Glace à la vanille crémeuse' 
    },
    tags: ['ice-cream', 'vanilla', 'cold', 'dessert']
  },
  {
    id: 'chocolate-cookies',
    names: { en: 'Chocolate Cookies', fr: 'Cookies au Chocolat' },
    calories: 160,
    portionSize: { amount: 2, unit: 'piece' },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    unsplashId: 'OfdDiqx8Cz8',
    description: { 
      en: 'Homemade chocolate cookies', 
      fr: 'Cookies au chocolat maison' 
    },
    tags: ['cookies', 'chocolate', 'baked', 'sweet']
  },
  {
    id: 'strawberry-cupcake',
    names: { en: 'Strawberry Cupcake', fr: 'Cupcake aux Fraises' },
    calories: 300,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'dessert',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=400&fit=crop',
    unsplashId: 'S2jw81lfrG0',
    description: { 
      en: 'Strawberry cupcake with frosting', 
      fr: 'Cupcake aux fraises avec glaçage' 
    },
    tags: ['cupcake', 'strawberry', 'frosting', 'dessert']
  },

  // BEVERAGES
  {
    id: 'coca-cola',
    names: { en: 'Coca Cola', fr: 'Coca-Cola' },
    calories: 140,
    portionSize: { amount: 330, unit: 'can' },
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=400&fit=crop',
    description: { 
      en: 'Classic Coca Cola soda', 
      fr: 'Coca Cola classique' 
    },
    tags: ['soda', 'cola', 'carbonated', 'sweet']
  },
  {
    id: 'orange-juice',
    names: { en: 'Orange Juice', fr: 'Jus d\'Orange' },
    calories: 110,
    portionSize: { amount: 250, unit: 'cup' },
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
    description: { 
      en: 'Fresh orange juice', 
      fr: 'Jus d\'orange frais' 
    },
    tags: ['juice', 'orange', 'fresh', 'vitamin-c']
  },
  {
    id: 'coffee-latte',
    names: { en: 'Coffee Latte', fr: 'Café Latte' },
    calories: 180,
    portionSize: { amount: 1, unit: 'cup' },
    category: 'beverage',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop',
    description: { 
      en: 'Creamy coffee latte', 
      fr: 'Café latte crémeux' 
    },
    tags: ['coffee', 'latte', 'milk', 'hot']
  },

  // SNACKS
  {
    id: 'potato-chips',
    names: { en: 'Potato Chips', fr: 'Chips de Pomme de Terre' },
    calories: 150,
    portionSize: { amount: 28, unit: '100g' },
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1586478050851-d59d3b68f6b9?w=400&h=400&fit=crop',
    description: { 
      en: 'Crispy potato chips', 
      fr: 'Chips de pomme de terre croustillantes' 
    },
    tags: ['chips', 'potato', 'crispy', 'salty']
  },
  {
    id: 'chocolate-bar',
    names: { en: 'Chocolate Bar', fr: 'Barre de Chocolat' },
    calories: 235,
    portionSize: { amount: 43, unit: '100g' },
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop',
    description: { 
      en: 'Milk chocolate bar', 
      fr: 'Barre de chocolat au lait' 
    },
    tags: ['chocolate', 'milk', 'sweet', 'bar']
  },
  {
    id: 'mixed-nuts',
    names: { en: 'Mixed Nuts', fr: 'Mélange de Noix' },
    calories: 170,
    portionSize: { amount: 28, unit: '100g' },
    category: 'snack',
    imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=400&fit=crop',
    description: { 
      en: 'Assorted mixed nuts', 
      fr: 'Assortiment de noix mélangées' 
    },
    tags: ['nuts', 'protein', 'healthy', 'mixed']
  },

  // FRUITS
  {
    id: 'apple-red',
    names: { en: 'Red Apple', fr: 'Pomme Rouge' },
    calories: 95,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
    description: { 
      en: 'Fresh red apple', 
      fr: 'Pomme rouge fraîche' 
    },
    tags: ['apple', 'red', 'fresh', 'healthy']
  },
  {
    id: 'banana',
    names: { en: 'Banana', fr: 'Banane' },
    calories: 105,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
    description: { 
      en: 'Ripe yellow banana', 
      fr: 'Banane jaune mûre' 
    },
    tags: ['banana', 'yellow', 'potassium', 'healthy']
  },
  {
    id: 'orange',
    names: { en: 'Orange', fr: 'Orange (fruit)' },
    calories: 65,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&h=400&fit=crop',
    description: { 
      en: 'Fresh orange fruit', 
      fr: 'Orange fraîche' 
    },
    tags: ['orange', 'citrus', 'vitamin-c', 'fresh']
  },
  {
    id: 'strawberries',
    names: { en: 'Strawberries', fr: 'Fraises' },
    calories: 50,
    portionSize: { amount: 150, unit: '100g' },
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
    unsplashId: 'OrkEasJeY74',
    description: { 
      en: 'Fresh strawberries', 
      fr: 'Fraises fraîches' 
    },
    tags: ['strawberry', 'berry', 'red', 'healthy']
  },
  {
    id: 'avocado',
    names: { en: 'Avocado', fr: 'Avocat' },
    calories: 160,
    portionSize: { amount: 1, unit: 'piece' },
    category: 'fruit',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
    description: { 
      en: 'Fresh avocado', 
      fr: 'Avocat frais' 
    },
    tags: ['avocado', 'green', 'healthy-fat', 'fresh']
  }
];

/**
 * Get total number of foods in dataset
 */
export const getFoodCount = (): number => FOODS_DATASET.length;

/**
 * Get foods by category
 */
export const getFoodsByCategory = (category: string): FoodData[] => {
  return FOODS_DATASET.filter(food => food.category === category);
};

/**
 * Get food by ID
 */
export const getFoodById = (id: string): FoodData | undefined => {
  return FOODS_DATASET.find(food => food.id === id);
};

/**
 * Search foods by name (English or French)
 */
export const searchFoodsByName = (query: string): FoodData[] => {
  const lowerQuery = query.toLowerCase();
  return FOODS_DATASET.filter(food => 
    food.names.en.toLowerCase().includes(lowerQuery) ||
    food.names.fr.toLowerCase().includes(lowerQuery) ||
    food.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};