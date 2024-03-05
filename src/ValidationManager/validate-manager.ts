import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

import { prisma } from "../config/db";
import utilities from "../utils/env";

//Validate roomId -> once validated store in redis cache
//validate UserId with JWT

export class ValidateUser {
  private static instance: ValidateUser;

  private Prisma: PrismaClient;
  constructor() {
    this.Prisma = prisma;
  }

  async validateUser(userId: string) {
    try {
      const user = await this.Prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return { status: !!user, user };
    } catch (error) {
      throw error;
    }
  }

  async validateRoomId(roomId: string) {
    try {
      const room = await this.Prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });
      return { status: !!room, room };
    } catch (error) {
      throw error;
    }
  }

  public static getInstance(): ValidateUser {
    if (!ValidateUser.instance) {
      ValidateUser.instance = new ValidateUser();
    }
    return ValidateUser.instance;
  }
}
