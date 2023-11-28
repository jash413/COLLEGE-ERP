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
              datewiseAttendance: [
                {
                  date: { type: String, required, unique: true },
                  Lectures: [
                    {
                      faculty :{
                        type: Schema.Types.ObjectId,
                        ref: "faculty",
                        required: true,
                      },
                      lectureNo: { type: Number, required },
                      attended: {
                        type: Boolean,
                        default:true,
                        required,
                      },
                    },
                  ],
                },
              ],
            },
          ],
          t2: [
            {
              datewiseAttendance: [
                {
                  date: { type: String, required, unique: true },
                  Lectures: [
                    {
                      lectureNo: { type: Number, required },
                      attended: {
                        type: Boolean,
                        required,
                      },
                    },
                  ],
                },
              ],
            },
          ],
          t3: [
            {
              datewiseAttendance: [
                {
                  date: { type: String, required, unique: true },
                  Lectures: [
                    {
                      lectureNo: { type: Number, required },
                      attended: {
                        type: Boolean,
                        required,
                      },
                    },
                  ],
                },
              ],
            },
          ],
          t4:[
            {
              datewiseAttendance: [
                {
                  date: { type: String, required, unique: true },
                  Lectures: [
                    {
                      lectureNo: { type: Number, required },
                      attended: {
                        type: Boolean,
                        required,
                      },
                    },
                  ],
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
      // Reset attendedLectures
      subject.attendedLectures = 0;

      // Calculate attendedLectures
      subject.datewiseAttendance.forEach((datewiseAttendance) => {
        datewiseAttendance.Lectures.forEach((lecture) => {
          if (lecture.attended) {
            subject.attendedLectures += 1;
          }
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
