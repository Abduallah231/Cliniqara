import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";

import type { ClinicMember } from "@/types/clinic";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type Props = {
  requests: ClinicMember[];
  onApprove: (
    membershipId: string,
  ) => void;
  onReject: (
    membershipId: string,
  ) => void;
};

export default function ClinicMembershipRequests({
  requests,
  onApprove,
  onReject,
}: Props) {
  return (
    <>
      {requests.length === 0 ? (
        <AppCard>
          <AppText
            style={styles.emptyText}
          >
            No pending membership requests.
          </AppText>
        </AppCard>
      ) : (
        requests.map((request) => (
          <AppCard
            key={request.id}
          >
            <AppText
              style={styles.memberName}
            >
              {request.user.fullName}
            </AppText>

            <AppText
              style={styles.memberInfo}
            >
              {request.user.accountType}

              {request.user.specialty
                ? ` • ${request.user.specialty}`
                : ""}
            </AppText>

            <AppView
              style={styles.actionRow}
            >
              <AppButton
                title="Approve"
                onPress={() =>
                  onApprove(request.id)
                }
              />

              <AppButton
                title="Reject"
                onPress={() =>
                  onReject(request.id)
                }
              />
            </AppView>
          </AppCard>
        ))
      )}
    </>
  );
}

const styles = StyleSheet.create({
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
    gap: SPACING.md,
    marginTop: SPACING.md,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    paddingVertical: SPACING.md,
  },
});