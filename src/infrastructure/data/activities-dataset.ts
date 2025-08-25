import { ActivityData, getIntensityFromMET } from '../types/ActivityData';

/**
 * Static physical activities dataset with official MET values
 * Based on 2011 Compendium of Physical Activities
 * All MET values are from published research or official compendium
 */
export const ACTIVITIES_DATASET: ActivityData[] = [
  // WALKING & BASIC CARDIO
  {
    key: 'walking_casual',
    names: { en: 'Walking (Casual)', fr: 'Marche (Décontractée)' },
    met: 3.0,
    category: 'cardio',
    intensity: getIntensityFromMET(3.0),
    compendiumCode: '17151',
    description: { 
      en: 'Walking at 2.5 mph on flat ground', 
      fr: 'Marche à 4 km/h sur terrain plat' 
    },
    tags: ['walking', 'casual', 'beginner', 'low-impact'],
    iconName: 'walk',
    equipment: []
  },
  {
    key: 'walking_brisk',
    names: { en: 'Walking (Brisk)', fr: 'Marche (Rapide)' },
    met: 3.5,
    category: 'cardio',
    intensity: getIntensityFromMET(3.5),
    compendiumCode: '17170',
    description: { 
      en: 'Walking at 3.5 mph on flat ground', 
      fr: 'Marche à 5.5 km/h sur terrain plat' 
    },
    tags: ['walking', 'brisk', 'moderate', 'cardio'],
    iconName: 'walk-fast',
    equipment: []
  },
  {
    key: 'walking_very_brisk',
    names: { en: 'Walking (Very Brisk)', fr: 'Marche (Très Rapide)' },
    met: 5.0,
    category: 'cardio',
    intensity: getIntensityFromMET(5.0),
    compendiumCode: '17190',
    description: { 
      en: 'Walking at 4.0 mph on flat ground', 
      fr: 'Marche à 6.5 km/h sur terrain plat' 
    },
    tags: ['walking', 'fast', 'moderate', 'cardio'],
    iconName: 'walk-fast',
    equipment: []
  },

  // RUNNING & JOGGING
  {
    key: 'jogging_general',
    names: { en: 'Jogging (General)', fr: 'Jogging (Général)' },
    met: 7.0,
    category: 'cardio',
    intensity: getIntensityFromMET(7.0),
    compendiumCode: '12020',
    description: { 
      en: 'Jogging at self-selected comfortable pace', 
      fr: 'Jogging à un rythme confortable choisi' 
    },
    tags: ['jogging', 'running', 'cardio', 'vigorous'],
    iconName: 'run',
    equipment: ['running-shoes']
  },
  {
    key: 'running_5mph',
    names: { en: 'Running (5 mph)', fr: 'Course (8 km/h)' },
    met: 8.5,
    category: 'cardio',
    intensity: getIntensityFromMET(8.5),
    compendiumCode: '12030',
    description: { 
      en: 'Running at 5 mph (12 min/mile)', 
      fr: 'Course à 8 km/h (12 min/mile)' 
    },
    tags: ['running', 'cardio', 'vigorous', 'endurance'],
    iconName: 'run',
    equipment: ['running-shoes']
  },
  {
    key: 'running_6mph',
    names: { en: 'Running (6 mph)', fr: 'Course (9.5 km/h)' },
    met: 9.8,
    category: 'cardio',
    intensity: getIntensityFromMET(9.8),
    compendiumCode: '12050',
    description: { 
      en: 'Running at 6 mph (10 min/mile)', 
      fr: 'Course à 9.5 km/h (10 min/mile)' 
    },
    tags: ['running', 'cardio', 'vigorous', 'endurance'],
    iconName: 'run-fast',
    equipment: ['running-shoes']
  },
  {
    key: 'running_7mph',
    names: { en: 'Running (7 mph)', fr: 'Course (11 km/h)' },
    met: 11.0,
    category: 'cardio',
    intensity: getIntensityFromMET(11.0),
    compendiumCode: '12070',
    description: { 
      en: 'Running at 7 mph (8.5 min/mile)', 
      fr: 'Course à 11 km/h (8.5 min/mile)' 
    },
    tags: ['running', 'cardio', 'vigorous', 'fast'],
    iconName: 'run-fast',
    equipment: ['running-shoes']
  },

  // CYCLING
  {
    key: 'cycling_leisurely',
    names: { en: 'Cycling (Leisurely)', fr: 'Vélo (Tranquille)' },
    met: 3.5,
    category: 'cardio',
    intensity: getIntensityFromMET(3.5),
    compendiumCode: '01010',
    description: { 
      en: 'Leisurely bike riding, < 10 mph', 
      fr: 'Vélo tranquille, < 16 km/h' 
    },
    tags: ['cycling', 'bike', 'leisurely', 'moderate'],
    iconName: 'bike',
    equipment: ['bicycle', 'helmet']
  },
  {
    key: 'cycling_moderate',
    names: { en: 'Cycling (Moderate)', fr: 'Vélo (Modéré)' },
    met: 6.8,
    category: 'cardio',
    intensity: getIntensityFromMET(6.8),
    compendiumCode: '01040',
    description: { 
      en: 'Cycling 12-14 mph, moderate effort', 
      fr: 'Vélo 19-22 km/h, effort modéré' 
    },
    tags: ['cycling', 'bike', 'moderate', 'vigorous'],
    iconName: 'bike',
    equipment: ['bicycle', 'helmet']
  },
  {
    key: 'cycling_vigorous',
    names: { en: 'Cycling (Vigorous)', fr: 'Vélo (Intense)' },
    met: 10.0,
    category: 'cardio',
    intensity: getIntensityFromMET(10.0),
    compendiumCode: '01060',
    description: { 
      en: 'Cycling 16-19 mph, vigorous effort', 
      fr: 'Vélo 25-30 km/h, effort intense' 
    },
    tags: ['cycling', 'bike', 'vigorous', 'fast'],
    iconName: 'bike-fast',
    equipment: ['bicycle', 'helmet']
  },

  // SWIMMING
  {
    key: 'swimming_leisurely',
    names: { en: 'Swimming (Leisurely)', fr: 'Natation (Tranquille)' },
    met: 6.0,
    category: 'water',
    intensity: getIntensityFromMET(6.0),
    compendiumCode: '18310',
    description: { 
      en: 'Swimming laps, freestyle, slow pace', 
      fr: 'Nage en longueurs, nage libre, rythme lent' 
    },
    tags: ['swimming', 'pool', 'water', 'full-body', 'vigorous'],
    iconName: 'swim',
    equipment: ['swimming-pool', 'swimsuit']
  },
  {
    key: 'swimming_moderate',
    names: { en: 'Swimming (Moderate)', fr: 'Natation (Modérée)' },
    met: 8.0,
    category: 'water',
    intensity: getIntensityFromMET(8.0),
    compendiumCode: '18320',
    description: { 
      en: 'Swimming laps, freestyle, moderate pace', 
      fr: 'Nage en longueurs, nage libre, rythme modéré' 
    },
    tags: ['swimming', 'pool', 'water', 'full-body', 'vigorous'],
    iconName: 'swim',
    equipment: ['swimming-pool', 'swimsuit']
  },

  // SPORTS
  {
    key: 'tennis_singles',
    names: { en: 'Tennis (Singles)', fr: 'Tennis (Simple)' },
    met: 8.0,
    category: 'sports',
    intensity: getIntensityFromMET(8.0),
    compendiumCode: '15675',
    description: { 
      en: 'Playing tennis singles', 
      fr: 'Jouer au tennis en simple' 
    },
    tags: ['tennis', 'racket', 'sport', 'vigorous'],
    iconName: 'tennis',
    equipment: ['tennis-racket', 'tennis-ball', 'court']
  },
  {
    key: 'basketball_game',
    names: { en: 'Basketball (Game)', fr: 'Basketball (Match)' },
    met: 8.0,
    category: 'sports',
    intensity: getIntensityFromMET(8.0),
    compendiumCode: '15065',
    description: { 
      en: 'Playing basketball game', 
      fr: 'Jouer un match de basketball' 
    },
    tags: ['basketball', 'team-sport', 'vigorous', 'running'],
    iconName: 'basketball',
    equipment: ['basketball', 'court']
  },
  {
    key: 'soccer_casual',
    names: { en: 'Soccer (Casual)', fr: 'Football (Décontracté)' },
    met: 7.0,
    category: 'sports',
    intensity: getIntensityFromMET(7.0),
    compendiumCode: '15520',
    description: { 
      en: 'Playing soccer casually', 
      fr: 'Jouer au football de façon décontractée' 
    },
    tags: ['soccer', 'football', 'team-sport', 'vigorous'],
    iconName: 'soccer',
    equipment: ['soccer-ball', 'field']
  },

  // DANCE
  {
    key: 'dance_ballroom',
    names: { en: 'Ballroom Dance', fr: 'Danse de Salon' },
    met: 3.0,
    category: 'dance',
    intensity: getIntensityFromMET(3.0),
    compendiumCode: '03025',
    description: { 
      en: 'Ballroom dancing, slow pace', 
      fr: 'Danse de salon, rythme lent' 
    },
    tags: ['dance', 'ballroom', 'social', 'moderate'],
    iconName: 'dance',
    equipment: []
  },
  {
    key: 'dance_aerobic',
    names: { en: 'Aerobic Dance', fr: 'Danse Aérobique' },
    met: 7.3,
    category: 'dance',
    intensity: getIntensityFromMET(7.3),
    compendiumCode: '03015',
    description: { 
      en: 'High-impact aerobic dance', 
      fr: 'Danse aérobique à fort impact' 
    },
    tags: ['dance', 'aerobic', 'high-impact', 'vigorous'],
    iconName: 'dance',
    equipment: []
  },
  {
    key: 'dance_hip_hop',
    names: { en: 'Hip Hop Dance', fr: 'Danse Hip Hop' },
    met: 5.0,
    category: 'dance',
    intensity: getIntensityFromMET(5.0),
    compendiumCode: '03032',
    description: { 
      en: 'Hip hop dancing', 
      fr: 'Danse hip hop' 
    },
    tags: ['dance', 'hip-hop', 'urban', 'moderate'],
    iconName: 'dance',
    equipment: []
  },

  // GYM & STRENGTH
  {
    key: 'weight_training_general',
    names: { en: 'Weight Training (General)', fr: 'Musculation (Général)' },
    met: 3.5,
    category: 'gym',
    intensity: getIntensityFromMET(3.5),
    compendiumCode: '02052',
    description: { 
      en: 'General weight training', 
      fr: 'Musculation générale' 
    },
    tags: ['weights', 'strength', 'gym', 'moderate'],
    iconName: 'weights',
    equipment: ['weights', 'gym']
  },
  {
    key: 'weight_training_vigorous',
    names: { en: 'Weight Training (Vigorous)', fr: 'Musculation (Intense)' },
    met: 6.0,
    category: 'gym',
    intensity: getIntensityFromMET(6.0),
    compendiumCode: '02054',
    description: { 
      en: 'Vigorous weight training', 
      fr: 'Musculation intensive' 
    },
    tags: ['weights', 'strength', 'gym', 'vigorous'],
    iconName: 'weights',
    equipment: ['weights', 'gym']
  },
  {
    key: 'yoga_hatha',
    names: { en: 'Yoga (Hatha)', fr: 'Yoga (Hatha)' },
    met: 2.5,
    category: 'gym',
    intensity: getIntensityFromMET(2.5),
    compendiumCode: '02101',
    description: { 
      en: 'Hatha yoga practice', 
      fr: 'Pratique du yoga Hatha' 
    },
    tags: ['yoga', 'flexibility', 'mindfulness', 'light'],
    iconName: 'yoga',
    equipment: ['yoga-mat']
  },
  {
    key: 'pilates',
    names: { en: 'Pilates', fr: 'Pilates' },
    met: 3.0,
    category: 'gym',
    intensity: getIntensityFromMET(3.0),
    compendiumCode: '02101',
    description: { 
      en: 'Pilates exercises', 
      fr: 'Exercices de Pilates' 
    },
    tags: ['pilates', 'core', 'flexibility', 'moderate'],
    iconName: 'pilates',
    equipment: ['mat']
  },
  {
    key: 'crossfit',
    names: { en: 'CrossFit', fr: 'CrossFit' },
    met: 8.0,
    category: 'gym',
    intensity: getIntensityFromMET(8.0),
    compendiumCode: '02131',
    description: { 
      en: 'CrossFit workout', 
      fr: 'Entraînement CrossFit' 
    },
    tags: ['crossfit', 'hiit', 'functional', 'vigorous'],
    iconName: 'crossfit',
    equipment: ['gym', 'weights', 'box']
  },

  // DAILY ACTIVITIES
  {
    key: 'stair_climbing',
    names: { en: 'Stair Climbing', fr: 'Montée d\'Escaliers' },
    met: 8.8,
    category: 'daily',
    intensity: getIntensityFromMET(8.8),
    compendiumCode: '17080',
    description: { 
      en: 'Walking up stairs', 
      fr: 'Monter les escaliers' 
    },
    tags: ['stairs', 'climbing', 'daily', 'vigorous'],
    iconName: 'stairs',
    equipment: []
  },
  {
    key: 'housework_general',
    names: { en: 'Housework (General)', fr: 'Ménage (Général)' },
    met: 3.3,
    category: 'daily',
    intensity: getIntensityFromMET(3.3),
    compendiumCode: '05040',
    description: { 
      en: 'General household tasks', 
      fr: 'Tâches ménagères générales' 
    },
    tags: ['housework', 'cleaning', 'daily', 'moderate'],
    iconName: 'cleaning',
    equipment: []
  },
  {
    key: 'gardening_general',
    names: { en: 'Gardening (General)', fr: 'Jardinage (Général)' },
    met: 4.0,
    category: 'daily',
    intensity: getIntensityFromMET(4.0),
    compendiumCode: '08140',
    description: { 
      en: 'General gardening activities', 
      fr: 'Activités de jardinage générales' 
    },
    tags: ['gardening', 'outdoor', 'daily', 'moderate'],
    iconName: 'garden',
    equipment: ['garden-tools']
  },

  // ADDITIONAL POPULAR ACTIVITIES
  {
    key: 'rowing_moderate',
    names: { en: 'Rowing (Moderate)', fr: 'Aviron (Modéré)' },
    met: 7.0,
    category: 'cardio',
    intensity: getIntensityFromMET(7.0),
    compendiumCode: '15200',
    description: { 
      en: 'Rowing on machine, moderate effort', 
      fr: 'Aviron sur machine, effort modéré' 
    },
    tags: ['rowing', 'cardio', 'full-body', 'vigorous'],
    iconName: 'rowing',
    equipment: ['rowing-machine']
  },
  {
    key: 'elliptical',
    names: { en: 'Elliptical Machine', fr: 'Vélo Elliptique' },
    met: 5.0,
    category: 'cardio',
    intensity: getIntensityFromMET(5.0),
    compendiumCode: '02065',
    description: { 
      en: 'Using elliptical machine', 
      fr: 'Utilisation du vélo elliptique' 
    },
    tags: ['elliptical', 'cardio', 'low-impact', 'moderate'],
    iconName: 'elliptical',
    equipment: ['elliptical-machine']
  }
];

