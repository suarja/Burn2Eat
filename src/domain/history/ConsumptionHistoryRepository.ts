import { ConsumptionRecord } from "./ConsumptionRecord"
import { ConsumptionRecordId } from "./ConsumptionRecordId"

/**
 * Domain port (interface) for consumption history persistence
 * Follows the Repository pattern from DDD
 *
 * This interface defines what the domain needs from persistence,
 * without depending on any specific storage implementation (MMKV, SQLite, etc.)
 */
export interface ConsumptionHistoryRepository {
  /**
   * Save a consumption record
   * If a record with the same ID exists, it should be updated
   *
   * @param record The consumption record to save
   * @returns Promise resolving to the saved record
   */
  save(record: ConsumptionRecord): Promise<ConsumptionRecord>

  /**
   * Find all consumption records for a specific date
   * Returns records sorted by consumption time (most recent first)
   *
   * @param date The date to filter by (only year/month/day matter, time is ignored)
   * @returns Promise resolving to array of records for that date
   */
  findByDate(date: Date): Promise<ConsumptionRecord[]>

  /**
   * Find all consumption records across all dates
   * Returns records sorted by consumption time (most recent first)
   *
   * @returns Promise resolving to all records
   */
  findAll(): Promise<ConsumptionRecord[]>

  /**
   * Delete a specific consumption record by ID
   *
   * @param id The ID of the record to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  deleteById(id: ConsumptionRecordId): Promise<boolean>

  /**
   * Clear all consumption history
   * This is a destructive operation and should be used with caution
   *
   * @returns Promise resolving when all records are deleted
   */
  clearAll(): Promise<void>

  /**
   * Check if any records exist for a specific date
   *
   * @param date The date to check
   * @returns Promise resolving to true if records exist, false otherwise
   */
  existsForDate(date: Date): Promise<boolean>

  /**
   * Get count of records for a specific date
   *
   * @param date The date to count records for
   * @returns Promise resolving to the count
   */
  countByDate(date: Date): Promise<number>
}
