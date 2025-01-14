import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shopkeeper: {
      type: Schema.Types.ObjectId,
      ref: "shopkeeper",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    old_price: {
      type: Number,
      required: true,
    },
    new_price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Boolean,
    },
    bestseller: {
      type: Boolean,
    },
    wigths: {
      type: Array,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    ratings: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
          //required: true,
        },
        rating: { type: Number },
        comment: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ]
  },
  { timestamps: true }
);

export const productModel = mongoose.models.product || mongoose.model('product', productSchema)
