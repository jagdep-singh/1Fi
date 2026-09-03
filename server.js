import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT || 8383;

app.get("/", (req, res) => {
  res.status(200).json({ message: "submission by Jagdeep Singh" });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});