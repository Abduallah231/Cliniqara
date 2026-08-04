import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN = "accessToken";
const USER = "user";
const GUEST = "guest";

export async function saveSession(
  token: string,
  user: any
) {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN, token],
    [USER, JSON.stringify(user)],
  ]);

  await AsyncStorage.removeItem(GUEST);
}

export async function saveGuestSession() {
  await AsyncStorage.setItem(GUEST, "true");
}

export async function logout() {
  await AsyncStorage.multiRemove([
    ACCESS_TOKEN,
    USER,
    GUEST,
  ]);
}

export async function getSession() {
  const token = await AsyncStorage.getItem(ACCESS_TOKEN);
  const user = await AsyncStorage.getItem(USER);
  const guest = await AsyncStorage.getItem(GUEST);

  return {
    token,
    guest: guest === "true",
    user: user ? JSON.parse(user) : null,
  };
}