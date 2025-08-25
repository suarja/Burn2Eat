# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Burn2Eat is a React Native MVP app built with the Ignite boilerplate that helps users understand the energy impact of their food choices by converting calories into exercise time equivalents. The project follows Domain-Driven Development (DDD) and Test-Driven Development (TDD) principles.

## Commands

### Development
- `yarn start` - Start Expo development server with dev-client
- `yarn android` - Run on Android
- `yarn ios` - Run on iOS  
- `yarn web` - Run on web

### Building
- `yarn build:ios:sim` - Build for iOS simulator
- `yarn build:android:sim` - Build for Android simulator
- `yarn build:ios:dev` - Build for iOS device (development)
- `yarn build:android:dev` - Build for Android device (development)

### Testing & Code Quality
- `yarn test` - Run Jest tests
- `yarn test:watch` - Run tests in watch mode
- `yarn compile` - TypeScript type checking
- `yarn lint` - Run ESLint with auto-fix
- `yarn lint:check` - Run ESLint check only

### Specific Test Commands
- `yarn test test/domain/Dish.spec.ts` - Run specific test file
- `yarn test --testNamePattern="Should be able to create"` - Run specific test case

## Architecture

### Domain-Driven Design Structure
The project follows hexagonal architecture with clear separation of concerns:

```
app/
├── domain/           # Core business logic (DDD)
│   ├── common/       # Shared domain types
│   │   └── UnitTypes.ts  # Branded types (Kilocalories, Kilograms, etc.)
│   ├── nutrition/    # Food/dish domain
│   │   ├── Dish.ts
│   │   ├── DishId.ts
│   │   └── NutritionalInfo.ts
│   ├── physiology/   # User health and activities
│   │   ├── UserHealthInfo.ts
│   │   ├── Activity.ts
│   │   └── Met.ts
│   └── effort/       # Effort calculation logic
│       ├── EffortCalculator.ts
│       └── EffortBreakdown.ts
├── application/      # Use cases/orchestration
└── infrastructure/   # External adapters
```

### Ignite Boilerplate Conventions

#### Components
- Custom components in `app/components/` follow consistent patterns
- Use the custom `Text`, `Button`, `TextField` components instead of React Native defaults
- Components support theming via `useAppTheme()` hook
- Import restrictions prevent direct use of RN Text, Button, TextInput

#### Styling & Theming
- Theme system in `app/theme/` with dark/light mode support
- Typography definitions in `app/theme/typography.ts`
- Spacing constants in `app/theme/spacing.ts`
- Use `ThemedStyle` types for theme-aware styling

#### Navigation
- React Navigation stack in `app/navigators/`
- Navigation utilities in `app/navigators/navigationUtilities.ts`
- Web linking configuration in `app.tsx`

#### Internationalization
- i18n setup with `react-i18next` in `app/i18n/`
- Translation keys via `TxKeyPath` type
- RTL support built-in

#### Storage
- Local storage utilities in `app/utils/storage/`
- Uses react-native-mmkv for performance

### Testing Strategy
- Jest configuration in `jest.config.js` with jest-expo preset
- Test setup in `test/setup.ts`
- Domain tests in `test/domain/` following TDD approach
- Tests focus on business logic first (domain layer)

### Code Quality
- ESLint config extends expo, typescript, react, prettier
- Import order enforcement with specific groupings
- Prettier integration for code formatting
- TypeScript strict configuration

## Development Guidelines

### Domain Logic
- Keep domain entities pure (no external dependencies)
- Use branded types for type safety (Kilocalories, Minutes, etc.)
- Follow the MET formula for effort calculations: `minutes ≈ calories / (MET * 3.5 * weightKg / 200)`

### Testing Approach
1. Write failing tests first (TDD)
2. Focus on domain logic testing
3. Use descriptive test names that explain behavior
4. Test both happy paths and edge cases

### Food Data Integration
- MVP uses static food data (no OpenFoodFacts integration yet)
- Future: OpenFoodFacts API integration via DishRepository adapter
- Need static dataset with food images and calorie data for MVP

### Ignite Component Usage
- Always use custom components from `app/components/`
- Follow theming patterns with `useAppTheme()`
- Use translation system (`tx` prop) for internationalization
- Respect import restrictions in ESLint config

## MVP Scope
- Simple onboarding (height, weight, preferred activity)
- Food search interface with static dataset
- Instant calorie-to-exercise conversion
- Fun animations/confetti for engagement
- Local storage for history
- No social features or authentication in MVP