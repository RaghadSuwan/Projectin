import "dotenv/config";
import express from "express";
import initapp from "./src/modules/app.router.js";
const app = express();
const PORT = process.env.PORT || 3000;
initapp(app,express);
app.listen(PORT, () => {
  console.log(`Server is running.. ${PORT}`);
})
