import mongoose from "mongoose";

const leaveSchema = mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Faculty",
    },
    leaveFrom: {
        type: String,
        required: true,
    },
    leaveTo: {
        type: String,
        required: true,
    },
    leaveReason: {
        type: String,
        required: true,
    },
    approvalStatus: {
        type: String,
        default: "pending",
    },
    appliedOn: {
        type: Date,
        default: Date.now,
    },
    });

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;