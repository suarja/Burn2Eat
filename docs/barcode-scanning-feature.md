# 📷 Barcode Scanning Feature Specification

**Version**: 2.0 (Post-MVP)  
**Status**: Planning  
**Target**: Q2 2025  

---

## 🎯 Business Case & User Value

### Problem Statement
While the MVP focuses on manual food search via OpenFoodFacts text search, many users prefer the instant convenience of barcode scanning for packaged foods. This feature addresses:

- **Speed**: Instant product identification vs typing/searching
- **Accuracy**: Eliminates typos and selection errors
- **User Experience**: Modern mobile app expectation
- **Data Quality**: Direct barcode → product mapping ensures precision

### Success Metrics
- **Adoption**: >40% of food lookups via barcode within 30 days
- **Accuracy**: >95% successful barcode → calorie conversions  
- **Speed**: <3 seconds from scan to effort calculation
- **Retention**: +15% weekly retention vs manual search only

---

## 👤 User Stories & Acceptance Criteria

### Epic: Barcode Food Scanning

#### Story 1: Scan Packaged Food
**As a** user wanting quick calorie lookup  
**I want to** scan a barcode on packaged food  
**So that** I can instantly see the effort required to burn it

**Acceptance Criteria:**
- ✅ Camera opens with barcode detection overlay
- ✅ Supports EAN13, EAN8, UPC_A barcode formats
- ✅ Provides visual feedback when barcode is detected
- ✅ Falls back to manual search if product not found
- ✅ Maintains same effort calculation flow as manual search

#### Story 2: Handle Scan Failures Gracefully
**As a** user with a unrecognized barcode  
**I want to** see helpful error messages and alternatives  
**So that** I don't get stuck in a dead-end experience

**Acceptance Criteria:**
- ✅ Clear error message for unreadable barcodes
- ✅ "Product not found" with manual search suggestion
- ✅ Option to contribute missing product data
- ✅ Retry scanning without restarting flow

#### Story 3: Barcode History & Favorites
**As a** frequent user of packaged foods  
**I want to** access recently scanned items quickly  
**So that** I can avoid re-scanning common items

**Acceptance Criteria:**
- ✅ Recently scanned barcodes appear in search suggestions
- ✅ Barcode data cached locally for offline access
- ✅ History integrates with existing food journal

---

## 🏗️ Technical Architecture

### Current State Analysis
The MVP already has:
- ✅ Complete DDD architecture with `Dish`, `NutritionalInfo` domains
- ✅ `StaticDishRepository` for food data access
- ✅ `CalculateEffortUseCase` for calorie → effort conversion
- ✅ React Native app with Expo setup

### Integration Points

#### 1. Domain Layer Extensions
```typescript
// /src/domain/nutrition/BarcodeId.ts
export class BarcodeId {
  private constructor(private readonly value: string) {}
  
  static from(barcode: string): BarcodeId // Validate EAN/UPC format
  toString(): string
  equals(other: BarcodeId): boolean
}

// /src/domain/nutrition/DishRepository.ts (extend existing)
export interface DishRepository {
  // ... existing methods
  findByBarcode(barcodeId: BarcodeId): Promise<Dish | null>
}

// /src/domain/scanning/BarcodeScanner.ts
export interface BarcodeScanner {
  scan(): Promise<BarcodeScanResult>
  requestPermissions(): Promise<boolean>
  isAvailable(): boolean
}

export interface BarcodeScanResult {
  readonly barcodeId: BarcodeId
  readonly format: BarcodeFormat
  readonly scanTime: Date
}
```

#### 2. Application Layer
```typescript
// /src/application/usecases/ScanFoodUseCase.ts
export class ScanFoodUseCase {
  constructor(
    private readonly barcodeScanner: BarcodeScanner,
    private readonly dishRepository: DishRepository
  ) {}
  
  async execute(): Promise<ScanFoodOutput> {
    // 1. Request camera permissions
    // 2. Scan barcode
    // 3. Lookup product via repository
    // 4. Return dish data or fallback to manual search
  }
}
```

#### 3. Infrastructure Layer
```typescript
// /src/infrastructure/adapters/ExpoBarcodeScanner.ts
export class ExpoBarcodeScanner implements BarcodeScanner {
  async scan(): Promise<BarcodeScanResult> {
    // expo-camera integration
  }
}

// /src/infrastructure/adapters/OpenFoodFactsRepository.ts
export class OpenFoodFactsRepository implements DishRepository {
  private readonly api: Api
  
  async findByBarcode(barcodeId: BarcodeId): Promise<Dish | null> {
    const response = await this.api.apisauce.get(
      `product/${barcodeId.toString()}`
    )
    return this.transformToDish(response.data)
  }
  
  private transformToDish(productData: any): Dish {
    // Transform OpenFoodFacts API response to domain Dish
  }
}
```

