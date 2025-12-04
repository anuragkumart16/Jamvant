import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Global handler (recommended to keep at root)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token: string | null = null;

  // Android: Set notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Physical device check
  if (!Device.isDevice) {
    alert('Must use physical device for push notifications');
    return null;
  }

  // Check if running in Expo Go
  if (Constants.executionEnvironment === 'storeClient') {
    console.log('Push notifications are not supported in Expo Go. Please use a development build.');
    return null;
  }

  // Check + request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: { allowDeviceCredentials: true }, // iOS 17+ requirement
    });
    finalStatus = status;
  }

  console.log("Notification Permissions Status:", finalStatus); // DEBUG LOG

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notifications!');
    return null;
  }

  try {
    // Fetch project ID safely
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.warn("Project ID not found — running in local dev?");
      return null; // Exit safely
    }

    // Get token
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("Expo Push Token:", token);

    // Save token securely
    if (token) {
      await SecureStore.setItemAsync('pushToken', token);
    }

  } catch (e) {
    console.error('Error getting push token:', e);
    alert(`Error getting push token: ${e}`);
  }

  return token;
}
