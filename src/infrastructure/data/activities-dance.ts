import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Dance and rhythmic movement activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const DANCE_ACTIVITIES: ActivityData[] = [
  {
    key: "dance_ballroom",
    names: { en: "Ballroom Dance", fr: "Danse de Salon" },
    met: 3.0,
    category: "dance",
    intensity: getIntensityFromMET(3.0),
    compendiumCode: "03025",
    description: {
      en: "Ballroom dancing, slow pace",
      fr: "Danse de salon, rythme lent",
    },
    tags: ["dance", "ballroom", "social", "moderate"],
    iconName: "dance",
    equipment: [],
  },
  {
    key: "dance_aerobic",
    names: { en: "Aerobic Dance", fr: "Danse Aérobique" },
    met: 7.3,
    category: "dance",
    intensity: getIntensityFromMET(7.3),
    compendiumCode: "03015",
    description: {
      en: "High-impact aerobic dance",
      fr: "Danse aérobique à fort impact",
    },
    tags: ["dance", "aerobic", "high-impact", "vigorous"],
    iconName: "dance",
    equipment: [],
  },
  {
    key: "dance_hip_hop",
    names: { en: "Hip Hop Dance", fr: "Danse Hip Hop" },
    met: 5.0,
    category: "dance",
    intensity: getIntensityFromMET(5.0),
    compendiumCode: "03032",
    description: {
      en: "Hip hop dancing",
      fr: "Danse hip hop",
    },
    tags: ["dance", "hip-hop", "urban", "moderate"],
    iconName: "dance",
    equipment: [],
  },
]
