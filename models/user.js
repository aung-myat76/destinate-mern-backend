import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    places: [
        {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Place",
        },
    ],
});

export default mongoose.model("User", userSchema);
