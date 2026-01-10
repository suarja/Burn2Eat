
📄 PRD — Burn2Eat (MVP)

1. Vision

Burn2Eat aide les utilisateurs à prendre conscience de l'impact énergétique de leurs choix alimentaires en traduisant chaque plat en temps d'effort physique.
👉 "Born to eat. Burn to eat."

⸻

2. Objectifs
	•	Offrir une expérience simple, fun et éducative.
	•	Générer un moment émotionnel (confettis, animation) qui encourage l'usage récurrent.
	•	Construire une base technique solide (DDD + TDD) permettant d'ajouter IA/scanning plus tard.
	•	Tester la viralité avec un MVP ultra minimal.

⸻

3. Utilisateurs cibles
	•	Jeunes adultes (18–35 ans) sensibles au fitness, nutrition, bien-être.
	•	Utilisateurs curieux qui veulent un outil simple et fun, sans lourdeur des applis fitness classiques.
	•	Public TikTok/Instagram qui aime partager des expériences rapides.

⸻

4. Problème utilisateur
	•	Les calories sont abstraites → difficile à relier au quotidien.
	•	Les apps fitness sont trop complexes, centrées sur le tracking strict.
	•	Besoin d'une conversion immédiate : "si je mange ça → combien d'effort je dois faire ?"

⸻

5. Solution (MVP Scope)
	1.	Onboarding rapide (optionnel)
	•	Homme/Femme/Autre, taille, poids (ou profil moyen par défaut).
	•	Sélection d'une activité préférée (ex. course, marche, vélo, danse).
	2.	Recherche de plats
	•	Barre de recherche (catalogue statique pour MVP, OpenFoodFacts en v2).
	•	Liste de plats populaires par catégorie (burger, pizza, soda…).
	•	Scan code-barre (OpenFoodFacts API) — ✅ Implémenté
	3.	Résultat instantané
	•	Calories du plat (par portion).
	•	Conversion en temps d'effort (selon poids & MET de l'activité).
	•	Alternatives : 2–3 autres sports.
	•	🎉 Confettis/animation légère.
	4.	Historique local simple ⏳ À IMPLÉMENTER
	•	Liste des plats consultés avec date/heure.
	•	Permet de suivre sa consommation dans la journée.
	•	L'utilisateur peut supprimer des entrées.
	•	Stockage local (MMKV) — pas de sync cloud pour MVP.
	•	Pas de leaderboard ni de social pour MVP.

⸻

6. Hors scope (MVP)
	•	Pas d'IA reconnaissance photo.
	•	Pas de leaderboard ni de partage social avancé.
	•	Pas d'authentification utilisateur (seulement stockage local).
	•	Pas d'intégration Apple HealthKit (prévu pour v2).

⸻

7. UX Principes
	•	Ultra simple : 4 écrans max (Home, Résultat, Historique, Profil).
	•	Fun : animations confettis, emojis, couleurs pop.
	•	Instantané : résultat en <1s.

⸻

8. Success Metrics (MVP)
	•	🎯 Activation : % d'utilisateurs qui arrivent jusqu'au premier calcul (objectif >70%).
	•	🎯 Rétention jour 1 (D1) : % qui reviennent le lendemain (objectif 20%).
	•	🎯 Viralité : % qui cliquent sur bouton "Partager" (si ajouté en v2).
	•	🎯 Feedback qualitatif : NPS > 30 sur premiers testeurs.

⸻

9. Stack technique (MVP)
	•	Frontend : React Native (Expo + Ignite boilerplate).
	•	Backend : pas de backend pour MVP → données statiques + OpenFoodFacts API (scan).
	•	Domain logic : DDD (UserHealthInfo, Dish, Activity, EffortCalculator).
	•	Tests : TDD avec Jest.
	•	Storage local : MMKV (pour historique + préférences).

⸻

10. Roadmap MVP

Sprint 1 — Domain Core ✅ DONE
	•	Modélisation des entités (Dish, UserHealthInfo, Activity, EffortCalculator).
	•	Implémentation du calcul MET → minutes.
	•	Tests unitaires.

Sprint 2 — UI Minimal ✅ DONE
	•	Écrans : Onboarding → Home (recherche) → Résultat.
	•	Catalogue statique de plats.
	•	Scan code-barre (OpenFoodFacts).
	•	Animation confettis.

