import React, { useState } from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native"

import { useActivityCatalog } from "@/hooks/useActivityCatalog"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Text } from "./Text"

export interface ActivityPickerButtonProps {
  /**
   * Currently selected activity key
   */
  selectedActivity: string | null
  /**
   * Callback when activity is selected
   */
  onActivitySelect: (activityKey: string) => void
  /**
   * Container style override
   */
  style?: ViewStyle
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean
}

export const ActivityPickerButton: React.FC<ActivityPickerButtonProps> = ({
  selectedActivity,
  onActivitySelect,
  style,
  disabled = false,
}) => {
  const { themed, theme } = useAppTheme()
  const [modalVisible, setModalVisible] = useState(false)

  const {
    data: { catalog },
  } = useActivityCatalog()

  // Find selected activity
  const selectedActivityData = catalog.find((activity) => activity.key === selectedActivity)

  const handleSelectActivity = (activityKey: string) => {
    onActivitySelect(activityKey)
    setModalVisible(false)
  }

  return (
    <>
      <TouchableOpacity
        style={[themed($pickerButton), style]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={themed($buttonContent)}>
          <Text style={themed($selectedActivityText)}>
            {selectedActivityData?.name || "Sélectionner une activité"}
          </Text>
          <Text style={themed($caretIcon)}>▼</Text>
        </View>
        {selectedActivityData && selectedActivityData.met != null && (
          <Text style={themed($metText)}>{selectedActivityData.met.toFixed(1)} MET</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={themed($modalOverlay)}>
          <View style={themed($modalContent)}>
            <View style={themed($modalHeader)}>
              <Text style={themed($modalTitle)}>Choisis ton activité</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Text style={themed($closeButton)}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={catalog}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.key === selectedActivity
                return (
                  <TouchableOpacity
                    style={[themed($activityItem), isSelected && themed($selectedItem)]}
                    onPress={() => handleSelectActivity(item.key)}
                    activeOpacity={0.6}
                  >
                    <View style={themed($activityItemContent)}>
                      <Text style={[themed($activityName), isSelected && themed($selectedText)]}>
                        {item.name}
                      </Text>
                      {item.met != null && (
                        <Text
                          style={[themed($activityMet), isSelected && themed($selectedMetText)]}
                        >
                          {item.met.toFixed(1)} MET
                        </Text>
                      )}
                    </View>
                    {isSelected && <Text style={themed($checkIcon)}>✓</Text>}
                  </TouchableOpacity>
                )
              }}
              ItemSeparatorComponent={() => <View style={themed($separator)} />}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const $pickerButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 12,
  padding: spacing.md,
  minHeight: 60,
})

const $buttonContent: ThemedStyle<ViewStyle> = ({}) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
})

const $selectedActivityText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 16,
  fontFamily: typography.primary.medium,
  color: colors.text,
  flex: 1,
})

const $metText: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
})

const $modalOverlay: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "flex-end",
})

const $modalContent: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingTop: spacing.md,
  paddingBottom: spacing.xl,
  maxHeight: "80%",
})

const $modalHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(0, 0, 0, 0.1)",
})

const $modalTitle: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontSize: 18,
  fontFamily: typography.primary.bold,
  color: colors.text,
})

const $activityItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
})

const $selectedItem: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.primary500,
})

const $activityItemContent: ThemedStyle<ViewStyle> = ({}) => ({
  flex: 1,
})

const $activityName: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontSize: 15,
  fontFamily: typography.primary.medium,
  color: colors.text,
  marginBottom: 2,
})

const $selectedText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral700,
})

const $activityMet: ThemedStyle<TextStyle> = ({ typography, colors }) => ({
  fontSize: 12,
  fontFamily: typography.primary.normal,
  color: colors.textDim,
})

const $selectedMetText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral200,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.palette.neutral200,
})

const $caretIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $closeButton: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  fontWeight: "300",
  color: colors.text,
})

const $checkIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  fontWeight: "bold",
  color: colors.palette.primary500,
})
