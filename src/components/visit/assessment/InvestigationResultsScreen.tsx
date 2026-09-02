import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppTextField from "@/components/common/AppTextField";

import investigationsData from "@/data/investigations";

import { getApiFileUrl } from "@/services/api";
import { uploadInvestigationImage } from "@/services/uploadApi";

import { useVisitStore } from "@/store/visitStore";

import {
  COLORS,
  RADIUS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";

interface Props {
  visitId?: string;
}

export default function InvestigationResultsScreen({
  visitId,
}: Props) {
  const investigationsState =
    useVisitStore(
      (state) =>
        state.visit.assessment
          .investigations,
    );

  const updateInvestigationResult =
    useVisitStore(
      (state) =>
        state.updateInvestigationResult,
    );

  const updateInvestigationStatus =
    useVisitStore(
      (state) =>
        state.updateInvestigationStatus,
    );

  const addInvestigationImage =
    useVisitStore(
      (state) =>
        state.addInvestigationImage,
    );

  const removeInvestigationImage =
    useVisitStore(
      (state) =>
        state.removeInvestigationImage,
    );

  const [expandedItem, setExpandedItem] =
    useState<string | null>(null);

  const [uploadingInvestigationId, setUploadingInvestigationId] =
    useState<string | null>(null);

  const getInvestigationIdentifier = (
    investigation: {
      id?: string;
      name: string;
    },
  ) => {
    return (
      investigation.id ??
      investigation.name
    );
  };

  const getResultValue = (
    investigationId: string,
    fieldId: string,
  ) => {
    const result =
      investigationsState.results.find(
        (item) =>
          item.investigationId ===
          investigationId,
      );

    return (
      result?.values.find(
        (field) =>
          field.fieldId === fieldId,
      )?.value ?? ""
    );
  };

  const updateResult = (
    investigationId: string,
    fieldId: string,
    fieldLabel: string,
    value: string,
  ) => {
    updateInvestigationResult(
      investigationId,
      fieldId,
      fieldLabel,
      value,
    );

    updateInvestigationStatus(
      investigationId,
      "completed",
    );
  };

  const pickAndUploadImage = async (
    investigation: {
      id?: string;
      name: string;
    },
  ) => {
    if (!visitId) {
      Alert.alert(
        "Upload Result Image",
        "The current visit is not available.",
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access to select an investigation result image.",
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.9,
          selectionLimit: 1,
        });

      if (
        result.canceled ||
        !result.assets?.length
      ) {
        return;
      }

      const asset = result.assets[0];

      /*
      * Always read the latest investigation
      * from Zustand before uploading.
      *
      * This prevents using a stale/local ID
      * from an old render.
      */
      const latestInvestigations =
        useVisitStore
          .getState()
          .visit.assessment
          .investigations
          .requestedInvestigations;

      const latestInvestigation =
        latestInvestigations.find(
          (item) =>
            item.id === investigation.id ||
            item.name === investigation.name,
        );

      const latestInvestigationId =
        latestInvestigation?.id;

      if (!latestInvestigationId) {
        Alert.alert(
          "Save Investigation First",
          "Please wait a moment for the investigation to be saved before adding an image.",
        );
        return;
      }

      setUploadingInvestigationId(
        latestInvestigationId,
      );

      const fileUrl =
        await uploadInvestigationImage(
          asset.uri,
          visitId,
          latestInvestigationId,
        );

      addInvestigationImage(
        latestInvestigationId,
        {
          fileUrl,
        },
      );

      updateInvestigationStatus(
        latestInvestigationId,
        "completed",
      );
    } catch (error: any) {
      console.error(
        "INVESTIGATION IMAGE UPLOAD FAILED:",
        error?.response?.data ??
          error,
      );

      Alert.alert(
        "Upload Failed",
        "Could not upload the investigation result image. Please try again.",
      );
    } finally {
      setUploadingInvestigationId(
        null,
      );
    }
  };

  const confirmRemoveImage = (
    investigationId: string,
    fileUrl: string,
  ) => {
    Alert.alert(
      "Remove Image",
      "Remove this result image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            removeInvestigationImage(
              investigationId,
              fileUrl,
            ),
        },
      ],
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={
        styles.container
      }
    >
      <Text style={styles.title}>
        Investigation Results
      </Text>

      {investigationsState.requestedInvestigations.map(
        (investigation) => {
          const investigationId =
            getInvestigationIdentifier(
              investigation,
            );

          const accordionId =
            investigation.name;

          const expanded =
            expandedItem ===
            accordionId;

          const investigationInfo =
            investigationsData.find(
              (item) =>
                item.name ===
                investigation.name,
            );

          const type =
            investigationInfo?.type ??
            "single";

          const images =
            investigation.images ??
            [];

          const isUploading =
            uploadingInvestigationId ===
            investigation.id;

          return (
            <View
              key={accordionId}
              style={styles.card}
            >
              <Pressable
                style={styles.header}
                onPress={() =>
                  setExpandedItem(
                    expanded
                      ? null
                      : accordionId,
                  )
                }
              >
                <View
                  style={
                    styles.headerLeft
                  }
                >
                  <Ionicons
                    name="flask-outline"
                    size={20}
                    color={
                      COLORS.primary
                    }
                  />

                  <Text
                    style={
                      styles.headerTitle
                    }
                  >
                    {investigation.name}
                  </Text>
                </View>

                <Ionicons
                  name={
                    expanded
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={20}
                  color={
                    COLORS.secondaryText
                  }
                />
              </Pressable>

              {expanded && (
                <View
                  style={
                    styles.content
                  }
                >
                  {type ===
                    "single" && (
                    <AppTextField
                      placeholder="Result"
                      value={String(
                        getResultValue(
                          investigationId,
                          "result",
                        ),
                      )}
                      onChangeText={(
                        text,
                      ) =>
                        updateResult(
                          investigationId,
                          "result",
                          "Result",
                          text,
                        )
                      }
                    />
                  )}

                  {type ===
                    "multi" && (
                    <>
                      {investigationInfo?.fields?.map(
                        (
                          field: string,
                        ) => (
                          <AppTextField
                            key={field}
                            placeholder={
                              field
                            }
                            value={String(
                              getResultValue(
                                investigationId,
                                field,
                              ),
                            )}
                            onChangeText={(
                              text,
                            ) =>
                              updateResult(
                                investigationId,
                                field,
                                field,
                                text,
                              )
                            }
                          />
                        ),
                      )}
                    </>
                  )}

                  {type ===
                    "text" && (
                    <AppTextField
                      multiline
                      placeholder="Interpretation"
                      value={String(
                        getResultValue(
                          investigationId,
                          "interpretation",
                        ),
                      )}
                      onChangeText={(
                        text,
                      ) =>
                        updateResult(
                          investigationId,
                          "interpretation",
                          "Interpretation",
                          text,
                        )
                      }
                    />
                  )}

                  {type ===
                    "report" && (
                    <>
                      <AppTextField
                        placeholder="Body Part / Region"
                        value={String(
                          getResultValue(
                            investigationId,
                            "region",
                          ),
                        )}
                        onChangeText={(
                          text,
                        ) =>
                          updateResult(
                            investigationId,
                            "region",
                            "Body Part / Region",
                            text,
                          )
                        }
                      />

                      <AppTextField
                        multiline
                        placeholder="Report"
                        value={String(
                          getResultValue(
                            investigationId,
                            "report",
                          ),
                        )}
                        onChangeText={(
                          text,
                        ) =>
                          updateResult(
                            investigationId,
                            "report",
                            "Report",
                            text,
                          )
                        }
                      />
                    </>
                  )}

                  {/* ======================================================
                      Result Images
                      ====================================================== */}

                  {images.length >
                    0 && (
                    <View
                      style={
                        styles.imagesSection
                      }
                    >
                      <Text
                        style={
                          styles.imagesTitle
                        }
                      >
                        Result Images
                      </Text>

                      <View
                        style={
                          styles.imagesGrid
                        }
                      >
                        {images.map(
                          (
                            image,
                            index,
                          ) => (
                            <View
                              key={`${image.fileUrl}-${index}`}
                              style={
                                styles.imageCard
                              }
                            >
                              <Image
                                source={{
                                  uri: getApiFileUrl(
                                    image.fileUrl,
                                  ),
                                }}
                                style={styles.resultImage}
                                resizeMode="cover"
                              />

                              <Pressable
                                style={
                                  styles.removeImageButton
                                }
                                onPress={() =>
                                  investigation.id &&
                                  confirmRemoveImage(
                                    investigation.id,
                                    image.fileUrl,
                                  )
                                }
                              >
                                <Ionicons
                                  name="close"
                                  size={
                                    18
                                  }
                                  color={
                                    "#FFFFFF"
                                  }
                                />
                              </Pressable>
                            </View>
                          ),
                        )}
                      </View>
                    </View>
                  )}

                  <Pressable
                    style={[
                      styles.imagePlaceholder,
                      isUploading &&
                        styles.imagePlaceholderDisabled,
                    ]}
                    disabled={
                      isUploading
                    }
                    onPress={() =>
                      pickAndUploadImage(
                        investigation,
                      )
                    }
                  >
                    <Ionicons
                      name={
                        isUploading
                          ? "cloud-upload-outline"
                          : "image-outline"
                      }
                      size={22}
                      color={
                        COLORS.primary
                      }
                    />

                    <View
                      style={
                        styles.imagePlaceholderText
                      }
                    >
                      <Text
                        style={
                          styles.imagePlaceholderTitle
                        }
                      >
                        {isUploading
                          ? "Uploading..."
                          : "Add Result Image"}
                      </Text>

                      <Text
                        style={
                          styles.imagePlaceholderSubtitle
                        }
                      >
                        {investigation.id
                          ? "Upload an image of the investigation result"
                          : "Save the investigation first to add an image"}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          );
        },
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },

  title: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOW,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },

  headerTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },

  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  imagePlaceholder: {
    minHeight: 72,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor:
      COLORS.background,
  },

  imagePlaceholderDisabled: {
    opacity: 0.6,
  },

  imagePlaceholderText: {
    flex: 1,
    gap: 2,
  },

  imagePlaceholderTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  imagePlaceholderSubtitle: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.secondaryText,
  },

  imagesSection: {
    gap: SPACING.sm,
  },

  imagesTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },

  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },

  imageCard: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    backgroundColor:
      COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },

  resultImage: {
    width: "100%",
    height: "100%",
  },

  removeImageButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(0,0,0,0.65)",
  },
});