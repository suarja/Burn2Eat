# 🚀 Burn2Eat - Roadmap Interface Utilisateur

## 🎨 Design System & Thème

### Palette de Couleurs
- **Primary**: `#C76542` (Orange énergique) - Boutons principaux, focus
- **Accent**: `#FFBB50` (Jaune doré) - Confettis, gamification, highlights
- **Secondary**: `#41476E` (Bleu/violet) - Alternatives d'exercice
- **Background**: `#F4F2F1` (Gris clair) - Fond principal
- **Text**: `#191015` (Presque noir) - Texte principal
- **Success**: `#4CAF50` (Vert) - Validation, succès
- **Error**: `#C03403` (Rouge) - Erreurs, alertes

### Composants Ignite Disponibles
- `Button` : 3 presets (default, filled, reversed) + accessories
- `Card` : heading, content, footer + composants customs
- `TextField` : icons, labels, helpers, validation states  
- `Text` : presets typographiques (heading, subheading, bold, default)
- `Screen`, `Header`, `ListItem`, `AutoImage`, `Icon`
- `EmptyState` : pour états vides

### Spacing (theme/spacing.ts)
```typescript
xxxs: 2, xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64
```

---

## 📱 Écrans & Wireframes

### 1️⃣ OnboardingScreen (`WelcomeScreen.tsx`)
**Route**: `/welcome` (Initial)

```
+----------------------------------+
|           🔥 Burn2Eat 🍔         |
|   "Born to eat. Burn to eat."    |
|                                  |
|   ┌─────────────────────────────┐ |
|   │  Commencer 🚀 (filled)      │ |  
|   └─────────────────────────────┘ |
|                                  |
| ┌─────────────┐ ┌───────────────┐ |
| │ Mode invité │ │ Créer profil  │ |
| └─────────────┘ └───────────────┘ |
+----------------------------------+
```

**Composants utilisés:**
- `Screen` preset="fixed" + gradient background  
- `Text` preset="heading" (titre principal)
- `Text` preset="subheading" (slogan)
- `Button` preset="filled" (CTA principal)
- `Button` preset="default" × 2 (actions secondaires)

**Actions:**
- Commencer → `UserProfileScreen` 
- Mode invité → `HomeScreen` (profil par défaut)
- Créer profil → `UserProfileScreen`

---

### 2️⃣ UserProfileScreen (`ProfileSetupScreen.tsx`)
**Route**: `/profile/setup`

```
+----------------------------------+
| ← Retour    📋 Ton profil        |
|                                  |
| ┌─────────────────────────────────┐|
| │ Nom (optionnel)                 │|
| └─────────────────────────────────┘|
|                                  |
| Sexe: ┌──────┐┌──────┐┌─────────┐ |
|       │ ♂️ H  ││ ♀️ F ││ Autre   │ |
|       └──────┘└──────┘└─────────┘ |
|                                  |
| ┌──────────────┐ ┌───────────────┐ |
| │ Poids: 75 kg │ │ Taille: 175cm │ |
| │   [-] [+]    │ │   [-]  [+]    │ |  
| └──────────────┘ └───────────────┘ |
|                                  |
| Activité préférée:                |
| ┌─────────────────────────────────┐|
| │ 🏃‍♂️ Course (sélectionné)        │|
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🚶 Marche                       │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────────────────────────┐|
| │ Sauvegarder ✅ (filled)          │|
| └─────────────────────────────────┘|
+----------------------------------+
```

**Composants utilisés:**
- `Header` avec bouton retour
- `TextField` pour nom (optionnel)
- `Button` group pour sexe (3 boutons, 1 sélectionné = preset="filled") 
- **`NumberStepper`** × 2 (poids + taille) - **NOUVEAU COMPOSANT**
- `Card` sélectionnables pour activités (preset="default" / "reversed" si sélectionné)
- `Button` preset="filled" pour validation

**Validation:**
- Poids: 30-300 kg
- Taille: 100-250 cm  
- Au moins 1 activité sélectionnée

**Actions:**
- Retour → `WelcomeScreen`
- Sauvegarder → `HomeScreen` (profil sauvé en MMKV)

---

### 3️⃣ HomeScreen (`FoodSearchScreen.tsx`)
**Route**: `/home` (Main)

