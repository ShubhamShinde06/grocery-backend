import mongoose from "mongoose";

const shopkeeperSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		shopName: {
			type: String,
			required: true,
		},
		address: {
			street: String, 
			city: String,
			state: String,
			zip: String,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const shopkeeperModel = mongoose.models.shopkeeper || mongoose.model("shopkeeper", shopkeeperSchema);
