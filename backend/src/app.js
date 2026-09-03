import express from "express";
import cors from "cors";
import "express-async-errors";
import productRoutes from "./routes/product.routes.js";
import {errorHandler} from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "submission by Jagdeep Singh" });
});

app.get("/api", (req, res) => {
  res.status(200).json({ message: "go to /api/products to fetch products" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});

app.use("/api/products" , productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `no routes for ${req.method} ${req.originalUrl}` });
});


app.use(errorHandler);
export default app;