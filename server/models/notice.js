import mongoose from "mongoose";

const noticeSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  to: {
    type: String,
    require: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model("notice", noticeSchema);
