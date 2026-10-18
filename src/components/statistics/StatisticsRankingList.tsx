import AppPressable from "@/components/common/AppPressable";
import AppText from "@/components/common/AppText";
import AppView from "@/components/common/AppView";
import { StyleSheet } from "react-native";

import { COLORS } from "@/theme/colors";
import { TYPOGRAPHY } from "@/theme/typography";

interface RankingItem {
  id?: string;
  name: string;
  count: number;
  code?: string | null;
}

interface Props {
  items: RankingItem[];
  showAll: boolean;
  onToggleShowAll: () => void;
  emptyText?: string;
}

export default function StatisticsRankingList({
  items,
  showAll,
  onToggleShowAll,
  emptyText = "No data available.",
}: Props) {
  const visibleItems = showAll
    ? items
    : items.slice(0, 5);

  if (!items.length) {
    return (
      <AppView style={styles.empty}>
        <AppText style={styles.emptyText}>
          {emptyText}
        </AppText>
      </AppView>
    );
  }

  return (
    <AppView>
      {visibleItems.map((item, index) => {
        const itemKey =
          item.id ??
          item.code ??
          `${item.name}-${index}`;

        return (
          <AppView
            key={itemKey}
            style={[
              styles.item,
              index !== visibleItems.length - 1 &&
                styles.itemBorder,
            ]}
          >
            <AppView style={styles.rank}>
              <AppText style={styles.rankText}>
                {index + 1}
              </AppText>
            </AppView>

            <AppView style={styles.content}>
              <AppText
                style={styles.name}
                numberOfLines={2}
              >
                {item.name}
              </AppText>

              {item.code ? (
                <AppText style={styles.code}>
                  {item.code}
                </AppText>
              ) : null}
            </AppView>

            <AppView style={styles.countContainer}>
              <AppText style={styles.count}>
                {item.count}
              </AppText>

              <AppText style={styles.visits}>
                visits
              </AppText>
            </AppView>
          </AppView>
        );
      })}

      {items.length > 5 ? (
        <AppPressable
          onPress={onToggleShowAll}
          style={styles.viewAllButton}
        >
          <AppText style={styles.viewAllText}>
            {showAll ? "Show Less" : "View All"}
          </AppText>
        </AppPressable>
      ) : null}
    </AppView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  rankText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  content: {
    flex: 1,
    paddingRight: 8,
  },

  name: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: "600",
  },

  code: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.secondaryText,
  },

  countContainer: {
    minWidth: 50,
    alignItems: "flex-end",
  },

  count: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  visits: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },

  viewAllButton: {
    marginTop: 10,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  viewAllText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  empty: {
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.small,
  },
});