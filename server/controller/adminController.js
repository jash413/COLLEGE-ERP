import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import Marks from "../models/marks.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    const { from, content, topic, date, noticeFor } = req.body;

    const errors = { noticeError: String };
    const exisitingNotice = await Notice.findOne({ topic, content, date });
    if (exisitingNotice) {
      errors.noticeError = "Notice already created";
      return res.status(400).json(errors);
    }
    const newNotice = await new Notice({
      from,
      content,
      topic,
      noticeFor,
      date,
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
      gender,
      designation,
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

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;

    const newFaculty = await new Faculty({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      contactNumber,
      dob,
      gender,
      designation,
      passwordUpdated,
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
  const { filter, updateData, isBulkUpdate } = req.body;

  try {
    let result;

    if (isBulkUpdate) {
      result = await Marks.updateMany(filter, updateData);
    } else {
      result = await Marks.findOneAndUpdate(filter, updateData, { new: true });
    }

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Marks not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update marks: ${error.message}` });
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

export const addSubject = async (req, res) => {
  try {
    const {
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
      semester,
      credit,
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
      credit,
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
      }
    }

    const marks= await Marks.find({student:students.map((student) => student._id)});
    if(marks.length!==0){
      for(var i=0;i<marks.length;i++){
        marks[i].marks.push({subject:newSubject._id});
        await marks[i].save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    console.log(error);
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
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
    } = req.body;

    const errors = { emailError: String };
    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    

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
    });

    // Find subjects for the student's department and year
    const subjects = await Subject.find({ department, year });

    newStudent.subjects.push(...subjects.map((subject) => subject._id));

    // uppercase all letters in all fields before saving
    newStudent.name = newStudent.name.toUpperCase();
    newStudent.department = newStudent.department.toUpperCase();
    newStudent.email = newStudent.email.toUpperCase();
    newStudent.fatherName = newStudent.fatherName.toUpperCase();
    newStudent.motherName = newStudent.motherName.toUpperCase();
    newStudent.section = newStudent.section.toUpperCase();
    newStudent.year = newStudent.year.toUpperCase();
    newStudent.gender = newStudent.gender.toUpperCase();


    // Save the new student
    await newStudent.save();

    // Create marks for each subject
       // Create a new Marks model for the student
    const marksData = {
      student: newStudent._id,
      marks: subjects.map((subject) => ({
        subject: subject._id,
      })),
    };

      // Create marks for the subject
      const marks = new Marks(marksData);

      // Save the marks
      await marks.save();

      // Add the marks to the student's marks array
      newStudent.marks=marks._id;


    // Save the updated student with marks
    await newStudent.save();

    return res.status(200).json({
      success: true,
      message: "Student registered successfully with marks for all subjects",
      response: newStudent,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
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
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
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
