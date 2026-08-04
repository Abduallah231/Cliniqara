import AppButton from "@/components/common/AppButton";
import AppCard from "@/components/common/AppCard";
import AppKeyboardAwareScrollView from "@/components/common/AppKeyboardAwareScrollView";
import AppTextField from "@/components/common/AppTextField";
import { register } from "@/services/authApi";
import {
  COLORS,
  SHADOW,
  SPACING,
  TYPOGRAPHY,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { uploadImage } from "@/services/uploadApi";

type UserRole = "DOCTOR" | "RECEPTION";
type DoctorLevel = "INTERN" | "DOCTOR";

export default function CreateAccountScreen() {
  const [step, setStep] = useState(1);

  const [role, setRole] =
    useState<UserRole>("DOCTOR");
  
  const [doctorLevel, setDoctorLevel] =
  useState<DoctorLevel>("DOCTOR");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [nationalId, setNationalId] =
    useState("");

  const [idFrontName, setIdFrontName] =
    useState("");

  const [medicalLicenseImage, setMedicalLicenseImage] =
    useState("");

  const [
    licenseNumber,
    setLicenseNumber,
  ] = useState("");

  const [loading, setLoading] =
  useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nationalId: "",
    licenseNumber: "",
  });

  const validateStep1 = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      nationalId: "",
      licenseNumber: "",
    };

    let valid = true;

    if (fullName.trim().length < 3) {
      newErrors.fullName =
        "Full name must be at least 3 characters";
      valid = false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (
      !/^[0-9]{10,15}$/.test(phone)
    ) {
      newErrors.phone =
        "Phone number is invalid";
      valid = false;
    }

    if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const validateStep2 = () => {
    const newErrors = {
      ...errors,
      nationalId: "",
    };

    let valid = true;

    if (
      nationalId &&
      !/^\d{14}$/.test(nationalId)
    ) {
      newErrors.nationalId =
        "National ID must be 14 digits";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const validateStep4 = () => {
    const newErrors = {
      ...errors,
      licenseNumber: "",
    };

    let valid = true;

    if (
      role === "DOCTOR" &&
      doctorLevel === "DOCTOR" &&
      !licenseNumber.trim()
    ) {
      newErrors.licenseNumber =
        "Medical license number is required";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const pickImage = async (
    setter: (value: string) => void
  ) => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow gallery access."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
  try {
    setLoading(true);

    if (
      !validateStep1() ||
      !validateStep2() ||
      !validateStep4()
    ) {
      setLoading(false);
      return;
    }

    let uploadedNationalIdImage: string | undefined;
    let uploadedMedicalLicenseImage: string | undefined;

    if (idFrontName) {
      uploadedNationalIdImage =
        await uploadImage(idFrontName);
    }

    if (medicalLicenseImage) {
      uploadedMedicalLicenseImage =
        await uploadImage(medicalLicenseImage);
    }

    const user = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,

      accountType: role,

      doctorLevel:
        role === "DOCTOR"
          ? doctorLevel
          : undefined,

      nationalId:
        nationalId.trim() || undefined,

      medicalLicenseNumber:
        licenseNumber.trim() || undefined,

      nationalIdImage:
        uploadedNationalIdImage,

      medicalLicenseImage:
        uploadedMedicalLicenseImage,
    });

    router.replace("/(auth)/login");


} finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons
              name="person-add"
              size={42}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join Cliniqara
          </Text>
        </View>

        <View style={styles.progressContainer}>
          {[1,2,3,4,5].map((item,index)=>(
            <View
              key={item}
              style={styles.progressWrapper}
            >
              <View
                style={[
                  styles.progressDot,
                  item <= step && styles.progressDotActive,
                ]}
              />

              {index < 4 && (
                <View
                  style={[
                    styles.progressLine,
                    item < step &&
                      styles.progressLineActive,
                  ]}
                />
              )}
            </View>
          ))}
        </View>

<Text style={styles.progressText}>
  Step {step} of 5
</Text>

        <AppCard style={styles.card}>
          <View style={styles.form}>
            {step === 1 && (
            <>
            <Text style={styles.sectionTitle}>
            Account Information
            </Text>

            <AppTextField
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            />

            <AppTextField
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            />

            <AppTextField
            label="Mobile Number"
            placeholder="Enter mobile number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            error={errors.phone}
            />

            <AppTextField
            label="Password"
            placeholder="Create password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
            rightIcon={
            showPassword
            ? "eye-off-outline"
            : "eye-outline"
            }
            onRightIconPress={() =>
            setShowPassword(!showPassword)
            }
            />

            <AppTextField
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={
            showConfirmPassword
            ? "eye-off-outline"
            : "eye-outline"
            }
            onRightIconPress={() =>
            setShowConfirmPassword(
            !showConfirmPassword
            )
            }
            />

            <AppButton
            title="Next"
            onPress={() => {
              if (validateStep1()) {
                setStep(2);
              }
            }}
            />
            </>
            )}
            {step === 2 && (
            <>
            <Text style={styles.sectionTitle}>
            Identity Verification
            </Text>

            <AppTextField
            label="National ID Number"
            placeholder="14-digit National ID"
            error={errors.nationalId}
            value={nationalId}
            onChangeText={setNationalId}
            keyboardType="number-pad"
            />

            <Pressable
              style={styles.uploadCard}
              onPress={() => pickImage(setIdFrontName)}
            >
            <View>
            <Text style={styles.uploadTitle}>
            National ID
            </Text>

            <Text style={styles.uploadSubtitle}>
            {idFrontName || "Choose Image"}
            </Text>
            </View>

            <Ionicons
            name="image-outline"
            size={28}
            color={COLORS.primary}
            />
            </Pressable>

            
            <View style={styles.buttonRow}>

            <AppButton
            title="Back"
            style={styles.flexButton}
            onPress={() => setStep(1)}
            />

            <AppButton
            title="Next"
            style={styles.flexButton}
            onPress={() => {
              if (validateStep2()) {
                setStep(3);
              }
            }}
            />

            </View>
            </>
            )}
            {step === 3 && (
            <>
              <Text style={styles.sectionTitle}>
                Register As
              </Text>

              <View style={styles.roleContainer}>

                <Pressable
                  style={[
                    styles.roleCard,
                    role === "DOCTOR" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setRole("DOCTOR")
                  }
                >
                  <Ionicons
                    name="medkit"
                    size={34}
                    color={
                      role === "DOCTOR"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Doctor
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Clinical Access
                    </Text>
                  </View>

                  {role === "DOCTOR" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.roleCard,
                    role === "RECEPTION" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setRole("RECEPTION")
                  }
                >
                  <Ionicons
                    name="people"
                    size={34}
                    color={
                      role ===
                      "RECEPTION"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Clinic Assistant
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Assist Doctors & Manage Patients
                    </Text>
                  </View>

                  {role ===
                    "RECEPTION" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              </View>

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    setStep(2)
                  }
                />

                <AppButton
                  title="Next"
                  style={styles.flexButton}
                  onPress={() =>
                    role === "DOCTOR"
                      ? setStep(4)
                      : setStep(5)
                  }
                />
              </View>
            </>
          )}

          {step === 4 && (
            <>
              <Text style={styles.sectionTitle}>
                Professional Information
              </Text>

              <Text style={styles.sectionTitle}>
                Doctor Level
              </Text>

              <View style={styles.roleContainer}>
                <Pressable
                  style={[
                    styles.roleCard,
                    doctorLevel === "INTERN" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setDoctorLevel("INTERN")
                  }
                >
                  <Ionicons
                    name="school-outline"
                    size={34}
                    color={
                      doctorLevel === "INTERN"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Intern
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Student & Intern • No Medical License Required • Limited Access
                    </Text>
                  </View>

                  {doctorLevel === "INTERN" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.roleCard,
                    doctorLevel === "DOCTOR" &&
                      styles.roleCardActive,
                  ]}
                  onPress={() =>
                    setDoctorLevel("DOCTOR")
                  }
                >
                  <Ionicons
                    name="medkit-outline"
                    size={34}
                    color={
                      doctorLevel === "DOCTOR"
                        ? COLORS.primary
                        : COLORS.secondaryText
                    }
                  />

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      Licensed Doctor
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Medical License Required • Full Access
                    </Text>
                  </View>

                  {doctorLevel === "DOCTOR" && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              </View>

              {doctorLevel === "DOCTOR" && (
                <>
                  <AppTextField
                    label="Medical License Number"
                    placeholder="Medical License Number"
                    value={licenseNumber}
                    error={errors.licenseNumber}
                    onChangeText={setLicenseNumber}
                  />

                  <Pressable
                    style={styles.uploadCard}
                    onPress={() =>
                      pickImage(setMedicalLicenseImage)
                    }
                  >
                    <View>
                      <Text style={styles.uploadTitle}>
                        Medical License Image
                      </Text>

                      <Text style={styles.uploadSubtitle}>
                        {medicalLicenseImage || "Upload Medical License"}
                      </Text>
                    </View>

                    <Ionicons
                      name="image-outline"
                      size={28}
                      color={COLORS.primary}
                    />
                  </Pressable>
                </>
              )}

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    setStep(3)
                  }
                />

                <AppButton
                  title="Continue"
                  style={styles.flexButton}
                  onPress={() => {
                    if (validateStep4()) {
                      setStep(5);
                    }
                  }}
                />
              </View>
            </>
          )}

          {step === 5 && (
            <>
              <View style={styles.summaryCard}>
                <Ionicons
                  name="shield-checkmark"
                  size={42}
                  color={COLORS.primary}
                />

                <Text style={styles.summaryTitle}>
                  Review & Create Account
                </Text>

                <Text style={styles.summarySubtitle}>
                  Please review your information before creating your account.
                </Text>
              </View>

              <AppCard style={styles.reviewCard}>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Full Name</Text>
                  <Text style={styles.reviewValue}>{fullName.trim()}</Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Email</Text>
                  <Text style={styles.reviewValue}>{email.trim()}</Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Phone</Text>
                  <Text style={styles.reviewValue}>{phone.trim()}</Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>National ID</Text>
                  <Text style={styles.reviewValue}>
                    {nationalId
                      ? `********${nationalId.slice(-4)}`
                      : "-"}
                  </Text>
                </View>

                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>Account Type</Text>
                  <Text style={styles.reviewValue}>
                    {role === "DOCTOR"
                      ? "Doctor"
                      : "Clinic Assistant"}
                  </Text>
                </View>

                {role === "DOCTOR" && (
                  <>
                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Doctor Level</Text>
                      <Text style={styles.reviewValue}>
                        {doctorLevel === "DOCTOR"
                          ? "Licensed Doctor"
                          : "Intern"}
                      </Text>
                    </View>

                    <View style={styles.reviewRow}>
                      <Text style={styles.reviewLabel}>Medical License</Text>
                      <Text style={styles.reviewValue}>
                        {doctorLevel === "DOCTOR"
                          ? medicalLicenseImage
                            ? "Uploaded"
                            : "Not Uploaded"
                          : "Not Required"}
                      </Text>
                    </View>
                  </>
                )}

              </AppCard>

              <View style={styles.buttonRow}>
                <AppButton
                  title="Back"
                  style={styles.flexButton}
                  onPress={() =>
                    role === "DOCTOR"
                      ? setStep(4)
                      : setStep(3)
                  }
                />

                <AppButton
                  title="Create Account"
                  style={styles.flexButton}
                  onPress={handleRegister}
                  loading={loading}
                />
              </View>

              <View style={styles.footer}>
                <Text
                  style={styles.footerText}
                >
                  Already have an account?
                </Text>

                <Pressable
                  onPress={() =>
                    router.back()
                  }
                >
                  <Text
                    style={styles.loginText}
                  >
                    Sign In
                  </Text>
                </Pressable>
              </View>
            </>
          )}

          </View>
        </AppCard>
      </AppKeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    padding: SPACING.lg,
  },

  header: {
    alignItems: "center",
    marginVertical: SPACING.xl,
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#EEF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: "700",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 6,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.secondaryText,
  },

  card: {
    ...SHADOW,
  },

  form: {
    gap: SPACING.md,
  },

  sectionTitle: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: SPACING.md,
    backgroundColor: COLORS.card,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  uploadSubtitle: {
    marginTop: 4,
    color: COLORS.secondaryText,
    fontSize: 13,
  },

  roleContainer: {
    gap: SPACING.md,
  },

  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },

  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EEF6FF",
  },

  roleContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  roleTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  roleSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  summaryCard: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  },

  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },

  summarySubtitle: {
    textAlign: "center",
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
    lineHeight: 22,
  },

  buttonRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },

  flexButton: {
    flex: 1,
  },

  footer: {
    marginTop: SPACING.xl,
    alignItems: "center",
    gap: SPACING.sm,
  },

  footerText: {
    color: COLORS.secondaryText,
    fontSize: TYPOGRAPHY.body,
  },

  loginText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: TYPOGRAPHY.body,
  },

  progressContainer:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    marginTop:SPACING.lg,
  },

  progressWrapper:{
    flexDirection:"row",
    alignItems:"center",
  },

  progressDot:{
    width:14,
    height:14,
    borderRadius:7,
    backgroundColor:"#D6DCE5",
  },

  progressDotActive:{
    backgroundColor:COLORS.primary,
  },

  progressLine:{
    width:38,
    height:3,
    backgroundColor:"#D6DCE5",
  },

  progressLineActive:{
    backgroundColor:COLORS.primary,
  },

  progressText:{
    marginTop:10,
    textAlign:"center",
    color:COLORS.secondaryText,
    fontWeight:"600",
  },

  reviewCard: {
    marginTop: SPACING.md,
  },

  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  reviewLabel: {
    fontSize: 15,
    color: COLORS.secondaryText,
  },

  reviewValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
});