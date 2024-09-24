import mongoose from "mongoose";

const PackagingSchema = new mongoose.Schema({
    date: String,
    vendor: String,
    product: String,
    rate: Number,
    remainingWeight: Number,
    isCompleted: Boolean,
    isVerified: Boolean,
    packaging: {
        weight: Number,
        partialWeight: Number,
        gross: Number,
        pieces: Number,
    },
    return: [{
        date: String,
        weight: Number,
        gross: Number,
        pieces: Number,
    }],
    boxing: {
        date: String,
        weight: Number,
        boxCount: Number,
        quantity: String,
    },
}, { toJSON: { getters: true } });

const Packaging = mongoose.models.Packaging || mongoose.model("Packaging", PackagingSchema);

export default Packaging;