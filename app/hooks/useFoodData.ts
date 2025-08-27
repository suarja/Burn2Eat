import { useCallback, useEffect, useState } from "react"

import { Centimeters, Kilograms } from "@/domain/common/UnitTypes"
import { Dish } from "@/domain/nutrition/Dish"
import { UserHealthInfo } from "@/domain/physiology"
import { Dependencies } from "@/services/Dependencies"

import { useCurrentProfile } from "./useUserProfile"

export const useFoodCatalog = () => {
  const [catalog, setCatalog] = useState<Dish[] | null>(null)
  const [loading, setLoading] = useState(false)

  const getDishUseCase = Dependencies.getFoodCatalogUseCase()
  const { loading: profileLoading, profile } = useCurrentProfile()
  const calculateEffortUseCase = Dependencies.calculateEffortUseCase()

  useEffect(() => {
    getFoodCatalog().finally(() => {
      setLoading(false)
    })
  }, [])

  const getFoodCatalog = async () => {
    setLoading(true)
    const data = await getDishUseCase.execute()
    setCatalog(data)
  }

  const calculateEffort = (dishId: string) => {
    if (!profile) return
    return calculateEffortUseCase.execute({
      dishId,
      user: UserHealthInfo.create(
        profile.sex,
        profile.weight as Kilograms,
        profile.height as Centimeters,
        profile.preferredActivityKeys,
      ),
    })
  }

  /**
   * Calculate effort for a dish object directly (for barcode scanned dishes)
   * This bypasses the local database lookup
   */
  const calculateEffortForDish = (dish: Dish) => {
    console.log("🔧 calculateEffortForDish called with:", dish.getName())
    
    if (!profile) {
      console.log("❌ No profile available for effort calculation")
      return Promise.resolve(null)
    }
    
    console.log("✅ Profile available, proceeding with calculation")
    
    try {
      const result = calculateEffortUseCase.executeWithDish({
        dish: dish,
        user: UserHealthInfo.create(
          profile.sex,
          profile.weight as Kilograms,
          profile.height as Centimeters,
          profile.preferredActivityKeys,
        ),
      })
      
      console.log("🔧 executeWithDish result:", result)
      return result
    } catch (error) {
      console.error("❌ Error in calculateEffortForDish:", error)
      return Promise.resolve(null)
    }
  }

  const findDish = useCallback(
    (dishId: string) => {
      if (!catalog) return null
      const index = catalog?.findIndex((dish) => {
        if (dishId === dish.getId().toString()) return true
        return false
      })
      if (index == -1) return null
      const dish = catalog[index]
      return dish
    },
    [catalog],
  )

  return {
    data: { catalog, loading: loading || profileLoading, profile },
    actions: {
      calculateEffort,
      calculateEffortForDish,
      findDish,
    },
  }
}
