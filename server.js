import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ⭐ ADD THIS LINE
import "./services/presenceBot.js";

import staffRoutes from "./routes/staffRoutes.js";

dotenv.config();

const app = express();

// FULL CORS FIX
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/staff", staffRoutes);

// ROOT TEST
app.get("/", (req, res) => {
  res.send("Discord Staff API Running 🚀");
});

// RENDER WILL SET PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} 🔥`);
});
