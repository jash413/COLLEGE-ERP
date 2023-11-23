import Attendance from "../models/attendance.js";


// get attendance records for all students
export const getAllAttendanceRecords = async (req, res, next) => {
  try {
    const attendanceRecords = await Attendance.find();
    res.status(200).json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};

//  get attendance for a specific student
export const getAttendanceByStudentId = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const attendanceRecord = await Attendance.findOne({ "student": studentId });
    if (!attendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found for the student" });
    }
    res.status(200).json(attendanceRecord);
  } catch (error) {
    next(error);
  }
};

// update attendance records
export const updateAttendanceRecord = async (req, res, next) => {
    const { studentId } = req.params;

    try {
      if (Array.isArray(req.body)) {
        const updatedAttendanceRecords = await Promise.all(
          req.body.map(async (attendanceRecord) => {
            const studentId = attendanceRecord.student;
            const existingRecord = await Attendance.findOne({ student: studentId });
  
            if (existingRecord) {
                // If record exists, update the existing one
                Object.assign(existingRecord, attendanceRecord);
                return existingRecord.save();
              } else {
                console.log(`Attendance record not found for the student with ID: ${studentId}`);
                return res.status(404).json({ message: "Attendance record not found for the student" });              
              }
          })
        );
  
        res.status(200).json(updatedAttendanceRecords);
      } else {
        // single student update
        const existingAttendanceRecord = await Attendance.findOne({ "student": studentId });
        if (!existingAttendanceRecord) {
          return res.status(404).json({ message: "Attendance record not found for the student" });
        }
  
       
        Object.assign(existingAttendanceRecord, req.body);
  
        
        const updatedAttendanceRecord = await existingAttendanceRecord.save();
  
        res.status(200).json(updatedAttendanceRecord);
      }
    } catch (error) {
      next(error);
    }
  };

//  delete attendance records
export const deleteAttendanceRecord = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const deletedAttendanceRecord = await Attendance.findOneAndDelete({ "student": studentId });
    if (!deletedAttendanceRecord) {
      return res.status(404).json({ message: "Attendance record not found for the student" });
    }
    res.status(200).json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    next(error);
  }
};
