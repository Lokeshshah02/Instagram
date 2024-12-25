import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utlis/db.js";

dotenv.config({});

const app = express();

app.use(express.json());
app.use(cookieParser()); //using it to store the cookies on frontend
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5137",
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "hello" });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server listen at ${PORT}`);
});
