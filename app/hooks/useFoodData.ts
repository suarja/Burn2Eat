import { Dish } from "@/domain/nutrition/Dish"
import { Dependencies } from "@/services/Dependencies"
import { useCallback, useEffect, useState } from "react"
import { useCurrentProfile } from "./useUserProfile"
import { UserHealthInfo } from "@/domain/physiology"
import { Centimeters, Kilograms } from "@/domain/common/UnitTypes"

interface UseFoodCatalogProps {
    dishId: string
}

export const useFoodCatalog = () => {
    const [catalog, setCatalog] = useState<Dish[] | null>(null)
    const [loading, setLoading]= useState(false)

    const dishUseCase = Dependencies.getFoodCatalogUseCase()
    const {loading: profileLoading, profile} = useCurrentProfile()
    const effortUseCase = Dependencies.calculateEffortUseCase()

    const getFoodCatalog = async() => {
        setLoading(true)
       const data = await dishUseCase.execute()
       setCatalog(data)
    }

    useEffect(() => {
        getFoodCatalog().finally(() => {
            setLoading(false)
        })
    }, [])

    const calculateEffort = (dishId: string) => {
        if (!profile) return
       return  effortUseCase.execute({
        dishId,
        user: UserHealthInfo.create(
         profile.sex,
           profile.weight as Kilograms,
        profile.height as Centimeters,
          profile.preferredActivityKeys

        )
       })
    }

    const findDish = useCallback((dishId : string) => {
        if (!catalog) return null
       const index = catalog?.findIndex((dish ) => {
        console.log("comparing", dish.getId().toString())
            if (dishId === dish.getId().toString()) return true
            return false
        })
        if (index == -1) return null
        const dish = catalog[index]
        console.log("returning", dish, "for index", index)
        return dish
    }, [catalog])

    return {
        data: {catalog, loading: loading || profileLoading, profile},
        actions: {
            calculateEffort,
            findDish

        }
    }
}