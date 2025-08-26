# Food Dataset Tracking Documentation

This document tracks all food items in the Burn2Eat app dataset, their organization, and expansion progress.

## ✅ COMPLETED EXPANSION - Current Dataset Overview

**Original Items**: 22 food items  
**New Items Added**: 15 food items  
**Total Items**: 37 food items (68% increase)  
**Last Updated**: August 26, 2025  
**Status**: ✅ Modular expansion system implemented  

### Files Structure
- **Main File**: `src/infrastructure/data/foods-dataset.ts` (original 22 items)
- **Addition Files**: `src/infrastructure/data/categories/` (new 15 items)
- **Utils**: `src/infrastructure/data/utils/` (templates & merger)

## Categories and Current Items

### Fast Food (10 items: 5 original + 5 new)

#### Original Items (foods-dataset.ts)
- **burger-classic**: Classic Burger - 540 cal/piece
- **cheeseburger-double**: Double Cheeseburger - 740 cal/piece  
- **pizza-margherita**: Margherita Pizza - 320 cal/slice
- **french-fries**: French Fries - 365 cal/100g
- **hot-dog**: Hot Dog - 290 cal/piece

#### ✅ New Additions (fast-food-additions.ts)
- **chicken-nuggets**: Chicken Nuggets - 280 cal/6 pieces
- **fish-and-chips**: Fish and Chips - 650 cal/serving
- **chicken-wrap**: Chicken Wrap - 380 cal/piece
- **pepperoni-pizza**: Pepperoni Pizza - 380 cal/slice
- **taco-beef**: Beef Taco - 220 cal/piece

### Desserts (6 items: 5 original + 1 new)

#### Original Items (foods-dataset.ts)
- **chocolate-cake**: Chocolate Cake - 410 cal/slice
- **glazed-donut**: Glazed Donut - 250 cal/piece
- **vanilla-ice-cream**: Vanilla Ice Cream - 210 cal/serving
- **chocolate-cookies**: Chocolate Cookies - 160 cal/2 pieces
- **strawberry-cupcake**: Strawberry Cupcake - 300 cal/piece

#### ✅ New Additions (breakfast-additions.ts using dessert category)
- **pancakes-stack**: Pancake Stack - 520 cal/3 pieces

### Beverages (3 items)
- **coca-cola**: Coca Cola - 140 cal/330ml can
- **orange-juice**: Orange Juice - 110 cal/250ml cup
- **coffee-latte**: Coffee Latte - 180 cal/cup

### Snacks (4 items: 3 original + 1 new)

#### Original Items (foods-dataset.ts)
- **potato-chips**: Potato Chips - 150 cal/28g
- **chocolate-bar**: Chocolate Bar - 235 cal/43g
- **mixed-nuts**: Mixed Nuts - 170 cal/28g

#### ✅ New Additions (breakfast-additions.ts using snack category)
- **greek-yogurt**: Greek Yogurt - 130 cal/cup

### Fruits (5 items)
- **apple-red**: Red Apple - 95 cal/piece
- **banana**: Banana - 105 cal/piece
- **orange**: Orange - 65 cal/piece
- **strawberries**: Strawberries - 50 cal/150g
- **avocado**: Avocado - 160 cal/piece

### Main Course (8 items: 0 original + 8 new)

#### ✅ New Additions (main-course-additions.ts + breakfast items using main-course category)
- **grilled-chicken-breast**: Grilled Chicken Breast - 185 cal/100g
- **beef-steak**: Beef Steak - 250 cal/100g
- **salmon-fillet**: Salmon Fillet - 200 cal/100g
- **spaghetti-carbonara**: Spaghetti Carbonara - 450 cal/serving
- **chicken-caesar-salad**: Chicken Caesar Salad - 320 cal/serving
- **scrambled-eggs**: Scrambled Eggs - 155 cal/2 pieces
- **oatmeal-bowl**: Oatmeal Bowl - 150 cal/cup
- **avocado-toast**: Avocado Toast - 280 cal/2 slices

## Updated Calorie Range Analysis

| Category | Items Count | Min Calories | Max Calories | Avg Calories |
|----------|------------|-------------|-------------|-------------|
| Fast Food | 10 | 220 | 740 | 426 |
| Desserts | 6 | 160 | 520 | 282 |
| Beverages | 3 | 110 | 180 | 143 |
| Snacks | 4 | 130 | 235 | 171 |
| Fruits | 5 | 50 | 160 | 95 |
| Main Course | 8 | 150 | 450 | 249 |

## Portion Size Patterns

- **piece**: 13 items (most common)
- **100g/weight**: 4 items 
- **cup/volume**: 3 items
- **slice**: 2 items

## Image Sources

