import jwt from "jsonwebtoken";

import HttpError from "../models/http-error.js";

const authCheck = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(new HttpError("Authorization failed!", 401));
        }

        const decoded = jwt.verify(token, "my_secret");

        req.user = { userId: decoded.userId, token: token };
        next();
    } catch (err) {
        return next(new HttpError(err, 500));
    }
};

export default authCheck;
