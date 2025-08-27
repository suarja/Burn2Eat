import React, { FC, useRef } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  SectionList,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  TouchableOpacity,
} from "react-native"

import { CollapsibleCategorySection } from "@/components/CollapsibleCategorySection"
import { FoodCard } from "@/components/FoodCard"
import { Icon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import {
  SkeletonLoader,
  FoodCardSkeleton,
  CategorySectionSkeleton,
} from "@/components/SkeletonLoader"
import { StickySearchBar } from "@/components/StickySearchBar"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Dish } from "@/domain/nutrition/Dish"
import { useCategoryData } from "@/hooks/useCategoryData"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface HomeScreenProps extends MainTabScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen(props) {
  const { navigation } = props
  const { themed } = useAppTheme()

  const {
    categories,
    categoryData,
    expandedCategory,
    searchText,
    searchResults,
    isLoadingCategories,
    isSearching,
    actions,
  } = useCategoryData()

  const scrollOffset = useRef(0)
  const sectionListRef = useRef<SectionList>(null)

  const handleFoodSelect = (food: Dish) => {
    console.log("Selected food:", food.getName())
    // @ts-ignore - Navigation types complex with nested navigators
    navigation.navigate("Result", { foodId: food.getId() })
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y
  }

  const handleCategoryToggle = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      actions.setExpandedCategory(null)
    } else {
      actions.setExpandedCategory(categoryId)
    }
  }

  const renderSearchResults = () => (
    <FlatList<Dish>
      data={searchResults}
      numColumns={2}
      keyExtractor={(item) => item.getId().toString()}
      renderItem={({ item }) => (
        <View style={themed($searchResultCard)}>
          <FoodCard dish={item} onPress={() => handleFoodSelect(item)} size="medium" />
        </View>
      )}
      ListEmptyComponent={
        isSearching ? (
          <View style={themed($skeletonContainer)}>
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} style={themed($searchResultCard)}>
                <FoodCardSkeleton size="medium" />
              </View>
            ))}
          </View>
        ) : (
          <View style={themed($emptyState)}>
            <Text style={themed($emptyStateText)}>
              {searchText.trim().length >= 2
                ? `Aucun résultat pour "${searchText}"`
                : "Tapez au moins 2 caractères pour rechercher"}
            </Text>
          </View>
        )
      }
      contentContainerStyle={themed($searchResultsContainer)}
    />
  )

  // Convert categories to sections for SectionList
  const sections = categories.map((category) => ({
    title: category.id,
    data: [category], // Each section contains one category
  }))

  // Debug logging
  React.useEffect(() => {
    console.log("🔧 HomeScreen categories:", categories.length, categories)
    console.log("🔧 HomeScreen isLoadingCategories:", isLoadingCategories)
    console.log("🔧 HomeScreen sections:", sections.length, sections)
  }, [categories, isLoadingCategories, sections])

  const renderCategorySection = ({ item: category }: { item: any }) => {
    const data = categoryData.get(category.id)

    return (
      <CollapsibleCategorySection
        category={category}
        dishes={data?.dishes || []}
        isExpanded={expandedCategory === category.id}
        hasMore={data?.hasMore || false}
        isLoadingMore={data?.isLoading || false}
        onToggle={() => handleCategoryToggle(category.id)}
        onDishSelect={handleFoodSelect}
        onLoadMore={() => actions.loadMoreForCategory(category.id)}
        style={themed($categorySection)}
      />
    )
  }

  const isShowingSearch = searchText.trim().length >= 2

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} style={themed($screenContainer)}>
      {/* Search Bar */}
      <View style={themed($searchContainer)}>
        <Icon icon="view" size={20} containerStyle={themed($searchIcon)} />
        <TextField
          value={searchText}
          onChangeText={actions.setSearchText}
          placeholder="Rechercher un plat..."
          containerStyle={themed($searchFieldContainer)}
          inputWrapperStyle={themed($searchInputWrapper)}
          style={themed($searchInput)}
        />
      </View>

      {/* Content */}
      {isShowingSearch ? (
        renderSearchResults()
      ) : (
        <View style={themed($categoriesContainer)}>
          <Text preset="bold" style={themed($sectionTitle)}>
            Catégories ({categories.length})
          </Text>

          {categories.map((category) => (
            <CollapsibleCategorySection
              key={category.id}
              category={category}
              dishes={categoryData.get(category.id)?.dishes || []}
              isExpanded={expandedCategory === category.id}
              hasMore={categoryData.get(category.id)?.hasMore || false}
              isLoadingMore={categoryData.get(category.id)?.isLoading || false}
              onToggle={() => handleCategoryToggle(category.id)}
              onDishSelect={handleFoodSelect}
              onLoadMore={() => actions.loadMoreForCategory(category.id)}
              style={themed($categorySection)}
            />
          ))}
        </View>
      )}
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingTop: spacing.sm, // Space for sticky search bar
})

const $sectionListContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $searchResultsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $searchResultCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.xs,
  marginBottom: spacing.md,
})

const $categorySection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $loadingIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xl,
})

const $emptyState: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.xxl,
  alignItems: "center",
  paddingHorizontal: spacing.lg,
})

const $emptyStateText: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  textAlign: "center",
  color: colors.textDim,
  fontSize: 16,
  marginTop: spacing.lg,
  marginBottom: spacing.md,
  lineHeight: 24,
})

const $skeletonContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  flexWrap: "wrap",
})

const $searchContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral200,
  borderRadius: 12,
  marginHorizontal: spacing.lg,
  marginVertical: spacing.md,
  paddingHorizontal: spacing.md,
  height: 50,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $searchIcon: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginRight: spacing.sm,
})

const $searchFieldContainer: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  marginVertical: 0,
})

const $searchInputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderWidth: 0,
  minHeight: 40,
  backgroundColor: "transparent",
})

const $searchInput: ThemedStyle<any> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  paddingVertical: 0,
})

const $listContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})

const $sectionTitle: ThemedStyle<any> = ({ spacing, colors }) => ({
  fontSize: 18,
  marginBottom: spacing.md,
  marginTop: spacing.md,
  color: colors.text,
})

const $categoriesContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.xl,
})
