# HANDOFF.md - Apple App Store Rejection Fix

**Date:** 2026-01-10
**Status:** ✅ Implementation Complete - Ready for iPad Testing
**Next Agent:** Test on iPad Air (5th gen) simulator and validate fixes
**Last Updated:** 2026-01-10 (Audit completed)

---

## 📋 Current Status Summary

### What Has Been Completed ✅

**All implementation work is DONE:**
- ✅ Performance fixes (search pagination, React.memo, useCallback, animations)
- ✅ UI/UX improvements (responsive spacing, cards, better layouts)
- ✅ ActivityPickerButton component (replaced confusing wheel picker)
- ✅ Context-aware ProfileSetupScreen (onboarding vs settings)
- ✅ MET value extraction fix (proper domain model handling)
- ✅ TypeScript compilation: **0 errors**
- ✅ All code committed to `dev` branch

### What Remains To Do ⏳

**Phase 3: Testing & Validation** (CRITICAL - START HERE)
- [ ] Build and test on iPad Air (5th gen) simulator with iPadOS 18.6.2+
- [ ] Execute full test checklist (see section below)
- [ ] Validate no freeze/lag issues
- [ ] Confirm UI is not "crowded" on iPad
- [ ] Take new screenshots for resubmission
- [ ] Prepare production build

---

## 🎯 Context: Apple Rejection Issues

The Burn2Eat React Native app was **rejected by Apple** with two critical issues:

1. **Guideline 2.1 - Performance**: App froze during review on iPad Air (5th gen), iPadOS 18.6.2
2. **Guideline 4.0 - Design**: Screens were crowded and difficult to complete tasks

**Apple Feedback:**
- Full details: `docs/publish/issues/issues-2.md`
- Screenshots: `docs/publish/issues/apple-screenshots/`

---

## ✅ Implementation Summary

### Phase 1: Performance Fixes (Guideline 2.1)

#### 1.1 Search Performance Fix ✅
**Problem:** Loading ALL dishes into memory for search, causing iPad freeze
**Solution:**
- Created `searchByName()` method in `GetFoodCatalogUseCase`
- Limits search results to 30 items maximum
- Added 300ms debounce

**Files:**
- `src/application/usecases/food/GetFoodCatalogUseCase.ts`
- `app/hooks/useCategoryData.ts:121`

#### 1.2 React.memo() Optimization ✅
**Problem:** Every category re-renders when ANY category expands/collapses
**Solution:** Added `React.memo()` to key components

**Files:**
- `app/components/CollapsibleCategorySection.tsx`
- `app/components/FoodCard.tsx`

#### 1.3 useCallback Optimization ✅
**Problem:** Event handlers recreated on every render
**Solution:** Wrapped handlers in `useCallback` with proper dependencies

**File:** `app/screens/HomeScreen.tsx`

#### 1.4 Animation Duration Reduction ✅
**Problem:** LayoutAnimation causing potential freezes
**Solution:** Reduced animation duration from 300ms to 200ms

**File:** `app/components/CollapsibleCategorySection.tsx:93,105`

---

### Phase 2: UI/UX Improvements (Guideline 4.0)

#### 2.1 Responsive Spacing Hook ✅
**Solution:** Created `useResponsiveSpacing` hook
- Detects iPad (width >= 768pt)
- Returns 1.5x multiplier for iPad spacing

**File:** `app/hooks/useResponsiveSpacing.ts`

#### 2.2 ProfileSetupScreen Improvements ✅
**Solution:**
- Wrapped sections in Card components for visual separation
- Increased content padding
- Applied responsive spacing multipliers
- Added emoji and improved titles

**File:** `app/screens/ProfileSetupScreen.tsx`

#### 2.3-2.5 Spacing Improvements ✅
**Files:**
- `app/screens/ResultScreen.tsx`
- `app/components/CollapsibleCategorySection.tsx`
- `app/components/OnboardingModal.tsx`

#### 2.6 ActivityPickerButton Component ✅
**Problem:** ActivityWheelPicker had poor contrast and confusing UX
**Solution:** Created modal-based picker with better visual hierarchy

**Files:**
- `app/components/ActivityPickerButton.tsx` (NEW)
- `app/screens/ProfileSetupScreen.tsx` (updated to use new component)

#### 2.7 ProfileSetupScreen Polish ✅
**Solution:**
- Added descriptive subtitles to sections
- Enhanced button styling (better touch targets)
- Improved visual hierarchy

