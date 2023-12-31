import express from "express";
import auth from "../middleware/auth.js";
import multer from "multer";
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  addStudentsFromExcel,
  updateMarks,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFilteredStudent,
  getFilteredFaculty,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getDepartmentById,
  getAllSubject,
  getMarks,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
  getFilteredNotice,
  forgotPasswordLink,
  resetPassword,
  createWhatsAppGroup,
  downloadStudentExcel,
  downloadStudentExcelTemplate,
  getAllLeaveRequests,
  updateLeaveRequestById,
  getLeaveRequestById,
  deleteLeaveRequestById,
} from "../controller/adminController.js";
import { getAllAttendanceRecords, getAttendanceByStudentId, updateAttendanceRecord, deleteAttendanceRecord } from '../controller/attendanceController.js';
const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return cb(new Error("Only excel files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

// admin routes
router.post("/login", adminLogin);
router.post("/updatepassword", auth, updatedPassword);
router.get("/getallstudent", auth, getAllStudent);
router.post("/createnotice", auth, createNotice);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getdepartmentbyid/:id", auth, getDepartmentById);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getallfilteredstudent", auth, getAllFilteredStudent);
router.get("/getfilteredfaculty", auth, getFilteredFaculty);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, updateAdmin);
router.post("/addadmin", auth, addAdmin);
router.post("/adddepartment", auth, addDepartment);
router.post("/addfaculty", auth, addFaculty);
router.post("/getfaculty", auth, getFaculty);
router.post("/addsubject", auth, addSubject);
router.post("/getsubject", auth, getSubject);
router.post("/addstudent", auth, addStudent);
router.post("/addstudentsfromexcel", auth, upload, addStudentsFromExcel);
router.post("/getstudent", auth, getStudent);
router.get("/getnotice", auth, getNotice);
router.post("/getadmin", auth, getAdmin);
router.get("/getmarks/:id", auth, getMarks);
router.post("/deleteadmin", auth, deleteAdmin);
router.post("/deletefaculty", auth, deleteFaculty);
router.post("/deletestudent", auth, deleteStudent);
router.post("/deletedepartment", auth, deleteDepartment);
router.post("/deletesubject", auth, deleteSubject);
router.post("/updatemarks", auth, updateMarks);
router.post("/forgotpassword", forgotPasswordLink);
router.post("/resetpassword", resetPassword);
router.get("/getfilterednotice", auth, getFilteredNotice);
router.post("/createwhatsappgroup", auth ,createWhatsAppGroup);
router.get("/downloadstudentexcel" ,downloadStudentExcel);
router.get("/downloadstudentexceltemplate",downloadStudentExcelTemplate);
router.get("/getallleaverequests", auth, getAllLeaveRequests);
router.patch("/updateleaverequest/:id", auth, updateLeaveRequestById);
router.get("/getleaverequest/:id", auth, getLeaveRequestById);
router.delete("/deleteleaverequest/:id", auth, deleteLeaveRequestById);

// attendance routes
router.get('/attendance', getAllAttendanceRecords);
router.get('/attendance/:studentId', getAttendanceByStudentId);
router.patch('/attendance/:studentId', updateAttendanceRecord);
router.delete('/attendance/:studentId', deleteAttendanceRecord);

export default router;