### API Integration Details

#### OpenFoodFacts API
- **Endpoint**: `https://world.openfoodfacts.net/api/v2/product/{barcode}`
- **Supported Formats**: EAN13, EAN8, UPC_A (same as expo-camera)
- **Rate Limits**: None specified (respectful usage)
- **Authentication**: Not required for read-only access

#### Sample API Response Mapping
```json
// OpenFoodFacts API Response
{
  "product": {
    "product_name": "Nutella",
    "nutriments": {
      "energy-kcal_100g": 539,
      "energy-kcal_per_portion": 80
    },
    "serving_size": "15g"
  }
}

// Domain Transformation
Dish.create({
  dishId: DishId.from(`off-${barcode}`),
  name: product_name,
  nutrition: NutritionalInfo.perServing(
    product.nutriments["energy-kcal_per_portion"] as Kilocalories
  )
})
```

---

## 📱 User Interface Design

### New Screen: BarcodeScannerScreen
```
+----------------------------------+
| ← Scan Code-Barre                |
|                                  |
| ┌────────────────────────────────┐ |
| │                                │ |
| │        [CAMERA PREVIEW]        │ |
| │                                │ |
| │     ┌─────────────────────┐     │ |
| │     │                     │     │ |
| │     │  [SCAN OVERLAY]     │     │ |
| │     │                     │     │ |
| │     └─────────────────────┘     │ |
| │                                │ |
| └────────────────────────────────┘ |
|                                  |
| "Positionner le code-barre       |
|  dans le cadre"                  |
|                                  |
| ┌─────────────────────────────────┐ |
| │ Recherche manuelle 🔍           │ |
| └─────────────────────────────────┘ |
+----------------------------------+
```

### Component: BarcodeCamera
```typescript
// /app/components/BarcodeCamera.tsx
interface BarcodeCameraProps {
  onBarcodeScanned: (barcode: string) => void
  onError: (error: BarcodeCameraError) => void
  onClose: () => void
}

// Features:
// - Real-time barcode detection
// - Visual scanning overlay
// - Haptic feedback on successful scan
// - Auto-focus and torch controls
// - Permission handling
```

### Integration with Existing HomeScreen
Add scanner button to food search:
```typescript
// Existing HomeScreen gets new "Scan" button
<Button
  text="Scanner 📷"
  preset="default"
  onPress={() => navigation.navigate('BarcodeScanner')}
/>
```

---

## 🔀 Approche d'Intégration Incrémentale

### Cohabitation des Architectures
L'implémentation du scan de barcode s'intègre harmonieusement dans l'architecture existante:

**Architecture MVP actuelle:**
- `FoodDataService` → données statiques locales
- `HomeScreen` → recherche manuelle par nom
- Navigation: `HomeScreen` → `ResultScreen`

**Nouvelle architecture Barcode:**
- `OpenFoodFactsService` → API externe temps réel
- `BarcodeScreen` → scan caméra + sélection produit
- Navigation: `BarcodeScreen` → `ProductSelectionScreen` → `ResultScreen`

**Point de convergence:**
Les deux flux se rejoignent au `ResultScreen` qui reçoit un objet `Dish` standardisé, permettant la cohabitation transparente des deux systèmes.

### Stratégie d'Implémentation
1. **Extension non-breaking**: Ajouter à `DishRepository` sans modifier l'existant
2. **Services parallèles**: `OpenFoodFactsService` coexiste avec `FoodDataService`
3. **Réutilisation**: `ResultScreen` et logique de calcul d'effort inchangés
4. **Progressive Enhancement**: Nouvelle navigation optionnelle via onglet "Scan"

### Flux Utilisateur Unifié

```
┌─────────────────┐    ┌──────────────────┐
│   HomeScreen    │    │  BarcodeScreen   │
│   (recherche    │    │   (scan caméra)  │
│    manuelle)    │    │                  │
└─────────┬───────┘    └────────┬─────────┘
          │                     │
          │                     ▼
          │            ┌─────────────────┐
          │            │ ProductSelection│
          │            │     Screen      │
          │            └────────┬────────┘
          │                     │
          ▼                     ▼
┌─────────────────────────────────────────┐
│             ResultScreen                │
│      (calcul d'effort unifié)          │
│     reçoit un objet Dish                │
└─────────────────────────────────────────┘
```

---

## 🗺️ Implementation Roadmap

