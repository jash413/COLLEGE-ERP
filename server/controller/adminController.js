import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import Marks from "../models/marks.js";
import blacklistedTokens from "../models/blacklistedTokens.js";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import Attendance from "../models/attendance.js";
import XLSX from "xlsx";
import mongoose from "mongoose";
import fs from "fs";
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode";
import Leave from "../models/leave.js";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // Longer initial delay in milliseconds

export const addStudentsFromExcel = async (req, res) => {
  let excelFile;
  let session;
  const socketId = req.query.socketId;
  const io = req.app.get("socketio");
  let progress = 0;

  try {
    excelFile = req.file;
    if (!excelFile) {
      throw new Error("Please upload an Excel file");
    }

    for (let retries = 0; retries < MAX_RETRIES; retries++) {
      session = await mongoose.startSession();
      try {
        session.startTransaction();

        const workbook = XLSX.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const totalStudents = jsonData.length;
        let processedStudentsNumber = 0;

        const processedStudents = [];

        for (const data of jsonData) {
          try {
            const newStudent = await processStudentData(data, session);
            processedStudents.push(newStudent);
            processedStudentsNumber++;
            progress = Math.round(
              (processedStudentsNumber / totalStudents) * 100
            );
            io.to(socketId).emit("progress", progress);
          } catch (error) {
            console.error("Error processing student data:", error);
          }
        }

        await session.commitTransaction(); // Commit changes
        session.endSession();
        // fs.unlinkSync(excelFile.path);

        return res.status(200).json({
          success: true,
          message: "Students uploaded successfully",
          addedStudents: processedStudents,
        });
      } catch (error) {
        console.error("Transaction failed, retrying...", error);
        await handleTransactionError(session, excelFile, error);
        await waitWithExponentialBackoff(retries);
      }
    }

    console.error("Transaction failed after retries.");
    await handleTransactionError(session, excelFile, new Error("Transaction failed after retries."));
    return res.status(500).json({ backendError: "Transaction failed after retries." });
  } catch (error) {
    await handleTransactionError(session, excelFile, error);
    return res.status(500).json({ backendError: error.message });
  }
};

const processStudentData = async (data, session) => {
  const {
    name,
    dob,
    department,
    contactNumber,
    email,
    enrollmentNumber,
    gender,
    batch,
    section,
    year,
    fatherName,
    motherName,
    fatherContactNumber,
    motherContactNumber,
    mentor,
  } = data;
  
  const existingStudent = await Student.findOne({ email }).session(session);
  if (existingStudent) {
    return {
      email,
      status: "Email already exists - Skipped",
    };
  }

  const newMentor = await Faculty.findOne({ shortName: mentor }).session(session);
  if (!newMentor) {
    return {
      email,
      status: "Mentor not found - Skipped",
    };
  }

  // Create a new student and save to the database
  const newStudent = new Student({
    name,
    dob,
    department,
    contactNumber,
    email,
    enrollmentNumber,
    gender,
    batch,
    section,
    year,
    fatherName,
    motherName,
    fatherContactNumber,
    motherContactNumber,
    mentor: newMentor._id,
  });
  const subjectIds = await Subject.find({ department, year }, "_id").session(
    session
  );
  newStudent.subjects = subjectIds.map((subject) => subject._id);
  await newStudent.save({ session });

  return { email, status: "Successfully added" };
};

const handleTransactionError = async (session, excelFile, error) => {
  console.log("Backend Error", error);
  if (session && session.inTransaction()) {
    try {
      await session.abortTransaction(); // Rollback changes
    } catch (abortError) {
      console.error("Abort transaction error:", abortError);
    }
  }
  if (session) {
    session.endSession();
  }
  if (excelFile) {
    // fs.unlinkSync(excelFile.path);
  }
};

const waitWithExponentialBackoff = async (retries) => {
  const delay = BASE_DELAY_MS * Math.pow(2, retries);
  await new Promise((resolve) => setTimeout(resolve, delay));
};



