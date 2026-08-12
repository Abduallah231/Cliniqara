import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppCard from "@/components/common/AppCard";
import AppChip from "@/components/common/AppChip";
import AppTextField from "@/components/common/AppTextField";
import Divider from "@/components/common/Divider";
import SectionHeader from "@/components/common/SectionHeader";
import AgeField from "@/components/patient-form/AgeField";

import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

type PatientSearchResult = {
  id: string;
  patientCode?: string;
  fullName: string;
  identifierType?: string;
  identifierNumber?: string;
};

type Props = {
  identifierType: string;
  documentType: string;
  identifierNumber: string;
  fullName: string;

  age: string;
  ageUnit: "Days" | "Months" | "Years";

  gender: "male" | "female";

  maritalStatus:
    | "Single"
    | "Married"
    | "Divorced"
    | "Widowed";

  childrenCount: string;

  onIdentifierTypeChange: (
    value: string,
  ) => void;

  onDocumentTypeChange: (
    value: string,
  ) => void;

  onIdentifierNumberChange: (
    value: string,
  ) => void;

  onFullNameChange: (
    value: string,
  ) => void;

  onAgeChange: (
    value: string,
  ) => void;

  onAgeUnitChange: (
    value: "Days" | "Months" | "Years",
  ) => void;

  onGenderChange: (
    value: "male" | "female",
  ) => void;

  onMaritalStatusChange: (
    value:
      | "Single"
      | "Married"
      | "Divorced"
      | "Widowed",
  ) => void;

  onChildrenCountChange: (
    value: string,
  ) => void;

  /*
   * =========================
   * Search
   * =========================
   */

  identifierSearchResults?: PatientSearchResult[];

  nameSearchResults?: PatientSearchResult[];

  searchingIdentifier?: boolean;

  searchingName?: boolean;

  onPatientSelect?: (
    patient: PatientSearchResult,
  ) => void;

  /*
   * =========================
   * National ID Verification
   * =========================
   */

  nationalIdVerified?: boolean;

  verifyingNationalId?: boolean;

  onVerifyNationalId?: () => void;

  /*
   * =========================
   * Derived Patient Data
   * =========================
   */

  isAgeLocked?: boolean;

  isGenderLocked?: boolean;
};

