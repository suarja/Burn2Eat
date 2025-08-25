
📄 PRD — Burn2Eat (MVP)

1. Vision

Burn2Eat aide les utilisateurs à prendre conscience de l’impact énergétique de leurs choix alimentaires en traduisant chaque plat en temps d’effort physique.
👉 “Born to eat. Burn to eat.”

⸻

2. Objectifs
	•	Offrir une expérience simple, fun et éducative.
	•	Générer un moment émotionnel (confettis, animation) qui encourage l’usage récurrent.
	•	Construire une base technique solide (DDD + TDD) permettant d’ajouter IA/scanning plus tard.
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
	•	Besoin d’une conversion immédiate : “si je mange ça → combien d’effort je dois faire ?”

⸻

5. Solution (MVP Scope)
	1.	Onboarding rapide (optionnel)
	•	Homme/Femme/Autre, taille, poids (ou profil moyen par défaut).
	•	Sélection d’une activité préférée (ex. course, marche, vélo, danse).
	2.	Recherche de plats
	•	Barre de recherche (connexion à OpenFoodFacts API).
	•	Liste de plats populaires (burger, pizza, soda…).
	3.	Résultat instantané
	•	Calories du plat (par portion).
	•	Conversion en temps d’effort (selon poids & MET de l’activité).
	•	Alternatives : 2–3 autres sports.
	•	🎉 Confettis/animation légère.
	4.	Historique local simple
	•	Liste des plats consultés.
	•	Pas de leaderboard ni de social pour MVP.

⸻

6. Hors scope (MVP)
	•	Pas de scan code-barre.
	•	Pas d’IA reconnaissance photo.
	•	Pas de leaderboard ni de partage social avancé.
	•	Pas d’authentification utilisateur (seulement stockage local).

⸻

7. UX Principes
	•	Ultra simple : 3 écrans max (Home, Résultat, Historique).
	•	Fun : animations confettis, emojis, couleurs pop.
	•	Instantané : résultat en <1s.

⸻

8. Success Metrics (MVP)
	•	🎯 Activation : % d’utilisateurs qui arrivent jusqu’au premier calcul (objectif >70%).
	•	🎯 Rétention jour 1 (D1) : % qui reviennent le lendemain (objectif 20%).
	•	🎯 Viralité : % qui cliquent sur bouton “Partager” (si ajouté en v2).
	•	🎯 Feedback qualitatif : NPS > 30 sur premiers testeurs.

⸻

9. Stack technique (MVP)
	•	Frontend : React Native (Expo + Tailwind).
	•	Backend : pas de backend pour MVP → appels directs à OpenFoodFacts API.
	•	Domain logic : DDD (UserHealthInfo, Dish, Activity, EffortCalculator).
	•	Tests : TDD avec Jest.
	•	Storage local : SQLite/AsyncStorage (pour historique + préférences).

⸻

10. Roadmap MVP

Sprint 1 — Domain Core
	•	Modélisation des entités (Dish, UserHealthInfo, Activity, EffortCalculator).
	•	Implémentation du calcul MET → minutes.
	•	Tests unitaires.

Sprint 2 — UI Minimal
	•	Écrans : Onboarding → Home (recherche) → Résultat.
	•	Intégration OpenFoodFacts.
	•	Animation confettis.

Sprint 3 — Polish
	•	Historique local.
	•	Choix activité préférée.
	•	Packaging App Store / Play Store (TestFlight & Beta).

⸻

11. Risques
	•	⚠️ Difficulté de compréhension si résultat trop sec → nécessité d’une animation visuelle fun.
	•	⚠️ Base OpenFoodFacts pas toujours précise sur portions → prévoir fallback avec valeurs standard.
	•	⚠️ Engagement limité sans social/leaderboard → mitigé par simplicité MVP.

⸻

