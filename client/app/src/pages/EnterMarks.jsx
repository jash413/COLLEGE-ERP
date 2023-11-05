import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentContext, subjectContext, userContext } from "../App";
import { toast } from "react-hot-toast";
import network from "../config/network";
import axios from "axios";

function EnterMarks() {
  const { token } = useContext(userContext);
  const [students] = useContext(studentContext);
  const [subjects] = useContext(subjectContext);
  const [enrollmentNumber, setEnrollmentNumber] = useState(null);
  const [courses, setCourses] = useState([]);

  const [student, setStudent] = useState({
    id: "",
    name: "",
    department: "",
    batch: "",
    course: [],
  });

  const [marks, setMarks] = useState({
    student: student.id,
    subject: "",
    t1: "",
    t2: "",
    t3: "",
    t4: "",
    practicalMarksIPE: "",
    practicalMarksProject: "",
  });

  const handleChange = (e) => {
    setMarks({ ...marks, [e.target.name]: e.target.value });
  };

  const getStudentDetails = () => {
    const foundStudent = students.find(
      (student) => student.enrollmentNumber === parseInt(enrollmentNumber, 10)
    );
    if (foundStudent) {
      setStudent({
        id: foundStudent._id,
        name: foundStudent.name,
        department: foundStudent.department,
        batch: foundStudent.batch,
        course: foundStudent.subjects,
      });
    } else {
      toast.error("Student not found");
    }
  };

  // student course name
  useEffect(() => {
    if (student.course && student.course.length > 0) {
      const courseName = student.course.map((course) => {
        const foundSubject = subjects.find((subject) => subject._id === course);
        return foundSubject.subjectName;
      });
      setCourses(courseName);
    }
  }, [student.course, subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (marks.subject === "") {
      toast.error("Please select course");
    } else {
      const foundStudent = students.find(
        (student) => student.enrollmentNumber === parseInt(enrollmentNumber, 10)
      );
      if (foundStudent) {
        setMarks({ ...marks, student: foundStudent._id });
        axios
          .post(`${network.server}/api/admin/addmarks`, marks, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            toast.success("Marks added successfully");
            setMarks({
              student: student.id,
              subject: "",
              t1: "",
              t2: "",
              t3: "",
              t4: "",
              practicalMarksIPE: "",
              practicalMarksProject: "",
            });
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      } else {
        toast.error("Student not found");
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="page-sub-header">
                <h3 className="page-title">Enter Marks</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/student/list">Marks</Link>
                  </li>
                  <li className="breadcrumb-item active">Enter Marks</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="student-group-form">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="form-group">
                <input
                  type="number"
                  className="form-control"
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  placeholder="Search by Enrollment Number ..."
                />
              </div>
            </div>
            <div className="col-lg-2">
              <div className="search-student-btn">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={getStudentDetails}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Basic Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Name</label>
                        <input
                          readOnly
                          type="text"
                          name="name"
                          className="form-control"
                          value={student.name ? student.name : "Student Name"}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Department</label>
                        <input
                          readOnly
                          type="text"
                          name="department"
                          className="form-control"
                          value={
                            student.department
                              ? student.department
                              : "Student Department"
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Batch</label>
                        <input
                          readOnly
                          type="text"
                          name="batch"
                          className="form-control"
                          value={
                            student.batch ? student.batch : "Student Batch"
                          }
                        />
                      </div>
                    </div>
                    {student.course && student.course.length > 0 && (
                      <div className="col-12 col-sm-4">
                        <div className="form-group local-forms">
                          <label>Select Course</label>
                          <select
                            className="form-control"
                            name="subject"
                            value={marks.subject}
                            onChange={handleChange}
                          >
                            <option>Select Course</option>
                            {courses.map((course, index) => (
                              <option key={index} value={subjects[index]._id}>{course}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="form-title">
                        <span>Marks Details</span>
                      </h5>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T1</label>
                        <input
                          type="number"
                          name="t1"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.t1}
                          placeholder="Enter T1 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T2</label>
                        <input
                          type="number"
                          name="t2"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.t2}
                          placeholder="Enter T2 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T3</label>
                        <input
                          type="number"
                          name="t3"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.t3}
                          placeholder="Enter T3 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>T4</label>
                        <input
                          type="number"
                          name="t4"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.t4}
                          placeholder="Enter T4 Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>IPE</label>
                        <input
                          type="number"
                          name="practicalMarksIPE"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.practicalMarksIPE}
                          placeholder="Enter IPE Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="form-group local-forms">
                        <label>Practical</label>
                        <input
                          type="number"
                          name="practicalMarksProject"
                          onChange={handleChange}
                          className="form-control"
                          value={marks.practicalMarksProject}
                          placeholder="Enter Practical Marks"
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="student-submit">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Copyright © 2023 Webwise Solutions.</p>
      </footer>
    </div>
  );
}

export default EnterMarks;
