import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    location: {
        type: Number,
        required: true,
    },
    // location: [
    //     {
    //         type: Number,
    //         required: true,
    //     },
    //     {
    //         type: Number,
    //         required: true,
    //     },
    // ],
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

export default mongoose.model("Place", placeSchema);
