// marks.js
import mongoose from "mongoose";

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
          ipeMarks: {
            type: Number,
            default: -1,
          },
          practicalMarks: {
            type: Number,
            default: -1,
          },
          practicalTotal: {
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
          practicalGrade: {
            type: String,
            default: "F",
          },
          overallGrade: {
            type: String,
            default: "F",
          },
          theoryGradePoint: {
            type: Number,
            default: 3,
          },
          practicalGradePoint: {
            type: Number,
            default: 3,
          },
          isBacklog: {
            type: Boolean,
            default: true,
          },
          theoryCredit: {
            type: Number,
            default: 0,
          },
          practicalCredit: {
            type: Number,
            default: 0,
          },
          ipeWeightage: {
            type: Number,
            default: 0,
          },
          practicalWeightage: {
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
      backlogs: {
        type: Number,
        default: 0,
      },
    },
  ],
  cpi: {
    type: Number,
    default: 0,
  },
  totalBacklogs: {
    type: Number,
    default: 0,
  },
});

markSchema.pre("save", async function (next) {
  const markDocument = this;
  try {
    // calculate theory total and practical total if all marks are entered
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (
          subject.t1 !== -1 &&
          subject.t2 !== -1 &&
          subject.t3 !== -1 &&
          subject.t4 !== -1
        ) {
          subject.theoryTotal =
            subject.t1 + subject.t2 + subject.t3 + subject.t4;
        } else {
          subject.theoryTotal = -1;
        }
        if (subject.practicalMarks !== -1 && subject.ipeMarks !== -1) {
          subject.practicalTotal =
            (subject.practicalMarks * subject.practicalWeightage) / 100 +
            (subject.ipeMarks * subject.ipeWeightage) / 100;
        } else {
          subject.practicalTotal = -1;
        }
      });
    });

    // Calculate theory grade and grade point
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1) {
          const theoryMarks = subject.theoryTotal;
          if (theoryMarks >= 95) {
            subject.theoryGrade = "O+++";
            subject.theoryGradePoint = 10;
          } else if (theoryMarks >= 90) {
            subject.theoryGrade = "O++";
            subject.theoryGradePoint = 9.5;
          } else if (theoryMarks >= 85) {
            subject.theoryGrade = "O+";
            subject.theoryGradePoint = 9;
          } else if (theoryMarks >= 80) {
            subject.theoryGrade = "O";
            subject.theoryGradePoint = 8.5;
          } else if (theoryMarks >= 75) {
            subject.theoryGrade = "A++";
            subject.theoryGradePoint = 8;
          } else if (theoryMarks >= 70) {
            subject.theoryGrade = "A+";
            subject.theoryGradePoint = 7.5;
          } else if (theoryMarks >= 65) {
            subject.theoryGrade = "A";
            subject.theoryGradePoint = 7;
          } else if (theoryMarks >= 60) {
            subject.theoryGrade = "B++";
            subject.theoryGradePoint = 6.5;
          } else if (theoryMarks >= 55) {
            subject.theoryGrade = "B+";
            subject.theoryGradePoint = 6;
          } else if (theoryMarks >= 50) {
            subject.theoryGrade = "B";
            subject.theoryGradePoint = 5.5;
          } else if (theoryMarks >= 45) {
            subject.theoryGrade = "C";
            subject.theoryGradePoint = 5;
          } else if (theoryMarks >= 40) {
            subject.theoryGrade = "D";
            subject.theoryGradePoint = 4.5;
          } else if (theoryMarks >= 35) {
            subject.theoryGrade = "E";
            subject.theoryGradePoint = 4;
          } else {
            subject.theoryGrade = "F";
            subject.theoryGradePoint = 3;
          }
        }
      });
    });

    // Calculate practical grade and grade point
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.practicalTotal !== -1) {
          const practicalMarks = subject.practicalTotal;
          if (practicalMarks >= 95) {
            subject.practicalGrade = "O+++";
            subject.practicalGradePoint = 10;
          } else if (practicalMarks >= 90) {
            subject.practicalGrade = "O++";
            subject.practicalGradePoint = 9.5;
          } else if (practicalMarks >= 85) {
            subject.practicalGrade = "O+";
            subject.practicalGradePoint = 9;
          } else if (practicalMarks >= 80) {
            subject.practicalGrade = "O";
            subject.practicalGradePoint = 8.5;
          } else if (practicalMarks >= 75) {
            subject.practicalGrade = "A++";
            subject.practicalGradePoint = 8;
          } else if (practicalMarks >= 70) {
            subject.practicalGrade = "A+";
            subject.practicalGradePoint = 7.5;
          } else if (practicalMarks >= 65) {
            subject.practicalGrade = "A";
            subject.practicalGradePoint = 7;
          } else if (practicalMarks >= 60) {
            subject.practicalGrade = "B++";
            subject.practicalGradePoint = 6.5;
          } else if (practicalMarks >= 55) {
            subject.practicalGrade = "B+";
            subject.practicalGradePoint = 6;
          } else if (practicalMarks >= 50) {
            subject.practicalGrade = "B";
            subject.practicalGradePoint = 5.5;
          } else if (practicalMarks >= 45) {
            subject.practicalGrade = "C";
            subject.practicalGradePoint = 5;
          } else if (practicalMarks >= 40) {
            subject.practicalGrade = "D";
            subject.practicalGradePoint = 4.5;
          } else if (practicalMarks >= 35) {
            subject.practicalGrade = "E";
            subject.practicalGradePoint = 4;
          } else {
            subject.practicalGrade = "F";
            subject.practicalGradePoint = 3;
          }
        }
      });
    });

    // calculate overall grade using weighted sum
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          const theoryMarks = subject.theoryTotal;
          const practicalMarks = subject.practicalTotal;
          const totalMarks =
            (theoryMarks * subject.theoryCredit +
              practicalMarks * subject.practicalCredit) /
            (subject.theoryCredit + subject.practicalCredit);
          if (totalMarks >= 95) {
            subject.overallGrade = "O+++";
          } else if (totalMarks >= 90) {
            subject.overallGrade = "O++";
          } else if (totalMarks >= 85) {
            subject.overallGrade = "O+";
          } else if (totalMarks >= 80) {
            subject.overallGrade = "O";
          } else if (totalMarks >= 75) {
            subject.overallGrade = "A++";
          } else if (totalMarks >= 70) {
            subject.overallGrade = "A+";
          } else if (totalMarks >= 65) {
            subject.overallGrade = "A";
          } else if (totalMarks >= 60) {
            subject.overallGrade = "B++";
          } else if (totalMarks >= 55) {
            subject.overallGrade = "B+";
          } else if (totalMarks >= 50) {
            subject.overallGrade = "B";
          } else if (totalMarks >= 45) {
            subject.overallGrade = "C";
          } else if (totalMarks >= 40) {
            subject.overallGrade = "D";
          } else if (totalMarks >= 35) {
            subject.overallGrade = "E";
          } else {
            subject.overallGrade = "F";
          }
        }
      });
    });

    // calculate total subjects credits and backlog
    markDocument.result.forEach((semester) => {
      semester.totalSubjectsCredits = 0;
      semester.backlogs = 0;
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          semester.totalSubjectsCredits +=
            subject.theoryCredit + subject.practicalCredit;
        }
        if (subject.overallGrade === "F") {
          subject.isBacklog = true;
          semester.backlogs++;
        } else {
          subject.isBacklog = false;
        }
      });
    });

    // calculate spi
    markDocument.result.forEach((semester) => {
      semester.totalSubjectsCredits = 0;
      semester.totalGradePoints = 0;
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          semester.totalSubjectsCredits +=
            subject.theoryCredit + subject.practicalCredit;
          semester.totalGradePoints +=
            subject.theoryCredit * subject.theoryGradePoint +
            subject.practicalCredit * subject.practicalGradePoint;
        }
      });
      semester.spi = semester.totalGradePoints / semester.totalSubjectsCredits;
    });


    // calculate total backlogs
    markDocument.totalBacklogs = 0;
    markDocument.result.forEach((semester) => {
      markDocument.totalBacklogs += semester.backlogs;
    });

    // calculate cpi
    let totalCredits = 0;
    let totalGradePoints = 0;
    markDocument.result.forEach((semester) => {
      totalCredits += semester.totalSubjectsCredits;
      totalGradePoints += semester.totalGradePoints;
    });
    markDocument.cpi = totalGradePoints / totalCredits;


    next();
  } catch (e) {
    console.log(e);
  }
});

const Marks = mongoose.model("marks", markSchema);

export default Marks;
