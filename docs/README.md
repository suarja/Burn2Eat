# 📚 Burn2Eat Documentation

**Dernière mise à jour:** 2026-01-10

Bienvenue dans la documentation du projet Burn2Eat. Ce répertoire contient toutes les spécifications, architectures, et guides pour le développement et la publication de l'application.

---

## 🗂️ Index de la Documentation

### 📋 Documents Principaux (À JOUR)

#### [prd.md](./prd.md) 🎯 CRITIQUE
**PRD (Product Requirements Document) - Version MVP**
- Vision et objectifs du projet
- Utilisateurs cibles et problèmes adressés
- Scope MVP et fonctionnalités
- Roadmap de développement
- Fonctionnalités v2 (Apple HealthKit, etc.)
- **État actuel de l'implémentation**

**Dernière MAJ:** 2026-01-10
**Statut:** ✅ À jour - Document de référence principal

---

#### [CLAUDE.md](../CLAUDE.md) 🤖 CRITIQUE
**Guide pour agents Claude Code**
- Contexte App Store rejection
- Commandes de développement
- Architecture DDD
- Guidelines de développement
- Priorités actuelles

**Dernière MAJ:** 2026-01-10
**Statut:** ✅ À jour - Référence pour agents IA

---

### 🏗️ Architecture & Design

#### [architecture.md](./architecture.md) 📐
**Documentation de l'architecture DDD**
- Structure du projet (Domain, Application, Infrastructure)
- Diagrammes des couches
- Principes architecturaux
- Exemples de patterns

**Statut:** ✅ Référence valide - Architecture actuelle
**Usage:** Pour comprendre la structure du projet

---

#### [DDD-REFACTORING-SUMMARY.md](./DDD-REFACTORING-SUMMARY.md) 📖
**Résumé du refactoring DDD**
- Transformation de l'architecture couplée vers DDD
- Exemples avant/après
- Explications des améliorations
- Patterns appliqués

**Statut:** ✅ Référence historique - Utile pour comprendre l'évolution
**Usage:** Apprendre les principes DDD appliqués au projet

---

#### [result-screen-refactoring-summary.md](./result-screen-refactoring-summary.md) 🔄
**Refactoring du ResultScreen**
- Réduction de 652 → 300 lignes
- Extraction de logique métier vers use cases
- Exemple concret de refactoring DDD

**Statut:** ✅ Référence - Bon exemple de refactoring
**Usage:** Comprendre l'approche de refactoring appliquée

---

#### [result-screen-ddd-refactoring-findings.md](./result-screen-ddd-refactoring-findings.md) 🔬
**Recherche et insights DDD**
- Findings de recherche sur le DDD
- Food portion estimation research
- Value object design patterns
- Lessons learned

**Statut:** ✅ Référence - Document de recherche
**Usage:** Approfondir la compréhension du DDD et des patterns

---

### 📱 Fonctionnalités & Spécifications

#### [barcode-scanning-feature.md](./barcode-scanning-feature.md) 📷
**Spécification du scan de code-barre**
- Business case et user value
- Architecture technique
- État de l'implémentation (✅ IMPLÉMENTÉ)
- Roadmap et améliorations futures

**Dernière MAJ:** 2026-01-10
**Statut:** ✅ À jour - Feature implémentée
**Usage:** Référence pour comprendre le scan de barcode

---

#### [ui-roadmap.md](./ui-roadmap.md) 🎨
**Roadmap UI/UX**
- Design system et palette de couleurs
- Wireframes des écrans
- Composants Ignite disponibles
- Spacing et typographie

**Statut:** ⚠️ Partiellement obsolète - Certains wireframes ont évolué
**Usage:** Référence design system, vérifier les wireframes avant usage

---

### 📦 Publication App Store

#### [publish/app-form.md](./publish/app-form.md) 📝
**Formulaire de soumission App Store**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/app-store-copywriting.md](./publish/app-store-copywriting.md) ✍️
**Textes marketing App Store (EN)**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/app-store-copywriting-fr.md](./publish/app-store-copywriting-fr.md) ✍️
**Textes marketing App Store (FR)**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/app-store-screenshots.md](./publish/app-store-screenshots.md) 📸
**Spécifications des screenshots App Store**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/app-support-url.md](./publish/app-support-url.md) 🔗
**URL de support pour l'app**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/marketing-url.md](./publish/marketing-url.md) 🔗
**URL marketing pour l'app**
**Statut:** ✅ Actif - Pour publication

---

#### [publish/issues/issues-2.md](./publish/issues/issues-2.md) ⚠️
**Rejet App Store - Détails complets**
- Guideline 2.1 (Performance - iPad freeze)
- Guideline 4.0 (Design - UI crowded)
- Feedback d'Apple avec screenshots

