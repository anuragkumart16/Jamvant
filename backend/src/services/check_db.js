import prisma from "../utils/prisma.js";

async function checkData() {
  try {
    const users = await prisma.User.findMany({
      where: {
        pushToken: {
          not: null,
        },
      },
      include: {
        floatCollections: true,
      },
    });

    console.log("Users with push tokens:", users.length);
    users.forEach((user) => {
      console.log(`User: ${user.email || user.id}`);
      console.log(`- Push Token: ${user.pushToken}`);
      console.log(`- Floats count: ${user.floatCollections.length}`);
    });
  } catch (error) {
    console.error("Error checking data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
