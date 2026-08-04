import axios from "axios";

const API_URL = "http://10.208.136.214:3000";

export async function uploadImage(uri: string) {
  const formData = new FormData();

  const fileName = uri.split("/").pop() || "image.jpg";

  formData.append("file", {
    uri,
    name: fileName,
    type: "image/jpeg",
  } as any);

  const response = await axios.post(
    `${API_URL}/upload/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.url;
}