```
+----------------------------------+
| 🔍 ┌───────────────────────────┐ |
|    │ Rechercher un plat... 🔎  │ |
|    └───────────────────────────┘ |
|                                  |
| Populaires:                      |
| ┌─────────┐ ┌─────────┐ ┌────────┐|
| │🍕 Pizza │ │🍔 Burger│ │🍟Frites││
| │450 kcal │ │540 kcal │ │365kcal ││
| └─────────┘ └─────────┘ └────────┘|
| ┌─────────┐ ┌─────────┐ ┌────────┐|
| │🥤 Soda  │ │🍦 Glace │ │🥗Salade││
| │150 kcal │ │280 kcal │ │120kcal ││
| └─────────┘ └─────────┘ └────────┘|
|                                  |
| Résultats de recherche:          |
| ┌─────────────────────────────────┐|
| │ 🍎 Pomme - 95 kcal        →    │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────────────────────────┐|
| │ Scanner code-barre 📷           │|
| └─────────────────────────────────┘|
+----------------------------------+
```

**Composants utilisés:**
- `Screen` avec padding
- `TextField` avec `RightAccessory` (icône search)
- `Text` preset="bold" pour sections  
- **`FoodCard`** × 6 (grid 2×3) - **NOUVEAU COMPOSANT** basé sur `Card`
- `ListItem` pour résultats de recherche (apparaissent dynamiquement)
- `Button` preset="default" pour scanner (v2)

**États:**
- Initial: plats populaires visibles
- Recherche active: résultats dynamiques via `StaticDishRepository`
- Recherche vide: `EmptyState` component

**Actions:**
- Tap plat populaire → `ResultScreen` avec dish ID
- Tap résultat recherche → `ResultScreen` avec dish ID  
- Scanner → Modal caméra (v2)

---

### 4️⃣ ResultScreen (`EffortResultScreen.tsx`)
**Route**: `/result/:dishId`

```
+----------------------------------+
| ← Pizza Reine                    |
|                                  |
| ┌─────────────────────────────────┐|
| │ 🍕 [IMAGE]    Pizza Reine       │|
| │               450 kcal/portion  │|
| │               Glucides: 35g     │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────────────────────────┐|
| │ 🔥 EFFORT NÉCESSAIRE:           │| (accent gradient)
| │                                 │|
| │ ⏱️  45 min de course             │|
| │ 🚶  1h 20min de marche          │|  
| │ 💪  25 min de crossfit          │|
| │                                 │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────┐ ┌────────────────┐ |
| │ Changer ⚡   │ │ Partager 📲    │ |
| └─────────────┘ └────────────────┘ |
| ┌─────────────────────────────────┐|
| │ Ajouter à l'historique ➕        │|
| └─────────────────────────────────┘|
+----------------------------------+
```

**Composants utilisés:**
- `Header` avec titre du plat + retour
- `Card` pour info nutritionnelle avec `AutoImage`
- **`EffortDisplay`** - **NOUVEAU COMPOSANT** basé sur `Card` preset="reversed"
- `Text` avec emojis pour alternatives d'exercice
- `Button` group pour actions (2 boutons côte à côte)
- `Button` preset="filled" pour ajout historique
- **Animation confettis** au mount (React Native Reanimated)

**Logique:**
- Récupère dish via `CalculateEffortUseCase`
- Utilise profil utilisateur pour calcul MET
- Affiche 3 alternatives d'activités (primaire + 2 autres)

**Actions:**
- Retour → `HomeScreen`
- Changer sport → `ActivitySelectorScreen` (modal)
- Partager → Share API (v2)
- Ajouter historique → MMKV save + `HistoryScreen`

---

### 5️⃣ HistoryScreen (`JournalScreen.tsx`)  
**Route**: `/history`

