import express, { Request, Response } from "express";
import http from "http";
import JWT from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import { ValidateUser } from "../ValidationManager/validate-manager";
import { RedisInstance } from "../RedisManager/redis-manager";
import utilities from "../utils/env";
import {
  IncomingMessage,
  JoinMessageType,
  SendMessageType,
  SupportedMessages,
  downVoteType,
  upVoteType,
} from "../messageTypes/messages";
import DbManager from "../dbManager/dbManager";

const app = express();

const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer });
const redis = RedisInstance.getInstance(utilities.REDIS_URI);
const validateUserInstance = ValidateUser.getInstance();
const dbStorage = DbManager;
wss.on("connection", async (ws: WebSocket, req: Request) => {
  try {
    const urlString = req.url;
    const urlObject = new URL(urlString, `http://${req.headers.host}`);
    const roomId = urlObject.searchParams.get("roomId");
    const jwtToken = urlObject.searchParams.get("token");
    if (!roomId || !jwtToken) {
      throw new Error("Both roomId and token are required to access the room.");
    }
    const { userId }: any = JWT.verify(jwtToken, utilities.JWT_SECRET);
    const userValidation = await validateUserInstance.validateUser(userId);
    const roomValidation = await validateUserInstance.validateRoomId(roomId);
    if (!userValidation.status || !roomValidation.status) {
      throw new Error("User or room not validated");
    }
    //now add user to this room array
    await dbStorage.addRoomIdInUsersDB(roomId, userId);
    await redis.storeInRedis(roomId, userId, ws); //this is only to check if the user is online or not
    console.log(
      `${userValidation.user?.username} joined ${roomValidation.room?.name} room`
    );
    ws.on("message", async (message) => {
      const parsedMessage: IncomingMessage = JSON.parse(message.toString());
      try {
        switch (parsedMessage.type) {
          case SupportedMessages.SendMessage:
            const sendMessage = parsedMessage.payload as SendMessageType;
            await redis.publishToRoom(roomId, sendMessage.message, userId);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON message:", error);
      }
    });

    ws.on("close", async () => {
      await redis.removeFromRedisAfterUserLeft(roomId, userId);
      console.log(
        `${userValidation.user?.username} left ${roomValidation.room?.name} room`
      );
    });
  } catch (error: any) {
    console.error("WebSocket connection error:", error.message);
    ws.send(JSON.stringify({ name: error.name, error: error.message }));
    ws.close();
  }
});

export { app, httpServer, wss };