**File:** `app/screens/ProfileSetupScreen.tsx`

#### 2.8 MET Value Extraction Fix ✅
**Problem:** Runtime error "selectedActivityData.met.toFixed is not a function"
**Solution:** Use `.toNumber()` method instead of invalid type cast

**Files:**
- `app/hooks/useActivityCatalog.ts:22`
- `app/components/ActivityPickerButton.tsx:72,108`

#### 2.9 Context-Aware ProfileSetupScreen ✅
**Problem:** Same text shown in onboarding and settings
**Solution:** Detect context and adapt UI/navigation accordingly

**File:** `app/screens/ProfileSetupScreen.tsx`

---

## 📦 Git Commits

All changes committed to `dev` branch:

```
b353a80 docs: Add missing commit b8af16c to HANDOFF.md git log
e5ff9ba docs: Complete HANDOFF.md with all UI/UX improvements and bug fixes
b8af16c fix: update types and imports
837c6da improve: Adapt ProfileSetupScreen UI based on context
a41bd25 fix: Correct MET value extraction and add defensive null checks
729ccbc docs: Update HANDOFF.md with ActivityPickerButton improvements
b7767b2 improve: Replace ActivityWheelPicker with simpler ActivityPickerButton
cfa25ca improve: Enhance ProfileSetupScreen layout with visual cards
780f9f1 fix: Rename search method to searchByName for clarity
1d2aacb improve: Increase OnboardingModal spacing for better readability
cb0cb92 fix: Resolve iPad freeze and crowded UI issues for App Store approval
```

---

## 🧪 Phase 3: Testing Checklist

### Critical Test Requirements

**Device:** iPad Air (5th generation) simulator - **This is mandatory**
**OS:** iPadOS 18.6.2 or later

### Test Steps

1. **Build for iOS Simulator**
   ```bash
   yarn compile          # Verify no TypeScript errors
   yarn build:ios:sim    # Build for simulator
   yarn ios              # Launch app
   ```

2. **Onboarding Flow Test**
   - [ ] Complete full onboarding without freeze
   - [ ] Configure profile (weight/height pickers work smoothly)
   - [ ] ActivityPickerButton modal opens and closes smoothly
   - [ ] Save profile successfully

3. **Home Screen Test**
   - [ ] Navigate through all 6 categories
   - [ ] Expand/collapse categories rapidly (10+ times) - must not freeze
   - [ ] Verify grid spacing looks good (not crowded)
   - [ ] Cards have proper spacing between them

4. **Search Performance Test** 🔥 CRITICAL
   - [ ] Type fast in search field
   - [ ] Search different terms multiple times
   - [ ] App stays responsive (no lag > 500ms)
   - [ ] Results limited to 30 items max
   - [ ] No console errors

5. **Settings Context Test**
   - [ ] Edit profile from settings screen
   - [ ] Button shows "Enregistrer les modifications" (not "Commencer l'aventure")
   - [ ] After save, returns to settings (not home)
   - [ ] Toast shows "Profil mis à jour" (not "Profil sauvegardé")

6. **UI/UX Validation**
   - [ ] ProfileSetupScreen: Sections clearly separated with cards
   - [ ] ProfileSetupScreen: Titles prominent and centered
   - [ ] Touch targets >= 44x44pt (Apple requirement)
   - [ ] Good spacing on iPad (comfortable, not crowded)
   - [ ] Readable text with clear hierarchy

7. **Stability Test**
   - [ ] Rapid screen navigation (back/forth 10+ times)
   - [ ] No memory leaks (check with Xcode Instruments if possible)
   - [ ] No console warnings/errors
   - [ ] No crashes

8. **Pre-submission Checks**
   - [ ] `yarn compile` - 0 errors
   - [ ] `yarn lint:check` - acceptable errors only
   - [ ] `yarn test` - all tests pass
   - [ ] Clean git history
   - [ ] Take new screenshots for App Store

---

## 🚀 Next Steps for Testing

### Immediate Actions

1. **Verify compilation:**
   ```bash
   yarn compile
   ```

2. **Build for simulator:**
   ```bash
   yarn build:ios:sim
   ```

3. **Launch on iPad Air (5th gen):**
   - Open Xcode → Developer Tools → Simulator
   - Select iPad Air (5th generation)
   - Run: `yarn ios`

4. **Execute test checklist above**

5. **Document results:**
   - Take screenshots of fixed screens
   - Note any issues found
   - Update this file with test results