```
+----------------------------------+
| 📊 Ton journal                   |
|                                  |
| Aujourd'hui - 25 août:           |
| ┌─────────────────────────────────┐|
| │ 🍔 Burger    →  30 min course   │|
| │ 14:20           (540 kcal)      │|
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🍦 Glace     →  20 min course   │|
| │ 16:45           (280 kcal)      │|
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🍕 Pizza     →  45 min course   │|
| │ 19:30           (450 kcal)      │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────────────────────────┐|
| │ 🏃‍♂️ TOTAL JOUR: 1h35 de course   │| (accent)
| │ 💪 Niveau: Warrior 🔥            │|
| │ ▓▓▓▓▓▓▓░░░ 70% vers Hero       │|
| └─────────────────────────────────┘|
|                                  |
| ┌─────────────────────────────────┐|
| │ Vider l'historique 🗑️           │|
| └─────────────────────────────────┘|
+----------------------------------+
```

**Composants utilisés:**
- `Header` avec icône journal
- `Text` preset="bold" pour date
- `Card` pour chaque entrée (dish + effort + timestamp)
- **`ProgressBar`** - **NOUVEAU COMPOSANT** pour gamification  
- `Card` preset="reversed" + accent pour totaux quotidiens
- `Button` preset="default" pour vider (avec confirmation)
- `EmptyState` si aucun historique

**Données:**
- MMKV storage des entries: `{dishId, effort, timestamp, calories}`
- Calcul totaux automatique
- Système de niveaux: Beginner → Warrior → Hero → Legend

**Actions:**
- Tap entrée → `ResultScreen` avec dish ID (re-calcul)
- Vider → Confirmation dialog → clear MMKV

---

### 6️⃣ ActivitySelectorScreen (`ActivitySelectorScreen.tsx`)
**Route**: Modal presentation

```
+----------------------------------+
| ← Choisir une activité           |
|                                  |
| ┌─────────────────────────────────┐|
| │ Rechercher activité...      🔎  │|
| └─────────────────────────────────┘|
|                                  |
| Intensité faible (1-3 MET):      |
| ┌─────────────────────────────────┐|
| │ 🚶 Marche lente - 2.5 MET       │|
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🧘 Yoga - 2.5 MET               │|
| └─────────────────────────────────┘|
|                                  |
| Intensité modérée (4-6 MET):     |
| ┌─────────────────────────────────┐|
| │ 🚶 Marche rapide - 3.5 MET ✓   │| (sélectionné)
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🚴 Vélo - 6.8 MET               │|
| └─────────────────────────────────┘|
|                                  |
| Intensité élevée (7+ MET):       |
| ┌─────────────────────────────────┐|
| │ 🏃‍♂️ Course - 7.0 MET             │|
| └─────────────────────────────────┘|
| ┌─────────────────────────────────┐|
| │ 🏋️ Crossfit - 10.0 MET          │|
| └─────────────────────────────────┘|
+----------------------------------+
```

**Composants utilisés:**
- `Header` modal avec close
- `TextField` pour recherche/filtre
- `Text` preset="bold" pour sections intensité
- `Card` sélectionnable pour chaque activité (preset="reversed" si sélectionné)
- `Text` avec MET values

**Logique:**
- Liste via `StaticActivityCatalog`
- Filtre par nom d'activité
- Groupement par intensité MET
- Sélection unique

**Actions:**  
- Close → Retour `ResultScreen` avec nouvelle activité
- Tap activité → Sélection + auto-close + re-calcul effort

---

## 🏗️ Architecture Technique

### Navigation Stack
```typescript
RootStack:
  ├── WelcomeScreen (initial)
  ├── ProfileSetupScreen  
  ├── MainTabs:
  │   ├── HomeScreen (default)
  │   ├── HistoryScreen
  │   └── ProfileScreen (v2)
  └── Modals:
      ├── ResultScreen  
      └── ActivitySelectorScreen
```

### Nouveaux Composants à Créer

#### 1. NumberStepper (`app/components/NumberStepper.tsx`)
```typescript
interface NumberStepperProps {
  value: number
  min: number
  max: number  
  step?: number
  suffix?: string // "kg", "cm"
  onChange: (value: number) => void
  disabled?: boolean
}
```
- Boutons +/- avec `Button` component  
- `TextField` central (keyboardType="numeric")
- Validation automatique min/max
- Style cohérent avec thème

#### 2. FoodCard (`app/components/FoodCard.tsx`)
```typescript
interface FoodCardProps {
  food: { name: string, calories: number, image?: string }
  onPress: () => void
}
```
- Basé sur `Card` component
- `AutoImage` + fallback emoji
- Calories prominentes
- Pressable avec feedback

