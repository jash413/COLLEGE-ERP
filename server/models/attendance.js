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
              dateWiseAttendance: [
                {
                  date: { type: String },
                  attended: {
                    type: Number,
                  },
                },
              ],
            },
          ],
          t2: [
            {
              dateWiseAttendance: [
                {
                  date: { type: String },
                  attended: {
                    type: Number,
                  },
                },
              ],
            },
          ],
          t3: [
            {
              dateWiseAttendance: [
                {
                  date: { type: String },
                  attended: {
                    type: Number,
                  },
                },
              ],
            },
          ],
          t4: [
            {
              dateWiseAttendance: [
                {
                  date: { type: String },
                  attended: {
                    type: Number,
                  },
                },
              ],
            },
          ],
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

attendenceSchema.pre("save", function (next) {
  this.attendanceRecord.forEach((record) => {
    record.subjectAttendance.forEach((subject) => {
      // Calculate attendedLectures
      ["t1", "t2", "t3", "t4"].forEach((term) => {
        subject[term].forEach((termRecord) => {
          termRecord.dateWiseAttendance.forEach((dateWiseAttendance) => {
            subject.attendedLectures += dateWiseAttendance.attended;
          });
        });
      });

      // Calculate attendancePercentage
      if (subject.totalLectures > 0) {
        subject.attendancePercentage =
          (subject.attendedLectures / subject.totalLectures) * 100;
      } else {
        subject.attendancePercentage = 0;
      }
    });
  });
  next();
});

export default mongoose.model("attendance", attendenceSchema);
