import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, "-password");
        if (!users.length > 0) {
            return next(new HttpError("There's no users to show!"));
        } else {
            return res.json({
                users: users.map((u) => u.toObject({ getters: true })),
            });
        }
    } catch (err) {
        return next(new HttpError("Could not fetch users", 500));
    }
};

export const getUser = (req, res, next) => {
    const userId = req.params.userId;

    const loadedUser = dummyUsers.find((u) => u.id === userId);

    res.json({ place: loadedUser });
};
