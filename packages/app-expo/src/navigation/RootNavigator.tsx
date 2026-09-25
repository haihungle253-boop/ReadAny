import { OnboardingNavigator } from "@/components/onboarding/OnboardingNavigator";
import { MissingBookPrompt } from "@/components/shared/MissingBookPrompt";
import BadgesScreen from "@/screens/BadgesScreen";
import { BookChatScreen } from "@/screens/BookChatScreen";
import { BookDetailsScreen } from "@/screens/BookDetailsScreen";
import { FullScreenNotesScreen } from "@/screens/FullScreenNotesScreen";
import { ReaderScreen } from "@/screens/ReaderScreen";
import SkillsScreen from "@/screens/SkillsScreen";
import StatsScreen from "@/screens/StatsScreen";
import { WebDavImportBrowserScreen } from "@/screens/library/WebDavImportBrowserScreen";
import AISettingsScreen from "@/screens/settings/AISettingsScreen";
import AboutScreen from "@/screens/settings/AboutScreen";
import AppearanceSettingsScreen from "@/screens/settings/AppearanceSettingsScreen";
import FeedbackDetailScreen from "@/screens/settings/FeedbackDetailScreen";
import FeedbackScreen from "@/screens/settings/FeedbackScreen";
import FontSettingsScreen from "@/screens/settings/FontSettingsScreen";
import SyncSettingsScreen from "@/screens/settings/SyncSettingsScreen";
import TTSSettingsScreen from "@/screens/settings/TTSSettingsScreen";
import TranslationSettingsScreen from "@/screens/settings/TranslationSettingsScreen";
import VectorModelSettingsScreen from "@/screens/settings/VectorModelSettingsScreen";
import { useSettingsStore } from "@/stores";
/**
 * RootNavigator — top-level stack matching Tauri mobile App.tsx routes exactly.
 */
import { useTheme } from "@/styles/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { WebDavImportSource } from "@readany/core";
import { TabNavigator } from "./TabNavigator";

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
  Reader: { bookId: string; cfi?: string; highlight?: boolean; openTTS?: boolean };
  BookDetails: { bookId: string };
  BookChat: { bookId: string; selectedText?: string; chapterTitle?: string };
  Stats: undefined;
  Badges: undefined;
  Skills: undefined;
  VectorModelSettings: undefined;
  AppearanceSettings: undefined;
  AISettings: undefined;
  TTSSettings: undefined;
  TranslationSettings: undefined;
  SyncSettings: undefined;
  About: undefined;
  Feedback: undefined;
  FeedbackDetail: { issueNumber: number; title: string };
  FullScreenNotes: { bookId: string };
  FontSettings: undefined;
  WebDavImportBrowser: { source: WebDavImportSource };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { hasCompletedOnboarding, _hasHydrated } = useSettingsStore();
  const { isEink } = useTheme();
  const pushOptions = { animation: isEink ? "none" : "slide_from_right" } as const;

  const showOnboarding = !hasCompletedOnboarding && _hasHydrated;

  if (!_hasHydrated) return null;

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false, ...(isEink && { animation: "none" }) }}
      >
        {showOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen
              name="Reader"
              component={ReaderScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="BookDetails"
              component={BookDetailsScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="BookChat"
              component={BookChatScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="Stats"
              component={StatsScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="Badges"
              component={BadgesScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="Skills"
              component={SkillsScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="VectorModelSettings"
              component={VectorModelSettingsScreen}
              options={pushOptions}
            />
            <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
            <Stack.Screen name="AISettings" component={AISettingsScreen} />
            <Stack.Screen name="TTSSettings" component={TTSSettingsScreen} />
            <Stack.Screen name="TranslationSettings" component={TranslationSettingsScreen} />
            <Stack.Screen name="SyncSettings" component={SyncSettingsScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
            <Stack.Screen
              name="FeedbackDetail"
              component={FeedbackDetailScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="FontSettings"
              component={FontSettingsScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="WebDavImportBrowser"
              component={WebDavImportBrowserScreen}
              options={pushOptions}
            />
            <Stack.Screen
              name="FullScreenNotes"
              component={FullScreenNotesScreen}
              options={pushOptions}
            />
          </>
        )}
      </Stack.Navigator>
      <MissingBookPrompt />
    </>
  );
}
