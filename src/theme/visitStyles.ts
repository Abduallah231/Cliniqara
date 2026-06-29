import { StyleSheet } from "react-native";

export const visitStyles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  sectionTitle: {
    fontWeight: "700",
    marginTop: 12,
    fontSize: 17,
    color: "#111827",
    marginBottom: 16,
  },


  subTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 6,
    color: "#475569",
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#93C5FD",
    paddingHorizontal: 10,
    paddingVertical: 6,
    
  },

  selectedChip: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#003594",
    
  },

  chipText: {
    color: "#000000",
  },

  selectedChipText: {
    color: "#1E40AF",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },


  
  textArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },

  box: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    marginBottom: 12,
  },

  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },

  summaryText: {
    color: "#0F172A",
  },

  placeholder: {
    color: "#94A3B8",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  addButton: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#93C5FD",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#1E40AF",
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  arrow: {
    fontSize: 12,
    color: "#64748B",
  },

  subSection: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  durationRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  durationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  unitBox: {
    width: 100,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  systemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
},

medicationCard: {
  backgroundColor: "#F8FAFC",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 12,
  padding: 12,
  marginTop: 8,
  marginBottom: 12,
},


inlineRow: {
  flexDirection: "row",
  gap: 8,
},

smallInput: {
  backgroundColor: "#F8FAFC",
  flex: 1,
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
},

chipGroup: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
},
vitalRow: {
  flexDirection: "row",
  gap: 8,
},

halfInput: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#CBD5E1",
  borderRadius: 10,
  paddingVertical: 8,
  paddingHorizontal: 10,
},
summaryContainer: {
  flexDirection: "row",

  flexWrap: "wrap",

  gap: 8,
},

summaryCard: {
  minWidth: 150,

  flexGrow: 1,

  maxWidth: "48%",

  marginBottom: 8,

  padding: 10,

  borderWidth: 1,

  borderColor: "#D1D5DB",

  borderRadius: 12,

  backgroundColor: "#FFFFFF",
},

summaryTitle: {
  fontSize: 12,
  fontWeight: "600",

  color: "#6B7280",

  marginBottom: 6,
},

summaryItem: {
  fontSize: 14,

  color: "#111827",

  marginBottom: 2,
},
summaryTagsContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
},

summaryTag: {
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 999,
  backgroundColor: "#EEF6FF",
  marginBottom: 4,
},

summaryTagText: {
  fontSize: 12,
  color: "#2563EB",
  fontWeight: "500",
},
assessmentSection: {
  marginBottom: 20,
},

assessmentTitle: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 8,
},

searchInput: {
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  backgroundColor: "#FFFFFF",
  marginBottom: 8,
},

searchResults: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  backgroundColor: "#FFFFFF",
  marginBottom: 8,
},

searchItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#F3F4F6",
},

emptyStateText: {
  color: "#6B7280",
},
investigationInfoCard: {
  marginTop: 8,

  padding: 12,

  borderRadius: 12,

  borderWidth: 1,

  borderColor: "#BFDBFE",

  backgroundColor: "#EFF6FF",
},

investigationInfoText: {
  fontSize: 13,

  color: "#1D4ED8",
},
investigationCard: {
  backgroundColor: "#FFFFFF",

  borderWidth: 1,
  borderColor: "#E5E7EB",

  borderRadius: 12,

  marginBottom: 10,

  overflow: "hidden",
},

investigationHeader: {
  padding: 14,

  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",
},

investigationTitle: {
  fontSize: 15,

  fontWeight: "600",
},

investigationContent: {
  padding: 14,

  borderTopWidth: 1,

  borderTopColor: "#F3F4F6",
},

multilineInput: {
  borderWidth: 1,

  borderColor: "#D1D5DB",

  borderRadius: 12,

  padding: 12,

  minHeight: 120,

  textAlignVertical: "top",

  backgroundColor: "#FFFFFF",

  marginBottom: 10,
},


primaryButton: {
    minWidth: 100,
    height: 54,

    paddingHorizontal: 28,

    borderRadius: 25,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#2563EB",

    elevation: 8,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 10,

    shadowOffset: {
        width: 0,
        height: 4,
    },
},

primaryButtonText: {
  color: "#FFFFFF",

  fontSize: 16,

  fontWeight: "700",
},

secondaryButtonText: {
  color: "#2563EB",

  fontSize: 16,

  fontWeight: "700",
},

assessmentSubtitle: {
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 8,
  marginTop: 12,
},
secondaryButton: {
    minWidth: 100,
    height: 54,

    paddingHorizontal: 28,

    borderRadius: 25,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1.5,

    borderColor: "#2563EB",

    elevation: 8,

    shadowColor: "#000",

    shadowOpacity: 0.12,

    shadowRadius: 10,

    shadowOffset: {
        width: 0,
        height: 4,
    },
},

prescriptionHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

