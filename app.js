import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import placesRoutes from "./routes/places.js";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import HttpError from "./models/http-error.js";

const app = express();
const MONGODB_URI =
    "mongodb+srv://aung_myat:zz762389@nodejs.4lf0iqx.mongodb.net/destinate?retryWrites=true&w=majority&appName=Nodejs";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use("/", (req, res, next) => {
    throw new HttpError("Page not found", 404);
});

app.use((err, req, res, next) => {
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