### Phase 1: Architecture Foundation (Sprint 1) 
**Duration**: 1 week  
**Status**: 🔄 En cours
**Goal**: Intégrer le scan de barcode dans l'architecture DDD existante

**Analyse de l'existant:**
- ✅ `DishRepository` interface définie dans `/src/domain/nutrition/`
- ✅ `BarcodeScreen` basique existant avec expo-camera configuré
- ✅ Navigation principale déjà configurée avec onglet "Scan"
- ✅ `ResultScreen` peut déjà recevoir un `Dish` pour calcul d'effort
- ✅ Services existants dans `app/services/` comme modèles

**Tasks Phase 1:**
1. 🔄 Étendre `DishRepository` avec méthode `findByBarcode(barcode: string)`
2. ⏳ Créer `OpenFoodFactsService` dans `app/services/OpenFoodFactsService.ts`
3. ⏳ Créer `ScanBarcodeUseCase` dans couche application
4. ⏳ Créer types pour transformation OpenFoodFacts → Dish
5. ⏳ Tests unitaires pour nouveaux composants domain

**Deliverable**: Architecture domaine étendue pour barcode

### Phase 2: Implémentation Scanning (Sprint 2)
**Duration**: 1.5 weeks  
**Status**: ⏳ À venir
**Goal**: Interface utilisateur complète pour scan → sélection → calcul

**Tasks Phase 2:**
1. ⏳ Améliorer `BarcodeScreen` avec détection barcode et overlay
2. ⏳ Créer `ProductSelectionScreen` pour choix produits OpenFoodFacts
3. ⏳ Intégrer flux: scan → API → sélection → transformation Dish → ResultScreen
4. ⏳ Gestion d'erreurs (produit non trouvé, problème réseau)
5. ⏳ Fallback vers recherche manuelle

**Deliverable**: Flux complet de scan fonctionnel

### Phase 3: Refactoring & Polish (Sprint 3)
**Duration**: 1 week  
**Status**: ⏳ À venir
**Goal**: Code propre et experience utilisateur optimisée

**Tasks Phase 3:**
1. ⏳ Refactorer `ResultScreen` avec custom hook `useEffortCalculation`
2. ⏳ Optimisation performances (cache, lifecycle caméra)
3. ⏳ Amélioration UX (feedback visuel, animations)
4. ⏳ Tests d'intégration end-to-end
5. ⏳ Documentation technique mise à jour

**Deliverable**: Feature production-ready avec code maintenable

---

## 🔧 Technical Implementation Details

### Camera Setup & Permissions
```typescript
// app.json configuration
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Burn2Eat to scan food barcodes"
        }
      ]
    ]
  }
}

// iOS Info.plist (auto-generated by Expo)
<key>NSCameraUsageDescription</key>
<string>Allow Burn2Eat to scan food barcodes</string>

// Permission handling
const { status } = await Camera.requestCameraPermissionsAsync()
if (status !== 'granted') {
  // Show settings redirect dialog
}
```

### Barcode Format Support
**Supported by both expo-camera AND OpenFoodFacts:**
- ✅ **EAN13** (European Article Number, 13 digits)  
- ✅ **EAN8** (European Article Number, 8 digits)
- ✅ **UPC_A** (Universal Product Code, 12 digits)
- ⚠️ **Code128** (Variable length - needs validation)

**Configuration:**
```typescript
<CameraView
  barcodeScannerSettings={{
    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'code128']
  }}
  onBarcodeScanned={handleBarcodeScanned}
/>
```

### Error Handling Strategy
```typescript
enum ScanningError {
  CAMERA_NOT_AVAILABLE = 'camera_not_available',
  PERMISSION_DENIED = 'permission_denied',
  PRODUCT_NOT_FOUND = 'product_not_found',
  NETWORK_ERROR = 'network_error',
  INVALID_BARCODE = 'invalid_barcode'
}

// Error Recovery Actions
const errorActions = {
  [ScanningError.PERMISSION_DENIED]: 'Open settings to enable camera',
  [ScanningError.PRODUCT_NOT_FOUND]: 'Try manual search',
  [ScanningError.NETWORK_ERROR]: 'Check connection and retry',
  [ScanningError.INVALID_BARCODE]: 'Position barcode in the frame'
}
```

### Performance Considerations
- **Camera Lifecycle**: Only activate when screen is focused
- **Scanning Throttle**: Limit to 1 scan per 2 seconds to prevent duplicate triggers
- **API Caching**: Cache successful barcode lookups locally (MMKV)
- **Bundle Size**: expo-camera adds ~2MB to app bundle
- **Battery Usage**: Camera usage optimized with auto-sleep

