import { api } from "./api";

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
  return uploadImage(
    uri,
    "/upload/user/national-id",
  );
}

export async function uploadMedicalLicenseImage(
  uri: string,
) {
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
  return uploadImage(
    uri,
    `/upload/visits/${visitId}/investigations/${investigationId}`,
  );
}