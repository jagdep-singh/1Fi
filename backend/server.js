import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";

const PORT = process.env.PORT || 8383;



app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});