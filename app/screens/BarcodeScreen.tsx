import { FC } from "react"
import { ViewStyle } from "react-native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
// import { useNavigation } from "@react-navigation/native"

interface BarcodeScreenProps extends AppStackScreenProps<"Barcode"> {}

export const BarcodeScreen: FC<BarcodeScreenProps> = () => {
  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="barcode" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
