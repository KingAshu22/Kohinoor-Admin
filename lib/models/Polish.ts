import mongoose from "mongoose";

const PolishSchema = new mongoose.Schema({
    product: String,
    totalWeight: Number,
    partialWeight: Number,
    vendor: String,
    gross: Number,
    pieces: Number,
    date: String
}, { toJSON: { getters: true } });

const Polish = mongoose.models.Polish || mongoose.model("Polish", PolishSchema);

export default Polish;