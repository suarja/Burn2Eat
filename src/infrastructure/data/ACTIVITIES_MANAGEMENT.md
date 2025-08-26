# Activities Dataset Management Guide

This document provides a comprehensive guide for managing and expanding the physical activities dataset used in the Burn2Eat application.

## Overview

The activities dataset is organized into separate category files for better maintainability and clear documentation. Each activity includes:
- **MET values** (Metabolic Equivalent of Task) from the 2011 Compendium of Physical Activities
- **Multiple language support** (English/French)
- **Intensity levels** automatically calculated from MET values
- **Equipment requirements** and **tags** for filtering
- **Official compendium codes** for scientific accuracy

## Dataset Structure

### Main Files
- `activities-dataset.ts` - Main entry point that exports all activities
- Category-specific files (detailed below)
- `ACTIVITIES_MANAGEMENT.md` - This documentation file

### Activity Data Format
```typescript
{
  key: string,                    // Unique identifier
  names: { en: string, fr: string }, // Multilingual names
  met: number,                    // MET value (scientific)
  category: string,               // Activity category
  intensity: string,              // Auto-calculated from MET
  compendiumCode?: string,        // Official research code
  description: { en: string, fr: string }, // Detailed descriptions
  tags: string[],                 // Search/filter tags
  iconName: string,              // Icon identifier
  equipment: string[]            // Required equipment
}
```

## Current Categories and Activity Count

### Existing Categories (as of current dataset)

#### 1. **Cardio** (11 activities)
**Files**: `activities-cardio.ts`
- Walking (casual, brisk, very brisk)
- Running/Jogging (various speeds)
- Cycling (leisurely, moderate, vigorous)
- Rowing, Elliptical

#### 2. **Water Sports** (2 activities) 
**Files**: `activities-water.ts`
- Swimming (leisurely, moderate)

#### 3. **Sports** (3 activities)
**Files**: `activities-sports.ts`
- Tennis, Basketball, Soccer

#### 4. **Dance** (3 activities)
**Files**: `activities-dance.ts`
- Ballroom, Aerobic, Hip Hop

#### 5. **Gym & Fitness** (5 activities)
**Files**: `activities-gym.ts`
- Weight training, Yoga, Pilates, CrossFit

#### 6. **Daily Activities** (3 activities)
**Files**: `activities-daily.ts`
- Stair climbing, Housework, Gardening

**Total Current Activities**: 27

## Apple Fitness+ Compatible Activities

Based on Apple's Fitness app, here are the most popular activity categories we should add:

### High Priority Additions Needed

#### **Combat Sports & Martial Arts**
- Boxing (already have basics, need expansion)
- Kickboxing (already have)
- Martial Arts (Karate, Taekwondo, Jiu-Jitsu)
- Fencing

#### **Racket Sports**  
- Tennis (already have singles)
- Badminton
- Squash
- Racquetball
- Table Tennis
- Pickleball (trending sport)

#### **Team Sports**
- Basketball (already have)
- Soccer (already have) 
- Volleyball
- Rugby
- Baseball/Softball
- American Football
- Hockey (Ice/Field)

#### **Winter Sports**
- Skiing (Cross Country, Downhill)
- Snowboarding
- Ice Skating
- Curling

#### **Water Activities** 
- Swimming (already have)
- Water Polo
- Surfing
- Paddling/Kayaking
- Sailing

#### **Climbing & Adventure**
- Rock Climbing
- Bouldering
- Hiking (trail hiking vs walking)
- Mountaineering

#### **Flexibility & Recovery**
- Yoga (expand current selection)
- Pilates (already have)
- Stretching/Flexibility
- Tai Chi
- Barre

#### **High-Intensity Training**
- HIIT (High-Intensity Interval Training)
- CrossFit (already have)
- Circuit Training
- Tabata
- Functional Fitness

#### **Recreational Activities**
- Golf
- Bowling
- Archery
- Fishing (surprisingly active)
- Disc Sports (Frisbee, Ultimate)

## Step-by-Step Guide to Add New Activities

