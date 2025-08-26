import { ActivityOption } from "@/components/ActivityWheelPicker"
import { Activity } from "@/domain/physiology"
import { Dependencies } from "@/services/Dependencies"

export const useActivityCatalog = () => {
  const ACTIVITIES: ActivityOption[] = fromCatalogToOption(
    Dependencies.activityCatalog().getAll?.() || [],
  )

  return {
    data: {
      catalog: ACTIVITIES,
    },
    actions: {},
  }
}

function fromCatalogToOption(activities: Activity[]): ActivityOption[] {
  return activities.map((act) => ({
    key: act.getKey(),
    name: act.getLabel(),
    met: act.getMET() as unknown as number,
  }))
}
