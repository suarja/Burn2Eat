// Quick test script to verify our food additions
const { mergeAllFoodData } = require("./src/infrastructure/data/utils/dataset-merger")

const { mergedData, stats } = mergeAllFoodData()

console.log("=== FOOD DATASET STATS ===")
console.log(`Total items: ${stats.totalCount}`)
console.log(`Original: ${stats.originalCount}`)
console.log(`New additions: ${stats.newItemsCount}`)
console.log(`Duplicates: ${stats.duplicateIds.length}`)

console.log("\n=== SAMPLE NEW FOODS ===")
const popularSearches = ["big mac", "starbucks", "oreo", "rice", "protein"]

popularSearches.forEach((search) => {
  const found = mergedData.filter(
    (food) =>
      food.names.en.toLowerCase().includes(search) ||
      food.tags?.some((tag) => tag.toLowerCase().includes(search)),
  )
  console.log(`"${search}": ${found.length} results - ${found.map((f) => f.names.en).join(", ")}`)
})

console.log("\n=== CATEGORY BREAKDOWN ===")
const categories = {}
mergedData.forEach((food) => {
  categories[food.category] = (categories[food.category] || 0) + 1
})
Object.entries(categories).forEach(([cat, count]) => {
  console.log(`${cat}: ${count} items`)
})
