import express from "express";
import cors from "cors";
import connectDB from "./config/db.ts";
import router from "./routes/index.ts";
import { defineEmailJob } from "./jobs/sendEmail.ts";
import agenda from "./config/agenda.ts";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://futureblink.rohitdhakane.me",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

defineEmailJob(agenda);
agenda.on("ready", async () => {
  console.log("Agenda is ready");
  await agenda.start();
});
agenda.on("error", (error) => {
  console.error("Agenda error:", error);
});

connectDB();

app.use("/api/v1", router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
