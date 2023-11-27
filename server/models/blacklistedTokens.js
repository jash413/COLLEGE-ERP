import mongoose from "mongoose";
const { Schema } = mongoose;

const blacklistedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // expires in 24 hours (in seconds)
  },
});

const BlacklistedToken = mongoose.model(
  "blacklistedToken",
  blacklistedTokenSchema
);

export default BlacklistedToken;