Sprint 3 — Finitions MVP ⏳ EN COURS
	•	✅ Choix activité préférée (ActivityPickerButton).
	•	✅ Profil utilisateur avec contexte (onboarding vs settings).
	•	✅ Optimisations performance iPad.
	•	⏳ Historique local (à implémenter).
	•	⏳ Polish UI/UX final.
	•	⏳ Packaging App Store / Play Store (TestFlight & Beta).

⸻

11. Fonctionnalités Post-MVP (v2)

### 11.1 Intégration Apple HealthKit & Google Fit

**Problème adressé:**
Les utilisateurs veulent comparer leur activité physique réelle avec ce qu'ils ont déclaré manger pour vérifier s'ils ont "brûlé" leurs calories.

**Solution:**
	•	Connexion à Apple HealthKit (iOS) et Google Fit (Android).
	•	Lecture des données de workout : type d'activité, durée, calories brûlées.
	•	Comparaison automatique : "Aujourd'hui tu as mangé X calories et brûlé Y calories".
	•	Notification optionnelle : "Tu as brûlé tes calories du déjeuner ! 🎉"

**Données HealthKit à récupérer:**
	•	HKWorkoutActivityType : type d'activité (course, vélo, natation, etc.)
	•	totalEnergyBurned : total des calories actives brûlées
	•	activeEnergyBurned : calories actives (hors métabolisme de base)
	•	duration : durée de l'activité
	•	startDate / endDate : période de l'activité

**Bibliothèques React Native:**
	•	Option 1 : `react-native-health` (agencyenterprise) — Moderne, Swift-based
	•	Option 2 : `react-native-healthkit` (kingstinct) — TypeScript, mappings proches de l'API native
	•	Option 3 : `react-native-fitness` (OvalMoney) — Support iOS + Android (HealthKit + Google Fit)

**Permissions requises:**
	•	iOS : HealthKit entitlements + Info.plist permissions
	•	Android : Google Fit API permissions

**UX Flow:**
	1.	L'utilisateur active l'intégration HealthKit dans les paramètres.
	2.	Permission système demandée (une seule fois).
	3.	L'app lit automatiquement les workouts récents.
	4.	Écran "Ma journée" affiche :
		•	Aliments consommés (historique local)
		•	Activités détectées (HealthKit)
		•	Bilan : calories consommées vs brûlées
	5.	Badge/confettis si équilibre atteint.

**Considérations techniques:**
	•	Pas de stockage des données HealthKit (lecture seule).
	•	Respect de la vie privée : données jamais envoyées à un serveur.
	•	Fallback gracieux si l'utilisateur refuse les permissions.
	•	Compatible uniquement avec custom dev client (pas Expo Go).

**Priorité:** v2 (post-publication App Store MVP)

### 11.2 Autres fonctionnalités v2
	•	Partage social (Instagram/TikTok story export).
	•	Leaderboard entre amis.
	•	Suggestions de plats en fonction de l'activité prévue.
	•	Recherche OpenFoodFacts étendue (au-delà du scan).

⸻

12. Risques
	•	⚠️ Difficulté de compréhension si résultat trop sec → nécessité d'une animation visuelle fun.
	•	⚠️ Base OpenFoodFacts pas toujours précise sur portions → prévoir fallback avec valeurs standard.
	•	⚠️ Engagement limité sans social/leaderboard → mitigé par simplicité MVP.
	•	⚠️ HealthKit requiert permissions utilisateur → taux d'acceptation variable.

⸻

13. État actuel de l'implémentation

### ✅ Implémenté
	•	Architecture DDD complète (domain, application, infrastructure)
	•	Écrans : Home, Profile, Barcode, Result
	•	Scan code-barre (OpenFoodFacts)
	•	Calcul d'effort avec MET
	•	Catalogue statique de plats par catégorie
	•	ActivityPickerButton (modal de sélection d'activité)
	•	Profil utilisateur context-aware (onboarding vs settings)
	•	Optimisations performance iPad (React.memo, useCallback, pagination)
	•	Responsive spacing (iPad/mobile)

### ⏳ À implémenter (MVP)
	•	Historique local des plats consultés
	•	Tests sur iPad Air (5th gen) pour validation App Store
	•	Screenshots finaux pour App Store
	•	Build production iOS/Android

### 🔮 Fonctionnalités futures (Post-MVP)
	•	Intégration Apple HealthKit / Google Fit
	•	Recherche OpenFoodFacts étendue
	•	Partage social
	•	Leaderboard

⸻

**Dernière mise à jour:** 2026-01-10
**Statut:** MVP presque complet, en attente historique + tests iPad + publication
