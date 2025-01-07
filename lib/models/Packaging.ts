import mongoose from "mongoose";

const PackagingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    entries: [
        {
            product: { type: String, required: true },
            vendor: { type: String, required: true },
            totalWeight: { type: Number, required: true },
            partialWeight: { type: Number, required: true },
            gross: { type: Number, required: true },
            pieces: { type: Number, required: true },
            rate: { type: Number, required: true },
        },
    ],
}, { toJSON: { getters: true } });

const Packaging = mongoose.models.Packaging || mongoose.model("Packaging", PackagingSchema);

export default Packaging;