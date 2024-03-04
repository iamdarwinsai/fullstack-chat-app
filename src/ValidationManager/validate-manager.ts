import { prisma } from "../config/db";

//Validate roomId -> once validated store in redis cache
//validate UserId with JWT

class ValidateUser {
  private roomId: string;
  constructor(roomId: string) {
    this.roomId = roomId;
  }
}
