// REGISTERING ENV VARIABLES
import { config } from "dotenv";
if (process.env.NODE_ENV === "development") {
  console.log("Loading development enviorment variables...");
  config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  console.log("Loading production enviorment variables...");
  config({ path: ".env.production" });
}

config(); // Load variables from .env file by default
