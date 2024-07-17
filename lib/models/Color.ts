import mongoose from "mongoose";

const ColorSchema = new mongoose.Schema({
    product: String,
    totalWeight: Number,
    partialWeight: Number,
    gross: Number,
    pieces: Number,
    date: String
}, { toJSON: { getters: true } });

const Color = mongoose.models.Color || mongoose.model("Color", ColorSchema);

export default Color;