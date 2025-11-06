import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const ReviewSchema = new Schema({
   content : {
    type: String,
    required: true,
   },
   author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },
   projet: {
    type: Schema.Types.ObjectId,
    ref: "Projet",
    required: true,
   },
}, { timestamps: true });


const Review = model("Review", ReviewSchema);
export default Review;