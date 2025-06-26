import express from "express";

import { check } from "express-validator";

import { postSignUp, postLogin } from "../controllers/auth.js";

const router = express.Router();

router.post(
    "/sign-up",
    [
        check("name").not().isEmpty(),
        check("email").normalizeEmail().isEmail(),
        check("password").isLength({ min: 6 }),
    ],
    postSignUp
);

router.post("/login", postLogin);

export default router;
