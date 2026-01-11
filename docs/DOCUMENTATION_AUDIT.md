# 📚 Documentation Audit - Burn2Eat

**Date:** 2026-01-11
**Audité par:** Claude Sonnet 4.5
**Objectif:** Identifier les fichiers de documentation à jour, obsolètes, ou à archiver
**Dernière modification:** Ajout de tiktok-link-feature.md

---

## 🎯 État de la Documentation

### ✅ Fichiers À JOUR et Actifs

#### 1. **prd.md** ✅ CRITIQUE - À JOUR
**Statut:** Mis à jour aujourd'hui (2026-01-10)
**Contenu:**
- Vision et objectifs MVP
- État actuel de l'implémentation
- Historique local marqué comme "À IMPLÉMENTER"
- Apple HealthKit documenté pour v2 (post-MVP)
- Roadmap mise à jour avec Sprint 3 en cours

**Action:** ✅ Aucune - Document principal du projet

---

#### 2. **CLAUDE.md** (racine du projet) ✅ CRITIQUE - À JOUR
**Statut:** À jour avec priorités actuelles
**Contenu:**
- Contexte App Store rejection
- Commandes de développement
- Architecture DDD
- Guidelines de développement

**Action:** ✅ Aucune - Document de référence pour agents Claude

---

#### 3. **system-prompt-extraction/HANDOFF.md** ✅ CRITIQUE - À JOUR
**Statut:** Mis à jour aujourd'hui (2026-01-11)
**Contenu:**
- État complet de l'implémentation
- Feature TikTok link (nouvelle)
- Checklist de tests iPad
- Guide de troubleshooting
- Prochaines étapes pour publication App Store

**Action:** ✅ Aucune - Document de handoff entre agents

---

#### 4. **docs/publish/issues/issues-2.md** ✅ IMPORTANT - RÉFÉRENCE
**Statut:** Document historique de la rejection Apple
**Contenu:**
- Détails du rejet App Store
- Feedback d'Apple (Guideline 2.1 et 4.0)

**Action:** ✅ Garder - Document de référence historique

---

### 📋 Fichiers de RÉFÉRENCE Architecturale (Garder)

#### 5. **docs/architecture.md** ✅ RÉFÉRENCE - VALIDE
**Statut:** Reflète l'architecture DDD actuelle
**Contenu:**
- Structure du projet DDD
- Diagrammes des couches (Domain, Application, Infrastructure)
- Principes architecturaux

**État:** Architecture toujours valide
**Action:** ✅ Garder - Bonne référence pour comprendre le projet

---

#### 6. **docs/DDD-REFACTORING-SUMMARY.md** ✅ RÉFÉRENCE - HISTORIQUE
**Statut:** Document historique du refactoring DDD
**Contenu:**
- Transformation de l'architecture couplée vers DDD
- Exemples avant/après
- Explications des améliorations

**Action:** ✅ Garder - Utile pour comprendre l'évolution du projet

---

### 📝 Fichiers de Spécifications (Valider avant usage)

#### 7. **docs/tiktok-link-feature.md** ✅ NOUVEAU - PRÊT À IMPLÉMENTER
**Statut:** Créé le 2026-01-11
**Contenu:**
- Spécification complète pour feature TikTok link
- Design des deux placements (ProfileSetupScreen + ResultScreen)
- Guide d'implémentation détaillé avec code examples
- Checklist de tests
- Vérification conformité App Store

**Action:** ✅ Garder - Document de référence pour implémentation

---

#### 8. **docs/barcode-scanning-feature.md** ⚠️ ATTENTION - PARTIELLEMENT OBSOLÈTE
**Statut:** Marqué "Post-MVP Q2 2025" mais scan déjà implémenté
**Contenu:**
- Spécifications détaillées du scan de code-barre
- User stories et acceptance criteria
- Stack technique (expo-barcode-scanner, OpenFoodFacts)

**Réalité:** Le scan de code-barre est **déjà implémenté** (BarcodeScreen.tsx existe)
**Action:** ⚠️ **À METTRE À JOUR** - Changer le statut de "Planning" à "Implémenté"

---

#### 9. **docs/ui-roadmap.md** ⚠️ PARTIELLEMENT OBSOLÈTE
**Statut:** Roadmap UI avec wireframes
**Contenu:**
- Design system et palette de couleurs
- Wireframes des écrans
- Composants Ignite disponibles

**Problèmes:**
- Certains écrans ont évolué depuis (ProfileSetupScreen avec ActivityPickerButton)
- Historique pas encore implémenté

**Action:** ⚠️ **À RÉVISER** - Mettre à jour les wireframes si nécessaire, ou archiver si plus utilisé

