import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          {emptyText}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {visibleItems.map((item, index) => {
        const itemKey =
          item.id ??
          item.code ??
          `${item.name}-${index}`;

        return (
          <View
            key={itemKey}
            style={[
              styles.item,
              index !== visibleItems.length - 1 &&
                styles.itemBorder,
            ]}
          >
            <View style={styles.rank}>
              <Text style={styles.rankText}>
                {index + 1}
              </Text>
            </View>

            <View style={styles.content}>
              <Text
                style={styles.name}
                numberOfLines={2}
              >
                {item.name}
              </Text>

              {item.code ? (
                <Text style={styles.code}>
                  {item.code}
                </Text>
              ) : null}
            </View>

            <View style={styles.countContainer}>
              <Text style={styles.count}>
                {item.count}
              </Text>

              <Text style={styles.visits}>
                visits
              </Text>
            </View>
          </View>
        );
      })}

      {items.length > 5 ? (
        <Pressable
          onPress={onToggleShowAll}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>
            {showAll ? "Show Less" : "View All"}
          </Text>
        </Pressable>
      ) : null}
    </View>
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