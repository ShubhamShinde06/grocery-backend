import { v2 as cloudinary } from "cloudinary";
import { productModel } from "../models/product.model.js";
import { shopkeeperModel } from "../models/shopkeeper.model.js"
import mongoose from "mongoose";

// product add only shopkeeper
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      old_price,
      new_price,
      category,
      stock,
      bestseller,
      wigths,
      shopkeeperId
    } = req.body;

    const shop = await shopkeeperModel.findOne(shopkeeperId);
    if (!shop) {
      return res.status(404).json("Shopkeeper not found!");
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      shopkeeper : shop._id,
      name,
      description,
      old_price,
      new_price,
      category,
      stock: stock === "true" ? true : false,
      bestseller: bestseller === "true" ? true : false,
      wigths: JSON.parse(wigths),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in addProduct",
    });
  }
};

//all product
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).populate('shopkeeper', 'name')
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in listProducts",
    });
  }
};

//delete product
export const removeProduct = async (req, res) => {
  try {
    const product_Id = req.params.id;

    await productModel.findOneAndDelete(product_Id);
    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in removeProducts",
    });
  }
};

//single product
export const singleProduct = async (req, res) => {
  try {
    const product_Id = req.params.id;

    const product = await productModel.findById(product_Id);
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in singleproduct",
    });
  }
};

//update product
export const updateProduct = async (req, res) => {
  try {
    const product_Id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(product_Id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      product_Id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({
      success: true,
      message: "updated",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
