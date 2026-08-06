import { api } from "./api";

export async function uploadImage(uri: string) {
  const formData = new FormData();

  const fileName = uri.split("/").pop() || "image.jpg";

  formData.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",
  } as any);

  const response = await api.post(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.url;
}