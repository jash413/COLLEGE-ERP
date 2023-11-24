// marks.test.js
import mongoose from "mongoose";
import Marks from "../models/marks.js";


const mockStudentData = {
  student: "655b85c25c415d4d303dec23",
  result: [
    {
      semester: 1,
      subjectMarks: [
        {
          subject: "655f9afbf0052c03a6bb46d7",
          t1: 20,
          t2: 15,
          t3: 15,
          t4: 20,
          ipeMarks: 95,
          practicalMarks: 92,
          practicalWeightage: 60,
          ipeWeightage: 25,
          theoryCredit: 3,
          practicalCredit: 2,
          totalSubjectsCredits: 5,
        },
      ],
    },
  ],
};

describe("Mark Calculation Middleware", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb+srv://jashmistry4444:SVjlOloq4CX6aNVE@cluster0.fran9pm.mongodb.net/college_erp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("Calculates theory and practical totals correctly", async () => {
    const mockMarkDocument = new Marks(mockStudentData);
    await mockMarkDocument.save();

    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const subjectMarks = savedDocument.result[0].subjectMarks[0];
    expect(subjectMarks.theoryTotal).toBe(70); // Replace with your expected value
    expect(subjectMarks.practicalTotal).toBe(78.95); // Replace with your expected value
  });

  test("Calculates theory grades and grade points correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const subjectMarks = savedDocument.result[0].subjectMarks[0];
    expect(subjectMarks.theoryGrade).toBe("A+"); // Replace with your expected value
    expect(subjectMarks.theoryGradePoint).toBe(7.5); // Replace with your expected value
  });

  test("Calculates practical grades and grade points correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const subjectMarks = savedDocument.result[0].subjectMarks[0];
    expect(subjectMarks.practicalGrade).toBe("A++"); // Replace with your expected value
    expect(subjectMarks.practicalGradePoint).toBe(8); // Replace with your expected value
  });

  test("Calculates overall grades correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const subjectMarks = savedDocument.result[0].subjectMarks[0];
    expect(subjectMarks.overallGrade).toBe("P"); // Replace with your expected value
  });

  test("Calculates SPI (Semester Performance Index) correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const semester = savedDocument.result[0];
    expect(semester.spi).toBe(7.7);
  });

  test("Calculates backlogs correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const semester = savedDocument.result[0];
    expect(semester.backlogs).toBe(0); // Replace with your expected value
  });

  test("Calculates total backlogs correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const totalBacklogs = savedDocument.totalBacklogs;
    expect(totalBacklogs).toBe(0); // Replace with your expected value
  });

  test("Calculates CPI (Cumulative Performance Index) correctly", async () => {
    const savedDocument = await Marks.findOne({
      student: mockStudentData.student,
    });

    const cpi = savedDocument.cpi;
    expect(cpi).toBe(7.7);
  });

  // Add more specific tests as per your schema and calculations
});