export default function PatientBasicInformation({
  identifierType,
  documentType,
  identifierNumber,
  fullName,

  age,
  ageUnit,

  gender,

  maritalStatus,
  childrenCount,

  onIdentifierTypeChange,
  onDocumentTypeChange,
  onIdentifierNumberChange,
  onFullNameChange,
  onAgeChange,
  onAgeUnitChange,
  onGenderChange,
  onMaritalStatusChange,
  onChildrenCountChange,

  identifierSearchResults = [],
  nameSearchResults = [],

  searchingIdentifier = false,
  searchingName = false,

  onPatientSelect,

  nationalIdVerified = false,
  verifyingNationalId = false,
  onVerifyNationalId,

  isAgeLocked = false,
  isGenderLocked = false,
}: Props) {
  const shouldSearchIdentifier =
    identifierType === "National ID" ||
    identifierType === "Passport";

  const shouldSearchName =
    identifierType === "Unknown" ||
    identifierNumber.trim() === "";

  const showIdentifierResults =
    shouldSearchIdentifier &&
    identifierNumber.trim().length > 0 &&
    (searchingIdentifier ||
      identifierSearchResults.length > 0);

  const showNameResults =
    shouldSearchName &&
    fullName.trim().length > 0 &&
    (searchingName ||
      nameSearchResults.length > 0);

  const showVerifyButton =
    identifierType === "National ID" &&
    identifierNumber.trim().length > 0;

  return (
    <>
      {/* =========================
          Basic Information Header
          ========================= */}

      <View style={styles.sectionHeader}>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={COLORS.primary}
        />

        <Text style={styles.sectionTitle}>
          Basic Information
        </Text>
      </View>

      <AppCard>
        {/* =========================
            Identification Type
            ========================= */}

        <SectionHeader title="Identification Type" />

        <View style={styles.row}>
          <AppChip
            label="National ID"
            selected={
              identifierType ===
              "National ID"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "National ID",
              )
            }
          />

          <AppChip
            label="Passport"
            selected={
              identifierType ===
              "Passport"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Passport",
              )
            }
          />

          <AppChip
            label="Other"
            selected={
              identifierType === "Other"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Other",
              )
            }
          />

          <AppChip
            label="Unknown"
            selected={
              identifierType ===
              "Unknown"
            }
            onPress={() =>
              onIdentifierTypeChange(
                "Unknown",
              )
            }
          />
        </View>

        {/* =========================
            Other Document Type
            ========================= */}

        {identifierType === "Other" && (
          <AppTextField
            label="Document Type"
            placeholder="Enter document type"
            value={documentType}
            onChangeText={
              onDocumentTypeChange
            }
          />
        )}

        {/* =========================
            Identification Number
            ========================= */}

        {identifierType !== "Unknown" && (
          <View
            style={styles.identifierSection}
          >
            <Text style={styles.fieldLabel}>
              Identification Number
            </Text>

            <View
              style={
                styles.identifierRow
              }
            >
              <View
                style={
                  styles.identifierInput
                }
              >
                <AppTextField
                  placeholder={
                    identifierType ===
                    "National ID"
                      ? "Enter 14-digit National ID"
                      : identifierType ===
                          "Passport"
                        ? "Enter Passport Number"
                        : "Enter Document Number"
                  }
                  value={
                    identifierNumber
                  }
                  onChangeText={
                    onIdentifierNumberChange
                  }
                  keyboardType={
                    identifierType ===
                    "National ID"
                      ? "number-pad"
                      : "default"
                  }
                />
              </View>

              {/* =========================
                  National ID Verify
                  ========================= */}

              {showVerifyButton && (
                <Pressable
                  style={[
                    styles.verifyButton,
                    nationalIdVerified &&
                      styles.verifyButtonSuccess,
                  ]}
                  onPress={
                    onVerifyNationalId
                  }
                  disabled={
                    verifyingNationalId ||
                    nationalIdVerified
                  }
                >
                  <Ionicons
                    name={
                      nationalIdVerified
                        ? "checkmark-circle"
                        : "shield-checkmark-outline"
                    }
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.verifyButtonText
                    }
                  >
                    {verifyingNationalId
                      ? "Checking..."
                      : nationalIdVerified
                        ? "Verified"
                        : "Verify"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* =========================
                Identifier Search Results
                ========================= */}

            {showIdentifierResults && (
              <View
                style={
                  styles.searchDropdown
                }
              >
                {searchingIdentifier ? (
                  <View
                    style={
                      styles.searchState
                    }
                  >
                    <Text
                      style={
                        styles.searchStateText
                      }
                    >
                      Searching...
                    </Text>
                  </View>
                ) : identifierSearchResults.length >
                  0 ? (
                  identifierSearchResults.map(
                    (patient) => (
                      <Pressable
                        key={patient.id}
                        style={
                          styles.searchResult
                        }
                        onPress={() =>
                          onPatientSelect?.(
                            patient,
                          )
                        }
                      >
                        <View
                          style={
                            styles.resultIcon
                          }
                        >
                          <Ionicons
                            name="person-outline"
                            size={18}
                            color={
                              COLORS.primary
                            }
                          />
                        </View>

                        <View
                          style={
                            styles.resultContent
                          }
                        >
                          <Text
                            style={
                              styles.resultName
                            }
                          >
                            {
                              patient.fullName
                            }
                          </Text>

                          {patient.patientCode && (
                            <Text
                              style={
                                styles.resultSecondary
                              }
                            >
                              {
                                patient.patientCode
                              }
                            </Text>
                          )}

                          {patient.identifierNumber && (
                            <Text
                              style={
                                styles.resultSecondary
                              }
                            >
                              {
                                patient.identifierNumber
                              }
                            </Text>
                          )}
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={
                            COLORS.secondaryText
                          }
                        />
                      </Pressable>
                    ),
                  )
                ) : (
                  <View
                    style={
                      styles.searchState
                    }
                  >
                    <Text
                      style={
                        styles.searchStateText
                      }
                    >
                      No matching patient found.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        <Divider />

        {/* =========================
            Full Legal Name
            ========================= */}

        <SectionHeader title="Full Legal Name" />

        <AppTextField
          value={fullName}
          onChangeText={onFullNameChange}
          placeholder="Enter patient's full name"
        />

        {/* =========================
            Name Search
            ========================= */}

        {showNameResults && (
          <View
            style={styles.searchDropdown}
          >
            {searchingName ? (
              <View
                style={styles.searchState}
              >
                <Text
                  style={
                    styles.searchStateText
                  }
                >
                  Searching...
                </Text>
              </View>
            ) : nameSearchResults.length >
              0 ? (
              nameSearchResults.map(
                (patient) => (
                  <Pressable
                    key={patient.id}
                    style={
                      styles.searchResult
                    }
                    onPress={() =>
                      onPatientSelect?.(
                        patient,
                      )
                    }
                  >
                    <View
                      style={
                        styles.resultIcon
                      }
                    >
                      <Ionicons
                        name="person-outline"
                        size={18}
                        color={
                          COLORS.primary
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.resultContent
                      }
                    >
                      <Text
                        style={
                          styles.resultName
                        }
                      >
                        {patient.fullName}
                      </Text>

                      {patient.patientCode && (
                        <Text
                          style={
                            styles.resultSecondary
                          }
                        >
                          {
                            patient.patientCode
                          }
                        </Text>
                      )}

                      {patient.identifierNumber && (
                        <Text
                          style={
                            styles.resultSecondary
                          }
                        >
                          {
                            patient.identifierNumber
                          }
                        </Text>
                      )}
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={
                        COLORS.secondaryText
                      }
                    />
                  </Pressable>
                ),
              )
            ) : null}
          </View>
        )}

        <Divider />

        {/* =========================
            Age
            ========================= */}

        <SectionHeader title="Age" />

        <View
          style={[
            styles.derivedField,
            isAgeLocked &&
              styles.lockedField,
          ]}
        >
          <AgeField
            age={age}
            setAge={onAgeChange}
            ageUnit={ageUnit}
            setAgeUnit={
              onAgeUnitChange
            }
            disabled={isAgeLocked}
          />

          {isAgeLocked && (
            <View
              style={
                styles.lockIndicator
              }
            >
              <Ionicons
                name="lock-closed"
                size={15}
                color={
                  COLORS.secondaryText
                }
              />

              <Text
                style={
                  styles.lockText
                }
              >
                Calculated from National ID
              </Text>
            </View>
          )}
        </View>

        <Divider />

        {/* =========================
            Gender
            ========================= */}

        <SectionHeader title="Gender" />

        <View
          style={[
            styles.genderContainer,
            isGenderLocked &&
              styles.lockedField,
          ]}
        >
          <AppChip
            label="Male"
            selected={
              gender === "male"
            }
            style={styles.genderChip}
            onPress={() =>
              !isGenderLocked &&
              onGenderChange("male")
            }
          />

          <AppChip
            label="Female"
            selected={
              gender === "female"
            }
            style={styles.genderChip}
            onPress={() =>
              !isGenderLocked &&
              onGenderChange("female")
            }
          />
        </View>

        {isGenderLocked && (
          <View
            style={styles.lockIndicator}
          >
            <Ionicons
              name="lock-closed"
              size={15}
              color={
                COLORS.secondaryText
              }
            />

            <Text
              style={styles.lockText}
            >
              Calculated from National ID
            </Text>
          </View>
        )}

        <Divider />

        {/* =========================
            Marital Status
            ========================= */}

        <SectionHeader title="Marital Status" />

        <View style={styles.row}>
          <AppChip
            label="Single"
            selected={
              maritalStatus ===
              "Single"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Single",
              )
            }
          />

          <AppChip
            label="Married"
            selected={
              maritalStatus ===
              "Married"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Married",
              )
            }
          />

          <AppChip
            label="Divorced"
            selected={
              maritalStatus ===
              "Divorced"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Divorced",
              )
            }
          />

          <AppChip
            label="Widowed"
            selected={
              maritalStatus ===
              "Widowed"
            }
            onPress={() =>
              onMaritalStatusChange(
                "Widowed",
              )
            }
          />
        </View>

        {maritalStatus !== "Single" && (
          <AppTextField
            label="Number of Children"
            placeholder="Number of Children"
            value={childrenCount}
            onChangeText={
              onChildrenCountChange
            }
            keyboardType="numeric"
          />
        )}
      </AppCard>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  sectionTitle: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  identifierSection: {
    position: "relative",
    zIndex: 20,
  },

  fieldLabel: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },

  identifierRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
  },

  identifierInput: {
    flex: 1,
  },

  verifyButton: {
    minHeight: 48,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    backgroundColor:
      COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    marginBottom: 1,
  },

  verifyButtonSuccess: {
    opacity: 0.8,
  },

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: TYPOGRAPHY.small,
    fontWeight: "700",
  },

  searchDropdown: {
    marginTop: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor:
      COLORS.background,
    overflow: "hidden",
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 100,
  },

  searchResult: {
    minHeight: 64,
    paddingHorizontal:
      SPACING.sm,
    paddingVertical:
      SPACING.sm,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
  },

  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor:
      COLORS.background,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },

  resultContent: {
    flex: 1,
  },

  resultName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  resultSecondary: {
    marginTop: 2,
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  searchState: {
    paddingHorizontal:
      SPACING.md,
    paddingVertical:
      SPACING.md,
  },

  searchStateText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  derivedField: {
    position: "relative",
  },

  lockedField: {
    opacity: 0.8,
  },

  lockIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },

  lockText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  genderContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },

  genderChip: {
    flex: 1,
  },
});