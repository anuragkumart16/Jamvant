import cron from 'node-cron';
import { Expo } from 'expo-server-sdk';
import prisma from '../utils/prisma.js';


const expo = new Expo();

export const startScheduler = () => {
    // Schedule a task to run every 2 hours
    // Cron expression: "0 */2 * * *"
    // For testing purposes, you can use "* * * * *" to run every minute
    cron.schedule('0 */2 * * *', async () => {
        console.log('Running scheduled notification task...');
        try {
            // 1. Fetch all users with a push token
            const users = await prisma.User.findMany({
                where: {
                    pushToken: {
                        not: null,
                    },
                },
                include: {
                    floatCollections: true, // Fetch their floats
                },
            });

            console.log(users);

            const messages = [];

            for (const user of users) {
                if (!user.pushToken || !Expo.isExpoPushToken(user.pushToken)) {
                    console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
                    continue;
                }

                if (user.floatCollections.length === 0) {
                    continue; // User has no floats
                }

                // 2. Select a random float
                const randomIndex = Math.floor(Math.random() * user.floatCollections.length);
                const randomFloat = user.floatCollections[randomIndex];

                // 3. Construct the message
                messages.push({
                    to: user.pushToken,
                    sound: 'default',
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
                    console.error('Error sending chunk:', error);
                }
            }
            
            console.log(`Sent ${messages.length} notifications.`);

        } catch (error) {
            console.error('Error in scheduled task:', error);
        }
    });
    
    console.log('Scheduler started: Notifications will be sent every 2 hours.');
};

startScheduler()