import React, { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Icon } from "@/components/Icon"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"
import type { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"

interface HomeScreenProps extends MainTabScreenProps<"HomeTab"> {}

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen(props) {
  const { navigation } = props
  const { themed } = useAppTheme()
  
  const [searchText, setSearchText] = React.useState("")

  const handleFoodSelect = (foodName: string) => {
    // TODO: Navigate to ResultScreen with food data
    console.log("Selected food:", foodName)
    // @ts-ignore - Navigation types complex with nested navigators
    navigation.navigate("Result", { foodId: foodName.toLowerCase() })
  }

  // Popular foods data (temporary - later from StaticDishRepository)
  const popularFoods = [
    { name: "Pizza", emoji: "🍕", calories: 450 },
    { name: "Burger", emoji: "🍔", calories: 540 },
    { name: "Frites", emoji: "🍟", calories: 365 },
    { name: "Soda", emoji: "🥤", calories: 150 },
    { name: "Glace", emoji: "🍦", calories: 280 },
    { name: "Salade", emoji: "🥗", calories: 120 },
  ]

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <View style={themed($styles.container)}>
        {/* Search Field */}
        <View style={themed($searchContainer)}>
          <Icon 
            icon="view" 
            size={20}
            containerStyle={themed($searchIcon)}
          />
          <TextField
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un plat..."
            containerStyle={themed($searchFieldContainer)}
            inputWrapperStyle={themed($searchInputWrapper)}
            style={themed($searchInput)}
          />
        </View>

        {/* Popular Foods Section */}
        <Text preset="bold" style={themed($sectionTitle)}>
          Populaires:
        </Text>

        <View style={themed($foodGrid)}>
          {popularFoods.map((food, index) => (
            <Button
              key={index}
              preset="default"
              style={themed($foodCard)}
              onPress={() => handleFoodSelect(food.name)}
            >
              <View style={themed($foodCardContent)}>
                <Text style={themed($foodEmoji)}>{food.emoji}</Text>
                <Text preset="bold" style={themed($foodName)}>{food.name}</Text>
                <Text style={themed($foodCalories)}>{food.calories} kcal</Text>
              </View>
            </Button>
          ))}
        </View>

        {/* Scanner Placeholder */}
        <Button
          preset="default"
          style={themed($scannerButton)}
          onPress={() => console.log("Scanner functionality coming soon")}
        >
          Scanner code-barre 📷
        </Button>

        <Text style={themed($comingSoon)}>
          Recherche et scanner à venir dans les prochaines versions...
        </Text>
      </View>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})



const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  marginTop: spacing.xxl,
  paddingHorizontal: spacing.md,
  marginBottom: spacing.xl,
  height: 50,
})

const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginRight: spacing.sm,
})

const $searchFieldContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginVertical: 0,
})

const $searchInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: "transparent",
  borderWidth: 0,
  minHeight: 40,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  paddingVertical: 0,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  fontSize: 18,
  marginBottom: spacing.md,
})

const $foodGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: spacing.xl,
})

const $foodCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: "48%",
  marginBottom: spacing.md,
  padding: spacing.sm,
  backgroundColor: colors.palette.neutral200,
  borderRadius: 8,
})

const $foodCardContent: ThemedStyle<ViewStyle> = ({}) => ({
  alignItems: "center",
})

const $foodEmoji: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 32,
  marginBottom: spacing.xxs,
})

const $foodName: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  color: colors.text,
  marginBottom: spacing.xxxs,
})

const $foodCalories: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $scannerButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  backgroundColor: colors.palette.neutral200,
})

const $comingSoon: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 12,
  fontStyle: "italic",
  marginTop: spacing.md,
})