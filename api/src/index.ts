import express from "express";
import cors from "cors";
import connectDB from "./config/db.ts";
import router from "./routes/index.ts";
import { defineEmailJob } from "./jobs/sendEmail.ts";
import agenda from "./config/agenda.ts";

const app = express();

app.use(express.json());
app.use(cors());
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
