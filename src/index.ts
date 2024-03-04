import express from "express";

import { errorHandler } from "./middlewares/error";
import { app, httpServer } from "./websocket/ws";

import apiRoutes from "./routes/v1/index";
import utilities from "./utils/env";

const PORT = utilities.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", apiRoutes);

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`server started working on ${PORT}`);
});
