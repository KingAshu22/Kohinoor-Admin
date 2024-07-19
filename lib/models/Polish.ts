import mongoose from "mongoose";

const PolishSchema = new mongoose.Schema({
    date: String,
    products: [{
        product: String,
        totalWeight: Number,
        partialWeight: Number,
        vendor: String,
        rate: Number,
        gross: Number,
        pieces: Number,
    }]
}, { toJSON: { getters: true } });

const Polish = mongoose.models.Polish || mongoose.model("Polish", PolishSchema);

export default Polish;