6. **If issues found:**
   - Search freeze → Check `useCategoryData.ts:121`
   - Category freeze → Check `CollapsibleCategorySection.tsx` memo
   - UI crowded → Increase multiplier in `useResponsiveSpacing.ts`
   - MET errors → Verify `.toNumber()` usage

7. **Prepare for resubmission:**
   - Take new App Store screenshots
   - Write release notes
   - Create production build: `yarn build:ios:dev`

---

## 📚 Critical Files Reference

### Performance Files
- `app/hooks/useCategoryData.ts:121` - Search with 30 item limit
- `app/components/CollapsibleCategorySection.tsx` - React.memo
- `app/components/FoodCard.tsx` - React.memo
- `app/screens/HomeScreen.tsx` - useCallback hooks

### UI/UX Files
- `app/hooks/useResponsiveSpacing.ts` - iPad spacing detection
- `app/hooks/useActivityCatalog.ts:22` - MET value extraction (.toNumber())
- `app/components/ActivityPickerButton.tsx` - Activity picker modal
- `app/screens/ProfileSetupScreen.tsx` - Context-aware UI
- `app/screens/ResultScreen.tsx` - Responsive spacing
- `app/components/OnboardingModal.tsx` - Improved spacing

### Domain Files
- `src/domain/physiology/Met.ts` - MET value object (use `.toNumber()`)

---

## 💡 Troubleshooting Guide

### If App Freezes on iPad
1. Check search implementation: `useCategoryData.ts:121` should call `searchByName(query, 30)`
2. Verify React.memo in `CollapsibleCategorySection.tsx` and `FoodCard.tsx`
3. Check useCallback in `HomeScreen.tsx`
4. Use React DevTools Profiler to identify re-renders

### If UI Looks Crowded
1. Check `useResponsiveSpacing.ts` - multiplier should be 1.5 for iPad
2. Verify ProfileSetupScreen uses Card components
3. Check spacing multipliers are applied: `spacing.xl * multiplier`

### If Runtime Errors with MET Values
1. Verify `useActivityCatalog.ts:22` uses `.toNumber()` not type cast
2. Check ActivityPickerButton has null checks: `item.met != null`

### If Context Issues in ProfileSetupScreen
1. Check `isEditingExistingProfile` state logic (line 107, 112)
2. Verify button text adapts (line 199-201)
3. Verify navigation adapts (line 65-74)

---

## 🔮 Future Improvements (Out of Scope for Now)

### OpenFoodFacts API Integration for Search

**Current State:**
- Static data (local) for catalog and search
- OpenFoodFacts only for barcode scanning

**Possible Future Enhancement:**
- Add text search via OpenFoodFacts API: `/api/v0/products.json?search=...`
- **Important limitations:**
  - Rate limit: 10 requests/min
  - Cannot use for search-as-you-type (would be blocked)
  - Would need caching strategy
- **Recommendation:** Keep static data for catalog, optionally add OpenFoodFacts for "expanded search"

**Why not now:**
- Current priority: Pass App Store review
- Static data works well for MVP
- OpenFoodFacts marked as "Out of Scope" in CLAUDE.md
- Can be added post-publication

**API Documentation:**
- [OpenFoodFacts API Tutorial](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/)
- [API Reference](https://openfoodfacts.github.io/openfoodfacts-server/api/ref-cheatsheet/)

---

## 🎉 Summary

**Implementation:** ✅ 100% Complete
**Code Quality:** ✅ TypeScript compiles, minimal linting issues
**Testing:** ⏳ 0% - **CRITICAL NEXT STEP**

**Confidence Level:** Very High
- All fixes directly address Apple's rejection reasons
- Code is clean, focused, well-documented
- No known runtime issues
- No compilation errors

**Blocker:** None - Ready for testing immediately

**Next Critical Action:** Test on iPad Air (5th gen) simulator with iPadOS 18.6.2+

---

## Commands Quick Reference

```bash
# Type checking
yarn compile

# Linting
yarn lint              # Auto-fix
yarn lint:check        # Check only

# Building
yarn build:ios:sim     # Build for iOS simulator
yarn ios               # Run on iOS

# Testing
yarn test              # Run tests

# Development
yarn start             # Start dev server
```

---

**Last Updated:** 2026-01-10
**Updated By:** Claude Sonnet 4.5 (Audit Agent)
**Status:** Ready for iPad Testing

Good luck! 🚀 All implementation is complete. Now validate it works on iPad and submit to Apple.
