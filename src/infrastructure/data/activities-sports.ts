import { ActivityData, getIntensityFromMET } from "../types/ActivityData"

/**
 * Sports and team activities dataset
 * MET values from 2011 Compendium of Physical Activities
 */
export const SPORTS_ACTIVITIES: ActivityData[] = [
  // RACKET SPORTS
  {
    key: "tennis_singles",
    names: { en: "Tennis (Singles)", fr: "Tennis (Simple)" },
    met: 8.0,
    category: "sports",
    intensity: getIntensityFromMET(8.0),
    compendiumCode: "15675",
    description: {
      en: "Playing tennis singles",
      fr: "Jouer au tennis en simple",
    },
    tags: ["tennis", "racket", "sport", "vigorous"],
    iconName: "tennis",
    equipment: ["tennis-racket", "tennis-ball", "court"],
  },

  // TEAM SPORTS
  {
    key: "basketball_game",
    names: { en: "Basketball (Game)", fr: "Basketball (Match)" },
    met: 8.0,
    category: "sports",
    intensity: getIntensityFromMET(8.0),
    compendiumCode: "15065",
    description: {
      en: "Playing basketball game",
      fr: "Jouer un match de basketball",
    },
    tags: ["basketball", "team-sport", "vigorous", "running"],
    iconName: "basketball",
    equipment: ["basketball", "court"],
  },
  {
    key: "soccer_casual",
    names: { en: "Soccer (Casual)", fr: "Football (Décontracté)" },
    met: 7.0,
    category: "sports",
    intensity: getIntensityFromMET(7.0),
    compendiumCode: "15520",
    description: {
      en: "Playing soccer casually",
      fr: "Jouer au football de façon décontractée",
    },
    tags: ["soccer", "football", "team-sport", "vigorous"],
    iconName: "soccer",
    equipment: ["soccer-ball", "field"],
  },
]
