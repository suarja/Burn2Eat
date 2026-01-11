# TikTok Link Feature - Implementation Spec

**Date:** 2026-01-11
**Status:** 📝 Specification Ready - Implementation Pending
**Priority:** High (v0 MVP)
**Estimated Time:** 1 hour

---

## 📋 Overview

Add social media links to TikTok account in the app to create an ecosystem and drive cross-traffic between app users and TikTok followers.

**Business Goal:**
- Build TikTok audience from app users
- Create content ecosystem (app + social media)
- Future monetization through TikTok (courses, coaching, affiliate)

**Strategy:**
- App users → TikTok followers → Engagement → Future revenue
- No immediate monetization but builds audience
- Simple, non-intrusive implementation

---

## 🎯 Requirements

### Functional Requirements

1. **Primary Placement - ProfileSetupScreen**
   - New Card section at bottom of screen (after all existing sections)
   - Prominent but not intrusive
   - Clear call-to-action
   - Opens TikTok profile in app or browser

2. **Secondary Placement - ResultScreen**
   - Small, discrete text link below effort breakdown
   - Non-intrusive (shouldn't distract from main content)
   - Same TikTok URL as primary placement

3. **Link Behavior**
   - Opens TikTok app if installed (iOS/Android)
   - Fallback to browser if TikTok app not installed
   - No navigation away from current screen context (user can come back)

### Non-Functional Requirements

- Must work on iOS and Android
- Must comply with App Store guidelines (external links are allowed)
- No tracking/analytics for MVP (can add later)
- Minimal performance impact
- Accessible (readable text, tappable target ≥44x44pt)

---

## 🎨 Design Specifications

### 1. ProfileSetupScreen - Primary Placement

**Location:** Bottom of screen, after all profile configuration sections

**Visual Design:**
```
┌────────────────────────────────────────┐
│  🌟 Rejoins la communauté              │
│                                        │
│  Suis-nous sur TikTok pour du contenu │
│  motivation, sport et nutrition        │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   📱 Voir notre TikTok           │ │
│  └──────────────────────────────────┘ │
└────────────────────────────────────────┘
```

**Styling:**
- Component: `<Card>` (existing component)
- Title: Bold, primary color, size: lg
- Description: Regular weight, dim color, size: sm
- Button: Primary style (existing Button component)
- Spacing: Apply `useResponsiveSpacing()` multiplier
- Background: Card background (theme-aware)

**Behavior:**
- Tapping button calls `Linking.openURL('https://www.tiktok.com/@username')`
- No loading state (instant open)
- User can return to app via standard system navigation

---

### 2. ResultScreen - Secondary Placement

**Location:** Below effort breakdown, before any bottom padding/spacing

**Visual Design:**
```
[Effort breakdown content above]

🎥 Besoin de motivation ? Suis-nous sur TikTok
```

**Styling:**
- Component: `<Text>` with `onPress`
- Size: xs (small)
- Color: textDim (gray, non-intrusive)
- Text align: center
- No underline (looks cleaner)
- Emoji at start for visual interest

**Behavior:**
- Tapping text calls same `Linking.openURL()`
- Should feel like a subtle footer link

---

## 💻 Implementation Guide

### Step 1: Define TikTok URL Constant

**File:** Create or update `app/config/social.ts`

```typescript
export const SOCIAL_LINKS = {
  tiktok: 'https://www.tiktok.com/@your_account_name', // Replace with actual account
} as const
```

**Note:** Use HTTPS URL format, not app deep link (better compatibility)

---

### Step 2: Create Helper Function (Optional)

**File:** `app/utils/linking.ts` (create if doesn't exist)

```typescript
import { Linking, Alert } from 'react-native'

export async function openExternalLink(url: string, errorMessage?: string) {
  try {
    const canOpen = await Linking.canOpenURL(url)
    if (canOpen) {
      await Linking.openURL(url)
    } else {
      Alert.alert('Erreur', errorMessage || 'Impossible d\'ouvrir le lien')
    }
  } catch (error) {
    console.error('Error opening link:', error)
    Alert.alert('Erreur', 'Une erreur est survenue')
  }
}
```

**Rationale:** Centralize error handling, reusable for future external links

---

### Step 3: Update ProfileSetupScreen

**File:** `app/screens/ProfileSetupScreen.tsx`

**Location:** Add new Card section after the "Save" button

**Implementation:**

1. Import requirements:
```typescript
import { Linking } from 'react-native'
import { SOCIAL_LINKS } from '@/config/social'
```

2. Add handler function:
```typescript
const handleOpenTikTok = async () => {
  try {
    await Linking.openURL(SOCIAL_LINKS.tiktok)
  } catch (error) {
    console.error('Error opening TikTok:', error)
  }
}
```

3. Add Card component before closing `</Screen>`:
```tsx
{/* TikTok Community Card */}
<Card
  style={themed($communityCard)}
  ContentComponent={
    <View style={themed($communityCardContent)}>
      <Text
        preset="subheading"
        style={themed($communityTitle)}
        text="🌟 Rejoins la communauté"
      />
      <Text
        size="sm"
        style={themed($communityDescription)}
        text="Suis-nous sur TikTok pour du contenu motivation, sport et nutrition"
      />
      <Button
        text="📱 Voir notre TikTok"
        onPress={handleOpenTikTok}
        style={themed($tiktokButton)}
      />
    </View>
  }
/>
```

4. Add styles:
```typescript
const $communityCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  marginBottom: spacing.xl,
})

const $communityCardContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  alignItems: 'center',
})

const $communityTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  textAlign: 'center',
  marginBottom: spacing.xs,
})

const $communityDescription: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: 'center',
  marginBottom: spacing.md,
})

const $tiktokButton: ThemedStyle<ViewStyle> = () => ({
  minWidth: 200,
})
```

---

### Step 4: Update ResultScreen

**File:** `app/screens/ResultScreen.tsx`

**Location:** After effort breakdown, before bottom spacing

**Implementation:**

1. Import requirements (same as ProfileSetupScreen)

2. Add handler function (same as ProfileSetupScreen)

3. Add Text component with link:
```tsx
{/* Discrete TikTok link */}
<Text
  size="xs"
  style={themed($tiktokLink)}
  onPress={handleOpenTikTok}
>
  🎥 Besoin de motivation ? Suis-nous sur TikTok
</Text>
```

4. Add style:
```typescript
const $tiktokLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: 'center',
  marginTop: spacing.lg,
  marginBottom: spacing.sm,
})
```

---

## ✅ Testing Checklist

### Manual Testing

**iOS:**
- [ ] ProfileSetupScreen: Tap button, TikTok app opens (if installed)
- [ ] ProfileSetupScreen: Tap button, browser opens (if TikTok not installed)
- [ ] ResultScreen: Tap text link, same behavior as ProfileSetupScreen
- [ ] No console errors
- [ ] Button is tappable (44x44pt minimum)
- [ ] Text is readable on both light and dark themes

**Android:**
- [ ] Same tests as iOS
- [ ] Verify correct app/browser fallback behavior

### Visual Testing

- [ ] ProfileSetupScreen: Card properly styled with spacing
- [ ] ProfileSetupScreen: Emoji renders correctly
- [ ] ResultScreen: Link is discrete and doesn't distract from main content
- [ ] Both placements: Responsive spacing on iPad (use multiplier)
- [ ] Both themes: Text readable in light and dark mode

### Edge Cases

- [ ] No internet connection: Alert shown or handled gracefully
- [ ] Invalid TikTok URL: Error handled (shouldn't happen with const URL)
- [ ] Rapid taps: No crash or duplicate opens

---

## 🚀 Deployment Checklist

Before merging:
- [ ] Update `SOCIAL_LINKS.tiktok` with actual TikTok account URL
- [ ] Test on iOS device (not just simulator)
- [ ] Test on Android device (not just emulator)
- [ ] Verify no TypeScript errors: `yarn compile`
- [ ] Verify no ESLint errors: `yarn lint:check`
- [ ] Take screenshots for documentation
- [ ] Update HANDOFF.md with completion status

---

## 📱 App Store Compliance

### Guidelines Check

✅ **Guideline 2.3.10 - Accurate Metadata**
- Links are clearly labeled as external (TikTok)
- No misleading text

✅ **Guideline 3.1.1 - In-App Purchase**
- Not bypassing IAP (no paid content/features)
- Social media link is allowed

✅ **Guideline 4.0 - Design**
- Links are well-integrated into UI
- Not intrusive or confusing

### Rejection Risks

❌ **High Risk:** None identified

⚠️ **Medium Risk:** If text is misleading (e.g., "Unlock premium features")
- **Mitigation:** Use clear, honest text about TikTok content

✅ **Low Risk:** Simple social media link, well-documented in guidelines

---

## 🔮 Future Enhancements (Out of Scope for v0)

### Analytics (v0.1+)
- Track link clicks (Firebase Analytics or similar)
- A/B test different copy/placements
- Measure conversion rate app → TikTok followers

### Deep Linking (v0.2+)
- Use TikTok deep links instead of web URLs
- Better UX (opens directly in app)
- Requires TikTok app scheme: `tiktok://user?username=your_account`

### Dynamic Links (v0.3+)
- Store TikTok URL in remote config
- Change URL without app update
- Add other social platforms (Instagram, YouTube)

### Referral Tracking (v1.0+)
- Add UTM parameters to track source
- Example: `https://www.tiktok.com/@account?utm_source=burn2eat&utm_medium=app`

---

## 📚 References

### React Native Linking API
- [Official Docs](https://reactnative.dev/docs/linking)
- Opening URLs: `Linking.openURL(url)`
- Check if URL can open: `Linking.canOpenURL(url)`

### TikTok URL Formats
- Web profile: `https://www.tiktok.com/@username`
- Deep link (app): `tiktok://user?username=your_account` (not recommended for v0)

### App Store Guidelines
- [3.1.1 In-App Purchase](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase)
- [4.0 Design](https://developer.apple.com/app-store/review/guidelines/#design)

---

## 🎉 Summary

**Complexity:** Low
**Risk:** Low
**Value:** High (builds audience for future monetization)
**Time:** ~1 hour

**Key Points:**
- Two simple placements (ProfileSetupScreen + ResultScreen)
- Uses standard React Native Linking API
- No external dependencies needed
- App Store compliant
- Easy to test and deploy

**Next Steps:**
1. Update `SOCIAL_LINKS.tiktok` with actual account URL
2. Implement ProfileSetupScreen changes
3. Implement ResultScreen changes
4. Test on iOS and Android devices
5. Update HANDOFF.md when complete

---

**Last Updated:** 2026-01-11
**Author:** Claude Sonnet 4.5
**Status:** Ready for Implementation
