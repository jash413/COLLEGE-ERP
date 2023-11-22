import mongoose from "mongoose";
const { Schema } = mongoose;
const attendenceSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  attendanceRecord: [
    {
      semester: {
        type: Number,
      },
      subjectAttendance: [
        {
          subject: {
            type: Schema.Types.ObjectId,
            ref: "subject",
            required: true,
          },
          t1: [
            {
              date: [
                {
                  num_Lectures:{
                    type:Number
                  },
                  attended:{
                    type:Number
                  },
                
                }
              ],
              

            }

          ],
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
          totalLectures: {
            type: Number,
            default: 0,
          },
          attendedLectures: {
            type: Number,
            default: 0,
          },
          attendancePercentage: {
            type: Number,
            default: 0,
          },
        },
      ],
      
    },
  ],
});
// calculate attendance percentage
attendenceSchema.methods.calculateAttendancePercentage = function () {
  this.attendanceRecord.forEach((record) => {
    record.subjectAttendance.forEach((subject) => {
      subject.attendancePercentage = Math.round(
        (subject.attendedLectures / subject.totalLectures) * 100
      );
    });
  });
};
// calculate attended lectures
attendenceSchema.methods.calculateAttendedLectures = function () {
  this.attendanceRecord.forEach((record) => {
    record.subjectAttendance.forEach((subject) => {
      subject.attendedLectures =
        subject.t1 + subject.t2 + subject.t3 + subject.t4;
    });
  });
};
export default mongoose.model("attendance", attendenceSchema);
