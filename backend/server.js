import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowed = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ];
  if (!origin || allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("Ekart API is running!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;