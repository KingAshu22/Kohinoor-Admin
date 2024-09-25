import mongoose from "mongoose";

const PackagingSchema = new mongoose.Schema({
    date: String,
    vendor: String,
    product: String,
    rate: Number,
    remainingWeight: Number,
    isCompleted: Boolean,
    packaging: {
        weight: Number,
        partialWeight: Number,
        gross: Number,
        pieces: Number,
    },
    return: [{
        date: String,
        weight: Number,
        packets: Number,
        gross: Number,
        isVerified: Boolean,
    }],
}, { toJSON: { getters: true } });

const Packaging = mongoose.models.Packaging || mongoose.model("Packaging", PackagingSchema);

export default Packaging;