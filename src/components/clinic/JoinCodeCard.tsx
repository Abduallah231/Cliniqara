import { View, Text } from "react-native";
import ClinicJoinQr from "./ClinicJoinQr";

type Props = {
  code: string;
  expiresAt: string;
};

export default function JoinCodeCard({
  code,
  expiresAt,
}: Props) {
  return (
    <View>
      <Text>Clinic Join Code</Text>

      <Text>{code}</Text>

      <Text>
        Expires:{" "}
        {new Date(expiresAt).toLocaleString()}
      </Text>

      <ClinicJoinQr code={code} />
    </View>
  );
}