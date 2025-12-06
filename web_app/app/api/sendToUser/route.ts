import { NextResponse } from 'next/server';
import { Expo } from 'expo-server-sdk';
import prisma from '@/lib/prisma';

const expo = new Expo();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pushToken = searchParams.get('pushToken');

        if (!pushToken) {
            return NextResponse.json({ success: false, error: 'Missing pushToken' }, { status: 400 });
        }

        if (!Expo.isExpoPushToken(pushToken)) {
            return NextResponse.json({ success: false, error: 'Invalid pushToken' }, { status: 400 });
        }

        console.log(`Sending notification to user with token: ${pushToken}`);

        // 1. Fetch the user with this push token
        const user = await prisma.user.findFirst({
            where: {
                pushToken: pushToken,
            },
            include: {
                floatCollections: true, // Fetch their floats
            },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        if (user.floatCollections.length === 0) {
            return NextResponse.json({ success: false, error: 'User has no floats' }, { status: 400 });
        }

        // 2. Select a random float
        const randomIndex = Math.floor(
            Math.random() * user.floatCollections.length
        );
        const randomFloat = user.floatCollections[randomIndex];

        // 3. Construct the message
        const messages = [{
            to: user.pushToken,
            sound: "default",
            title: randomFloat.text,
            data: { floatId: randomFloat.id },
        }];

        // 4. Send notifications
        // Since it's just one, we don't strictly need chunking, but safe to keep it standard
        const chunks = expo.chunkPushNotifications(messages as any);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error("Error sending chunk:", error);
            }
        }

        console.log(`Sent notification to ${pushToken}`);

        return NextResponse.json({ success: true, sentCount: 1 });

    } catch (error) {
        console.error("Error in sendToUser task:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
