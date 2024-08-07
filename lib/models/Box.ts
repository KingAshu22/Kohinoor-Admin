import mongoose from "mongoose";

const BoxSchema = new mongoose.Schema({
    date: String,
    products: [{
        product: String,
        boxCount: Number,
        quantity: String,
    }]
}, { toJSON: { getters: true } });

const Box = mongoose.models.Box || mongoose.model("Box", BoxSchema);

export default Box;