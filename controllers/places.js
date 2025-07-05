import mongoose from "mongoose";

import HttpError from "../models/http-error.js";
import Place from "../models/place.js";
import User from "../models/user.js";

export const getPlaces = (req, res, next) => {
    res.json({ msg: "it works!" });
};

export const getPlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError(err), 500);
    }

    if (!place) {
        return next(new HttpError("Could not find a place with this Id!", 404));
    }

    res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let userPlaces;

    try {
        userPlaces = await User.findById(userId).populate("places");

        if (!userPlaces) {
            return next("Could not find a place with this User Id!", 404);
        }

        res.json({ place: userPlaces });
    } catch (err) {
        return next(err, 500);
    }
};

export const postPlace = async (req, res, next) => {
    const { name, description, address, location, userId } = req.body;

    let user;

    try {
        user = await User.findById(userId);
        if (!user) {
            return next(new HttpError("Could not find user", 404));
        }
    } catch (err) {
        return next(new HttpError("Could not create place", 500));
    }

    const newPlace = new Place({
        name,
        description,
        address,
        location,
        userId,
        image: req.file.path,
    });

    let session;

    try {
        session = await mongoose.startSession();
        session.startTransaction();
        await newPlace.save({ session });
        user.places.push(newPlace);
        await user.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            place: newPlace,
        });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(new HttpError(err, 500));
    }
};

export const patchPlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    const { name, description } = req.body;

    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError(err), 500);
    }

    place.name = name;
    place.description = description;

    if (req.user.userId.toString() !== place.userId._id.toString()) {
        return next(new HttpError("Authorization failed to update", 401));
    }
    try {
        await place.save().then(() => {
            res.status(200).json({
                place: place.toObject({ getters: true }),
                user: req.user,
            });
        });
    } catch (err) {
        return next(new HttpError(err, 500));
    }
};

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;

    try {
        place = await Place.findById(placeId).populate("userId");

        if (!place) {
            return next(new HttpError("Could not find this place", 404));
        }

        console.log(req.user, place);

        if (req.user.userId.toString() !== place.userId._id.toString()) {
            return next(new HttpError("Authorization failed to delete", 401));
        }
    } catch (err) {
        return next(new HttpError(err), 500);
    }

    let session;
    try {
        session = await mongoose.startSession();
        await session.startTransaction();
        await place.deleteOne({ session });
        place.userId.places.pull(place);
        await place.userId.save({ session });

        await session.commitTransaction();
        await session.endSession();
        res.status(200).json({ msg: "Deleted Place!" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return next(new HttpError(err, 500));
    }
};
