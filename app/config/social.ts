/**
 * Social media links configuration
 * Update these URLs with actual account handles before deployment
 */
export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@suarjason",
} as const

export type SocialPlatform = keyof typeof SOCIAL_LINKS
