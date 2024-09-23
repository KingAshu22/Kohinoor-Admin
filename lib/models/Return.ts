import mongoose from "mongoose";

const ReturnSchema = new mongoose.Schema({
    date: String,
    products: [{
        product: String,
        weight: Number,
        remainingWeight: Number,
        vendor: String,
        rate: Number,
        gross: Number,
        pieces: Number,
        isCompleted: Boolean,
        isVerified: Boolean
    }]
}, { toJSON: { getters: true } });

const Return = mongoose.models.Return || mongoose.model("Return", ReturnSchema);

export default Return;