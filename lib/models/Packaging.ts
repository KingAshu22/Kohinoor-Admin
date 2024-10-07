import mongoose from "mongoose";

const PackagingSchema = new mongoose.Schema({
    vendor: String,
    product: String,
    rate: Number,
    totalWeight: Number,
    remainingWeight: Number,
    isCompleted: Boolean,
    packaging: [{
        date: String,
        weight: Number,
        partialWeight: Number,
        gross: Number,
        pieces: Number,
    }],
    return: [{
        date: String,
        weight: Number,
        packets: Number,
        gross: Number,
    }],
    box: [{
        date: String,
        packets: Number,
        gross: Number,
        boxCount: String,
        quantity: Number,
    }],
}, { toJSON: { getters: true } });

const Packaging = mongoose.models.Packaging || mongoose.model("Packaging", PackagingSchema);

export default Packaging;