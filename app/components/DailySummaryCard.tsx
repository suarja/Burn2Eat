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
  typographyScale?: number
  spacingScale?: number
}

/**
 * Component displaying daily consumption summary with BMR comparison
 * Shows total calories, BMR, surplus/deficit, and target effort
 */
export const DailySummaryCard: FC<DailySummaryCardProps> = ({
  summary,
  style,
  typographyScale = 1,
  spacingScale = 1,
}) => {
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
      style={[themed($container), style, { marginBottom: theme.spacing.md * spacingScale }]}
      preset="default"
      ContentComponent={
        <View style={[themed($content), { padding: theme.spacing.md * spacingScale }]}>
          {/* Header */}
          <Text
            preset="subheading"
            style={[
              themed($title),
              {
                marginBottom: theme.spacing.sm * spacingScale,
                fontSize: 20 * typographyScale,
                lineHeight: 30 * typographyScale,
              },
            ]}
          >
            Aujourd'hui
          </Text>

          {/* Stats */}
          <View style={[themed($statsContainer), { gap: theme.spacing.xs * spacingScale }]}>
            <View style={themed($statRow)}>
              <Text
                style={[
                  themed($statLabel),
                  { fontSize: 14 * typographyScale, lineHeight: 21 * typographyScale },
                ]}
              >
                Total consommé
              </Text>
              <Text
                preset="bold"
                style={[
                  themed($statValue),
                  { fontSize: 16 * typographyScale, lineHeight: 24 * typographyScale },
                ]}
              >
                {Math.round(totalCalories)} kcal
              </Text>
            </View>

            <View style={themed($statRow)}>
              <Text
                style={[
                  themed($statLabel),
                  { fontSize: 14 * typographyScale, lineHeight: 21 * typographyScale },
                ]}
              >
                Métabolisme de base (BMR)
              </Text>
              <Text
                preset="bold"
                style={[
                  themed($statValue),
                  { fontSize: 16 * typographyScale, lineHeight: 24 * typographyScale },
                ]}
              >
                {Math.round(bmr)} kcal
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={[themed($divider), { marginVertical: theme.spacing.sm * spacingScale }]}
          />

          {/* Surplus/Deficit */}
          <View style={[themed($resultContainer), { gap: theme.spacing.xs * spacingScale }]}>
            {hasSurplus ? (
              <>
                <Text
                  style={[
                    themed($resultLabel),
                    { fontSize: 13 * typographyScale, lineHeight: 19 * typographyScale },
                  ]}
                >
                  Surplus calorique
                </Text>
                <Text
                  preset="bold"
                  style={[
                    themed($surplusValue),
                    { fontSize: 24 * typographyScale, lineHeight: 36 * typographyScale },
                  ]}
                >
                  +{Math.round(surplus)} kcal
                </Text>

                {targetEffort && (
                  <View
                    style={[
                      themed($effortContainer),
                      {
                        marginTop: theme.spacing.xs * spacingScale,
                        paddingTop: theme.spacing.xs * spacingScale,
                        gap: theme.spacing.xxs * spacingScale,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        themed($effortLabel),
                        { fontSize: 13 * typographyScale, lineHeight: 19 * typographyScale },
                      ]}
                    >
                      Effort suggéré pour compenser:
                    </Text>
                    <Text
                      preset="bold"
                      style={[
                        themed($effortValue),
                        { fontSize: 16 * typographyScale, lineHeight: 24 * typographyScale },
                      ]}
                    >
                      {targetEffort.minutes} min de {targetEffort.activityLabel.toLowerCase()}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text
                  style={[
                    themed($resultLabel),
                    { fontSize: 13 * typographyScale, lineHeight: 19 * typographyScale },
                  ]}
                >
                  Déficit calorique
                </Text>
                <Text
                  preset="bold"
                  style={[
                    themed($deficitValue),
                    { fontSize: 24 * typographyScale, lineHeight: 36 * typographyScale },
                  ]}
                >
                  {Math.round(surplus)} kcal
                </Text>
                <Text
                  size="xs"
                  style={[
                    themed($deficitHint),
                    { fontSize: 12 * typographyScale, lineHeight: 18 * typographyScale },
                  ]}
                >
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
  backgroundColor: colors.palette.neutral100,
  // marginBottom is applied inline for scaling
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // padding is applied inline for scaling
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  // marginBottom, fontSize, and lineHeight are applied inline for scaling
})

const $statsContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // gap is applied inline for scaling
})

const $statRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
})

const $statLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  // fontSize and lineHeight are applied inline for scaling
})

const $statValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  // fontSize and lineHeight are applied inline for scaling
})

const $divider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.border,
  // marginVertical is applied inline for scaling
})

const $resultContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  // gap is applied inline for scaling
})

const $resultLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textTransform: "uppercase",
  // fontSize and lineHeight are applied inline for scaling
})

const $surplusValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.angry500,
  // fontSize and lineHeight are applied inline for scaling
})

const $deficitValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  // fontSize and lineHeight are applied inline for scaling
})

const $deficitHint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontStyle: "italic",
  // fontSize and lineHeight are applied inline for scaling
})

const $effortContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  borderTopWidth: 1,
  borderTopColor: colors.border,
  // marginTop, paddingTop, and gap are applied inline for scaling
})

const $effortLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  // fontSize and lineHeight are applied inline for scaling
})

const $effortValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  // fontSize and lineHeight are applied inline for scaling
})