All images sourced from Unsplash (free license):
- **With Unsplash ID**: 8 items tracked
- **Without Unsplash ID**: 14 items (URLs only)

## Expansion Plan

### Proposed New Categories
- **Breakfast**: Cereals, eggs, pancakes, toast
- **Healthy**: Salads, grilled proteins, whole grains
- **International**: Asian, Mexican, Mediterranean cuisines

### Target Expansion
- Aim for 10+ items per existing category
- Add 20+ main course items
- Total target: 100+ food items

## Modular Organization Structure

```
src/infrastructure/data/
├── foods-dataset.ts (main aggregated file)
├── categories/ (new modular files)
│   ├── fast-food-additions.ts
│   ├── dessert-additions.ts
│   ├── beverage-additions.ts
│   ├── snack-additions.ts
│   ├── fruit-additions.ts
│   ├── main-course-additions.ts
│   ├── breakfast-additions.ts
│   └── healthy-additions.ts
└── utils/
    ├── food-data-template.ts
    └── dataset-merger.ts
```

## Quality Standards

### Required Fields
- ✅ Unique ID (kebab-case)
- ✅ English and French names
- ✅ Accurate calorie count per portion
- ✅ Clear portion size definition
- ✅ High-quality food image (400x400px)
- ✅ Relevant category assignment

### Optional Fields
- Description in both languages
- Search tags array
- Unsplash ID for image traceability

## ✅ Completed Progress Tracking

- [x] Document existing dataset
- [x] Create modular file structure  
- [x] Add 5+ breakfast items (5 items added)
- [x] Add 5+ main course items (8 items total)
- [x] Add fast food expansions (5 new items)
- [x] Create template and validation system
- [x] Build dataset merger utility
- [x] Update tracking documentation

## 🚀 How to Add New Food Items

### Step-by-Step Process

1. **Choose the Right File**
   ```
   src/infrastructure/data/categories/
   ├── fast-food-additions.ts      # For fast food items
   ├── dessert-additions.ts        # For desserts (create if needed)
   ├── beverage-additions.ts       # For drinks (create if needed)
   ├── snack-additions.ts          # For snacks (create if needed)
   ├── fruit-additions.ts          # For fruits (create if needed)
   ├── main-course-additions.ts    # For main meals
   ├── breakfast-additions.ts      # For breakfast items
   └── healthy-additions.ts        # For healthy options (create if needed)
   ```

2. **Use the Template System**
   ```typescript
   // Import the template from utils
   import { createFoodDataTemplate, validateFoodData } from "../utils/food-data-template"
   
   // Create new item using template
   const newFood = createFoodDataTemplate()
   // Fill in the data...
   
   // Validate before adding
   const validation = validateFoodData(newFood)
   if (!validation.isValid) {
     console.log("Fix these errors:", validation.errors)
   }
   ```

3. **Follow Naming Conventions**
   - **ID**: Use kebab-case (e.g., "grilled-chicken-breast")
   - **Names**: Provide both English and French
   - **Images**: Use Unsplash URLs in format: `https://images.unsplash.com/photo-ID?w=400&h=400&fit=crop`

4. **Required Fields Checklist**
   - ✅ Unique ID (kebab-case)
   - ✅ English name (`names.en`)
   - ✅ French name (`names.fr`)
   - ✅ Accurate calories per portion
   - ✅ Clear portion size (amount + unit)
   - ✅ Correct category assignment
   - ✅ High-quality Unsplash image URL

5. **Optional but Recommended**
   - Description in both languages
   - Unsplash photo ID for traceability
   - Relevant search tags array

### Example New Food Entry
```typescript
{
  id: "grilled-salmon",
  names: { en: "Grilled Salmon", fr: "Saumon Grillé" },
  calories: 206,
  portionSize: { amount: 100, unit: "100g" },
  category: "main-course",
  imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop",
  unsplashId: "1467003909585-2f8a72700288",
  description: {
    en: "Grilled salmon fillet, rich in omega-3",
    fr: "Filet de saumon grillé, riche en oméga-3"
  },
  tags: ["salmon", "fish", "healthy", "protein", "omega-3"]
}
```

### Merging New Items

1. **Test First**: Use the merger utility to validate
   ```typescript
   import { generateMergerReport } from "../utils/dataset-merger"
   const report = generateMergerReport()
   console.log(report) // Check for issues
   ```

2. **Update Main File**: When ready, use merger to combine all additions into `foods-dataset.ts`

3. **Update This Documentation**: Add new items to tracking sections above

### Quality Standards
- Calories should be realistic (1-2000 per portion)
- Images must be 400x400px from Unsplash
- All text fields must be family-friendly
- Verify portion sizes make sense
- Test search tags work properly

---

*Last Updated: August 26, 2025 - System fully implemented and ready for expansion*