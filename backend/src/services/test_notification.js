import { Expo } from "expo-server-sdk";

const expo = new Expo();
const pushToken = "ExponentPushToken[bFPjE8GPTdvy0fkFaTSoAc]";

async function sendTestNotification() {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  const messages = [
    {
      to: pushToken,
      sound: "default",
      title: "Test Notification",
      data: { test: true },
    },
  ];

  console.log("Sending test notification...");
  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("Ticket received:", ticketChunk);

      // Check for errors in tickets
      for (const ticket of ticketChunk) {
        if (ticket.status === "error") {
          console.error(`Error sending notification: ${ticket.message}`);
          if (ticket.details && ticket.details.error) {
            console.error(`Error details: ${ticket.details.error}`);
          }
        }
      }
    } catch (error) {
      console.error("Error sending chunk:", error);
    }
  }
}

sendTestNotification();
