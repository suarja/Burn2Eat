// Infrastructure adapters
import { MMKVUserHealthInfoRepository } from "./MMKVUserHealthInfoRepository"

export { MMKVUserHealthInfoRepository } from "./MMKVUserHealthInfoRepository"
export { StaticActivityCatalog } from "./StaticActivityCatalog"
export { StaticDishRepository } from "./StaticDishRepository"

export const mmkvUserhealthInfoRepository = new MMKVUserHealthInfoRepository()
