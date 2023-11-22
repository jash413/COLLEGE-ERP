import mongoose from "mongoose";
const { Schema } = mongoose;

const blacklistedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
});

const BlacklistedToken = mongoose.model(
  "blacklistedToken",
  blacklistedTokenSchema
);

export default BlacklistedToken;