---

#### 10. **docs/result-screen-refactoring-summary.md** ✅ RÉFÉRENCE - HISTORIQUE
**Statut:** Document de refactoring du ResultScreen
**Contenu:**
- Transformation du ResultScreen (652 → 300 lignes)
- Extraction de la logique métier vers use cases
- Exemple de refactoring DDD

**Action:** ✅ Garder - Bonne référence pour comprendre l'approche refactoring

---

#### 11. **docs/result-screen-ddd-refactoring-findings.md** 📁 ARCHIVER?
**Statut:** Findings détaillés du refactoring
**Contenu:** Probablement un doublon ou détail supplémentaire de result-screen-refactoring-summary.md

**Action:** 📁 **À VÉRIFIER** - Peut être archivé si redondant avec result-screen-refactoring-summary.md

---

### 📄 Fichiers de Publication App Store

#### 12-16. **docs/publish/** ✅ GARDER TOUS
**Fichiers:**
- `app-form.md` - Formulaire de soumission App Store
- `app-store-copywriting.md` / `app-store-copywriting-fr.md` - Textes marketing
- `app-store-screenshots.md` - Spécifications des screenshots
- `app-support-url.md` - URL de support
- `marketing-url.md` - URL marketing

**Statut:** Documents actifs pour publication
**Action:** ✅ Garder tous - Nécessaires pour soumission App Store

---

## 🎯 Actions Recommandées

### 🔴 HAUTE PRIORITÉ

1. **Mettre à jour `docs/barcode-scanning-feature.md`**
   - Changer statut de "Planning" à "✅ Implémenté"
   - Ajouter date d'implémentation
   - Référencer BarcodeScreen.tsx

2. **Réviser ou archiver `docs/ui-roadmap.md`**
   - Si encore utilisé: mettre à jour avec nouveaux composants (ActivityPickerButton)
   - Sinon: déplacer vers `docs/archive/`

### 🟡 MOYENNE PRIORITÉ

3. **Vérifier `docs/result-screen-ddd-refactoring-findings.md`**
   - Lire pour voir si redondant avec result-screen-refactoring-summary.md
   - Si redondant: archiver

4. **Créer un dossier `docs/archive/`**
   - Y déplacer les documents historiques qui ne sont plus référencés activement
   - Garde l'historique sans polluer la doc active

### 🟢 BASSE PRIORITÉ

5. **Ajouter un README.md dans docs/**
   - Index de tous les fichiers de documentation
   - Description rapide de chaque fichier
   - Date de dernière mise à jour

---

## 📊 Statistique de la Documentation

**Total fichiers de documentation:** 16 fichiers
**À jour:** 5 fichiers (31%) - Ajout de tiktok-link-feature.md
**Références valides:** 4 fichiers (25%)
**À mettre à jour:** 2 fichiers (13%)
**À archiver/vérifier:** 1 fichier (6%)
**Publication App Store:** 5 fichiers (31%)

---

## 🗂️ Structure Recommandée

```
docs/
├── README.md                           # Index de la documentation
├── prd.md                             # ✅ À JOUR - Document principal
├── CLAUDE.md (racine)                 # ✅ À JOUR - Guide pour agents
├── architecture.md                    # ✅ RÉFÉRENCE - Architecture DDD
├── DDD-REFACTORING-SUMMARY.md        # ✅ RÉFÉRENCE - Historique refactoring
├── tiktok-link-feature.md            # ✅ NOUVEAU - Spec TikTok link
├── barcode-scanning-feature.md       # ⚠️ À METTRE À JOUR - Changer statut
├── ui-roadmap.md                     # ⚠️ À RÉVISER - Wireframes obsolètes?
├── result-screen-refactoring-summary.md  # ✅ RÉFÉRENCE - Exemple refactoring
│
├── publish/                          # ✅ GARDER - Documents App Store
│   ├── app-form.md
│   ├── app-store-copywriting.md
│   ├── app-store-copywriting-fr.md
│   ├── app-store-screenshots.md
│   ├── app-support-url.md
│   ├── marketing-url.md
│   └── issues/
│       ├── issues-2.md              # ✅ RÉFÉRENCE - Rejection Apple
│       └── FIX_PLAN.md
│
└── archive/                          # 📁 CRÉER - Pour docs historiques
    └── result-screen-ddd-refactoring-findings.md  # Si redondant
```

---

**Dernière mise à jour:** 2026-01-11
**Dernière modification:** Ajout de tiktok-link-feature.md (spécification nouvelle feature)
**Prochain audit recommandé:** Après publication App Store
