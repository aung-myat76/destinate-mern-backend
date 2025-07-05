import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import placesRoutes from "./routes/places.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import HttpError from "./models/http-error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const MONGODB_URI =
    "mongodb+srv://aung_myat:zz762389@nodejs.4lf0iqx.mongodb.net/destinate?retryWrites=true&w=majority&appName=Nodejs";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads/img", express.static(path.join(__dirname, "uploads", "img")));
app.use(
    cors({
        origin: "http://localhost:5173", // your React app domain
        credentials: true, // allow cookies if needed
    })
);

app.use("/", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/", (req, res, next) => {
    throw new HttpError("Page not found", 404);
});

app.use((err, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path);
    }

    if (res.headerSent) {
        return next(err);
    }
    res.status(err.code || 500).json({
        message: err.message || "Something went wrong!",
    });
});

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("server is connected!");
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });
