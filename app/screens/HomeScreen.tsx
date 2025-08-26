import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, ScrollView, Dimensions } from "react-native"

import { FoodCard } from "@/components/FoodCard"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Dish } from "@/domain/nutrition/Dish"
import { useFoodCatalog } from "@/hooks/useFoodData"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { colors } from "@/theme/colors"

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen(props) {
  const { navigation } = props
  const { themed } = useAppTheme()

  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<Dish[]>([])

  const {
    data: { catalog, loading },
  } = useFoodCatalog()

  const handleFoodSelect = (food: Dish) => {
    console.log("Selected food:", food.getName())
    // @ts-ignore - Navigation types complex with nested navigators
    navigation.navigate("Result", { foodId: food.getId() })
  }

  useEffect(() => {
    if (!catalog) return
    if (searchText === "") {
      setSearchResults([])
      return
    }
    setSearchResults(catalog.filter((dish) => dish.getName().toString().includes(searchText)))
  }, [searchText])

  if (loading || !catalog)
    return (
      <View>
        <Text>Empty Catalog</Text>
      </View>
    )

  return (
    <Screen preset="scroll" style={themed($screenContainer)}>
      <View style={themed($styles.container)}>
        {/* Search Field */}
        <View style={themed($searchContainer)}>
          <Icon icon="view" size={20} containerStyle={themed($searchIcon)} />
          <TextField
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Rechercher un plat..."
            containerStyle={themed($searchFieldContainer)}
            inputWrapperStyle={themed($searchInputWrapper)}
            style={themed($searchInput)}
          />
        </View>

        {/* Dynamic Foods Section */}
        <Text preset="bold" style={themed($sectionTitle)}>
          {searchResults.length > 0 ? `Résultats (${searchResults.length})` : "Plats:"}
        </Text>
        <ScrollView style={themed($foodScroll)}>
          <View style={themed($foodGrid)}>
            {(searchText.length > 0 ? searchResults : catalog).length ? (searchText.length > 0 ? searchResults : catalog).map((dish) => (
              <FoodCard
                key={dish.getId().toString()}
                dish={dish}
                onPress={() => handleFoodSelect(dish)}
                style={themed($foodCardWrapper)}
                size="medium"
              />
            )): (
              <View style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
                <Text style={{ color: colors.palette.angry500, fontWeight: "500", fontSize: 20, }}>
             
🚫
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        {searchResults.length === 0 && searchText.trim().length >= 2 && (
          <Text style={themed($noResultsText)}>Aucun résultat pour "{searchText}"</Text>
        )}
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
  borderWidth: 0,
  minHeight: 40,
  backgroundColor: colors.palette.accent200

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
const { height: SCREEN_HEIGHT } = Dimensions.get("window")

const $foodGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: spacing.xl,
})
const $foodScroll: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: SCREEN_HEIGHT * 0.6,
  marginVertical: spacing.md,
})

const $foodCardWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "48%",
  marginHorizontal: "1%",
})


const $noResultsText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 14,
  marginTop: spacing.lg,
  marginBottom: spacing.md,
})
