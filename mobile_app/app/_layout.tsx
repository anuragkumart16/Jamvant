import { Slot } from "expo-router";
import { useEffect } from "react";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import * as Notifications from 'expo-notifications';

export default function Layout() {
    useEffect(() => {
        registerForPushNotificationsAsync();

        const subscription = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
            console.log("Notification received:", notification);
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
            console.log("Notification response:", response);
        });

        return () => {
            subscription.remove();
            responseSubscription.remove();
        };
    }, []);

    return <Slot />;
}
