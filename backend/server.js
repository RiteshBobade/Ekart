import "dotenv/config";
import express from "express";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import productRoute from './routes/productRoute.js'

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(
  {
    origin: ["http://localhost:5173"],
    credentials: true
  }
));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});