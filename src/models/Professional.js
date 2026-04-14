import mongoose from "mongoose";

const ProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  experience: {
    type: Number, // years of experience
    default: 0,
  },
  rating: {
    type: Number, // average rating
    default: 0,
  },
  division: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "assigned", "busy"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Professional = mongoose.models.Professional || mongoose.model("Professional", ProfessionalSchema);

export default Professional;