### Step 1: Research MET Values
1. Visit the [2011 Compendium of Physical Activities](https://sites.google.com/site/compendiumofphysicalactivities/)
2. Find official MET values and compendium codes
3. Verify with multiple sources when possible
4. Document source in comments

### Step 2: Determine Category
Choose appropriate category or create new one:
- `cardio` - Endurance-focused activities
- `sports` - Competitive/team sports  
- `water` - Water-based activities
- `gym` - Gym/fitness center activities
- `dance` - Dance and rhythmic movement
- `daily` - Daily life activities
- `combat` - Fighting/martial arts (new)
- `winter` - Cold weather sports (new)
- `climbing` - Climbing activities (new)
- `flexibility` - Stretching/yoga (new)

### Step 3: Create/Update Category File
1. Create or open category file: `activities-[category].ts`
2. Follow existing format exactly
3. Include proper imports
4. Add comprehensive tags for searchability
5. Include both English and French translations

### Step 4: Update Main Dataset File
1. Import new activities from category file
2. Add to main `ACTIVITIES_DATASET` array
3. Update total count
4. Test search and filter functions

### Step 5: Validate Data
1. Run `yarn compile` to check TypeScript
2. Verify MET values are reasonable (typically 1.5-15)
3. Check intensity calculations
4. Test search functionality
5. Validate translations

## MET Value Guidelines

### Intensity Levels (Auto-calculated)
- **Light**: 1.5-2.9 MET
- **Moderate**: 3.0-5.9 MET  
- **Vigorous**: 6.0-8.9 MET
- **Very Vigorous**: 9.0+ MET

### Common MET Reference Points
- **Sleeping**: 0.9 MET
- **Sitting quietly**: 1.0 MET
- **Casual walking**: 3.0 MET
- **Brisk walking**: 4.0 MET
- **Jogging**: 7.0 MET
- **Running (6 mph)**: 10.0 MET
- **Elite athletics**: 12.0+ MET

## Translation Guidelines

### Required Languages
- **English** (en): Primary language
- **French** (fr): Secondary language

### Translation Tips
- Keep activity names concise but descriptive
- Use commonly understood terms
- Be consistent with existing translations
- Include intensity indicators in parentheses when helpful

## Equipment Standardization

### Common Equipment IDs
```typescript
// Gym Equipment
"weights", "dumbbells", "barbell", "kettlebell"
"treadmill", "elliptical-machine", "rowing-machine"
"yoga-mat", "exercise-ball", "resistance-bands"

// Sports Equipment  
"tennis-racket", "basketball", "soccer-ball"
"bicycle", "helmet", "swimming-pool"

// Specialized
"boxing-gloves", "climbing-gear", "skis"
"golf-clubs", "archery-bow"
```

## Icon Naming Convention

Use simple, descriptive names:
- `run`, `walk`, `bike`, `swim`
- `tennis`, `basketball`, `soccer`
- `weights`, `yoga`, `dance`
- Follow existing patterns in the codebase

## Quality Checklist

Before adding new activities, verify:
- [ ] MET value from official source
- [ ] Compendium code included (if available)
- [ ] Both English and French translations
- [ ] Appropriate category assignment
- [ ] Relevant tags for searchability
- [ ] Equipment list (empty array if none)
- [ ] Icon name follows convention
- [ ] TypeScript compilation passes
- [ ] Search functionality works
- [ ] Intensity level seems reasonable

## Future Enhancements

### Planned Features
1. **Difficulty levels** within activities
2. **Age/gender adjustments** for MET values
3. **Seasonal activity** recommendations
4. **Equipment-based filtering** improvements
5. **Custom activity** creation by users

### Research Sources
- [Compendium of Physical Activities](https://sites.google.com/site/compendiumofphysicalactivities/)
- [Apple Fitness+ Activity Types](https://support.apple.com/en-us/105089)
- [Harvard Medical School Calorie Calculator](https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights)
- [American Council on Exercise (ACE)](https://www.acefitness.org/)

---

*Last updated: August 2025*
*Next review: When adding 10+ new activities*