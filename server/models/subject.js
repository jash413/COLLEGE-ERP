import mongoose from "mongoose";
const { Schema } = mongoose;
const subjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  totalLectures: {
    type: Number,
    default: 10,
  },
  year: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  theoryCredit:{
    type:Number,
    required:true
  },
  practicalCredit:{
    type:Number,
    required:true
  },
  ipeWeightage:{
    type:Number,
    required:true
  },
  practicalWeightage:{
    type:Number,
    required:true
  },
});

export default mongoose.model("subject", subjectSchema);
