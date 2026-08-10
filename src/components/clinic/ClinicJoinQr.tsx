import QRCode from "react-native-qrcode-svg";

type Props = {
  code: string;
};

export default function ClinicJoinQr({ code }: Props) {
  return (
    <QRCode
      value={code}
      size={220}
    />
  );
}