import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppTopBar from "@/components/common/AppTopBar";
import SectionHeader from "@/components/common/SectionHeader";

import { prescriptionTemplates } from "@/data/prescriptionTemplates";

import {
    COLORS,
    SPACING,
    TYPOGRAPHY
} from "@/theme";

export default function PrescriptionTemplateDetails() {
  const { templateId } =
    useLocalSearchParams();

  const template = useMemo(
    () =>
      prescriptionTemplates.find(
        (item) =>
          item.id === templateId
      ) ??
      prescriptionTemplates[0],
    [templateId]
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <AppTopBar
        title={template.title}
        onBack={() =>
          router.back()
        }
        onRightPress={() =>
          router.push("/settings")
        }
      />

      <FlatList
        data={template.medications}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        ListHeaderComponent={
          <>
            <SectionHeader title="Medications" />
          </>
        }
        renderItem={({ item }) => (
          <AppCard
            style={styles.medicationCard}
          >
            <Text
              style={styles.medicationName}
            >
              {item.name}
            </Text>

            <Text
              style={styles.secondary}
            >
              {item.dose}
            </Text>

            <Text
              style={styles.secondary}
            >
              {item.frequency}
            </Text>

            <Text
              style={styles.secondary}
            >
              {item.duration}
            </Text>
          </AppCard>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: SPACING.md,
            }}
          />
        )}
        ListFooterComponent={
          <>
            <SectionHeader title="Patient Advice" />

            <AppCard>
              {template.patientAdvice.map(
                (item, index) => (
                  <Text
                    key={index}
                    style={
                      styles.bullet
                    }
                  >
                    • {item}
                  </Text>
                )
              )}
            </AppCard>

            <SectionHeader title="Follow-up" />

            <AppCard>
              <Text
                style={
                  styles.primaryText
                }
              >
                {template.followUp}
              </Text>
            </AppCard>

            {!!template.notes && (
              <>
                <SectionHeader title="Notes" />

                <AppCard>
                  <Text
                    style={
                      styles.secondary
                    }
                  >
                    {template.notes}
                  </Text>
                </AppCard>
              </>
            )}

            <View
              style={styles.actions}
            >
              <AppButton
                title="Edit"
                variant="secondary"
                style={styles.button}
                onPress={() => {}}
              />

              <AppButton
                title="Use Template"
                style={styles.button}
                onPress={() => {}}
              />
            </View>
          </>
        }
      />
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
    paddingBottom: 40,
    gap: SPACING.md,
  },

  medicationCard: {
    gap: SPACING.xs,
  },

  medicationName: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    fontWeight: "700",
  },

  primaryText: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
  },

  secondary: {
    color:
      COLORS.secondaryText,
    fontSize:
      TYPOGRAPHY.small,
  },

  bullet: {
    color: COLORS.text,
    fontSize:
      TYPOGRAPHY.body,
    marginBottom:
      SPACING.sm,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  button: {
    flex: 1,
  },
});