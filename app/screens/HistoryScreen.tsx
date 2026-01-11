import { FC, useState, useCallback } from "react"
import { View, ViewStyle, TextStyle, FlatList, RefreshControl } from "react-native"

import { ChoiceModal } from "@/components/ChoiceModal"
import { ConsumptionRecordCard } from "@/components/ConsumptionRecordCard"
import { DailySummaryCard } from "@/components/DailySummaryCard"
import { EmptyHistoryView } from "@/components/EmptyHistoryView"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useClearHistory } from "@/hooks/useClearHistory"
import { useDeleteConsumption } from "@/hooks/useDeleteConsumption"
import { useResponsiveSpacing } from "@/hooks/useResponsiveSpacing"
import { useTodayHistory } from "@/hooks/useTodayHistory"
import type { MainTabScreenProps } from "@/navigators/MainTabNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import type { ConsumptionRecord } from "../../src/domain/history/ConsumptionRecord"

interface HistoryScreenProps extends MainTabScreenProps<"History"> {}

/**
 * History Screen - Display today's consumption history with daily summary
 *
 * Features:
 * - Daily summary card with BMR comparison
 * - List of consumed dishes with delete option
 * - Clear all history with confirmation modal
 * - Empty state when no consumption exists
 * - Pull-to-refresh
 * - iPad responsive layout
 */
export const HistoryScreen: FC<HistoryScreenProps> = function HistoryScreen() {
  const { themed, theme } = useAppTheme()
  const { multiplier } = useResponsiveSpacing()

  // Responsive scaling for iPad
  const typographyScale = multiplier > 1 ? 1.7 : 1
  const spacingScale = multiplier > 1 ? 1.3 : 1

  // State
  const [showClearModal, setShowClearModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Hooks
  const { records, summary, loading, error, refresh } = useTodayHistory()
  const { deleteRecord } = useDeleteConsumption()
  const { clearHistory } = useClearHistory()

  /**
   * Handle deleting a single record
   */
  const handleDelete = useCallback(
    async (recordId: string) => {
      const result = await deleteRecord(recordId)
      if (result.success) {
        // Refresh the list to show updated data
        await refresh()
      }
    },
    [deleteRecord, refresh],
  )

  /**
   * Handle clear all history
   */
  const handleClearAll = useCallback(() => {
    setShowClearModal(true)
  }, [])

  /**
   * Handle confirm clear all
   */
  const handleClearConfirm = useCallback(async () => {
    const result = await clearHistory()
    setShowClearModal(false)

    if (result.success) {
      // Refresh to show empty state
      await refresh()
    }
  }, [clearHistory, refresh])

  /**
   * Handle pull-to-refresh
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }, [refresh])

  /**
   * Render a consumption record
   */
  const renderRecord = useCallback(
    ({ item }: { item: ConsumptionRecord }) => {
      return (
        <ConsumptionRecordCard
          record={item}
          onDelete={handleDelete}
          typographyScale={typographyScale}
          spacingScale={spacingScale}
        />
      )
    },
    [handleDelete, typographyScale, spacingScale],
  )

  /**
   * Render empty state
   */
  const renderEmpty = useCallback(() => {
    if (loading) return null
    return <EmptyHistoryView />
  }, [loading])

  /**
   * Render list header (summary card)
   */
  const renderListHeader = useCallback(() => {
    if (!summary || records.length === 0) return null

    return (
      <>
        <DailySummaryCard
          summary={summary}
          typographyScale={typographyScale}
          spacingScale={spacingScale}
        />
        <Text
          preset="formLabel"
          style={[
            themed($sectionTitle),
            {
              fontSize: 15 * typographyScale,
              lineHeight: multiplier > 1 ? 24 * typographyScale : undefined,
            },
          ]}
        >
          Plats consommés ({records.length})
        </Text>
      </>
    )
  }, [summary, records.length, themed, typographyScale, multiplier, spacingScale])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={themed($screenContent)}>
      <Header
        title="Historique"
        rightIcon={records.length > 0 ? "x" : undefined}
        rightText={records.length > 0 ? "Effacer tout" : undefined}
        onRightPress={records.length > 0 ? handleClearAll : undefined}
      />

      <View style={themed($container)}>
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => item.getId().toString()}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={themed($listContent)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.tint}
            />
          }
        />

        {error && (
          <View
            style={[
              themed($errorContainer),
              {
                padding: theme.spacing.md * spacingScale,
                borderRadius: theme.spacing.xs * spacingScale,
                marginTop: theme.spacing.md * spacingScale,
              },
            ]}
          >
            <Text style={[themed($errorText), { fontSize: 14 * typographyScale }]}>{error}</Text>
          </View>
        )}
      </View>

      {/* Clear all confirmation modal */}
      <ChoiceModal
        visible={showClearModal}
        variant="challenge"
        title="Effacer l'historique ?"
        content="Cette action est irréversible. Tous vos enregistrements de consommation seront supprimés."
        primaryButtonText="Effacer"
        secondaryButtonText="Annuler"
        onPrimaryPress={handleClearConfirm}
        onSecondaryPress={() => setShowClearModal(false)}
        onDismiss={() => setShowClearModal(false)}
      />
    </Screen>
  )
}

const $screenContent: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.md,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
  paddingBottom: spacing.xxl,
  flexGrow: 1,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginTop: spacing.md,
  marginBottom: spacing.xs,
})

const $errorContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.angry100,
  // padding, borderRadius, and marginTop are applied inline for responsive scaling
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.angry500,
  textAlign: "center",
  // fontSize is applied inline for responsive scaling
})
