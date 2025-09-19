import express from "express";
import connection from "./src/dbConfig.js";
import cors from "cors";
import errorMiddleWare from "./src/middlewares/errorMiddleWare.js";
import authRoutes from "./src/routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;
connection()
  .then(() => {
    app.listen(PORT, (error) => {
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
app.use("/api/v1/auth", authRoutes);

// write everything above do not touch these error middelware
app.use((req, res, next) => {
  const error = new Error(`not found ${req.originalUrl}`);
  error.stausCode = 404;
  next(error);
});
app.use(errorMiddleWare);
