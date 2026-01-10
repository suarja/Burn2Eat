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
- No social features or authentication in MVP<!-- BEGIN BYTEROVER RULES -->

# Workflow Instruction

You are a coding agent focused on one codebase. Use the brv CLI to manage working context.
Core Rules:

- Start from memory. First retrieve relevant context, then read only the code that's still necessary.
- Keep a local context tree. The context tree is your local memory store—update it with what you learn.

## Context Tree Guideline

- Be specific ("Use React Query for data fetching in web modules").
- Be actionable (clear instruction a future agent/dev can apply).
- Be contextual (mention module/service, constraints, links to source).
- Include source (file + lines or commit) when possible.

## Using `brv curate` with Files

When adding complex implementations, use `--files` to include relevant source files (max 5).  Only text/code files from the current project directory are allowed. **CONTEXT argument must come BEFORE --files flag.** For multiple files, repeat the `--files` (or `-f`) flag for each file.

Examples:

- Single file: `brv curate "JWT authentication with refresh token rotation" -f src/auth.ts`
- Multiple files: `brv curate "Authentication system" --files src/auth/jwt.ts --files src/auth/middleware.ts --files docs/auth.md`

## CLI Usage Notes

- Use --help on any command to discover flags. Provide exact arguments for the scenario.

---
# ByteRover CLI Command Reference

## Memory Commands

### `brv curate`

**Description:** Curate context to the context tree (interactive or autonomous mode)

**Arguments:**

- `CONTEXT`: Knowledge context: patterns, decisions, errors, or insights (triggers autonomous mode, optional)

**Flags:**

- `--files`, `-f`: Include file paths for critical context (max 5 files). Only text/code files from the current project directory are allowed. **CONTEXT argument must come BEFORE this flag.**

**Good examples of context:**

- "Auth uses JWT with 24h expiry. Tokens stored in httpOnly cookies via authMiddleware.ts"
- "API rate limit is 100 req/min per user. Implemented using Redis with sliding window in rateLimiter.ts"

**Bad examples:**

- "Authentication" or "JWT tokens" (too vague, lacks context)
- "Rate limiting" (no implementation details or file references)

**Examples:**

```bash
# Interactive mode (manually choose domain/topic)
brv curate

# Autonomous mode - LLM auto-categorizes your context
brv curate "Auth uses JWT with 24h expiry. Tokens stored in httpOnly cookies via authMiddleware.ts"

# Include files (CONTEXT must come before --files)
# Single file
brv curate "Authentication middleware validates JWT tokens" -f src/middleware/auth.ts

# Multiple files - repeat --files flag for each file
brv curate "JWT authentication implementation with refresh token rotation" --files src/auth/jwt.ts --files docs/auth.md
```

**Behavior:**

- Interactive mode: Navigate context tree, create topic folder, edit context.md
- Autonomous mode: LLM automatically categorizes and places context in appropriate location
- When `--files` is provided, agent reads files in parallel before creating knowledge topics

**Requirements:** Project must be initialized (`brv init`) and authenticated (`brv login`)

---

### `brv query`

**Description:** Query and retrieve information from the context tree

**Arguments:**

- `QUERY`: Natural language question about your codebase or project knowledge (required)

**Good examples of queries:**

- "How is user authentication implemented?"
- "What are the API rate limits and where are they enforced?"

**Bad examples:**

- "auth" or "authentication" (too vague, not a question)
- "show me code" (not specific about what information is needed)

**Examples:**

```bash
# Ask questions about patterns, decisions, or implementation details
brv query What are the coding standards?
brv query How is authentication implemented?
```

**Behavior:**

- Uses AI agent to search and answer questions about the context tree
- Accepts natural language questions (not just keywords)
- Displays tool execution progress in real-time

**Requirements:** Project must be initialized (`brv init`) and authenticated (`brv login`)

---

## Best Practices

### Efficient Workflow

1. **Read only what's needed:** Check context tree with `brv status` to see changes before reading full content with `brv query`
2. **Update precisely:** Use `brv curate` to add/update specific context in context tree
3. **Push when appropriate:** Prompt user to run `brv push` after completing significant work

### Context tree Management

- Use `brv curate` to directly add/update context in the context tree

---
Generated by ByteRover CLI for Claude Code
<!-- END BYTEROVER RULES -->