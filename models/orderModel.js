import mongoose from "mongoose";
import productModel from "./productModel.js";

const orderSchema = new mongoose.Schema({
    products:[
        {
            type: mongoose.ObjectId,
            ref: 'Products',
        },
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: 'users',
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"],
    },
}, {timestamps:true});

export default mongoose.model('Order', orderSchema);