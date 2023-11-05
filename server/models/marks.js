import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },
  t1: {
    type: Number,
    default: -1,
  },
  t2: {
    type: Number,
    default: -1,
  },
  t3: {
    type: Number,
    default: -1,
  },
  t4: {
    type: Number,
    default: -1,
  },
  practicalMarksIPE: {
    type: Number,
    default: 0,
  },
  practicalMarksProject: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("marks", marksSchema);
