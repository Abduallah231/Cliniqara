import AppScrollView from "@/components/common/AppScrollView";
import AppView from "@/components/common/AppView";
import AppText from "@/components/common/AppText";
import AppPressable from "@/components/common/AppPressable";
import { Modal, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";
import AppButton from "@/components/common/AppButton";

import { useClinicStore } from "@/store/clinicStore";
import { selectClinic } from "@/services/clinicApi";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  SHADOW,
} from "@/theme";

import type { ClinicRole } from "@/types/clinic";

import { useState } from "react";

type Props = {
  onCreateClinic: () => void;
  onJoinClinic: () => void;
};

const getRoleLabel = (
  role: ClinicRole,
) => {
  switch (role) {
    case "OWNER":
      return "Owner";

    case "DOCTOR":
      return "Doctor";

    case "RECEPTION":
      return "Assistant";

    default:
      return role;
  }
};

export default function ClinicSelector({
  onCreateClinic,
  onJoinClinic,
}: Props) {
  const {
    clinics,
    currentClinic,
    setCurrentClinicById,
    moveClinicUp,
    moveClinicDown,
  } = useClinicStore();

  const [organizeMode, setOrganizeMode] =
    useState(false);

  const handleSelectClinic = async (
    clinicId: string,
  ) => {
    // Update UI immediately
    setCurrentClinicById(clinicId);

    try {
      // Persist selection on backend
      await selectClinic(clinicId);
    } catch (error) {
      console.warn(
        "Failed to select clinic:",
        error,
      );
    }
  };

  return (
    <>
      <AppCard style={styles.card}>
        <AppView style={styles.header}>
          <AppText style={styles.title}>
            My Clinics
          </AppText>

          {clinics.length > 1 && (
            <AppPressable
              style={styles.organizeButton}
              onPress={() =>
                setOrganizeMode(true)
              }
            >
              <Ionicons
                name="swap-vertical-outline"
                size={18}
                color={COLORS.primary}
              />

              <AppText
                style={
                  styles.organizeButtonText
                }
              >
                Organize
              </AppText>
            </AppPressable>
          )}
        </AppView>

        {clinics.length > 0 ? (
          <AppScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.clinicsList
            }
          >
            {clinics.map((item) => {
              const selected =
                item.clinic.id ===
                currentClinic?.clinic.id;

              return (
                <AppPressable
                  key={item.clinic.id}
                  style={[
                    styles.clinicRow,
                    selected &&
                      styles.selected,
                  ]}
                  onPress={() =>
                    handleSelectClinic(item.clinic.id)
                  }
                >
                  <AppView
                    style={styles.icon}
                  >
                    <Ionicons
                      name="business-outline"
                      size={22}
                      color={
                        COLORS.primary
                      }
                    />
                  </AppView>

                  <AppView
                    style={styles.info}
                  >
                    <AppText
                      style={styles.name}
                      numberOfLines={1}
                    >
                      {item.clinic.name}
                    </AppText>

                    <AppView
                      style={
                        styles.roleBadge
                      }
                    >
                      <AppText
                        style={
                          styles.roleBadgeText
                        }
                      >
                        {getRoleLabel(
                          item.role,
                        )}
                      </AppText>
                    </AppView>
                  </AppView>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={
                        COLORS.primary
                      }
                    />
                  )}
                </AppPressable>
              );
            })}
          </AppScrollView>
        ) : (
          <AppView
            style={styles.emptyState}
          >
            <AppView
              style={styles.emptyIcon}
            >
              <Ionicons
                name="business-outline"
                size={30}
                color={COLORS.primary}
              />
            </AppView>

            <AppText
              style={styles.emptyTitle}
            >
              No Clinic Yet
            </AppText>

            <AppText
              style={styles.emptyText}
            >
              Create a new clinic or join
              an existing clinic using a
              join code.
            </AppText>
          </AppView>
        )}

        <AppView style={styles.actions}>
          <AppButton
            title="Create New Clinic"
            icon="add-outline"
            style={styles.actionButton}
            onPress={onCreateClinic}
          />

          <AppPressable
            style={styles.joinButton}
            onPress={onJoinClinic}
          >
            <Ionicons
              name="enter-outline"
              size={18}
              color={COLORS.primary}
            />

            <AppText
              style={
                styles.joinButtonText
              }
            >
              Join Existing Clinic
            </AppText>
          </AppPressable>
        </AppView>
      </AppCard>

      <Modal
        visible={organizeMode}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setOrganizeMode(false)
        }
      >
        <AppView style={styles.modalOverlay}>
          <AppView
            style={styles.organizeModal}
          >
            <AppView
              style={styles.modalHeader}
            >
              <AppView>
                <AppText
                  style={
                    styles.modalTitle
                  }
                >
                  Organize Clinics
                </AppText>

                <AppText
                  style={
                    styles.modalSubtitle
                  }
                >
                  Arrange your clinics in
                  the order you prefer.
                </AppText>
              </AppView>

              <AppPressable
                style={
                  styles.modalCloseButton
                }
                onPress={() =>
                  setOrganizeMode(false)
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={COLORS.text}
                />
              </AppPressable>
            </AppView>

            <AppScrollView
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.organizeList
              }
            >
              {clinics.map(
                (item, index) => (
                  <AppView
                    key={item.clinic.id}
                    style={
                      styles.organizeRow
                    }
                  >
                    <AppView
                      style={
                        styles.orderNumber
                      }
                    >
                      <AppText
                        style={
                          styles.orderNumberText
                        }
                      >
                        {index + 1}
                      </AppText>
                    </AppView>

                    <AppView
                      style={
                        styles.organizeIcon
                      }
                    >
                      <Ionicons
                        name="business-outline"
                        size={22}
                        color={
                          COLORS.primary
                        }
                      />
                    </AppView>

                    <AppView
                      style={
                        styles.organizeInfo
                      }
                    >
                      <AppText
                        style={
                          styles.organizeName
                        }
                        numberOfLines={1}
                      >
                        {item.clinic.name}
                      </AppText>

                      <AppText
                        style={
                          styles.organizeRole
                        }
                      >
                        {getRoleLabel(
                          item.role,
                        )}
                      </AppText>
                    </AppView>

                    <AppView
                      style={
                        styles.moveButtons
                      }
                    >
                      <AppPressable
                        disabled={
                          index === 0
                        }
                        onPress={() =>
                          moveClinicUp(
                            index,
                          )
                        }
                        style={[
                          styles.moveButton,
                          index === 0 &&
                            styles.moveButtonDisabled,
                        ]}
                      >
                        <Ionicons
                          name="chevron-up"
                          size={21}
                          color={
                            index === 0
                              ? COLORS.border
                              : COLORS.primary
                          }
                        />
                      </AppPressable>

                      <AppPressable
                        disabled={
                          index ===
                          clinics.length -
                            1
                        }
                        onPress={() =>
                          moveClinicDown(
                            index,
                          )
                        }
                        style={[
                          styles.moveButton,
                          index ===
                            clinics.length -
                              1 &&
                            styles.moveButtonDisabled,
                        ]}
                      >
                        <Ionicons
                          name="chevron-down"
                          size={21}
                          color={
                            index ===
                            clinics.length -
                              1
                              ? COLORS.border
                              : COLORS.primary
                          }
                        />
                      </AppPressable>
                    </AppView>
                  </AppView>
                ),
              )}
            </AppScrollView>

            <AppPressable
              style={styles.doneButton}
              onPress={() =>
                setOrganizeMode(false)
              }
            >
              <Ionicons
                name="checkmark"
                size={20}
                color={COLORS.white}
              />

              <AppText
                style={styles.doneButtonText}
              >
                Done
              </AppText>
            </AppPressable>
          </AppView>
        </AppView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    ...SHADOW,
    marginBottom: SPACING.lg,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  organizeButton: {
    minHeight: 38,
    paddingHorizontal: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "#EEF6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  organizeButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  clinicsList: {
    gap: SPACING.sm,
    paddingBottom: SPACING.xs,
  },

  clinicRow: {
    width: 220,
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  selected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
  },

  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  name: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor:
      COLORS.background,
  },

  roleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF6FF",
    marginBottom: SPACING.sm,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    marginTop: 5,
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
  },

  actions: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },

  joinButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  joinButtonText: {
    flexShrink: 1,
    textAlign: "center",
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  // Modal

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0, 0, 0, 0.38)",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },

  organizeModal: {
    maxHeight: "82%",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: SPACING.lg,
    ...SHADOW,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.secondaryText,
  },

  modalCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor:
      COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  organizeList: {
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },

  organizeRow: {
    minHeight: 70,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
  },

  orderNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E7F1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  orderNumberText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  organizeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginLeft: 8,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  organizeInfo: {
    flex: 1,
    marginLeft: 10,
    minWidth: 0,
  },

  organizeName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  organizeRole: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  moveButtons: {
    flexDirection: "row",
    gap: 5,
    marginLeft: 8,
  },

  moveButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C9DDF5",
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  moveButtonDisabled: {
    opacity: 0.55,
    backgroundColor:
      COLORS.background,
  },

  doneButton: {
    height: 48,
    borderRadius: 13,
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  doneButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  actionButton: {
    flex: 1,
    minWidth: 0,
  },
});