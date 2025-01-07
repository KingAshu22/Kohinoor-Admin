import mongoose from "mongoose";

const ReturnSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    entries: [
        {
            product: { type: String, required: true },
            vendor: { type: String, required: true },
            weight: { type: Number, required: true },
            packets: { type: Number, required: true },
            piecesPerPacket: { type: Number, required: true },
            gross: { type: Number, required: true },
            pieces: { type: Number, required: true },
            rate: { type: Number, required: true },
        },
    ],
}, { toJSON: { getters: true } });

const Return = mongoose.models.Return || mongoose.model("Return", ReturnSchema);

export default Return;