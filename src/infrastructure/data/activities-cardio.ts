import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Cardio and endurance activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const CARDIO_ACTIVITIES: ActivityData[] = [
  // WALKING
  {
    key: "walking_casual",
    names: { en: "Walking (Casual)", fr: "Marche (Décontractée)" },
    met: 3.0,
    category: "cardio",
    intensity: getIntensityFromMET(3.0),
    compendiumCode: "17151",
    description: {
      en: "Walking at 2.5 mph on flat ground",
      fr: "Marche à 4 km/h sur terrain plat",
    },
    tags: ["walking", "casual", "beginner", "low-impact"],
    iconName: "walk",
    equipment: [],
  },
  {
    key: "walking_brisk",
    names: { en: "Walking (Brisk)", fr: "Marche (Rapide)" },
    met: 3.5,
    category: "cardio",
    intensity: getIntensityFromMET(3.5),
    compendiumCode: "17170",
    description: {
      en: "Walking at 3.5 mph on flat ground",
      fr: "Marche à 5.5 km/h sur terrain plat",
    },
    tags: ["walking", "brisk", "moderate", "cardio"],
    iconName: "walk-fast",
    equipment: [],
  },
  {
    key: "walking_very_brisk",
    names: { en: "Walking (Very Brisk)", fr: "Marche (Très Rapide)" },
    met: 5.0,
    category: "cardio",
    intensity: getIntensityFromMET(5.0),
    compendiumCode: "17190",
    description: {
      en: "Walking at 4.0 mph on flat ground",
      fr: "Marche à 6.5 km/h sur terrain plat",
    },
    tags: ["walking", "fast", "moderate", "cardio"],
    iconName: "walk-fast",
    equipment: [],
  },

  // RUNNING & JOGGING
  {
    key: "jogging_general",
    names: { en: "Jogging (General)", fr: "Jogging (Général)" },
    met: 7.0,
    category: "cardio",
    intensity: getIntensityFromMET(7.0),
    compendiumCode: "12020",
    description: {
      en: "Jogging at self-selected comfortable pace",
      fr: "Jogging à un rythme confortable choisi",
    },
    tags: ["jogging", "running", "cardio", "vigorous"],
    iconName: "run",
    equipment: ["running-shoes"],
  },
  {
    key: "running_5mph",
    names: { en: "Running (5 mph)", fr: "Course (8 km/h)" },
    met: 8.5,
    category: "cardio",
    intensity: getIntensityFromMET(8.5),
    compendiumCode: "12030",
    description: {
      en: "Running at 5 mph (12 min/mile)",
      fr: "Course à 8 km/h (12 min/mile)",
    },
    tags: ["running", "cardio", "vigorous", "endurance"],
    iconName: "run",
    equipment: ["running-shoes"],
  },
  {
    key: "running_6mph",
    names: { en: "Running (6 mph)", fr: "Course (9.5 km/h)" },
    met: 9.8,
    category: "cardio",
    intensity: getIntensityFromMET(9.8),
    compendiumCode: "12050",
    description: {
      en: "Running at 6 mph (10 min/mile)",
      fr: "Course à 9.5 km/h (10 min/mile)",
    },
    tags: ["running", "cardio", "vigorous", "endurance"],
    iconName: "run-fast",
    equipment: ["running-shoes"],
  },
  {
    key: "running_7mph",
    names: { en: "Running (7 mph)", fr: "Course (11 km/h)" },
    met: 11.0,
    category: "cardio",
    intensity: getIntensityFromMET(11.0),
    compendiumCode: "12070",
    description: {
      en: "Running at 7 mph (8.5 min/mile)",
      fr: "Course à 11 km/h (8.5 min/mile)",
    },
    tags: ["running", "cardio", "vigorous", "fast"],
    iconName: "run-fast",
    equipment: ["running-shoes"],
  },

  // CYCLING
  {
    key: "cycling_leisurely",
    names: { en: "Cycling (Leisurely)", fr: "Vélo (Tranquille)" },
    met: 3.5,
    category: "cardio",
    intensity: getIntensityFromMET(3.5),
    compendiumCode: "01010",
    description: {
      en: "Leisurely bike riding, < 10 mph",
      fr: "Vélo tranquille, < 16 km/h",
    },
    tags: ["cycling", "bike", "leisurely", "moderate"],
    iconName: "bike",
    equipment: ["bicycle", "helmet"],
  },
  {
    key: "cycling_moderate",
    names: { en: "Cycling (Moderate)", fr: "Vélo (Modéré)" },
    met: 6.8,
    category: "cardio",
    intensity: getIntensityFromMET(6.8),
    compendiumCode: "01040",
    description: {
      en: "Cycling 12-14 mph, moderate effort",
      fr: "Vélo 19-22 km/h, effort modéré",
    },
    tags: ["cycling", "bike", "moderate", "vigorous"],
    iconName: "bike",
    equipment: ["bicycle", "helmet"],
  },
  {
    key: "cycling_vigorous",
    names: { en: "Cycling (Vigorous)", fr: "Vélo (Intense)" },
    met: 10.0,
    category: "cardio",
    intensity: getIntensityFromMET(10.0),
    compendiumCode: "01060",
    description: {
      en: "Cycling 16-19 mph, vigorous effort",
      fr: "Vélo 25-30 km/h, effort intense",
    },
    tags: ["cycling", "bike", "vigorous", "fast"],
    iconName: "bike-fast",
    equipment: ["bicycle", "helmet"],
  },

  // CARDIO MACHINES
  {
    key: "rowing_moderate",
    names: { en: "Rowing (Moderate)", fr: "Aviron (Modéré)" },
    met: 7.0,
    category: "cardio",
    intensity: getIntensityFromMET(7.0),
    compendiumCode: "15200",
    description: {
      en: "Rowing on machine, moderate effort",
      fr: "Aviron sur machine, effort modéré",
    },
    tags: ["rowing", "cardio", "full-body", "vigorous"],
    iconName: "rowing",
    equipment: ["rowing-machine"],
  },
  {
    key: "elliptical",
    names: { en: "Elliptical Machine", fr: "Vélo Elliptique" },
    met: 5.0,
    category: "cardio",
    intensity: getIntensityFromMET(5.0),
    compendiumCode: "02065",
    description: {
      en: "Using elliptical machine",
      fr: "Utilisation du vélo elliptique",
    },
    tags: ["elliptical", "cardio", "low-impact", "moderate"],
    iconName: "elliptical",
    equipment: ["elliptical-machine"],
  },
]
