// REGISTERING ENV VARIABLES
import { config } from "dotenv";
if (process.env.NODE_ENV === "development") {
  console.log("Loading development enviorment variables...");
  config({ path: ".env.development" });
}

config(); // Load variables from .env file by default
