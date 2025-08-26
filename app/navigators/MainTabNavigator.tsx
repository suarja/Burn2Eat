import { TextStyle, ViewStyle } from "react-native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { translate } from "@/i18n/translate"
import { DemoDebugScreen } from "@/screens/DemoDebugScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { ProfileSetupScreen } from "@/screens/ProfileSetupScreen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type MainTabParamList = {
  Home: undefined
  Profile: undefined
  DebugTab: undefined
  // HistoryTab: undefined // Will add later
}

/**
 * Helper for automatically generating navigation prop types for each route.
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainTabParamList>()

/**
 * This is the main tab navigator for Burn2Eat with a bottom tab bar.
 */
export function MainTabNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: themed([$tabBar, { paddingBottom: Math.max(bottom - 10, 10) }]),
        tabBarActiveTintColor: colors.palette.primary500,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: themed($tabBarLabel),
        tabBarItemStyle: themed($tabBarItem),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="view"
              size={30}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileSetupScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="settings"
              size={30}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />

      <Tab.Screen
        name="DebugTab"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: "Historique",
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="more"
              size={24}
              color={focused ? colors.palette.primary500 : colors.textDim}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.border,
  borderTopWidth: 1,
  paddingTop: spacing.sm,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography, spacing }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  marginTop: spacing.xxxs,
})
