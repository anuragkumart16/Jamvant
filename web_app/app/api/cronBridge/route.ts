import { NextResponse } from 'next/server';
import { Expo } from 'expo-server-sdk';
import prisma from '@/lib/prisma'; // Ensure this path matches your project structure

const expo = new Expo();

// Force dynamic usage so Next.js doesn't cache this as static
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Running scheduled notification task via Cron Bridge...");

    // 1. Fetch all users with a push token
    const users = await prisma.user.findMany({
      where: {
        pushToken: {
          not: null,
        },
      },
      include: {
        floatCollections: true, // Fetch their floats
      },
    });

    // console.log(users); // Optional: log users for debugging, maybe too verbose for prod

    const messages: any[] = [];

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
        sound: "default",
        title: randomFloat.text,
        data: { floatId: randomFloat.id },
      });
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

    // Return success response
    return NextResponse.json({ success: true, sentCount: messages.length });

  } catch (error) {
    console.error("Error in scheduled task:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