### Offline Support
```typescript
// Local barcode cache structure
interface CachedBarcodeData {
  barcodeId: string
  productName: string
  calories: number
  cachedAt: Date
  lastUsed: Date
}

// Fallback strategy:
// 1. Check local cache first
// 2. If miss, attempt API call
// 3. If offline, show "Try again when online"
// 4. Cache successful API responses
```

---

## 🧪 Testing Strategy

### Unit Tests
- ✅ `BarcodeId` value object validation
- ✅ `ExpoBarcodeScanner` adapter mocking
- ✅ `OpenFoodFactsRepository` API transformations
- ✅ `ScanFoodUseCase` with various scenarios

### Integration Tests  
- ✅ Camera permissions flow
- ✅ API integration with real barcodes
- ✅ Domain service integration
- ✅ Cache invalidation logic

### E2E Tests (Detox/Maestro)
- ✅ Scan → Calculate → History workflow
- ✅ Camera permission denied handling
- ✅ Product not found graceful fallback
- ✅ Network error recovery

### Device Testing
**Priority Products for Testing:**
- Common food items (Coca-Cola, Nutella, etc.)
- Various barcode formats (EAN13, UPC_A)
- International products (multi-language)
- Products with missing/incomplete OpenFoodFacts data

---

## ⚠️ Risk Assessment & Mitigation

### High Risk
**1. OpenFoodFacts Data Quality**
- **Risk**: Missing or inaccurate product data
- **Mitigation**: Fallback to manual search, user contribution prompts
- **Acceptance**: 85% successful lookups target

**2. Camera Performance on Older Devices**  
- **Risk**: Poor camera performance, slow scanning
- **Mitigation**: Graceful degradation, manual entry option
- **Testing**: Validate on iPhone 8+ and Android 8+ devices

### Medium Risk
**3. Barcode Format Edge Cases**
- **Risk**: Unsupported or malformed barcodes
- **Mitigation**: Format validation, clear error messages
- **Monitoring**: Track unsupported format frequency

**4. Network Dependency**
- **Risk**: Poor connectivity affects user experience
- **Mitigation**: Aggressive caching, offline indicators
- **Target**: <3s response time 95th percentile

### Low Risk  
**5. App Store Review (Camera Permissions)**
- **Risk**: Additional scrutiny for camera usage
- **Mitigation**: Clear permission descriptions, legitimate use case
- **Compliance**: Follow platform guidelines

---

## 📊 Success Metrics & Analytics

### Adoption Metrics
- **Scan Attempt Rate**: % of users who try barcode scanning
- **Scan Success Rate**: % of scans that result in product identification  
- **Feature Retention**: % returning users who use scanning >3 times/week

### Performance Metrics
- **Time to Scan**: Average duration from camera open → product identified
- **API Response Time**: Average OpenFoodFacts API response latency
- **Error Rate**: % of scans resulting in errors by category

### Business Impact
- **Session Length**: Compare scan users vs manual search users
- **Calculation Volume**: Increase in total effort calculations per user
- **User Satisfaction**: In-app rating/feedback on scanning experience

---

## 🔄 Future Enhancements (v3+)

### Advanced Features
- **Multi-Barcode Scanning**: Scan multiple items in sequence
- **OCR Text Recognition**: Extract nutrition info from text when no barcode
- **Smart Portion Detection**: Use camera to estimate serving sizes
- **AR Overlay**: Floating calorie/effort display over products

### Data Enhancements
- **User Contributions**: Allow users to add missing products
- **Local Database**: Preload common products for offline usage  
- **Regional Customization**: Localized product databases
- **Custom Foods**: Barcode scanning for homemade/restaurant items

### Social Features
- **Scan Challenges**: "Scan 10 healthy snacks this week"
- **Product Reviews**: User ratings on scanned foods
- **Shared Shopping Lists**: Collaborative barcode-based lists

---

## 🎉 Conclusion

The barcode scanning feature represents a natural evolution of Burn2Eat from MVP to full-featured app. By leveraging:

- ✅ **Proven Technology Stack**: expo-camera + OpenFoodFacts
- ✅ **Solid Architecture Foundation**: Existing DDD structure
- ✅ **Clear User Value**: Speed and accuracy improvements
- ✅ **Measured Implementation**: Phased rollout with validation

This feature can significantly enhance user experience while maintaining code quality and architectural principles established in the MVP.

**Next Steps**: Begin Phase 1 technical proof of concept with expo-camera installation and basic barcode detection demo.

---

*Document Version: 1.0*  
*Last Updated: August 26, 2025*  
*Author: Claude Code Assistant*