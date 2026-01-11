import { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"

import { Icon } from "./Icon"
import { Text } from "./Text"
import type { ConsumptionRecord } from "../../src/domain/history/ConsumptionRecord"
import { useAppTheme } from "../theme/context"
import { spacing } from "../theme/spacing"
import type { ThemedStyle } from "../theme/types"

export interface ConsumptionRecordCardProps {
  record: ConsumptionRecord
  onDelete: (id: string) => void
  style?: ViewStyle
}

/**
 * Component displaying a single consumption record
 * Shows dish name, calories, time, effort, and delete button
 */
export const ConsumptionRecordCard: FC<ConsumptionRecordCardProps> = ({
  record,
  onDelete,
  style,
}) => {
  const { themed, theme } = useAppTheme()

  const handleDelete = () => {
    onDelete(record.getId().toString())
  }

  return (
    <View style={[themed($container), style]}>
      <View style={themed($content)}>
        {/* Dish name */}
        <Text preset="bold" style={themed($dishName)}>
          {record.getDishName()}
        </Text>

        {/* Time and calories */}
        <View style={themed($infoRow)}>
          <Text size="xs" style={themed($timeText)}>
            {record.getFormattedTime()}
          </Text>
          <Text size="xs" style={themed($separator)}>
            •
          </Text>
          <Text size="xs" style={themed($caloriesText)}>
            {Math.round(record.getCalories())} kcal
          </Text>
        </View>

        {/* Effort */}
        <View style={themed($effortRow)}>
          <Text size="xs" style={themed($effortText)}>
            {record.getPrimaryEffort().minutes} min de{" "}
            {record.getPrimaryEffort().activityLabel.toLowerCase()}
          </Text>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        onPress={handleDelete}
        style={themed($deleteButton)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon icon="x" size={20} color={theme.colors.textDim} />
      </TouchableOpacity>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.background,
  borderRadius: spacing.xs,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.sm,
  marginBottom: spacing.xs,
})

const $content: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  gap: spacing.xxs,
})

const $dishName: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
})

const $infoRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

const $timeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $separator: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $caloriesText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $effortRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $effortText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.primary500,
  fontStyle: "italic",
})

const $deleteButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xs,
})
