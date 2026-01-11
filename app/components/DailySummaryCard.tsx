import { FC } from "react"
import { View, ViewStyle, TextStyle } from "react-native"

import { Card } from "./Card"
import { Text } from "./Text"
import type { DailySummary } from "../../src/domain/history/DailySummary"
import { useAppTheme } from "../theme/context"
import { spacing } from "../theme/spacing"
import type { ThemedStyle } from "../theme/types"

export interface DailySummaryCardProps {
  summary: DailySummary | null
  style?: ViewStyle
}

/**
 * Component displaying daily consumption summary with BMR comparison
 * Shows total calories, BMR, surplus/deficit, and target effort
 */
export const DailySummaryCard: FC<DailySummaryCardProps> = ({ summary, style }) => {
  const { themed, theme } = useAppTheme()

  if (!summary) {
    console.log("📊 DailySummaryCard: No summary provided, rendering null")
    return null
  }

  const totalCalories = summary.getTotalCalories()
  const bmr = summary.getBMR()
  const surplus = summary.getSurplus()
  const hasSurplus = summary.hasSurplus()
  const targetEffort = summary.getTargetEffort()

  console.log(
    `📊 DailySummaryCard: Rendering summary - Total: ${totalCalories}, BMR: ${bmr}, Surplus: ${surplus}, HasSurplus: ${hasSurplus}`,
  )

  return (
    <Card
      style={[themed($container), style]}
      preset="default"
      ContentComponent={
        <View style={themed($content)}>
          {/* Header */}
          <Text preset="subheading" style={themed($title)}>
            Aujourd'hui
          </Text>

          {/* Stats */}
          <View style={themed($statsContainer)}>
            <View style={themed($statRow)}>
              <Text style={themed($statLabel)}>Total consommé</Text>
              <Text preset="bold" style={themed($statValue)}>
                {Math.round(totalCalories)} kcal
              </Text>
            </View>

            <View style={themed($statRow)}>
              <Text style={themed($statLabel)}>Métabolisme de base (BMR)</Text>
              <Text preset="bold" style={themed($statValue)}>
                {Math.round(bmr)} kcal
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={themed($divider)} />

          {/* Surplus/Deficit */}
          <View style={themed($resultContainer)}>
            {hasSurplus ? (
              <>
                <Text style={themed($resultLabel)}>Surplus calorique</Text>
                <Text preset="bold" style={themed($surplusValue)}>
                  +{Math.round(surplus)} kcal
                </Text>

                {targetEffort && (
                  <View style={themed($effortContainer)}>
                    <Text style={themed($effortLabel)}>Effort suggéré pour compenser:</Text>
                    <Text preset="bold" style={themed($effortValue)}>
                      {targetEffort.minutes} min de {targetEffort.activityLabel.toLowerCase()}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={themed($resultLabel)}>Déficit calorique</Text>
                <Text preset="bold" style={themed($deficitValue)}>
                  {Math.round(surplus)} kcal
                </Text>
                <Text size="xs" style={themed($deficitHint)}>
                  Vous êtes en dessous de votre BMR
                </Text>
              </>
            )}
          </View>
        </View>
      }
    />
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  marginBottom: spacing.md,
  backgroundColor: colors.palette.neutral100,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  marginBottom: spacing.sm,
  color: colors.text,
})

const $statsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $statRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $statLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
})

const $statValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.border,
  marginVertical: spacing.sm,
})

const $resultContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
})

const $resultLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 13,
  color: colors.textDim,
  textTransform: "uppercase",
})

const $surplusValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  color: colors.palette.angry500,
})

const $deficitValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  color: colors.palette.primary500,
})

const $deficitHint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontStyle: "italic",
})

const $effortContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xs,
  paddingTop: spacing.xs,
  borderTopWidth: 1,
  borderTopColor: colors.border,
  gap: spacing.xxs,
})

const $effortLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 13,
  color: colors.textDim,
})

const $effortValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.palette.primary500,
})
