import { useCallback, useEffect, useState, useRef } from "react"

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

  // Use ref to get current profile value
  const profileRef = useRef(profile)
  const profileLoadingRef = useRef(profileLoading)

  useEffect(() => {
    profileRef.current = profile
    profileLoadingRef.current = profileLoading
  }, [profile, profileLoading])

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
   * This bypasses the local database lookup and waits for profile to be available
   */
  const calculateEffortForDish = async (dish: Dish) => {
    console.log("🔧 calculateEffortForDish called with:", dish.getName())

    // Wait for profile to be available if still loading
    let currentProfile = profileRef.current
    let currentLoading = profileLoadingRef.current

    if (currentLoading || !currentProfile) {
      console.log("⏳ Profile still loading, waiting...")
      // Simple retry mechanism with timeout
      let retries = 0
      const maxRetries = 50 // 5 seconds maximum wait

      while ((!currentProfile || currentLoading) && retries < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        currentProfile = profileRef.current
        currentLoading = profileLoadingRef.current
        retries++
      }
    }

    if (!currentProfile) {
      console.log("❌ No profile available for effort calculation after waiting")
      return null
    }

    console.log("✅ Profile available, proceeding with calculation")

    try {
      const result = await calculateEffortUseCase.executeWithDish({
        dish: dish,
        user: UserHealthInfo.create(
          currentProfile.sex,
          currentProfile.weight as Kilograms,
          currentProfile.height as Centimeters,
          currentProfile.preferredActivityKeys,
        ),
      })

      console.log("🔧 executeWithDish result:", result)
      return result
    } catch (error) {
      console.error("❌ Error in calculateEffortForDish:", error)
      return null
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
