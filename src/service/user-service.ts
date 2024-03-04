import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UserRepo } from "../repository";
import { AppError, ServiceError } from "../utils/Errors";

import {
  LoginSchemaType,
  UserValidationSchemaType,
} from "../utils/validations";
import utilities from "../utils/env";

export default class UserService {
  private userRepo: UserRepo;
  constructor() {
    this.userRepo = new UserRepo();
  }

  async createUser(data: UserValidationSchemaType) {
    try {
      const response = await this.userRepo.createUser(data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  async loginUser(data: LoginSchemaType) {
    try {
      const findUser = await this.userRepo.getUser(data.email);
      if (!findUser) {
        throw new ServiceError(
          "NOT_FOUND",
          "Email doesn't exists",
          httpStatus.UNAUTHORIZED
        );
      }

      const passwordMatch = await bcrypt.compare(
        data.password,
        findUser.password
      );
      if (!passwordMatch) {
        throw new AppError(
          "Password_Wrong",
          "Password wrong",
          httpStatus.UNAUTHORIZED
        );
      }
      const { id } = findUser;
      const token = this.generateToken({ userId: id });
      return token;
    } catch (err) {
      throw err;
    }
  }

  generateToken(data: JwtPayload) {
    return jwt.sign(data, utilities.JWT_SECRET, { expiresIn: "10h" });
  }
}
