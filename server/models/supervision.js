import mongoose from "mongoose";
const { Schema } = mongoose;

const supervisionSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "course",
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: "faculty",
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    date: {
        type: Date,
    },
    phase: {
        type: String,
    },
    room: {
        type: String,
    },
    instruction : {
        type: String,
    },
    status: {
        type: String,
    },
});

const Supervision = mongoose.model("supervision", supervisionSchema);
export default Supervision;
