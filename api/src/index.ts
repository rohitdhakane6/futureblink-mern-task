import express from "express";
import cors from "cors";
import connectDB from "./config/db.ts";
import router from "./routes/index.ts";

const app = express();

app.use(express.json());
app.use(cors())

connectDB();

app.use("/api/v1", router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