/**
 * Get total number of activities in dataset
 */
export const getActivityCount = (): number => ACTIVITIES_DATASET.length;

/**
 * Get activities by category
 */
export const getActivitiesByCategory = (category: string): ActivityData[] => {
  return ACTIVITIES_DATASET.filter(activity => activity.category === category);
};

/**
 * Get activity by key
 */
export const getActivityByKey = (key: string): ActivityData | undefined => {
  return ACTIVITIES_DATASET.find(activity => activity.key === key);
};

/**
 * Search activities by name (English or French)
 */
export const searchActivitiesByName = (query: string): ActivityData[] => {
  const lowerQuery = query.toLowerCase();
  return ACTIVITIES_DATASET.filter(activity => 
    activity.names.en.toLowerCase().includes(lowerQuery) ||
    activity.names.fr.toLowerCase().includes(lowerQuery) ||
    activity.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get activities by intensity level
 */
export const getActivitiesByIntensity = (intensity: string): ActivityData[] => {
  return ACTIVITIES_DATASET.filter(activity => activity.intensity === intensity);
};

/**
 * Get activities within MET range
 */
export const getActivitiesByMETRange = (minMET: number, maxMET: number): ActivityData[] => {
  return ACTIVITIES_DATASET.filter(activity => 
    activity.met >= minMET && activity.met <= maxMET
  );
};