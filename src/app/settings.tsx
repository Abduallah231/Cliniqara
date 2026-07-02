import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import AppTopBar from "@/components/common/AppTopBar";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import {
  COLORS,
  SPACING,
  TYPOGRAPHY
} from "@/theme";

import { useState } from "react";

export default function SettingsScreen() {
  const [theme, setTheme] = useState("System");
  const [language, setLanguage] =
    useState("English");
  const [fontSize, setFontSize] =
    useState("Medium");
  const [appLock, setAppLock] =
    useState(false);
  const [biometric, setBiometric] =
    useState(false);

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title="Settings"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <SectionHeader title="Doctor Profile" />

        <AppCard>
          <AppTextField
            label="Full Name"
            value="Dr. Abdullah"
            editable={false}
          />

          <AppTextField
            label="Specialty"
            value="Family Medicine"
            editable={false}
          />

        </AppCard>

        <SectionHeader title="Clinic" />

        <Pressable
          onPress={() =>
            router.push(
              "/clinic-management"
            )
          }
        >
          <AppCard style={styles.row}>
            <View style={styles.left}>
              <Ionicons
                name="business-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.title}>
                Clinic Management
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </AppCard>
        </Pressable>

        <SectionHeader title="Appearance" />

        <AppCard style={styles.chips}>
          <AppChip
            label="Light"
            selected={
              theme === "Light"
            }
            onPress={() =>
              setTheme("Light")
            }
          />

          <AppChip
            label="Dark"
            selected={
              theme === "Dark"
            }
            onPress={() =>
              setTheme("Dark")
            }
          />

          <AppChip
            label="System"
            selected={
              theme === "System"
            }
            onPress={() =>
              setTheme("System")
            }
          />
        </AppCard>

        <SectionHeader title="Language" />

        <AppCard style={styles.chips}>
          <AppChip
            label="English"
            selected={
              language === "English"
            }
            onPress={() =>
              setLanguage(
                "English"
              )
            }
          />

          <AppChip
            label="العربية"
            selected={
              language === "العربية"
            }
            onPress={() =>
              setLanguage(
                "العربية"
              )
            }
          />
        </AppCard>

        <SectionHeader title="Font Size" />

        <AppCard style={styles.chips}>
          <AppChip
            label="Small"
            selected={
              fontSize === "Small"
            }
            onPress={() =>
              setFontSize("Small")
            }
          />

          <AppChip
            label="Medium"
            selected={
              fontSize === "Medium"
            }
            onPress={() =>
              setFontSize("Medium")
            }
          />

          <AppChip
            label="Large"
            selected={
              fontSize === "Large"
            }
            onPress={() =>
              setFontSize("Large")
            }
          />
        </AppCard>
                <SectionHeader title="Privacy & Security" />

        <AppCard>

          <Pressable
            style={styles.settingRow}
            onPress={() =>
              setAppLock(!appLock)
            }
          >
            <Text style={styles.settingTitle}>
              App Lock
            </Text>

            <AppChip
              label={
                appLock
                  ? "On"
                  : "Off"
              }
              selected={appLock}
              onPress={() =>
                setAppLock(!appLock)
              }
            />
          </Pressable>

          <Pressable
            style={styles.settingRow}
            onPress={() =>
              setBiometric(
                !biometric
              )
            }
          >
            <Text style={styles.settingTitle}>
              Biometric Unlock
            </Text>

            <AppChip
              label={
                biometric
                  ? "On"
                  : "Off"
              }
              selected={biometric}
              onPress={() =>
                setBiometric(
                  !biometric
                )
              }
            />
          </Pressable>

        </AppCard>

        <SectionHeader title="Data & Backup" />

        <AppCard>

          <Pressable
            style={styles.row}
          >
            <View style={styles.left}>
              <Ionicons
                name="cloud-upload-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.title}>
                Backup Data
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </Pressable>

              <Divider />

          <Pressable
            style={styles.row}
          >
            <View style={styles.left}>
              <Ionicons
                name="cloud-download-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.title}>
                Restore Data
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={
                COLORS.secondaryText
              }
            />
          </Pressable>

        </AppCard>

        <SectionHeader title="About" />

        <AppCard>

          <View
            style={styles.settingRow}
          >
            <Text
              style={
                styles.settingTitle
              }
            >
              App Version
            </Text>

            <Text
              style={
                styles.settingValue
              }
            >
              1.0.0
            </Text>
          </View>

          <Divider />

          <View
            style={styles.settingRow}
          >
            <Text
              style={
                styles.settingTitle
              }
            >
              Developed By
            </Text>

            <Text
              style={
                styles.settingValue
              }
            >
              Cliniqara
            </Text>
          </View>

        </AppCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: SPACING.lg,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },

  title: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "600",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingVertical:
      SPACING.sm,
  },

  settingTitle: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "600",
  },

  settingValue: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.body,
  },

});