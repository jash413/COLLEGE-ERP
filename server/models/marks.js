import mongoose from "mongoose";


const marksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
    unique: true,
  },
  marks: [
    {
      semester: {
        type: Number,
      },
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
        required: true,
      },
      credits: {
        type: Number,
        default: 0,
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
      practicalMarksIPE: {
        type: Number,
        default: 0,
      },
      practicalMarksProject: {
        type: Number,
        default: 0,
      },
      theoryTotal: {
        type: Number,
        default: 0,
      },
      theoryGrade: {
        type: String,
      },
      gradePoint: {
        type: Number,
        default: 0,
      },
    },
  ],
  totalGradePoints: {
    type: Number,
    default: 0,
  },
  totalSubjectsCredits: {
    type: Number,
    default: 0,
  },
  spi: {
    type: Number,
    default: 0,
  },
});

// Add a method to calculate the theoryTotal, theoryGrade, and gradePoint for each mark object
marksSchema.pre("save", async function (next) {
  for (let i = 0; i < this.marks.length; i++) {
    const mark = this.marks[i];

    // Calculate theoryTotal as the sum of provided test marks
    mark.theoryTotal = [mark.t1, mark.t2, mark.t3, mark.t4].reduce(
      (acc, val) => (val !== -1 ? acc + val : acc),
      0
    );

    // Calculate theoryGrade and gradePoint based on theoryTotal
    if (mark.theoryTotal >= 95) {
      mark.theoryGrade = "O+++";
      mark.gradePoint = 10;
    } else if (mark.theoryTotal >= 90) {
      mark.theoryGrade = "O++";
      mark.gradePoint = 9.5;
    } else if (mark.theoryTotal >= 85) {
      mark.theoryGrade = "O+";
      mark.gradePoint = 9;
    } else if (mark.theoryTotal >= 80) {
      mark.theoryGrade = "O";
      mark.gradePoint = 8.5;
    } else if (mark.theoryTotal >= 75) {
      mark.theoryGrade = "A++";
      mark.gradePoint = 8;
    } else if (mark.theoryTotal >= 70) {
      mark.theoryGrade = "A+";
      mark.gradePoint = 7.5;
    } else if (mark.theoryTotal >= 65) {
      mark.theoryGrade = "A";
      mark.gradePoint = 7;
    } else if (mark.theoryTotal >= 60) {
      mark.theoryGrade = "B++";
      mark.gradePoint = 6.5;
    } else if (mark.theoryTotal >= 55) {
      mark.theoryGrade = "B+";
      mark.gradePoint = 6;
    } else if (mark.theoryTotal >= 50) {
      mark.theoryGrade = "B";
      mark.gradePoint = 5.5;
    } else if (mark.theoryTotal >= 45) {
      mark.theoryGrade = "C";
      mark.gradePoint = 5;
    } else if (mark.theoryTotal >= 40) {
      mark.theoryGrade = "E";
      mark.gradePoint = 4.5;
    } else if (mark.theoryTotal >= 35) {
      mark.theoryGrade = "D";
      mark.gradePoint = 4;
    } else {
      mark.theoryGrade = "F";
      mark.gradePoint = 3;
    }

    // Fetch the subject from the database to get its credits and semester
    // try {
    //   const subject = await Subject.findById(mark.subject);
    //   if (subject) {
    //     mark.credits = subject.credits;
    //     mark.semester = subject.semester;
    //   } else {
    //     console.log(`Subject not found for mark with ID ${mark._id}`);
    //   }
    // } catch (error) {
    //   console.error(`Error fetching subject for mark with ID ${mark._id}: ${error.message}`);
    // }
  }

  // Calculate totalSubjectsCredits as the sum of credits of all subjects
  this.totalSubjectsCredits = this.marks.reduce(
    (acc, mark) => acc + mark.credits,
    0
  );

  // Calculate totalGradePoints as the sum of gradePoints of all marks
  this.totalGradePoints = this.marks.reduce(
    (acc, mark) => acc + mark.gradePoint,
    0
  );

  // Calculate cgpa as the totalGradePoints divided by totalSubjectsCredits
  if (this.totalSubjectsCredits === 0) {
    this.spi = 0; // Handle potential division by zero
  } else {
    this.spi = this.totalGradePoints / this.totalSubjectsCredits;
  }

  next();
});

const Marks = mongoose.model("marks", marksSchema);

export default Marks;
