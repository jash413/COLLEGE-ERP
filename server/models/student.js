import mongoose from "mongoose";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendance from "../models/attendance.js";

const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "subject",
    },
  ],
  marks: {
    type: Schema.Types.ObjectId,
    ref: "marks",
  },
  attendance: {
    type: Schema.Types.ObjectId,
    ref: "attendance",
  },
  gender: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  department: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  batch: {
    type: String,
  },
  section: {
    type: String,
  },
  contactNumber: {
    type: Number,
  },
  fatherContactNumber: {
    type: Number,
  },
  dob: {
    type: String,
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
  }
  
});

studentSchema.pre("save", async function (next) {
  try {
    const student = this;
    const subjects = await Subject.find({ department: student.department });

    let mark = await Marks.findOne({ student: student._id });
    let attendanceRecord = await Attendance.findOne({ student: student._id });

    if (!mark) {
      // Group subjects by semester
      const subjectsBySemester = {};
      subjects.forEach((subject) => {
        if (!subjectsBySemester[subject.semester]) {
          subjectsBySemester[subject.semester] = [];
        }
        subjectsBySemester[subject.semester].push(subject);
      });

      const marks = {
        student: student._id,
        result: [],
      };

      // Create subjectMarks for each semester based on the grouped subjects
      for (let semester = 1; semester <= 8; semester++) {
        const semesterSubjects = subjectsBySemester[semester] || [];

        const subjectMarks = semesterSubjects.map((subject) => ({
          subject: subject._id,
          theoryCredit: subject.theoryCredit,
          practicalCredit: subject.practicalCredit,
          ipeWeightage: subject.ipeWeightage,
          practicalWeightage: subject.practicalWeightage,
          // Include other default properties for subjectMarks if needed
        }));

        marks.result.push({ semester, subjectMarks });
      }

      student.marks = await Marks.create(marks);
      next();
    } else {
      next();
    }
    // attendance pre-save
    if (!attendanceRecord) {
      // Group subjects by semester
      const subjectsBySemester = {};
      subjects.forEach((subject) => {
        if (!subjectsBySemester[subject.semester]) {
          subjectsBySemester[subject.semester] = [];
        }
        subjectsBySemester[subject.semester].push(subject);
      });

      const attendance = {
        student: student._id,
        attendanceRecord: [],
      };

      // Create subjectAttendance for each semester based on the grouped subjects
      for (let semester = 1; semester <= 8; semester++) {
        const semesterSubjects = subjectsBySemester[semester] || [];

        const subjectAttendance = semesterSubjects.map((subject) => ({
          subject: subject._id,
          t1: [],
          t2: [],
          t3: [],
          t4: [],
          totalLectures: subject.totalLectures,
          attendedLectures: 0,
          attendancePercentage: 0,
        }));

        attendance.attendanceRecord.push({ semester, subjectAttendance });
      }

      student.attendance = await Attendance.create(attendance);
      next();
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});


export default mongoose.model("student", studentSchema);