importTemplateText: {
  color: "#2563EB",
  fontWeight: "600",
},

medicationInput: {
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 12,
  padding: 12,
  minHeight: 60,
  textAlignVertical: "top",
  backgroundColor: "#FFFFFF",
},

removeText: {
  color: "#DC2626",
  marginTop: 6,
},

autoExpandInput: {
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 12,
  padding: 12,
  minHeight: 80,
  textAlignVertical: "top",
  backgroundColor: "#FFFFFF",
  marginBottom: 12,
},

selectedTag: {
  borderWidth: 1,
  borderColor: "#2563EB",
  backgroundColor: "#DBEAFE",
  borderRadius: 12,
  paddingHorizontal: 10,
  paddingVertical: 6,

  marginBottom: 6,
},
visitHeader: {
  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: 16,
},

headerLogo: {
  fontSize: 24,

  fontWeight: "700",

  color: "#2563EB",
},

headerIcon: {
  fontSize: 24,
},

  container: {
    flex: 1,
    backgroundColor: "#E2E8F0",

  },



  tab: {
    flex: 1,

    height: 60,

    justifyContent: "center",

    alignItems: "center",

    borderRadius: 16,

    backgroundColor: "#FFFFFF",

    marginHorizontal: 4,
  },
tabText: {
  fontSize: 13,

  fontWeight: "600",
},
  activeTab: {
    borderWidth: 2,
    borderColor: "#2563EB",
  },
bottomTabBar: {
  flexDirection: "row",

  gap: 8,

  paddingHorizontal: 12,

  paddingVertical: 8,

  backgroundColor: "#F1F5F9",

  borderTopWidth: 1,

  borderTopColor: "#E5E7EB",
},
  tabBar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
 patientBanner: {
  backgroundColor: "#FFFFFF",

  borderRadius: 14,

  paddingHorizontal: 16,
  paddingVertical: 12,

  marginHorizontal: 16,
  marginTop: 12,
  marginBottom: 12,

  borderWidth: 1,
  borderColor: "#E5E7EB",
},

patientName: {
  fontSize: 16,
  fontWeight: "700",
},

patientInfo: {
  fontSize: 13,
  color: "#6B7280",
  marginTop: 2,
},
patientBannerName: {
  fontSize: 16,

  fontWeight: "700",

  color: "#111827",
},

patientBannerInfo: {
  marginTop: 2,

  fontSize: 13,

  color: "#6B7280",
},
visitContent: {
  flex: 1,
  paddingHorizontal: 16,

},
screenContent: {
  flex: 1,
},

navigationBar: {
  position: "absolute",
bottom: 1,
left: 16,
right: 16,
  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",

  marginHorizontal: 16,

  marginTop: 12,

  marginBottom: 20,

  gap: 12,
},
collapseContainer: {
  backgroundColor: "#FFFFFF",

  borderRadius: 16,

  borderWidth: 1,

  borderColor: "#D1D5DB",

  marginBottom: 12,

  overflow: "hidden",
},

collapseHeader: {
  flexDirection: "row",

  justifyContent: "space-between",

  alignItems: "center",

  paddingHorizontal: 16,

  paddingVertical: 14,
},

collapseBody: {
  paddingHorizontal: 16,

  paddingBottom: 16,
},




collapseTitle: {
  fontSize: 15,
  fontWeight: "600",
  color: "#111827",
},

collapseArrow: {
  fontSize: 14,
  color: "#6B7280",
},
importTemplateButton: {
  backgroundColor: "#2563EB",

  borderRadius: 14,

  height: 52,

  justifyContent: "center",

  alignItems: "center",

  marginBottom: 16,
},

importTemplateButtonText: {
  color: "#FFFFFF",

  fontSize: 16,

  fontWeight: "700",
},
aiButton: {
  height: 52,

  backgroundColor: "#2563EB",

  borderRadius: 14,

  justifyContent: "center",

  alignItems: "center",

  marginHorizontal: 16,

  marginTop: 16,

  marginBottom: 12,
},

aiButtonText: {
  color: "#FFFFFF",

  fontSize: 16,

  fontWeight: "700",
},

aiDisclaimer: {
  marginHorizontal: 16,

  marginBottom: 20,

  padding: 14,

  backgroundColor: "#FFF8E7",

  borderRadius: 12,

  borderLeftWidth: 4,

  borderLeftColor: "#F59E0B",
},

aiDisclaimerTitle: {
  fontSize: 14,

  fontWeight: "700",

  color: "#92400E",

  marginBottom: 6,
},

aiDisclaimerText: {
  fontSize: 13,

  lineHeight: 20,

  color: "#78350F",
},

sectionCard: {
  backgroundColor: "#FFFFFF",

  borderRadius: 20,

  padding: 16,

  marginBottom: 16,

  borderWidth: 1,

  borderColor: "#E5E7EB",
},


sectionContent: {
},
headerIconButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
},

});