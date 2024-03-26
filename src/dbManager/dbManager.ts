import { prisma } from "../config/db";

// Create a method where messages get stored in the database
class DatabaseManager {
  private static instance: DatabaseManager;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async addRoomIdInUsersDB(roomId: string, userId: string) {
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          room: {
            connect: {
              id: roomId,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error adding room id in user db:", error);
    }
  }
}

const DbManager = DatabaseManager.getInstance();
export default DbManager;
