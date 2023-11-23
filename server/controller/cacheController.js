import NodeCache from "node-cache";
import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";

// Create a new cache
const cache = new NodeCache();

// Function to fetch student data
const getStudentData = async () => {
  try {
    const students = await Student.find();
    cache.set("students", students);
    console.log("Student data cached");
    return students;
  } catch (error) {
    console.error("Error fetching student data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

const getFacultyData = async () => {
  try {
    const faculties = await Faculty.find();
    cache.set("faculties", faculties);
    console.log("Faculty data cached");
    return faculties;
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

const getAdminData = async () => {
  try {
    const admins = await Admin.find();
    cache.set("admins", admins);
    console.log("Admin data cached");
    return admins;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

const getDepartmentData = async () => {
  try {
    const departments = await Department.find();
    cache.set("departments", departments);
    console.log("Department data cached");
    return departments;
  } catch (error) {
    console.error("Error fetching department data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

const getSubjectData = async () => {
  try {
    const subjects = await Subject.find();
    cache.set("subjects", subjects);
    console.log("Subject data cached");
    return subjects;
  } catch (error) {
    console.error("Error fetching subject data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

// Function to fetch all data
export const getAllData = async () => {
  try {
    const studentsPromise = getStudentData();
    const facultiesPromise = getFacultyData();
    const adminsPromise = getAdminData();
    const departmentsPromise = getDepartmentData();
    const subjectsPromise = getSubjectData();

    // Parallel execution of all data fetching functions
    const [students, faculties, admins, departments, subjects] =
      await Promise.all([
        studentsPromise,
        facultiesPromise,
        adminsPromise,
        departmentsPromise,
        subjectsPromise,
      ]);

    return { students, faculties, admins, departments, subjects };
  } catch (error) {
    console.error("Error fetching all data:", error);
    throw error; // Rethrow the error for better error handling
  }
};

// Update cache on database changes
const updateCacheOnChange = (modelName, getDataFunction) => {
  modelName.watch().on("change", async () => {
    try {
      await getDataFunction();
    } catch (error) {
      console.error(`Error updating cache for ${modelName.modelName}:`, error);
    }
  });
};

// Update cache on database changes for each entity
updateCacheOnChange(Student, getStudentData);
updateCacheOnChange(Faculty, getFacultyData);
updateCacheOnChange(Admin, getAdminData);
updateCacheOnChange(Department, getDepartmentData);
updateCacheOnChange(Subject, getSubjectData);


