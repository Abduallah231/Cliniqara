type ApiErrorResult = {
  title: string;
  message: string;
};

const getFirstMessage = (
  error: any,
): string | null => {
  const message =
    error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message[0] ?? null;
  }

  if (
    typeof message === "string" &&
    message.trim()
  ) {
    return message.trim();
  }

  return null;
};

export const getApiError = (
  error: any,
  fallback: ApiErrorResult,
): ApiErrorResult => {
  const backendMessage =
    getFirstMessage(error);

  if (!backendMessage) {
    return fallback;
  }

  const message =
    backendMessage.toLowerCase();

  /*
   * =========================
   * Phone
   * =========================
   */

  if (
    message.includes("phone") &&
    (
      message.includes("valid") ||
      message.includes("phone number")
    )
  ) {
    return {
      title: "Invalid Phone Number",
      message:
        "Please enter a valid Egyptian phone number.",
    };
  }

  /*
   * =========================
   * Email
   * =========================
   */

  if (
    message.includes("email") &&
    (
      message.includes("valid") ||
      message.includes("email")
    )
  ) {
    return {
      title: "Invalid Email",
      message:
        "Please enter a valid email address.",
    };
  }

  /*
   * =========================
   * Clinic Name
   * =========================
   */

  if (
    message.includes("name") &&
    message.includes("empty")
  ) {
    return {
      title: "Clinic Name Required",
      message:
        "Please enter the clinic name.",
    };
  }

  /*
   * =========================
   * Working Days
   * =========================
   */

  if (
    message.includes("working day") ||
    message.includes("workingdays") ||
    message.includes("shift")
  ) {
    return {
      title: "Invalid Working Hours",
      message:
        "Please check the clinic working days and shifts.",
    };
  }

  /*
   * =========================
   * Duplicate Clinic
   * =========================
   */

  if (
    message.includes("already exists") ||
    message.includes("duplicate")
  ) {
    return {
      title: "Already Exists",
      message:
        "A clinic with the same information already exists.",
    };
  }

  /*
   * =========================
   * Unauthorized
   * =========================
   */

  if (
    message.includes("unauthorized") ||
    message.includes("not authorized") ||
    message.includes("forbidden")
  ) {
    return {
      title: "Permission Denied",
      message:
        "You do not have permission to perform this action.",
    };
  }

  /*
   * =========================
   * Known backend message
   * =========================
   *
   * If the backend message is understandable,
   * keep it instead of hiding the actual reason.
   */

  return {
    title: fallback.title,
    message: backendMessage,
  };
};