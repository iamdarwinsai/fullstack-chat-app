import express, { Request, Response } from "express";
import http from "http";
import { WebSocket, WebSocketServer } from "ws";

const app = express();

const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket, req: Request) => {
  try {
    const urlString = req.url;
    const urlObject = new URL(urlString, `http://${req.headers.host}`);
    const roomId = urlObject.searchParams.get("roomId");

    if (!roomId) {
      throw new Error("RoomId not present");
    }

    console.log(`WebSocket connection established for roomId: ${roomId}`);
  } catch (error: any) {
    console.error("WebSocket connection error:", error.message);

    ws.send(JSON.stringify({ error: error.message }));

    ws.close();
  }
});

export { app, httpServer, wss };
