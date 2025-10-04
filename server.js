import express from "express";
import connection from "../ims_admin_backend/src/dbConfig.js";
import cors from "cors";
import errorMiddleWare from "./src/middlewares/errorMiddleWare.js";
import authRoutes from "./src/routes/authRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js";
import notificationRouter from "./src/routes/notificationRoutes.js";
import imageRouter from "./src/routes/imageRoute.js";
// socket.io imports
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();
const PORT = process.env.PORT || 8000;

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
  console.log("🔌 User connected:", socket.id);

  // let user join a room based on their profileId/userId
  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(` User with ID ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(" User disconnected:", socket.id);
  });
});
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
app.use(cors());
app.use(express.json());

// auth routes
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use("/api/v1/notification", notificationRouter);

// write everything above do not touch these error middelware
app.use((req, res, next) => {
  const error = new Error(`not found ${req.originalUrl}`);
  error.stausCode = 404;
  next(error);
});
app.use(errorMiddleWare);
