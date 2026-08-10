import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import type { ClinicMember } from "@/types/clinic";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  members: ClinicMember[];
  loading?: boolean;
  isOwner: boolean;
  currentMembershipId: string;
  onRemoveMember: (
    membershipId: string,
  ) => void;
  onTransferOwnership: (
    membershipId: string,
  ) => void;
  onLeaveClinic: () => void;
};

export default function ClinicMembers({
  members,
  loading = false,
  isOwner,
  currentMembershipId,
  onRemoveMember,
  onTransferOwnership,
  onLeaveClinic,
}: Props) {
  const handleTransfer = (
    membershipId: string,
    memberName: string,
  ) => {
    Alert.alert(
      "Transfer Ownership",
      `Transfer clinic ownership to ${memberName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Transfer",
          style: "destructive",
          onPress: () =>
            onTransferOwnership(
              membershipId,
            ),
        },
      ],
    );
  };

  const getRoleLabel = (
    role: ClinicMember["clinicRole"],
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

  if (members.length === 0) {
    return (
      <AppCard>
        <Text style={styles.emptyText}>
          No active members.
        </Text>

        {!isOwner && (
          <AppButton
            title="Leave Clinic"
            onPress={onLeaveClinic}
          />
        )}
      </AppCard>
    );
  }

  return (
    <View style={styles.container}>
      {members.map((member) => {
        const isCurrentUser =
          member.id ===
          currentMembershipId;

        const isMemberOwner =
          member.clinicRole === "OWNER";

        const isDoctor =
          member.clinicRole === "DOCTOR";

        return (
          <AppCard key={member.id}>
            <View style={styles.memberHeader}>
              <View style={styles.memberIdentity}>
                <Text style={styles.memberName}>
                  {member.user.fullName}
                </Text>

                <View style={styles.roleRow}>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>
                      {getRoleLabel(
                        member.clinicRole,
                      )}
                    </Text>
                  </View>

                  {member.clinicRole === "DOCTOR" &&
                    member.user.doctorLevel && (
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>
                          {member.user.doctorLevel ===
                          "DOCTOR"
                            ? "Doctor"
                            : "Intern"}
                        </Text>
                      </View>
                    )}
                </View>
              </View>
            </View>

            {(member.user.specialty ||
              member.user.professionalTitle) && (
              <View style={styles.professionalInfo}>
                {member.user.specialty && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="medical-outline"
                      size={17}
                      color={COLORS.secondaryText}
                    />

                    <Text style={styles.infoText}>
                      {member.user.specialty}
                    </Text>
                  </View>
                )}

                {member.user.professionalTitle && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="briefcase-outline"
                      size={17}
                      color={COLORS.secondaryText}
                    />

                    <Text style={styles.infoText}>
                      {member.user.professionalTitle}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {isOwner &&
              !isCurrentUser &&
              !isMemberOwner && (
                <View style={styles.actionRow}>
                  <AppButton
                    title="Remove"
                    onPress={() =>
                      onRemoveMember(member.id)
                    }
                  />

                  {isDoctor && (
                    <AppButton
                      title="Transfer Ownership"
                      onPress={() =>
                        handleTransfer(
                          member.id,
                          member.user.fullName,
                        )
                      }
                    />
                  )}
                </View>
              )}
          </AppCard>
        );
      })}

      {!isOwner && (
        <AppButton
          title="Leave Clinic"
          onPress={onLeaveClinic}
        />
      )}

      {loading && (
        <Text style={styles.loadingText}>
          Updating members...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  memberHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  memberIdentity: {
    flex: 1,
  },

  memberName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#EEF6FF",
  },

  roleBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },

  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },

  levelBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  professionalInfo: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoText: {
    flex: 1,
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    paddingVertical: SPACING.md,
  },

  loadingText: {
    textAlign: "center",
    color: COLORS.secondaryText,
  },
});