import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, ActivityIndicator } from "react-native"

import { FoodCard } from "@/components/FoodCard"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Dish } from "@/domain/nutrition/Dish"
import { useFoodCatalog } from "@/hooks/useFoodData"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"
import { colors } from "@/theme/colors"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

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

  const displayData = searchText.length > 0 ? searchResults : catalog || []

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screenContainer)}>
      <FlatList<Dish>
        contentContainerStyle={themed([ $listContentContainer])}
        data={displayData}
        numColumns={2}
        keyExtractor={(item) => item.getId().toString()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator />
          ) : (
            <View style={themed($emptyState)}>
              <Text style={themed($emptyStateText)}>
                {searchText.trim().length >= 2
                  ? `Aucun résultat pour "${searchText}"`
                  : "Aucun plat disponible"}
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View>
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

            {/* Section Title */}
            <Text preset="bold" style={themed($sectionTitle)}>
              {displayData.length > 0
                ? searchText.length > 0
                  ? `Résultats (${displayData.length})`
                  : `Plats (${displayData.length})`
                : ""}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={themed($foodCardContainer)}>
            <FoodCard
              dish={item}
              onPress={() => handleFoodSelect(item)}
              style={themed($foodCardWrapper)}
              size="medium"
            />
          </View>
        )}
      />
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
  marginTop: spacing.md,
  paddingHorizontal: spacing.md,
  marginBottom: spacing.sm,
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
  backgroundColor: colors.palette.accent200,
})

const $searchInput: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  paddingVertical: 0,
})

const $listContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  marginBottom: spacing.md,
  marginTop: spacing.md,
})

const $foodCardContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.xs,
  marginBottom: spacing.md,
})

const $foodCardWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xxl,
  alignItems: "center",
})

const $emptyStateText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 16,
  marginTop: spacing.lg,
  marginBottom: spacing.md,
})