// Controller function to get all leave requests
export const getAllLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await Leave.find();
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get a specific leave request by ID
export const getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveRequest = await Leave.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(leaveRequest);
  } catch (error) {
    console.error("Error fetching leave request by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to update a leave request by ID
export const updateLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveFrom, leaveTo, leaveReason, approvalStatus } = req.body;

    const leaveRequest = await Leave.findById(id);

    if (!leaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    
    if(leaveFrom) leaveRequest.leaveFrom = leaveFrom;
    if(leaveTo) leaveRequest.leaveTo = leaveTo;
    if(leaveReason) leaveRequest.leaveReason = leaveReason;
    if(approvalStatus) leaveRequest.approvalStatus = approvalStatus;

    const updatedLeaveRequest = await leaveRequest.save();
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    console.error("Error updating leave request by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get filtered leave requests
export const getFilteredLeaveRequests = async (req, res) => {
  try {
    const filters = { ...req.query };
    const leaveRequests = await Leave.find(filters);
    res.status(200).json(leaveRequests);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Controller function to delete a leave request by ID
export const deleteLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLeaveRequest = await Leave.findByIdAndDelete(id);

    if (!deletedLeaveRequest) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave request by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadStudentExcelTemplate = async (req, res) => {
  try {
    // create a new workbook and worksheet with dummy data
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: "John Doe",
        dob: "01-01-2000",
        department: "IT",
        contactNumber: "8320052869",
        email: "xyz@gmail.com",
        enrollmentNumber: "21002170610013",
        gender: "male",
        batch: "2021-2025",
        section: "A1",
        year: "FY",
        fatherName: "John Doe",
        motherName: "Jane Doe",
        fatherContactNumber: "0123456789",
        motherContactNumber: "0123456789",
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const filePath = "../server/assets/Student_Excel_Template.xlsx";

    XLSX.writeFile(
      workbook,
      filePath,
      { bookType: "xlsx", type: "buffer" },
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          reject(err);
        } else {
          resolve();
        }
      }
    );

    // Download the file
    await res.download(filePath, "Student_Excel_Template.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadStudentExcel = async (req, res) => {
  try {
    const students = await Student.find();
    const studentData = await Promise.all(
      students.map(async (student) => {
        const {
          name,
          dob,
          department,
          contactNumber,
          email,
          enrollmentNumber,
          gender,
          batch,
          section,
          year,
          fatherName,
          motherName,
          fatherContactNumber,
          motherContactNumber,
          mentor,
        } = student;

        const faculty = await Faculty.findOne({ _id: mentor });

        return {
          name,
          dob,
          department,
          contactNumber,
          email,
          enrollmentNumber,
          gender,
          batch,
          section,
          year,
          fatherName,
          motherName,
          fatherContactNumber,
          motherContactNumber,
          mentor: faculty ? faculty.shortName : "", // Check if faculty exists before accessing name
        };
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(studentData);
    // Format all columns with numeric values as text
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cellRef] && !isNaN(worksheet[cellRef].v)) {
          worksheet[cellRef].t = "s"; // Set the cell type as string (text)
        }
      }
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const filePath = "../server/assets/Student_Excel.xlsx";

    XLSX.writeFile(
      workbook,
      filePath,
      { bookType: "xlsx", type: "buffer" },
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
          res.status(500).json({ error: "Error writing file" });
        }
      }
    );

    await res.download(filePath, "Student_Excel.xlsx", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file" });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const createWhatsAppGroup = async (req, res) => {
  try {
    const { groupName, participants } = req.body;
    const client = new Client();

    client.on("qr", async (qr) => {
      try {
        const qrImage = await qrcode.toDataURL(qr, {
          errorCorrectionLevel: "H",
        });
        const imageBuffer = Buffer.from(
          qrImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, ""),
          "base64"
        );
        fs.writeFileSync("qr_code.png", imageBuffer);

        const io = req.app.get("socketio");
        const imageData = fs.readFileSync("qr_code.png", {
          encoding: "base64",
        });
        io.emit("whatsappQR", imageData);
        console.log("QR RECEIVED");
      } catch (qrError) {
        console.error("Error generating QR code:", qrError);
      }
    });

    client.on("ready", async () => {
      try {
        console.log("Client is ready!");
        await client.createGroup(groupName, participants);
        res.status(200).send("Group created successfully!");
      } catch (groupError) {
        console.error("Error creating group:", groupError);
        res.status(500).send("Error creating group");
      }
    });

    client.on("auth_failure", (err) => {
      console.error("Authentication failed:", err);
      res.status(401).send("Authentication failed");
    });

    client.initialize();
  } catch (error) {
    console.error("General error:", error);
    res.status(500).send("Internal server error");
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      errors.usernameError = "Admin doesn't exist.";
      return res.status(404).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingAdmin.email,
        id: existingAdmin._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingAdmin, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const admin = await Admin.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    if (admin.passwordUpdated === false) {
      admin.passwordUpdated = true;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: admin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email } = req.body;
    const updatedAdmin = await Admin.findOne({ email });
    if (name) {
      updatedAdmin.name = name;
      await updatedAdmin.save();
    }
    if (dob) {
      updatedAdmin.dob = dob;
      await updatedAdmin.save();
    }
    if (department) {
      updatedAdmin.department = department;
      await updatedAdmin.save();
    }
    if (contactNumber) {
      updatedAdmin.contactNumber = contactNumber;
      await updatedAdmin.save();
    }
    if (avatar) {
      updatedAdmin.avatar = avatar;
      await updatedAdmin.save();
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, joiningYear } =
      req.body;
    const errors = { emailError: String };
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment.departmentCode;
    const admins = await Admin.find({ department });

    let helper;
    if (admins.length < 10) {
      helper = "00" + admins.length.toString();
    } else if (admins.length < 100 && admins.length > 9) {
      helper = "0" + admins.length.toString();
    } else {
      helper = admins.length.toString();
    }
    var date = new Date();
    var components = ["ADM", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      passwordUpdated,
    });
    await newAdmin.save();
    return res.status(200).json({
      success: true,
      message: "Admin registerd successfully",
      response: newAdmin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, content, date, to, faculty } = req.body;

    const errors = { noticeError: String };
    const exisitingNotice = await Notice.findOne({ content, date });
    if (exisitingNotice) {
      errors.noticeError = "Notice already created";
      return res.status(400).json(errors);
    }
    const newNotice = await new Notice({
      title,
      content,
      date,
      to,
      faculty,
    });
    await newNotice.save();
    return res.status(200).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addDepartment = async (req, res) => {
  try {
    const errors = { departmentError: String };
    const { department, hod } = req.body;
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      errors.departmentError = "Department already added";
      return res.status(400).json(errors);
    }
    const departments = await Department.find({});
    let add = departments.length + 1;
    let departmentCode;
    if (add < 9) {
      departmentCode = "0" + add.toString();
    } else {
      departmentCode = add.toString();
    }

    const newDepartment = await new Department({
      department,
      departmentCode,
      hod,
    });

    await newDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department added successfully",
      response: newDepartment,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addFaculty = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      email,
      joiningYear,
      joiningDate,
      gender,
      designation,
      sections,
      userType,
    } = req.body;
    const errors = { emailError: String };
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment.departmentCode;

    const faculties = await Faculty.find({ department });
    let helper;
    if (faculties.length < 10) {
      helper = "00" + faculties.length.toString();
    } else if (faculties.length < 100 && faculties.length > 9) {
      helper = "0" + faculties.length.toString();
    } else {
      helper = faculties.length.toString();
    }
    var date = new Date();
    var components = ["FAC", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    console.log(newDob);
    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;

    // uppercase all letters in all fields before saving
    const newName = name.toUpperCase();
    const newDepartment = department.toUpperCase();
    const newEmail = email.toUpperCase();
    const newDesignation = designation.toUpperCase();
    const newGender = gender.toUpperCase();

    // Uppercase sections array
    const newSections = sections.map((section) => section.toUpperCase());

    const newFaculty = await new Faculty({
      name: newName,
      email: newEmail,
      password: hashedPassword,
      joiningYear,
      joiningDate,
      username,
      department: newDepartment,
      contactNumber,
      dob,
      gender: newGender,
      designation: newDesignation,
      passwordUpdated,
      sections: newSections,
      userType,
    });

    // Send email to faculty with username and password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: newFaculty.email,
      subject: "WELCOME TO LJ UNIVERSITY ERP PORTAL",
      html: `
        <p>Welcome <span style="font-weight: bold">${newFaculty.name}</span> to LJ University ERP Portal!</p>
        <p>Your username is: <span style="font-weight: bold">${newFaculty.username}</span></p>
        <p>Your temporary password is: <span style="font-weight: bold">${newDob}</span></p>
        <p>Please change your password after logging in.</p>
        <p>Click <a href="http://localhost:3000/">here</a> to login.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
    });

    await newFaculty.save();
    return res.status(200).json({
      success: true,
      message: "Faculty registerd successfully",
      response: newFaculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateMarks = async (req, res) => {
  try {
    const { updates } = req.body;

    if (Array.isArray(updates)) {
      const updateResults = await Promise.all(
        updates.map(async (update) => {
          const { studentId, semester, updatedMarks } = update;
          const marks = await Marks.findOne({ student: studentId });

          if (!marks) {
            return { studentId, error: "Marks not found for the student." };
          }

          const semesterIndex = marks.result.findIndex(
            (semesterObj) => semesterObj.semester === semester
          );

          if (semesterIndex !== -1) {
            const semesterObj = marks.result[semesterIndex];

            updatedMarks.forEach((updatedSubjectMarks) => {
              const existingSubjectIndex = semesterObj.subjectMarks.findIndex(
                (subjectMark) =>
                  subjectMark.subject.toString() === updatedSubjectMarks.subject
              );

              if (existingSubjectIndex !== -1) {
                semesterObj.subjectMarks[existingSubjectIndex] = {
                  ...semesterObj.subjectMarks[existingSubjectIndex],
                  ...updatedSubjectMarks,
                };
              } else {
                semesterObj.subjectMarks.push(updatedSubjectMarks);
              }
            });

            await marks.save();
            return { studentId, message: "Marks updated successfully." };
          }

          return { studentId, error: `Semester ${semester} not found.` };
        })
      );

      return res.status(200).json({ updates: updateResults });
    }

    // Single update logic
    const { studentId, semester, updatedMarks } = req.body;
    const marks = await Marks.findOne({ student: studentId });

    if (!marks) {
      return res
        .status(404)
        .json({ error: "Marks not found for the student." });
    }

    const semesterObj = marks.result.find(
      (semesterObj) => semesterObj.semester === semester
    );

    if (!semesterObj) {
      return res.status(404).json({ error: `Semester ${semester} not found.` });
    }

    updatedMarks.forEach((updatedSubjectMarks) => {
      const existingSubjectIndex = semesterObj.subjectMarks.findIndex(
        (subjectMark) =>
          subjectMark.subject.toString() === updatedSubjectMarks.subject
      );

      if (existingSubjectIndex !== -1) {
        semesterObj.subjectMarks[existingSubjectIndex] = {
          ...semesterObj.subjectMarks[existingSubjectIndex],
          ...updatedSubjectMarks,
        };
      } else {
        semesterObj.subjectMarks.push(updatedSubjectMarks);
      }
    });

    await marks.save();
    return res.status(200).json({ message: "Marks updated successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFaculty = async (req, res) => {
  try {
    const { department } = req.body;
    const errors = { noFacultyError: String };
    const faculties = await Faculty.find({ department });
    if (faculties.length === 0) {
      errors.noFacultyError = "No Faculty Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: faculties });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getNotice = async (req, res) => {
  try {
    const errors = { noNoticeError: String };
    const notices = await Notice.find({});
    if (notices.length === 0) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notices });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getFilteredNotice = async (req, res) => {
  try {
    const filters = { ...req.query.faculty };
    const faculty = req.query.faculty;

    // Fetch notices addressed to 'all'
    const allNotices = await Notice.find({ to: "all", ...filters });

    // Fetch notices specific to the faculty (if 'faculty' parameter exists)
    const facultyNotices = faculty
      ? await Notice.find({ faculty: faculty, ...filters })
      : [];

    // Merge the results of both queries
    const mergedNotices = [...allNotices, ...facultyNotices];

    res.status(200).json(mergedNotices);
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addSubject = async (req, res) => {
  try {
    const {
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
      semester,
      theoryCredit,
      practicalCredit,
      ipeWeightage,
      practicalWeightage,
    } = req.body;
    const errors = { subjectError: String };
    const subject = await Subject.findOne({ subjectCode });
    if (subject) {
      errors.subjectError = "Given Subject is already added";
      return res.status(400).json(errors);
    }

    const newSubject = await new Subject({
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
      semester,
      theoryCredit,
      practicalCredit,
      ipeWeightage,
      practicalWeightage,
    });

    // uppercase all letters in all fields before saving
    newSubject.subjectCode = newSubject.subjectCode.toUpperCase();
    newSubject.subjectName = newSubject.subjectName.toUpperCase();
    newSubject.year = newSubject.year.toUpperCase();

    await newSubject.save();
    const students = await Student.find({ department, year });
    if (students.length !== 0) {
      for (var i = 0; i < students.length; i++) {
        students[i].subjects.push(newSubject._id);
        await students[i].save();
        let marks = await Marks.findOne({ student: students[i]._id });
        if (marks) {
          marks.result.forEach((semester) => {
            if (semester.semester === newSubject.semester) {
              semester.subjectMarks.push({
                subject: newSubject._id,
                theoryCredit: newSubject.theoryCredit,
                practicalCredit: newSubject.practicalCredit,
                ipeWeightage: newSubject.ipeWeightage,
                practicalWeightage: newSubject.practicalWeightage,
              });
            }
          });
        }

        await marks.save();
        let attendance = await Attendance.findOne({ student: students[i]._id });
        if (attendance) {
          attendance.attendanceRecord.forEach((semester) => {
            if (semester.semester === newSubject.semester) {
              semester.subjectAttendance.push({
                subject: newSubject._id,
                t1: [],
                t2: [],
                t3: [],
                t4: [],
                totalLectures: 0,
                attendedLectures: 0,
                attendancePercentage: 0,
              });
            }
          });
          await attendance.save();
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    console.error("Error adding subject:", error);
    return res.status(500).json({ backendError: "Failed to add subject" });
  }
};

export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.find({ department, year });
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;

    const errors = { noAdminError: String };

    const admins = await Admin.find({ department });
    if (admins.length === 0) {
      errors.noAdminError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: admins });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admins = req.body;
    const errors = { noAdminError: String };
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i];

      await Admin.findOneAndDelete({ _id: admin });
    }
    res.status(200).json({ message: "Admin Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteFaculty = async (req, res) => {
  try {
    const faculties = req.body;
    const errors = { noFacultyError: String };
    for (var i = 0; i < faculties.length; i++) {
      var faculty = faculties[i];

      await Faculty.findOneAndDelete({ _id: faculty });
    }
    res.status(200).json({ message: "Faculty Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const students = req.body;
    const errors = { noStudentError: String };
    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      await Student.findOneAndDelete({ _id: student });
    }
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body;
    const errors = { noSubjectError: String };
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];

      await Subject.findOneAndDelete({ _id: subject });
    }
    res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    await Department.findOneAndDelete({ department });

    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addStudent = async (req, res) => {
  try {
    // Extract relevant data from req.body
    const {
      name,
      dob,
      department,
      contactNumber,
      email,
      enrollmentNumber,
      gender,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      mentor,
    } = req.body;

    // Check for existing student with the same email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ emailError: "Email already exists" });
    }

    // Create a new Student instance
    const newStudent = new Student({
      name,
      dob,
      department,
      contactNumber,
      email,
      enrollmentNumber,
      gender,
      batch,
      section,
      year,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      mentor,
    });

    // Uppercase all necessary fields
    newStudent.name = newStudent.name.toUpperCase();
    newStudent.department = newStudent.department.toUpperCase();
    newStudent.email = newStudent.email.toUpperCase();
    newStudent.fatherName = newStudent.fatherName.toUpperCase();
    newStudent.motherName = newStudent.motherName.toUpperCase();
    newStudent.section = newStudent.section.toUpperCase();
    newStudent.year = newStudent.year.toUpperCase();
    newStudent.gender = newStudent.gender.toUpperCase();

    // Find subjects for the student's department, year, and semester
    const subjects = await Subject.find({ department, year });

    newStudent.subjects = subjects.map((subject) => subject._id);

    // Save the new student
    await newStudent.save();

    const io = req.app.get("socketio");

    // Use a more accurate timestamp for the notification
    const currentTime = new Date().toLocaleString(); // or use any specific format you prefer

    // Broadcast a notification to all connected clients
    io.emit("notification", {
      title: "New Student Added",
      message: `${newStudent.name} was added to the database at ${currentTime}`,
    });

    return res.status(200).json({
      success: true,
      message: "Student registered successfully with marks for all subjects",
      response: newStudent,
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const students = await Student.find({ department, year });

    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getAllStudent = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
  const pageSize = parseInt(req.query.limit) || 10; // Set the default page size or specify a custom limit

  try {
    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / pageSize);

    const students = await Student.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      students,
      page,
      totalPages,
      totalStudents,
    });
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllFilteredStudent = async (req, res) => {
  try {
    // Define an empty object to store filter conditions
    const filters = {};

    // Loop through all query parameters and add them to the filters object
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        filters[key] = req.query[key];
      }
    }

    // Modify the Student.find() query to include the filters
    const students = await Student.find(filters);

    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFilteredFaculty = async (req, res) => {
  try {
    const { contactNumber } = req.query;

    // Check if contactNumber exists in the query
    if (contactNumber) {
      const faculties = await Faculty.find({ contactNumber });
      res.status(200).json(faculties);
    } else {
      res.status(200).json(faculties);
    }
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = { noMarksError: String };
    const marks = await Marks.findOne({ id });

    if (!marks) {
      errors.noMarksError = "No Marks Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: marks });
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const forgotPasswordLink = async (req, res) => {
  try {
    const { email, userType } = req.body;

    let user;
    let modelName;

    // Determine the user model based on the userType provided in the request
    if (userType === "admin") {
      user = await Admin.findOne({ email: email.toUpperCase() });
      modelName = "Admin";
    } else if (userType === "faculty") {
      user = await Faculty.findOne({ email: email.toUpperCase() });
      modelName = "Faculty";
    } else {
      return res.status(400).json({ message: "Invalid userType provided" });
    }

    if (!user) {
      return res.status(404).json({ message: `${modelName} not found` });
    }

    // Generate a reset token (you can use JWT or any other method)
    const resetToken = jwt.sign(
      { userId: user._id, userType },
      "your_secret_key",
      { expiresIn: "1h" }
    );

    // Send an email to the user with a reset link containing the resetToken
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Use Nodemailer to send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Link is valid for 1 hour and can be used for 1 time only.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }
      return res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if token is blacklisted
    const blacklisted = await blacklistedTokens
      .findOne({ token: token })
      .exec();
    if (blacklisted) {
      return res.status(401).json({
        message: "Invalid or expired token. Please request a new link.",
      });
    }

    // Verify the token
    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token. Please request a new link.",
        });
      }

      const { userId, userType } = decoded;

      let userModel;

      // Determine the user model based on the userType provided in the token
      if (userType === "admin") {
        userModel = Admin;
      } else if (userType === "faculty") {
        userModel = Faculty;
      } else {
        return res.status(400).json({ message: "Invalid userType provided" });
      }

      // Find the user by ID
      const user = await userModel.findById(userId);

      // New password cannot be the same as the old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res
          .status(400)
          .json({ message: "New password cannot be the same as old password" });
      }

      if (!user) {
        return res.status(404).json({ message: `${userType} not found` });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      // Send an email to the user notifying them that their password has been changed
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: "Password Reset Successful",
        html: `
          <p>Hello ${user.name},</p>
          <p>Your password has been reset successfully.</p>
          <p>If you didn't request this, please contact the admin.</p>
          <p>Your updated password: ${user.password}</p>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Failed to send reset email" });
        }
      });

      // // Blacklist the token
      // const blacklistedToken = new blacklistedTokens({ token });
      // await blacklistedToken.save();

      return res.status(200).json({ message: "Password updated successfully" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = { noDepartmentError: String };
    const department = await Department.findOne({ _id: id });

    if (!department) {
      errors.noDepartmentError = "No Department Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ department });
  } catch (error) {
    console.log("Backend Error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOldTokens = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Delete tokens older than 24 hours
    await blacklistedTokens.deleteMany({
      createdAt: { $lt: twentyFourHoursAgo },
    });
    console.log("Old tokens deleted successfully");
  } catch (error) {
    console.error("Error deleting old tokens:", error);
  }
};

// Schedule the task to run every day at a specific time (e.g., midnight)
cron.schedule("0 0 * * *", deleteOldTokens);
