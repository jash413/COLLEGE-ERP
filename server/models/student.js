import mongoose from "mongoose";
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "subject",
    },
  ],
  marks:{
    type: Schema.Types.ObjectId,
    ref: "marks",
  },
  gender: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  batch: {
    type: String,
  },
  section: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  fatherContactNumber: {
    type: Number,
  },
  dob: {
    type: String,
    required: true,
  },
});

export default mongoose.model("student", studentSchema);
