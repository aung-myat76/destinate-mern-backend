import HttpError from "../models/http-error.js";
import Place from "../models/place.js";

const dummyPlaces = [
    {
        id: "p1",
        name: "Yangon",
        address: "Southern part of Myanmar",
        description: "A nice place to find better opportunities...",
        img: "data:image/jpeg;base64,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",
        location: [16.8409, 96.1735],
        userId: "u1",
    },
];

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

    let place;

    try {
        place = await Place.find({ userId: userId });
    } catch (err) {
        return next(err, 500);
    }

    if (!place) {
        return next("Could not find a place with this User Id!", 404);
    }

    res.json({ place: place });
};

export const postPlace = async (req, res, next) => {
    const { name, description, address, location, userId } = req.body;
    const newPlace = new Place({
        name,
        description,
        address,
        location,
        userId,
    });

    try {
        await newPlace.save();
        res.status(201).json({
            place: newPlace,
        });
    } catch (err) {
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

    try {
        await place.save().then(() => {
            res.status(200).json({ place: place.toObject({ getters: true }) });
        });
    } catch (err) {
        return next(new HttpError(err, 500));
    }
};

export const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;

    let place;

    try {
        place = await Place.findByIdAndDelete(placeId);
    } catch (err) {
        return next(new HttpError(err), 500);
    }

    if (!place) {
        return next(new HttpError("Could not find to delete this place!", 404));
    }

    res.status(200).json({ msg: "Deleted Place!" });
};
