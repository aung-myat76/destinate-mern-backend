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
import upload from "../middlewares/file-upload.js";
import authCheck from "../middlewares/authCheck.js";

const router = express.Router();

router.get("/", getPlaces);

router.get("/users/:userId", getPlacesByUserId);

router.get("/:placeId", getPlace);

router.use(authCheck);

router.post("/add-place", upload.single("image"), postPlace);

router.patch("/:placeId", patchPlace);

router.delete("/:placeId", deletePlace);

export default router;
