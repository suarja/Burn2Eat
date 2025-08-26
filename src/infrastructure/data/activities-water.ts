import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Water-based activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const WATER_ACTIVITIES: ActivityData[] = [
  // SWIMMING
  {
    key: "swimming_leisurely",
    names: { en: "Swimming (Leisurely)", fr: "Natation (Tranquille)" },
    met: 6.0,
    category: "water",
    intensity: getIntensityFromMET(6.0),
    compendiumCode: "18310",
    description: {
      en: "Swimming laps, freestyle, slow pace",
      fr: "Nage en longueurs, nage libre, rythme lent",
    },
    tags: ["swimming", "pool", "water", "full-body", "vigorous"],
    iconName: "swim",
    equipment: ["swimming-pool", "swimsuit"],
  },
  {
    key: "swimming_moderate",
    names: { en: "Swimming (Moderate)", fr: "Natation (Modérée)" },
    met: 8.0,
    category: "water",
    intensity: getIntensityFromMET(8.0),
    compendiumCode: "18320",
    description: {
      en: "Swimming laps, freestyle, moderate pace",
      fr: "Nage en longueurs, nage libre, rythme modéré",
    },
    tags: ["swimming", "pool", "water", "full-body", "vigorous"],
    iconName: "swim",
    equipment: ["swimming-pool", "swimsuit"],
  },
]
