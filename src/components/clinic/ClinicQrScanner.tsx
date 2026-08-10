import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { COLORS } from "@/theme/colors";

type Props = {
  onCodeScanned: (code: string) => void;
};

export default function ClinicQrScanner({
  onCodeScanned,
}: Props) {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text onPress={requestPermission}>
          Allow camera access to scan the clinic QR code
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                onCodeScanned(data);
              }
        }
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>
          Scan Clinic QR Code
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    overflow: "hidden",
    borderRadius: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  text: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: "600",
  },
  center: {
    padding: 20,
    alignItems: "center",
  },
});