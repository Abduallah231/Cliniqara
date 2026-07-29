import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      const message = error.response.data.message;

      if (Array.isArray(message)) {
        return message.join("\n");
      }

      return message;
    }

    if (error.code === "ECONNABORTED") {
      return "Request timeout.";
    }

    if (!error.response) {
      return "Cannot connect to the server.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}