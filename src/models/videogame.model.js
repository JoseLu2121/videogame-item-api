import mongoose from 'mongoose';

const videogameSchema = new mongoose.Schema({
    igdb_id: { type: Number, unique: true },
    name: { type: String, required: true },
    summary: { type: String },
    storyline: { type: String },
    rating: { type: Number },
    rating_count: { type: Number },
    first_release_date: { type: Date },
    game_type: { type: String },
    cover: { type: String },
    collections: [{ type: String }],
    franchises: [{ type: String }],
    genres: [{ type: String }],
    keywords: [{ type: String }],
    themes: [{ type: String }],
    videos: [{ type: String }],
    languages: [{ type: String }],
}, { timestamps: true });

export const Videogame = mongoose.model('Videogame', videogameSchema);