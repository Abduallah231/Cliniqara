import { StyleSheet } from "react-native";

export const existingPatientStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F3F6FB",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003594",
    marginBottom: 20,
  },

  list: {
    paddingBottom: 40,
    gap: 12,
  },

  // ==========================
  // Search
  // ==========================

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E2E8F0",

    borderRadius: 16,

    paddingHorizontal: 14,

    height: 52,

    marginBottom: 14,
  },

  searchInput: {
    flex: 1,

    marginLeft: 10,

    fontSize: 15,

    color: "#111827",
  },

  // ==========================
  // Filters
  // ==========================

  filterRow: {
    flexDirection: "row",

    marginBottom: 18,
  },

  filterChip: {
    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,

    borderColor: "#D7E2F2",

    marginRight: 10,
  },

  filterChipSelected: {
    backgroundColor: "#003594",

    borderColor: "#003594",
  },

  filterText: {
    color: "#374151",

    fontSize: 14,

    fontWeight: "600",
  },

  filterTextSelected: {
    color: "#FFFFFF",
  },

  // ==========================
  // Card
  // ==========================

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 16,

    marginBottom: 14,

    borderWidth: 1,

    borderColor: "#E6ECF5",

    shadowColor: "#003594",

    shadowOpacity: 0.05,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "center",
  },

  avatar: {
    width: 46,

    height: 46,

    borderRadius: 23,

    backgroundColor: "#EAF1FF",

    justifyContent: "center",

    alignItems: "center",
  },

  avatarText: {
    color: "#003594",

    fontWeight: "700",

    fontSize: 18,
  },

  patientInfo: {
    flex: 1,

    marginLeft: 12,
  },

  patientName: {
    fontSize: 17,

    fontWeight: "700",

    color: "#111827",
  },

  patientMeta: {
    fontSize: 13,

    color: "#6B7280",

    marginTop: 2,
  },

  patientId: {
    fontSize: 12,

    color: "#9CA3AF",

    marginTop: 3,
  },

  moreButton: {
    padding: 4,
  },

  divider: {
    height: 1,

    backgroundColor: "#EEF2F7",

    marginVertical: 12,
  },

  visitRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  lastVisit: {
    marginLeft: 8,

    color: "#374151",

    fontSize: 14,

    fontWeight: "500",
  },

  buttonRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  secondaryButton: {
    flex: 1,

    height: 42,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: "#003594",

    justifyContent: "center",

    alignItems: "center",

    marginRight: 8,
  },

  secondaryButtonText: {
    color: "#003594",

    fontWeight: "700",

    fontSize: 14,
  },

  primaryButton: {
    flex: 1,

    height: 42,

    borderRadius: 12,

    backgroundColor: "#003594",

    justifyContent: "center",

    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",

    fontWeight: "700",

    fontSize: 14,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
},

  // ==========================
  // Empty State
  // ==========================

  emptyContainer: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 20,

    fontSize: 20,

    fontWeight: "700",

    color: "#111827",
  },

  emptySubtitle: {
    marginTop: 8,

    fontSize: 14,

    color: "#6B7280",

    textAlign: "center",

    paddingHorizontal: 30,
  },

  
  // ==========================
  // patient menu
  // ==========================

  menuOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
},

menuContainer: {
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 36,
},

menuTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003594",

    marginBottom: 18,
},

menuItem: {
    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 16,
},

menuText: {
    fontSize: 16,

    color: "#111827",

    marginLeft: 16,

    fontWeight: "500",
},

menuDivider: {
    height: 1,

    backgroundColor: "#E5E7EB",

    marginVertical: 10,
},

deleteText: {
    marginLeft: 16,

    color: "#DC2626",

    fontWeight: "600",

    fontSize: 16,
},

cancelButton: {
    marginTop: 14,

    height: 50,

    borderRadius: 14,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#F3F4F6",
},

cancelText: {
    color: "#374151",

    fontWeight: "600",

    fontSize: 16,
},
});