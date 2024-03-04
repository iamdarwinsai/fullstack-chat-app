import bcrypt from "bcryptjs";
import httpStatus from "http-status";

import { prisma } from "../config/db";
import { UserValidationSchemaType } from "../utils/validations";

import { AppError, ServiceError } from "../utils/Errors";

class UserRepo {
  async createUser(userData: UserValidationSchemaType) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: userData.email,
        },
      });

      if (user) {
        throw new ServiceError(
          "USER EXITS",
          "User with this email already exits",
          httpStatus.CONFLICT
        );
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          password: hashedPassword,
        },
      });

      return newUser;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (err) {
      throw err;
    }
  }
}

export default UserRepo;
