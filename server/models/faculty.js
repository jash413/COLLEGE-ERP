import mongoose from "mongoose";

const facultySchema = mongoose.Schema({
  name: {
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
  },
  username: {
    type: String,
  },
  gender: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  section : {
    type: String,
    required: true,
  },
  contactNumber: {
    type: Number,
  },
  dob: {
    type: String,
    required: true,
  },
  joiningYear: {
    type: Number,
    required: true,
  },
  passwordUpdated: {
    type: Boolean,
    default: false,
  },
  userType: {
    type: String,
    default: "faculty",
  },
});

export default mongoose.model("faculty", facultySchema);
