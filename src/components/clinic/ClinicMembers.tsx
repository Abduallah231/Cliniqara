import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
            <Text style={styles.memberName}>
              {member.user.fullName}
            </Text>

            <Text style={styles.memberInfo}>
              {member.clinicRole}
              {" • "}
              {member.user.accountType}
            </Text>

            {member.user.specialty && (
              <Text style={styles.memberInfo}>
                {member.user.specialty}
              </Text>
            )}

            {member.user
              .professionalTitle && (
              <Text
                style={styles.memberInfo}
              >
                {
                  member.user
                    .professionalTitle
                }
              </Text>
            )}

            {isOwner &&
              !isCurrentUser &&
              !isMemberOwner && (
                <View style={styles.actionRow}>
                  <AppButton
                    title="Remove"
                    onPress={() =>
                      onRemoveMember(
                        member.id,
                      )
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

  memberName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  memberInfo: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    marginBottom: 4,
  },

  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
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