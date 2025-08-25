# Activities Dataset Infrastructure

This directory contains the static physical activities dataset for the Burn2Eat MVP, implemented following Domain-Driven Design principles.

## Overview

The activities dataset provides type-safe access to physical activities with official MET values from the 2011 Compendium of Physical Activities. All activities include multilingual support (English/French) and are categorized by intensity and type.

## Structure

```
infrastructure/
├── data/
│   ├── activities-dataset.ts    # Main dataset with 28 activities
│   └── activities-index.ts      # Centralized exports
├── types/
│   └── ActivityData.ts          # TypeScript interfaces
├── utils/
│   └── validateActivitiesDataset.ts # Validation utilities
├── adapters/
│   └── StaticActivityCatalog.ts # Domain adapter
└── README-activities.md         # This file
```

## Usage

### Basic Import
```typescript
import { ACTIVITIES_DATASET, getActivityByKey } from '@/infrastructure/data/activities-dataset';

// Get a specific activity
const jogging = getActivityByKey('jogging_general');
console.log(jogging?.names.en); // "Jogging (General)"
```

### Search Operations
```typescript
import { searchActivitiesByName, getActivitiesByIntensity } from '@/infrastructure/data/activities-dataset';

// Search by name (supports English, French, and tags)
const running = searchActivitiesByName('running');

// Filter by intensity
const vigorousActivities = getActivitiesByIntensity('vigorous');
```

### Domain Integration
```typescript
import { StaticActivityCatalog } from '@/infrastructure/adapters/StaticActivityCatalog';

const catalog = new StaticActivityCatalog();
const activity = catalog.getByKey('crossfit'); // Returns domain Activity object
console.log(activity?.getMET().toNumber()); // 8.0
```

## Dataset Contents

### Current Stats
- **Total Activities:** 28 activities
- **Categories:** cardio (12), gym (5), sports (3), dance (3), daily (3), water (2)
- **Average MET:** 6.2 METs
- **Languages:** English & French names
- **MET Sources:** Official 2011 Compendium of Physical Activities

### Intensity Distribution
- **Light (< 3 METs):** 1 activity (3.6%) - e.g., Yoga
- **Moderate (3-6 METs):** 11 activities (39.3%) - e.g., Walking, Weight Training
- **Vigorous (≥ 6 METs):** 16 activities (57.1%) - e.g., Running, CrossFit

### Category Breakdown
- **Cardio (42.9%):** Walking, Running, Cycling, Rowing, Elliptical
- **Gym (17.9%):** Weight Training, Yoga, Pilates, CrossFit  
- **Sports (10.7%):** Tennis, Basketball, Soccer
- **Dance (10.7%):** Ballroom, Aerobic, Hip Hop
- **Daily (10.7%):** Stairs, Housework, Gardening
- **Water (7.1%):** Swimming activities

## Data Structure

Each activity follows the `ActivityData` interface:

```typescript
interface ActivityData {
  key: string;                    // 'jogging_general', 'cycling_moderate'
  names: {                        // Multilingual names
    en: string;
    fr: string;
  };
  met: number;                    // Official MET value (1.0-20.0)
  category: ActivityCategory;     // 'cardio', 'gym', 'sports', etc.
  intensity: ActivityIntensity;   // 'light', 'moderate', 'vigorous'
  compendiumCode?: string;       // Official compendium code
  description?: {                // Optional descriptions
    en?: string;
    fr?: string;
  };
  tags?: string[];              // Search tags
  iconName?: string;            // UI icon reference
  equipment?: string[];         // Required equipment
}
```

## MET Values & Science

### Formula Integration
The dataset works with the standard MET formula:
```
minutes = calories / (MET × 3.5 × weightKg / 200)
```

### Example Calculations
- **Apple (95 kcal) + Brisk Walking (3.5 MET):** ~22 minutes for 70kg person
- **Burger (540 kcal) + Jogging (7.0 MET):** ~63 minutes for 70kg person  
- **Pizza slice (320 kcal) + Cycling (6.8 MET):** ~38 minutes for 70kg person

### MET Value Sources
All MET values are from the official 2011 Compendium:
- **Walking 3.5 mph:** 3.5 METs (Code 17170)
- **Running 6 mph:** 9.8 METs (Code 12050)  
- **Cycling moderate:** 6.8 METs (Code 01040)
- **CrossFit workout:** 8.0 METs (Code 02131)

## Validation

### Automated Validation
Run the validation script to check dataset integrity:
```bash
# Full validation report
npx ts-node scripts/validate-activities-dataset.ts
```

### Test Coverage
```bash
# Domain tests (pure business logic)
yarn test test/domain/physiology/

# Adapter integration tests  
yarn test test/infrastructure/adapters/StaticActivityCatalog.spec.ts

# End-to-end formula integration
yarn test test/integration/effort-calculation.spec.ts
```

Tests cover:
- MET value validation against scientific ranges
- Domain business rules (intensity classification)
- Data translation between infrastructure and domain
- Integration with effort calculation formula

## Extending the Dataset

### Adding New Activities

1. Add entries to `ACTIVITIES_DATASET` in `activities-dataset.ts`
2. Follow the `ActivityData` interface structure  
3. Use official MET values from Compendium of Physical Activities
4. Include English and French names
5. Add relevant tags for search
6. Run validation: `npx ts-node scripts/validate-activities-dataset.ts`
7. Run tests: `yarn test test/domain/physiology/ test/infrastructure/adapters/`

### Guidelines
- **MET Values:** Use official Compendium values (validate against known ranges)
- **Intensities:** Auto-calculated from MET (light <3, moderate 3-6, vigorous ≥6)
- **Categories:** Stick to existing categories when possible
- **Names:** Ensure French translations are meaningful
- **Keys:** Use lowercase with underscores (e.g., `activity_modifier`)

## Integration with Domain

This infrastructure layer serves the Domain layer through the adapter pattern:

### Domain Objects Created
- `ActivityData` (infrastructure) → `Activity` (domain) via `StaticActivityCatalog`
- MET values become `Met` value objects with business rules
- Categories and intensities are preserved for filtering

### Domain Business Rules
- **Intensity Classification:** Based on MET ranges with domain logic
- **Activity Comparison:** Compare activities by intensity
- **Validation:** Domain validates MET ranges and activity keys

## Performance & Scalability  

### Current Implementation
- **Static dataset:** Fast, no network calls required
- **Memory efficient:** ~28 activities loaded once
- **Search optimized:** Simple array filtering (adequate for MVP)

### Future Optimizations
- Index by category/intensity for O(1) lookups
- Fuzzy search for typo tolerance  
- Lazy loading for larger datasets
- Caching layer for computed values

## Future Enhancements

### Planned Features
- **More activities:** Target 100+ activities
- **Equipment integration:** Track required equipment
- **Skill levels:** Beginner/intermediate/advanced variations
- **Cultural activities:** Region-specific sports and activities
- **Seasonal activities:** Outdoor vs indoor alternatives

### Advanced Features
- **AI recommendations:** Based on user preferences and history
- **Dynamic MET adjustment:** Account for fitness level and environmental factors
- **Integration with wearables:** Real-time MET measurement
- **Community activities:** User-contributed activities with validation

---

*This activities dataset powers the Burn2Eat MVP physiology domain with scientifically accurate MET values for precise effort calculations.*