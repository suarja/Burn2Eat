import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Daily life and household activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const DAILY_ACTIVITIES: ActivityData[] = [
  {
    key: "stair_climbing",
    names: { en: "Stair Climbing", fr: "Montée d'Escaliers" },
    met: 8.8,
    category: "daily",
    intensity: getIntensityFromMET(8.8),
    compendiumCode: "17080",
    description: {
      en: "Walking up stairs",
      fr: "Monter les escaliers",
    },
    tags: ["stairs", "climbing", "daily", "vigorous"],
    iconName: "stairs",
    equipment: [],
  },
  {
    key: "housework_general",
    names: { en: "Housework (General)", fr: "Ménage (Général)" },
    met: 3.3,
    category: "daily",
    intensity: getIntensityFromMET(3.3),
    compendiumCode: "05040",
    description: {
      en: "General household tasks",
      fr: "Tâches ménagères générales",
    },
    tags: ["housework", "cleaning", "daily", "moderate"],
    iconName: "cleaning",
    equipment: [],
  },
  {
    key: "gardening_general",
    names: { en: "Gardening (General)", fr: "Jardinage (Général)" },
    met: 4.0,
    category: "daily",
    intensity: getIntensityFromMET(4.0),
    compendiumCode: "08140",
    description: {
      en: "General gardening activities",
      fr: "Activités de jardinage générales",
    },
    tags: ["gardening", "outdoor", "daily", "moderate"],
    iconName: "garden",
    equipment: ["garden-tools"],
  },
]
