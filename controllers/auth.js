import { validationResult } from "express-validator";
import User from "../models/user.js";
import HttpError from "../models/http-error.js";

export const postSignUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!validationResult) {
        return next(new HttpError("Invalid entered values!", 403));
    } else {
        const newUser = new User({
            name,
            email,
            password,
        });

        try {
            await newUser
                .save()
                .then(() => {
                    res.status(200).json({
                        name,
                        email,
                        password,
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

    let loggedInUser;

    try {
        loggedInUser = await User.find({ email: email, password: password })
            .exec()
            .then((user) => {
                if (!user.length > 0) {
                    return next(new HttpError("You haven't Sign up yet!", 402));
                }

                return res.status(200).json({
                    user: user,
                    message: "Account have been logged in!",
                });
            })
            .catch((err) => {
                return next(new HttpError(err, 402));
            });
    } catch (err) {
        return next(new HttpError(err, 500));
    }
};
