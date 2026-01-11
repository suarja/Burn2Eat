import { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"

import { Icon } from "./Icon"
import { Text } from "./Text"
import type { ConsumptionRecord } from "../../src/domain/history/ConsumptionRecord"
import { useAppTheme } from "../theme/context"
import type { ThemedStyle } from "../theme/types"

export interface ConsumptionRecordCardProps {
  record: ConsumptionRecord
  onDelete: (id: string) => void
  style?: ViewStyle
  typographyScale?: number
  spacingScale?: number
}

/**
 * Component displaying a single consumption record
 * Shows dish name, calories, time, effort, and delete button
 */
export const ConsumptionRecordCard: FC<ConsumptionRecordCardProps> = ({
  record,
  onDelete,
  style,
  typographyScale = 1,
  spacingScale = 1,
}) => {
  const { themed, theme } = useAppTheme()

  const handleDelete = () => {
    onDelete(record.getId().toString())
  }

  return (
    <View
      style={[
        themed($container),
        style,
        {
          borderRadius: theme.spacing.xs * spacingScale,
          padding: theme.spacing.sm * spacingScale,
          marginBottom: theme.spacing.xs * spacingScale,
        },
      ]}
    >
      <View style={[themed($content), { gap: theme.spacing.xxs * spacingScale }]}>
        {/* Dish name */}
        <Text
          preset="bold"
          style={[
            themed($dishName),
            { fontSize: 16 * typographyScale, lineHeight: 24 * typographyScale },
          ]}
        >
          {record.getDishName()}
        </Text>

        {/* Time and calories */}
        <View style={[themed($infoRow), { gap: theme.spacing.xs * spacingScale }]}>
          <Text
            size="xs"
            style={[
              themed($timeText),
              { fontSize: 12 * typographyScale, lineHeight: 18 * typographyScale },
            ]}
          >
            {record.getFormattedTime()}
          </Text>
          <Text size="xs" style={[themed($separator), { fontSize: 12 * typographyScale }]}>
            •
          </Text>
          <Text
            size="xs"
            style={[
              themed($caloriesText),
              { fontSize: 12 * typographyScale, lineHeight: 18 * typographyScale },
            ]}
          >
            {Math.round(record.getCalories())} kcal
          </Text>
        </View>

        {/* Effort */}
        <View style={themed($effortRow)}>
          <Text
            size="xs"
            style={[
              themed($effortText),
              { fontSize: 12 * typographyScale, lineHeight: 18 * typographyScale },
            ]}
          >
            {record.getPrimaryEffort().minutes} min de{" "}
            {record.getPrimaryEffort().activityLabel.toLowerCase()}
          </Text>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        onPress={handleDelete}
        style={[themed($deleteButton), { padding: theme.spacing.xs * spacingScale }]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon icon="x" size={20 * typographyScale} color={theme.colors.textDim} />
      </TouchableOpacity>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  // Remaining styles applied inline for scaling
})

const $content: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  // Remaining styles applied inline for scaling
})

const $dishName: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  // Remaining styles applied inline for scaling
})

const $infoRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  // Remaining styles applied inline for scaling
})

const $timeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  // Remaining styles applied inline for scaling
})

const $separator: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  // Remaining styles applied inline for scaling
})

const $caloriesText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  // Remaining styles applied inline for scaling
})

const $effortRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $effortText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontStyle: "italic",
  // Remaining styles applied inline for scaling
})

const $deleteButton: ThemedStyle<ViewStyle> = () => ({
  // Remaining styles applied inline for scaling
})
