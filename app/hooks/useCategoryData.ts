import { useCallback, useEffect, useState, useMemo, useRef } from "react"

import { Dish } from "@/domain/nutrition/Dish"
import { CategoryInfo } from "@/domain/nutrition/DishRepository"
import { Dependencies } from "../services/Dependencies"

export interface CategoryDishData {
  category: CategoryInfo
  dishes: Dish[]
  hasMore: boolean
  isLoading: boolean
  page: number
}

export interface UseCategoryDataReturn {
  categories: CategoryInfo[]
  categoryData: Map<string, CategoryDishData>
  expandedCategory: string | null
  searchText: string
  searchResults: Dish[]
  isLoadingCategories: boolean
  isSearching: boolean
  actions: {
    setExpandedCategory: (categoryId: string | null) => void
    setSearchText: (text: string) => void
    loadMoreForCategory: (categoryId: string) => Promise<void>
    refreshCategory: (categoryId: string) => Promise<void>
  }
}

const DISHES_PER_PAGE = 6

export const useCategoryData = (): UseCategoryDataReturn => {
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [categoryData, setCategoryData] = useState<Map<string, CategoryDishData>>(new Map())
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<Dish[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const getFoodCatalogUseCase = Dependencies.getFoodCatalogUseCase()

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  // Debounced search to improve performance
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch()
    }, 300) // 300ms debounce
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchText])

  const loadCategories = async () => {
    try {
      setIsLoadingCategories(true)
      console.log("🔧 Loading categories...")
      const categoriesData = await getFoodCatalogUseCase.getCategories()
      console.log("🔧 Categories loaded:", categoriesData.length, categoriesData)
      
      // If no categories, add a fallback test category
      if (categoriesData.length === 0) {
        console.log("⚠️ No categories found, using fallback")
        setCategories([
          {
            id: "fast-food",
            name: "Fast Food",
            icon: "🍔",
            count: 10,
            description: "Test category"
          }
        ])
      } else {
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error("❌ Failed to load categories:", error)
      // Add fallback category on error
      setCategories([
        {
          id: "fast-food",
          name: "Fast Food",
          icon: "🍔",
          count: 10,
          description: "Test category"
        }
      ])
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const handleSearch = async () => {
    if (searchText.trim().length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    try {
      setIsSearching(true)
      // Use the existing catalog and filter locally for now
      const allDishes = await getFoodCatalogUseCase.execute()
      const filtered = allDishes.filter((dish) =>
        dish.getName().toLowerCase().includes(searchText.toLowerCase())
      )
      setSearchResults(filtered)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const loadDishesForCategory = useCallback(
    async (categoryId: string, page: number = 0): Promise<Dish[]> => {
      try {
        const dishes = await getFoodCatalogUseCase.getByCategoryPaginated({
          category: categoryId,
          limit: DISHES_PER_PAGE,
          page,
        })
        return dishes
      } catch (error) {
        console.error(`Failed to load dishes for category ${categoryId}:`, error)
        return []
      }
    },
    [getFoodCatalogUseCase]
  )

  const handleSetExpandedCategory = useCallback(
    async (categoryId: string | null) => {
      setExpandedCategory(categoryId)

      if (categoryId && !categoryData.has(categoryId)) {
        // Load initial dishes for this category
        setCategoryData((prev) => {
          const newMap = new Map(prev)
          const category = categories.find((c) => c.id === categoryId)
          if (category) {
            newMap.set(categoryId, {
              category,
              dishes: [],
              hasMore: true,
              isLoading: true,
              page: 0,
            })
          }
          return newMap
        })

        const dishes = await loadDishesForCategory(categoryId, 0)
        setCategoryData((prev) => {
          const newMap = new Map(prev)
          const existingData = newMap.get(categoryId)
          if (existingData) {
            newMap.set(categoryId, {
              ...existingData,
              dishes,
              hasMore: dishes.length === DISHES_PER_PAGE,
              isLoading: false,
              page: 0,
            })
          }
          return newMap
        })
      }
    },
    [categoryData, categories, loadDishesForCategory]
  )

  const loadMoreForCategory = useCallback(
    async (categoryId: string) => {
      const currentData = categoryData.get(categoryId)
      if (!currentData || currentData.isLoading || !currentData.hasMore) {
        return
      }

      const nextPage = currentData.page + 1

      setCategoryData((prev) => {
        const newMap = new Map(prev)
        const existingData = newMap.get(categoryId)
        if (existingData) {
          newMap.set(categoryId, { ...existingData, isLoading: true })
        }
        return newMap
      })

      const newDishes = await loadDishesForCategory(categoryId, nextPage)

      setCategoryData((prev) => {
        const newMap = new Map(prev)
        const existingData = newMap.get(categoryId)
        if (existingData) {
          newMap.set(categoryId, {
            ...existingData,
            dishes: [...existingData.dishes, ...newDishes],
            hasMore: newDishes.length === DISHES_PER_PAGE,
            isLoading: false,
            page: nextPage,
          })
        }
        return newMap
      })
    },
    [categoryData, loadDishesForCategory]
  )

  const refreshCategory = useCallback(
    async (categoryId: string) => {
      setCategoryData((prev) => {
        const newMap = new Map(prev)
        const existingData = newMap.get(categoryId)
        if (existingData) {
          newMap.set(categoryId, {
            ...existingData,
            dishes: [],
            isLoading: true,
            page: 0,
            hasMore: true,
          })
        }
        return newMap
      })

      const dishes = await loadDishesForCategory(categoryId, 0)

      setCategoryData((prev) => {
        const newMap = new Map(prev)
        const existingData = newMap.get(categoryId)
        if (existingData) {
          newMap.set(categoryId, {
            ...existingData,
            dishes,
            hasMore: dishes.length === DISHES_PER_PAGE,
            isLoading: false,
            page: 0,
          })
        }
        return newMap
      })
    },
    [loadDishesForCategory]
  )

  const actions = useMemo(
    () => ({
      setExpandedCategory: handleSetExpandedCategory,
      setSearchText,
      loadMoreForCategory,
      refreshCategory,
    }),
    [handleSetExpandedCategory, loadMoreForCategory, refreshCategory]
  )

  return {
    categories,
    categoryData,
    expandedCategory,
    searchText,
    searchResults,
    isLoadingCategories,
    isSearching,
    actions,
  }
}