import mongoose from "mongoose";

const OfficeSchema = new mongoose.Schema({
    date: String,
    products: [{
        product: String,
        vendor: String,
        sheetType: String,
        sheetCount: Number,
        rate: Number,
    }]
}, { toJSON: { getters: true } });

const Office = mongoose.models.Office || mongoose.model("Office", OfficeSchema);

export default Office;