#### 3. EffortDisplay (`app/components/EffortDisplay.tsx`)  
```typescript
interface EffortDisplayProps {
  efforts: EffortItem[]
  primaryActivity: string
}
```
- `Card` avec gradient accent
- Liste des alternatives avec icônes
- Animations d'apparition
- Typography emphasis sur primaire

#### 4. WeightHeightSelector (`app/components/WeightHeightSelector.tsx`)
```typescript
interface WeightHeightSelectorProps {
  weight: number
  height: number
  onWeightChange: (kg: number) => void
  onHeightChange: (cm: number) => void
}
```  
- 2× `NumberStepper` côte à côte
- Validation métier intégrée
- Presets par sexe/âge (optionnel)

#### 5. ProgressBar (`app/components/ProgressBar.tsx`)
```typescript
interface ProgressBarProps {
  progress: number // 0-1
  label?: string
  color?: string
}
```
- Barre de progression animée
- Gradient fill avec accent color
- Text label intégré

#### 6. Confetti (`app/components/Confetti.tsx`)
- React Native Reanimated animations
- Déclenchement automatique  
- Particules colorées (accent colors)
- Duration configurable

### Icônes à Ajouter (`app/components/Icon.tsx`)
```typescript
export const iconRegistry = {
  // ... existing icons
  plus: require("@assets/icons/plus.png"),
  minus: require("@assets/icons/minus.png"), 
  weight: require("@assets/icons/weight.png"),
  height: require("@assets/icons/height.png"),
}
```

---

## 🎯 Stratégie d'Implémentation

### Phase 1: Foundation (Sprint 1)
**Objectif**: Navigation + écrans de base fonctionnels

1. ✅ Setup navigation stack  
2. ✅ `WelcomeScreen` - Layout + boutons
3. ✅ `HomeScreen` - Search + plats populaires statiques
4. ✅ `ResultScreen` - Display basique sans animations
5. ✅ `NumberStepper` component
6. ✅ Icons plus/minus ajoutés

**Tests**: Navigation flow complet fonctionne

### Phase 2: Features (Sprint 2)  
**Objectif**: Logique métier + persistence

1. ✅ `ProfileSetupScreen` + `WeightHeightSelector`
2. ✅ Integration use cases domain (CalculateEffortUseCase)
3. ✅ MMKV persistence profil + historique  
4. ✅ `HistoryScreen` + `ProgressBar` 
5. ✅ `ActivitySelectorScreen` modal
6. ✅ Search fonctionnelle HomeScreen

**Tests**: Workflow complet profil → recherche → résultat → historique

### Phase 3: Polish & UX (Sprint 3)
**Objectif**: Animations + finitions

1. ✅ `Confetti` component + animations ResultScreen
2. ✅ Gradients + thème avancé
3. ✅ `FoodCard` + `EffortDisplay` composants
4. ✅ Loading states + error handling
5. ✅ Micro-interactions + feedback tactile
6. ✅ Accessibility + RTL support

**Tests**: Performance + UX testing sur devices

### Phase 4: Extensions (v2)
1. 🔮 Scanner code-barre (Camera API)
2. 🔮 Partage social (Share API)
3. 🔮 Push notifications rappels  
4. 🔮 Synchronisation cloud (v2)
5. 🔮 Système d'achievements avancé

---

## 📊 Métriques & KPIs

### Activation (MVP)
- % utilisateurs complétant onboarding → profil → premier calcul (**>70%**)
- Temps moyen pour premier calcul (**<2 minutes**)
- % utilisation mode invité vs profil complet

### Engagement  
- Rétention J1 (**>20%**)
- Nombre moyen de calculs par session
- % utilisateurs revenant à l'historique

### Performance Technique
- Time to Interactive (TTI) **<3s**
- Bundle size **<10MB**  
- 60fps animations
- Memory usage **<150MB**

---

## 🚀 Ready to Code!

Cette roadmap utilise **100%** des composants Ignite existants, respecte l'architecture DDD établie, et fournit un plan détaillé phase par phase pour une implémentation efficace.

**Next Steps**: Implémenter Phase 1 en commençant par `NumberStepper` puis navigation setup! 🎯