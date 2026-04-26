import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
	game: { type: String, required: true },
	external_id: { type: String },
	name: { type: String, required: true },
	title: { type: String },
	image_url: { type: String },
	tags: [{ type: String }],
});

export const Character = mongoose.model("Character", characterSchema);
