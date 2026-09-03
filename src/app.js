import express from "express";
import cors from "cors";
import "express-async-errors";
import productRoutes from "./routes/product.routes.js";
import {errorHandler} from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());



app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});

app.use("/api/products" , productRoutes);

app.use(errorHandler);
export default app;