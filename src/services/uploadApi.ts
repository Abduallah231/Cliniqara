import { api } from "./api";
import { Directory, File, Paths } from "expo-file-system";
import { AUTH_ENABLED } from "@/config/features";

async function uploadImage(
  uri: string,
  endpoint: string,
) {
  const formData = new FormData();

  const fileName =
    decodeURIComponent(uri.split("/").pop() || "image.jpg");

  const extension =
    fileName.split(".").pop()?.toLowerCase();

  const mimeType =
    extension === "png"
      ? "image/png"
      : extension === "webp"
      ? "image/webp"
      : "image/jpeg";

  formData.append("file", {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await api.post(
    endpoint,
    formData,
    {
      headers: {
        // Do NOT manually set Content-Type here.
        // Axios/React Native will add the correct
        // multipart boundary automatically.
      },
    },
  );

  return response.data.url as string;
}

export async function uploadNationalIdImage(
  uri: string,
) {
  if (!AUTH_ENABLED) {
    throw new Error("Account registration is disabled in offline mode.");
  }
  return uploadImage(
    uri,
    "/upload/user/national-id",
  );
}

export async function uploadMedicalLicenseImage(
  uri: string,
) {
  if (!AUTH_ENABLED) {
    throw new Error("Account registration is disabled in offline mode.");
  }
  return uploadImage(
    uri,
    "/upload/user/medical-license",
  );
}

export async function uploadInvestigationImage(
  uri: string,
  visitId: string,
  investigationId: string,
) {
  const sourceName = decodeURIComponent(uri.split("/").pop() || "image.jpg");
  const extension = sourceName.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
  const directory = new Directory(Paths.document, "investigations");
  directory.create({ idempotent: true, intermediates: true });
  const destination = new File(directory, `${visitId}-${investigationId}-${Date.now()}.${extension}`);
  await new File(uri).copy(destination);
  return destination.uri;
}
