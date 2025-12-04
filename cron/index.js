import cron from "node-cron";
import { Expo } from "expo-server-sdk";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const expo = new Expo();

console.log("Starting Cron Service...");

// Schedule a task to run every 2 hours
// Cron expression: "0 */2 * * *"
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled notification task...");
  try {
    // 1. Fetch all users with a push token
    const users = await prisma.user.findMany({
      where: {
        pushToken: {
          not: null,
        },
      },
      include: {
        floatCollections: true,
      },
    });

    console.log(`Found ${users.length} users with push tokens.`);

    const messages = [];

    for (const user of users) {
      if (!user.pushToken || !Expo.isExpoPushToken(user.pushToken)) {
        console.error(
          `Push token ${user.pushToken} is not a valid Expo push token`
        );
        continue;
      }

      if (user.floatCollections.length === 0) {
        continue; // User has no floats
      }

      // 2. Select a random float
      const randomIndex = Math.floor(
        Math.random() * user.floatCollections.length
      );
      const randomFloat = user.floatCollections[randomIndex];

      // 3. Construct the message
      messages.push({
        to: user.pushToken,
        body: randomFloat.text,
        data: { floatId: randomFloat.id },
      });
    }

    if (messages.length === 0) {
      console.log("No notifications to send.");
      return;
    }

    // 4. Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error sending chunk:", error);
      }
    }

    console.log(`Sent ${messages.length} notifications.`);
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});

console.log("Scheduler started: Notifications will be sent every 2 hours.");

// Keep the process alive
process.stdin.resume();
