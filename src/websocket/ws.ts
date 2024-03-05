import express, { Request, Response } from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";
import { ValidateUser } from "../ValidationManager/validate-manager";

const app = express();

const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", async (ws: WebSocket, req: Request) => {
  try {
    const urlString = req.url;
    const urlObject = new URL(urlString, `http://${req.headers.host}`);
    const roomId = urlObject.searchParams.get("roomId");
    const userID = urlObject.searchParams.get("userId");

    if (!roomId || !userID) {
      throw new Error("Both roomId and token are required to access the room.");
    }

    const userValidation = await ValidateUser.getInstance().validateUser(
      userID
    );
    const roomValidation = await ValidateUser.getInstance().validateRoomId(
      roomId
    );

    if (!userValidation.status || !roomValidation.status) {
      throw new Error("User or room not validated");
    }
    console.log(
      `${userValidation.user?.username} joined ${roomValidation.room?.name} room`
    );

    // ws.on("message",()=>handleMe(ws))

    ws.on("close", () => {
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
