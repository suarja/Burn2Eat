import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Gym, fitness center, and strength training activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const GYM_ACTIVITIES: ActivityData[] = [
  // STRENGTH TRAINING
  {
    key: "weight_training_general",
    names: { en: "Weight Training (General)", fr: "Musculation (Général)" },
    met: 3.5,
    category: "gym",
    intensity: getIntensityFromMET(3.5),
    compendiumCode: "02052",
    description: {
      en: "General weight training",
      fr: "Musculation générale",
    },
    tags: ["weights", "strength", "gym", "moderate"],
    iconName: "weights",
    equipment: ["weights", "gym"],
  },
  {
    key: "weight_training_vigorous",
    names: { en: "Weight Training (Vigorous)", fr: "Musculation (Intense)" },
    met: 6.0,
    category: "gym",
    intensity: getIntensityFromMET(6.0),
    compendiumCode: "02054",
    description: {
      en: "Vigorous weight training",
      fr: "Musculation intensive",
    },
    tags: ["weights", "strength", "gym", "vigorous"],
    iconName: "weights",
    equipment: ["weights", "gym"],
  },

  // FLEXIBILITY & MINDFULNESS
  {
    key: "yoga_hatha",
    names: { en: "Yoga (Hatha)", fr: "Yoga (Hatha)" },
    met: 2.5,
    category: "gym",
    intensity: getIntensityFromMET(2.5),
    compendiumCode: "02101",
    description: {
      en: "Hatha yoga practice",
      fr: "Pratique du yoga Hatha",
    },
    tags: ["yoga", "flexibility", "mindfulness", "light"],
    iconName: "yoga",
    equipment: ["yoga-mat"],
  },
  {
    key: "pilates",
    names: { en: "Pilates", fr: "Pilates" },
    met: 3.0,
    category: "gym",
    intensity: getIntensityFromMET(3.0),
    compendiumCode: "02101",
    description: {
      en: "Pilates exercises",
      fr: "Exercices de Pilates",
    },
    tags: ["pilates", "core", "flexibility", "moderate"],
    iconName: "pilates",
    equipment: ["mat"],
  },

  // HIGH-INTENSITY TRAINING
  {
    key: "crossfit",
    names: { en: "CrossFit", fr: "CrossFit" },
    met: 8.0,
    category: "gym",
    intensity: getIntensityFromMET(8.0),
    compendiumCode: "02131",
    description: {
      en: "CrossFit workout",
      fr: "Entraînement CrossFit",
    },
    tags: ["crossfit", "hiit", "functional", "vigorous"],
    iconName: "crossfit",
    equipment: ["gym", "weights", "box"],
  },
]
