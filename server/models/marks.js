// marks.js
import mongoose from "mongoose";
import Subject from "../models/subject.js";

const { Schema } = mongoose;

const markSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  result: [
    {
      semester: {
        type: Number,
      },
      subjectMarks: [
        {
          subject: {
            type: Schema.Types.ObjectId,
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
          theoryTotal: {
            type: Number,
            default: -1,
          },
          theoryGrade: {
            type: String,
            default: "F",
          },
          gradePoint: {
            type: Number,
            default: 3,
          },
          isBacklog: {
            type: Boolean,
            default: true,
          },
          credits: {
            type: Number,
            default: 0,
          },
        },
      ],
      totalSubjectsCredits: {
        type: Number,
        default: 0,
      },
      totalGradePoints: {
        type: Number,
        default: 0,
      },
      spi: {
        type: Number,
        default: 0,
      },
    },
  ],
  cpi: {
    type: Number,
    default: 0,
  },
});

// markSchema.pre("save", async function (next) {

//   try {

//     for (const result of this.result) {

//       // Calculate theory total
//       for (const subjectMark of result.subjectMarks) {
//         const { t1, t2, t3, t4 } = subjectMark;
//         const allGradesPresent = [t1, t2, t3, t4].every((grade) => grade !== -1);

//         if (allGradesPresent) {
//           subjectMark.theoryTotal = t1 + t2 + t3 + t4;
//         }
//         else {
//           subjectMark.theoryTotal = 0;
//         }
//       }

//       // Calculate theory grade and grade point
//       const grades = [
//         { min: 95, grade: "O+++", points: 10 },
//         { min: 90, grade: "O++", points: 9.5 },
//         { min: 85, grade: "O+", points: 9 },
//         { min: 80, grade: "O", points: 8.5 },
//         { min: 75, grade: "A++", points: 8 },
//         { min: 70, grade: "A+", points: 7.5 },
//         { min: 65, grade: "A", points: 7 },
//         { min: 60, grade: "B++", points: 6.5 },
//         { min: 55, grade: "B+", points: 6 },
//         { min: 50, grade: "B", points: 5.5 },
//         { min: 45, grade: "C", points: 5 },
//         { min: 40, grade: "E", points: 4.5 },
//         { min: 35, grade: "D", points: 4 },
//         { min: 0, grade: "F", points: 3 },
//       ];

//       // Calculate theory grade and grade point
//       for (const subjectMark of result.subjectMarks) {
//         const grade = grades.find(
//           (grade) => grade.min <= subjectMark.theoryTotal
//         );
//         subjectMark.theoryGrade = grade.grade;
//         subjectMark.gradePoint = grade.points;
//       }

//       // Calculate total subjects credits
//       const subjectIds = result.subjectMarks.map(
//         (subjectMark) => subjectMark.subject
//       );
//       const subjects = await Subject.find({ _id: { $in: subjectIds } });

//       for (const subjectMark of result.subjectMarks) {
//         const subject = subjects.find(
//           (subject) => subject._id.toString() === subjectMark.subject
//         );
//         subjectMark.credits = subject.credits;
//       }

//       result.totalSubjectsCredits = result.subjectMarks.reduce(
//         (acc, mark) => acc + mark.credits,
//         0
//       );

//       // Calculate total grade points
//       result.totalGradePoints = result.subjectMarks.reduce(
//         (acc, mark) => acc + mark.gradePoint * mark.credits,
//         0
//       );

//       // Calculate spi
//       result.spi = result.totalGradePoints / result.totalSubjectsCredits;
//     }

//     // Calculate cpi
//     this.cpi =
//       this.result.reduce((acc, mark) => acc + mark.spi, 0) / this.result.length;

//     next();
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// }
// );

const Marks = mongoose.model("marks", markSchema);

export default Marks;