**Statut:** ✅ Référence historique - Document important
**Usage:** Comprendre le contexte du rejet et les corrections à apporter

---

#### [publish/issues/FIX_PLAN.md](./publish/issues/FIX_PLAN.md) 🔧
**Plan de correction du rejet**
**Statut:** 📁 Voir system-prompt-extraction/HANDOFF.md pour état actuel

---

### 📊 Documents d'Audit & Suivi

#### [DOCUMENTATION_AUDIT.md](./DOCUMENTATION_AUDIT.md) 🔍
**Audit complet de la documentation**
- État de chaque fichier (à jour, obsolète, à archiver)
- Actions recommandées
- Structure de documentation recommandée

**Date:** 2026-01-10
**Statut:** ✅ Audit complet - Document de référence

---

## 📁 Structure Recommandée

```
docs/
├── README.md                              # ✅ Ce fichier - Index documentation
├── prd.md                                 # ✅ À JOUR - Document principal
├── architecture.md                        # ✅ Référence - Architecture DDD
├── DDD-REFACTORING-SUMMARY.md            # ✅ Référence - Historique refactoring
├── barcode-scanning-feature.md           # ✅ À JOUR - Feature implémentée
├── ui-roadmap.md                         # ⚠️ Partiellement obsolète
├── result-screen-refactoring-summary.md  # ✅ Référence - Exemple refactoring
├── result-screen-ddd-refactoring-findings.md # ✅ Référence - Research
├── DOCUMENTATION_AUDIT.md                # ✅ À JOUR - Audit documentation
│
├── publish/                              # ✅ Documents App Store
│   ├── app-form.md
│   ├── app-store-copywriting.md
│   ├── app-store-copywriting-fr.md
│   ├── app-store-screenshots.md
│   ├── app-support-url.md
│   ├── marketing-url.md
│   └── issues/
│       ├── issues-2.md                   # ✅ Rejet Apple
│       └── FIX_PLAN.md
│
└── archive/                              # 📁 Docs historiques (vide pour l'instant)
```

---

## 🎯 Guides Rapides

### Pour commencer un nouveau développement
1. Lire [prd.md](./prd.md) - Comprendre la vision et le scope
2. Lire [architecture.md](./architecture.md) - Comprendre l'architecture DDD
3. Lire [CLAUDE.md](../CLAUDE.md) - Guidelines de développement

### Pour comprendre le rejet App Store
1. Lire [publish/issues/issues-2.md](./publish/issues/issues-2.md) - Feedback d'Apple
2. Lire [../system-prompt-extraction/HANDOFF.md](../system-prompt-extraction/HANDOFF.md) - État des corrections

### Pour apprendre le DDD dans ce projet
1. Lire [DDD-REFACTORING-SUMMARY.md](./DDD-REFACTORING-SUMMARY.md) - Vue d'ensemble
2. Lire [result-screen-refactoring-summary.md](./result-screen-refactoring-summary.md) - Exemple concret
3. Lire [result-screen-ddd-refactoring-findings.md](./result-screen-ddd-refactoring-findings.md) - Approfondissement

### Pour préparer la publication App Store
1. Lire tous les fichiers dans [publish/](./publish/)
2. Vérifier [prd.md](./prd.md) section 13 - État de l'implémentation
3. Suivre [../system-prompt-extraction/HANDOFF.md](../system-prompt-extraction/HANDOFF.md) - Checklist de tests

---

## 📈 Statut Global

**Documentation:**
- ✅ Documents principaux à jour (PRD, CLAUDE.md, HANDOFF.md)
- ✅ Architecture bien documentée
- ✅ Publication App Store documentée
- ⚠️ Quelques wireframes UI à vérifier/mettre à jour

**Projet:**
- ✅ MVP presque complet
- ⏳ Historique local à implémenter
- ⏳ Tests iPad à effectuer
- ⏳ Screenshots finaux à prendre
- 🎯 Objectif: Publication App Store

---

## 🔄 Maintenance de la Documentation

**Quand mettre à jour:**
- Après chaque feature majeure implémentée
- Avant et après soumission App Store
- Après chaque refactoring significatif
- Mensuellement pour vérifier l'alignement

**Comment contribuer:**
1. Lire d'abord ce README.md pour comprendre la structure
2. Mettre à jour les fichiers concernés
3. Mettre à jour les dates "Dernière MAJ"
4. Si nouveau fichier: l'ajouter à ce README.md

---

**Dernière révision:** 2026-01-10
**Prochain audit recommandé:** Après publication App Store MVP
