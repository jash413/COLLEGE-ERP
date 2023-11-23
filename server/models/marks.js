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
          gradePoint: {
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
  try{

    // calculate theory total and practical total if all marks are entered 
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.t1 !== -1 && subject.t2 !== -1 && subject.t3 !== -1 && subject.t4 !== -1) {
          subject.theoryTotal = subject.t1 + subject.t2 + subject.t3 + subject.t4;
        }else{
          subject.theoryTotal = -1;
        }
        if (subject.practicalMarks !== -1 && subject.ipeMarks !== -1) {
          subject.practicalTotal = subject.practicalMarks * subject.practicalWeightage / 100 + subject.ipeMarks * subject.ipeWeightage / 100;
        }else{
          subject.practicalTotal = -1;
        }
      });
    });

    // calculate theory grade and practical grade
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1) {
          if (subject.theoryTotal >= 90) {
            subject.theoryGrade = "O";
          } else if (subject.theoryTotal >= 80) {
            subject.theoryGrade = "A+";
          } else if (subject.theoryTotal >= 70) {
            subject.theoryGrade = "A";
          } else if (subject.theoryTotal >= 60) {
            subject.theoryGrade = "B+";
          } else if (subject.theoryTotal >= 50) {
            subject.theoryGrade = "B";
          } else if (subject.theoryTotal >= 40) {
            subject.theoryGrade = "C";
          } else {
            subject.theoryGrade = "F";
          }
        }
        if (subject.practicalTotal !== -1) {
          if (subject.practicalTotal >= 90) {
            subject.practicalGrade = "O";
          } else if (subject.practicalTotal >= 80) {
            subject.practicalGrade = "A+";
          } else if (subject.practicalTotal >= 70) {
            subject.practicalGrade = "A";
          } else if (subject.practicalTotal >= 60) {
            subject.practicalGrade = "B+";
          } else if (subject.practicalTotal >= 50) {
            subject.practicalGrade = "B";
          } else if (subject.practicalTotal >= 40) {
            subject.practicalGrade = "C";
          } else {
            subject.practicalGrade = "F";
          }
        }
      });
    });

    // calculate overall grade
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          if (subject.theoryTotal >= 35 && subject.practicalTotal >= 35) {
            subject.overallGrade = "P";
          } else {
            subject.overallGrade = "F";
          }
        }
      });
    });

    // calculate grade point
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          if (subject.theoryTotal >= 90) {
            subject.gradePoint = 10;
          } else if (subject.theoryTotal >= 80) {
            subject.gradePoint = 9;
          } else if (subject.theoryTotal >= 70) {
            subject.gradePoint = 8;
          } else if (subject.theoryTotal >= 60) {
            subject.gradePoint = 7;
          } else if (subject.theoryTotal >= 50) {
            subject.gradePoint = 6;
          } else if (subject.theoryTotal >= 40) {
            subject.gradePoint = 5;
          } else {
            subject.gradePoint = 4;
          }
        }
      });
    });

    // calculate total subjects credits
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          subject.theoryCredit = subject.subject.theoryCredits;
          subject.practicalCredit = subject.subject.practicalCredits + subject.subject.ipeCredits;
          subject.isBacklog = false;
        }else{
          subject.isBacklog = true;
        }
      });
    });

    // calculate spi
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.theoryTotal !== -1 && subject.practicalTotal !== -1) {
          semester.totalSubjectsCredits += subject.theoryCredit + subject.practicalCredit;
          semester.totalGradePoints += subject.gradePoint * (subject.theoryCredit + subject.practicalCredit);
        }
      });
      semester.spi = semester.totalGradePoints / semester.totalSubjectsCredits;
    });

    // calculate backlogs
    markDocument.result.forEach((semester) => {
      semester.subjectMarks.forEach((subject) => {
        if (subject.isBacklog) {
          semester.backlogs++;
        }
      });
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

  }catch(e){
    console.log(e);
  }
}
);


const Marks = mongoose.model("marks", markSchema);

export default Marks;
