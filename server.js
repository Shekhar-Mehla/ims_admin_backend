import express from "express";
import connection from "./src/dbConfig.js";
import cors from "cors";
import errorMiddleWare from "./src/middlewares/errorMiddleWare.js";
import authRoutes from "./src/routes/authRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import imageRouter from "./src/routes/imageRoute.js";
// socket.io imports
import { createServer } from "http";
import { Server } from "socket.io";

import intershipRoutes from "./src/routes/internshipRoutes.js";
import notificationCollection from "./src/models/Notification/notificationSchema.js";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
// wrap express app inside http server
const httpServer = createServer(app);
// initialize socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "*", // you can restrict to your frontend domain
    methods: ["GET", "POST"],
  },
});
// make io available inside routes/controllers
app.set("io", io);

// socket.io connection
io.on("connection", (socket) => {
  // let user join a room based on their profileId/userId
  socket.on("join", async (userId) => {
    socket.join(userId.toString());
    const unreadCount = await notificationCollection.countDocuments({
      authId: userId,
      isRead: false,
    });
    socket.emit("unreadCount", unreadCount);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});
// db connection
connection()
  .then(() => {
    httpServer.listen(PORT, (error) => {
      return !error
        ? console.log(`service is running at http://localhost:${PORT}`)
        : console.log(error);
    });
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("server is live");
});

// auth routes
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/notification", notificationRouter);

app.use("/api/v1/internship", intershipRoutes);

// notification routes

// write everything above do not touch these error middelware
app.use((req, res, next) => {
  const error = new Error(`not found ${req.originalUrl}`);
  error.stausCode = 404;
  next(error);
});
app.use(errorMiddleWare);
