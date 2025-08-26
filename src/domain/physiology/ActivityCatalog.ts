import { Activity } from "./Activity"

/**
 * Domain port for accessing physical activity data
 * This is an interface that will be implemented by infrastructure adapters
 */
export interface ActivityCatalog {
  /**
   * Get activity by its key
   */
  getByKey(key: string): Activity | null

  /**
   * Get default/popular activities for initial selection
   */
  listDefaults(): Activity[]

  /**
   * Search activities by name or tag
   */
  search?(query: string): Activity[]

  /**
   * Get activities by intensity level
   */
  getByIntensity?(intensity: "light" | "moderate" | "vigorous"): Activity[]

  /**
   * Get activities within MET range
   */
  getByMETRange?(minMET: number, maxMET: number): Activity[]

  /**
   * Get all available activities
   */
  getAll?(): Activity[]
}
