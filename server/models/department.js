import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  departmentCode: {
    type: String,
    required: true,
    unique: true,
  },
  hod:{
    type: String,
    required: true
  },
});

export default mongoose.model("department", departmentSchema);
