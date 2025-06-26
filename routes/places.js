import express from "express";

import {
    deletePlace,
    getPlace,
    getPlaces,
    getPlacesByUserId,
    patchPlace,
    postPlace,
} from "../controllers/places.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/", getPlaces);

router.get("/users/:userId", getPlacesByUserId);

router.get("/:placeId", getPlace);

router.post("/add-place", postPlace);

router.patch("/:placeId", patchPlace);

router.delete("/:placeId", deletePlace);

export default router;
