import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Place from "../models/place.js";
import HttpError from "../models/http-error.js";

export const serverErrorEmitter = (err) => {
    return next(new HttpError(err, 500));
};

export const postSignUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    let cryptedPassword;

    try {
        cryptedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        serverErrorEmitter(err);
    }

    if (!validationResult) {
        return next(new HttpError("Invalid entered values!", 403));
    } else {
        const newUser = new User({
            name,
            profile: req.file.path,
            email,
            password: cryptedPassword,
            places: [],
        });

        try {
            await newUser
                .save()
                .then(() => {
                    res.status(200).json({
                        name,
                        profile: req.file.path,
                        email,
                        password,
                        places: newUser.places,
                        message: "You have signed up an account",
                    });
                })
                .catch((err) => {
                    if (err.code === 11000) {
                        return next(
                            new HttpError(
                                "Your email has been used for signing up, please login instead!",
                                422
                            )
                        );
                    }
                });
        } catch (err) {
            return next(new HttpError(err, 500));
        }
    }
};

export const postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    let user;
    let isPswValid;

    try {
        user = await User.findOne({ email: email }).exec();
        isPswValid = await bcrypt.compare(password, user.password);
        if (!user) {
            return next(new HttpError("You haven't Sign up yet!", 402));
        }

        if (!isPswValid) {
            return next(new HttpError("Your Password is incorrect", 402));
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            "my_secret",
            {
                expiresIn: "1h",
            }
        );

        return res.status(200).json({
            user,
            token,
            message: "Account have been logged in!",
        });
    } catch (err) {
        return next(new HttpError(err, 500));
    }
};
