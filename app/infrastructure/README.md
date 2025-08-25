# Food Dataset Infrastructure

This directory contains the static food dataset for the Burn2Eat MVP, implemented following Domain-Driven Design principles.

## Overview

The food dataset provides type-safe access to nutritional information for popular foods, complete with multilingual support and royalty-free images from Unsplash.

## Structure

```
infrastructure/
├── data/
│   ├── foods-dataset.ts      # Main dataset with 21 food items
│   └── index.ts              # Centralized exports
├── types/
│   └── FoodData.ts           # TypeScript interfaces
├── utils/
│   └── validateFoodDataset.ts # Validation utilities
└── README.md                 # This file
```

## Usage

### Basic Import
```typescript
import { FOODS_DATASET, getFoodById } from '@/infrastructure/data';

// Get a specific food
const burger = getFoodById('burger-classic');
console.log(burger?.names.en); // "Classic Burger"
```

### Search Operations
```typescript
import { searchFoodsByName, getFoodsByCategory } from '@/infrastructure/data';

// Search by name (supports English, French, and tags)
const pizzas = searchFoodsByName('pizza');

// Filter by category
const desserts = getFoodsByCategory('dessert');
```

### Dataset Statistics
```typescript
import { DATASET_STATS } from '@/infrastructure/data';

console.log(`Total foods: ${DATASET_STATS.totalFoods}`);
console.log(`Categories: ${DATASET_STATS.categories.join(', ')}`);
```

## Dataset Contents

### Current Stats
- **Total Items:** 21 foods
- **Categories:** fast-food, dessert, beverage, snack, fruit
- **Average Calories:** 240 kcal per portion
- **Languages:** English & French names
- **Images:** Unsplash royalty-free photos

### Category Breakdown
- **Fast Food:** 5 items (burgers, pizza, fries, hot dog)
- **Desserts:** 5 items (cake, donuts, ice cream, cookies, cupcakes)
- **Beverages:** 3 items (soda, juice, coffee)
- **Snacks:** 3 items (chips, chocolate, nuts)
- **Fruits:** 5 items (apple, banana, orange, strawberries, avocado)

## Data Structure

Each food item follows the `FoodData` interface:

```typescript
interface FoodData {
  id: string;                    // Unique identifier
  names: {                       // Multilingual names
    en: string;
    fr: string;
  };
  calories: number;              // Per portion
  portionSize: {                 // Standard portion
    amount: number;
    unit: PortionUnit;
  };
  category: FoodCategory;        // Food category
  imageUrl: string;              // Unsplash image URL
  unsplashId?: string;          // Optional Unsplash ID
  description?: {               // Optional descriptions
    en?: string;
    fr?: string;
  };
  tags?: string[];              // Search tags
}
```

## Image Usage

All images are sourced from Unsplash under the [Unsplash License](https://unsplash.com/license):
- ✅ Free to use for any purpose
- ✅ No attribution required
- ✅ Commercial use allowed
- 📐 Standardized to 400x400px with crop fit

Example URL format:
```
https://images.unsplash.com/photo-[id]?w=400&h=400&fit=crop
```

## Validation

### Automated Validation
Run the validation script to check dataset integrity:
```bash
# Basic validation
npx ts-node scripts/validate-dataset.ts

# Include image URL validation (requires internet)
npx ts-node scripts/validate-dataset.ts --validate-images
```

### Test Coverage
```bash
yarn test test/infrastructure/foods-dataset.spec.ts
```

Tests cover:
- Data structure validation
- Search functionality
- Multilingual support
- Image URL formats
- Category distribution

## Extending the Dataset

### Adding New Foods

1. Add entries to `FOODS_DATASET` in `foods-dataset.ts`
2. Follow the `FoodData` interface structure
3. Use Unsplash for images with proper URL format
4. Include English and French names
5. Add relevant tags for search
6. Run validation: `npx ts-node scripts/validate-dataset.ts`
7. Run tests: `yarn test test/infrastructure/foods-dataset.spec.ts`

### Guidelines
- **Calories:** Realistic values (10-1000 kcal per portion)
- **Portions:** Use standard serving sizes
- **Categories:** Stick to existing categories when possible
- **Images:** Maintain visual consistency (clean, well-lit food photos)
- **Names:** Ensure French translations are different from English

## Integration with Domain

This infrastructure layer serves the Domain layer through adapters:
- Future: `StaticDishRepository` will implement `DishRepository` port
- Converts `FoodData` to `Dish` domain entities
- Provides search and filtering capabilities for the application layer

## Future Enhancements

### Planned Features
- OpenFoodFacts API integration
- Nutritional macros (protein, carbs, fat)
- Allergen information
- Additional languages (Spanish, German)
- Portion size variations
- Food images optimization

### Dataset Expansion
- Target: 100+ food items
- More diverse cuisines
- Regional food preferences
- Seasonal foods
- Restaurant-specific items

## Development Tools

### Available Scripts
- `scripts/validate-dataset.ts` - Dataset validation and reporting
- `test/infrastructure/foods-dataset.spec.ts` - Comprehensive test suite

### Utilities
- `validateFoodDataset()` - Validates entire dataset
- `validateImageUrls()` - Checks image accessibility
- `generateDatasetReport()` - Creates validation report
- Search and filter functions

---

*This dataset powers the Burn2Eat MVP nutrition domain. All data is curated for accuracy and includes proper licensing for images.*