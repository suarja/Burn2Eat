import { load, save, remove } from "../../../app/utils/storage"
import { Grams, Kilocalories, Minutes } from "../../domain/common/UnitTypes"
import { ConsumptionHistoryRepository } from "../../domain/history/ConsumptionHistoryRepository"
import { ConsumptionRecord } from "../../domain/history/ConsumptionRecord"
import { ConsumptionRecordId } from "../../domain/history/ConsumptionRecordId"
import { DishId } from "../../domain/nutrition/DishId"
import {
  ConsumptionRecordData,
  isValidConsumptionRecordDataArray,
} from "../types/ConsumptionRecordData"

/**
 * MMKV implementation of ConsumptionHistoryRepository
 * Uses the existing Ignite MMKV storage utilities
 *
 * Storage Strategy (MVP):
 * - Single key with array of all records: "consumption-history-all"
 * - Simple and fast for MVP scope
 * - Date filtering done in memory
 * - Can migrate to per-day keys if performance becomes an issue
 */
export class MMKVConsumptionHistoryRepository implements ConsumptionHistoryRepository {
  private readonly HISTORY_KEY = "consumption-history-all"

  /**
   * Convert domain ConsumptionRecord to storage data
   */
  private toData(record: ConsumptionRecord): ConsumptionRecordData {
    return {
      id: record.getId().toString(),
      dishId: record.getDishId().toString(),
      dishName: record.getDishName(),
      calories: record.getCalories(),
      consumedAt: record.getConsumedAt().toISOString(),
      primaryEffort: {
        minutes: record.getPrimaryEffort().minutes,
        activityLabel: record.getPrimaryEffort().activityLabel,
      },
      gramsConsumed: record.getGramsConsumed(),
    }
  }

  /**
   * Convert storage data to domain ConsumptionRecord
   */
  private toDomain(data: ConsumptionRecordData): ConsumptionRecord {
    try {
      const id = ConsumptionRecordId.from(data.id)
      const dishId = DishId.from(data.dishId)

      return ConsumptionRecord.create({
        consumptionId: id,
        dishId,
        dishName: data.dishName,
        calories: data.calories as Kilocalories,
        consumedAt: new Date(data.consumedAt),
        primaryEffort: {
          minutes: data.primaryEffort.minutes as Minutes,
          activityLabel: data.primaryEffort.activityLabel,
        },
        gramsConsumed: data.gramsConsumed !== undefined ? (data.gramsConsumed as Grams) : undefined,
      })
    } catch (error) {
      throw new Error(
        `Failed to convert ConsumptionRecordData to domain: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }
  }

  /**
   * Load all records from storage
   * Returns empty array if no data exists or data is invalid
   */
  private loadAll(): ConsumptionRecordData[] {
    try {
      const data = load<ConsumptionRecordData[]>(this.HISTORY_KEY)

      if (!data) {
        return []
      }

      if (!isValidConsumptionRecordDataArray(data)) {
        console.warn("Invalid consumption history data found in storage, clearing...")
        remove(this.HISTORY_KEY)
        return []
      }

      return data
    } catch (error) {
      console.error("Error loading consumption history:", error)
      return []
    }
  }

  /**
   * Save all records to storage
   */
  private saveAll(records: ConsumptionRecordData[]): boolean {
    try {
      return save(this.HISTORY_KEY, records)
    } catch (error) {
      console.error("Error saving consumption history:", error)
      return false
    }
  }

  /**
   * Save a consumption record
   */
  async save(record: ConsumptionRecord): Promise<ConsumptionRecord> {
    try {
      const allData = this.loadAll()
      const recordData = this.toData(record)

      // Check if record with same ID already exists, replace it
      const existingIndex = allData.findIndex((r) => r.id === recordData.id)
      if (existingIndex >= 0) {
        allData[existingIndex] = recordData
      } else {
        // Add new record
        allData.push(recordData)
      }

      const success = this.saveAll(allData)
      if (!success) {
        throw new Error("Failed to save consumption record to storage")
      }

      return record
    } catch (error) {
      throw new Error(
        `Error saving consumption record: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Find all consumption records for a specific date
   * Returns records sorted by time (most recent first)
   */
  async findByDate(date: Date): Promise<ConsumptionRecord[]> {
    try {
      const allData = this.loadAll()

      // Get start and end of day for filtering
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      // Filter by date
      const filtered = allData.filter((data) => {
        const recordDate = new Date(data.consumedAt)
        return recordDate >= startOfDay && recordDate <= endOfDay
      })

      // Convert to domain and sort by time (most recent first)
      const records = filtered.map((data) => this.toDomain(data))
      records.sort((a, b) => b.getConsumedAt().getTime() - a.getConsumedAt().getTime())

      return records
    } catch (error) {
      console.error("Error finding records by date:", error)
      return []
    }
  }

  /**
   * Find all consumption records across all dates
   * Returns records sorted by time (most recent first)
   */
  async findAll(): Promise<ConsumptionRecord[]> {
    try {
      const allData = this.loadAll()

      // Convert to domain
      const records = allData.map((data) => this.toDomain(data))

      // Sort by time (most recent first)
      records.sort((a, b) => b.getConsumedAt().getTime() - a.getConsumedAt().getTime())

      return records
    } catch (error) {
      console.error("Error finding all records:", error)
      return []
    }
  }

  /**
   * Delete a specific consumption record by ID
   */
  async deleteById(id: ConsumptionRecordId): Promise<boolean> {
    try {
      const allData = this.loadAll()
      const idString = id.toString()

      const initialLength = allData.length
      const filtered = allData.filter((r) => r.id !== idString)

      // If no record was removed, return false
      if (filtered.length === initialLength) {
        return false
      }

      this.saveAll(filtered)
      return true
    } catch (error) {
      console.error("Error deleting consumption record:", error)
      return false
    }
  }

  /**
   * Clear all consumption history
   */
  async clearAll(): Promise<void> {
    try {
      remove(this.HISTORY_KEY)
    } catch (error) {
      throw new Error(
        `Error clearing consumption history: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Check if any records exist for a specific date
   */
  async existsForDate(date: Date): Promise<boolean> {
    try {
      const records = await this.findByDate(date)
      return records.length > 0
    } catch (error) {
      return false
    }
  }

  /**
   * Get count of records for a specific date
   */
  async countByDate(date: Date): Promise<number> {
    try {
      const records = await this.findByDate(date)
      return records.length
    } catch (error) {
      return 0
    }
  }
}
