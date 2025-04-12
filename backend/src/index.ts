import express from "express";
import cors from "cors";
import { olhcRouter } from "./routes/olhc";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

app.use("/api/v1/olhc", olhcRouter);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
