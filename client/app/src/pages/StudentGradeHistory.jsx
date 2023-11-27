import React, { useState, useContext, useEffect } from "react";
import { userContext, subjectContext } from "../App";
import { toast } from "react-hot-toast";
import network from "../config/network";
import axios from "axios";

function StudentGradeHistory() {
  const { token } = useContext(userContext);
  const [subjects] = useContext(subjectContext);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [studentGrade, setStudentGrade] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [subjectArray, setSubjectArray] = useState([]);

  const handleEnrollmentNumberChange = (event) => {
    setEnrollmentNumber(event.target.value);
  };

  // Get student based on enrollment number
  const getStudent = () => {
    if (
      enrollmentNumber !== "" &&
      enrollmentNumber !== null &&
      enrollmentNumber !== undefined
    ) {
      setStudentGrade(null);
      setSearchLoading(true);
      axios
        .get(
          `${network.server}/api/admin/getallfilteredstudent?enrollmentNumber=${enrollmentNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setSearchLoading(false);
          if (res.data.length === 0) {
            toast.error("Student not found");
          }
          setStudent(res.data[0]);
        })
        .catch((err) => {
          setSearchLoading(false);
          toast.error(err.response.data.message);
        });
    }
  };

  //   Get student grade based on marks id
  useEffect(() => {
    if (student !== null && student !== undefined && student !== "") {
      axios
        .get(`${network.server}/api/admin/getmarks/${student.marks}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setStudentGrade(res.data.result);
          console.log(res.data);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }, [student]);

  //  Get subjects based on subjectMarks array
  useEffect(() => {
    if (subjects && studentGrade !== null && studentGrade !== undefined) {
      let temp = [];
      studentGrade.result.map((sem, index) => {
        sem.subjectMarks.map((subject, index) => {
          subjects.map((sub, index) => {
            if (subject.subject === sub._id) {
              temp.push({
                semester: sem.semester,
                subject: sub,
                subjectMarks: subject,
              });
            }
          });
        });
      });
      setSubjectArray(temp);
      console.log(temp);
    }
  }, [studentGrade]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="row">
            <div className="col-sm-12">
              <div className="page-sub-header">
                <h3 className="page-title">Student Grade History</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="student-group-form">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Enrollment Number ..."
                  value={enrollmentNumber}
                  onChange={handleEnrollmentNumberChange}
                />
              </div>
            </div>
            <div className="col-lg-2">
              {searchLoading ? (
                <div className="search-student-btn">
                  <button type="btn" className="btn btn-primary">
                    <i className="fa fa-spinner fa-spin"></i>
                  </button>
                </div>
              ) : (
                <div className="search-student-btn">
                  <button
                    type="btn"
                    className="btn btn-primary"
                    onClick={() => {
                      getStudent();
                    }}
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="page-header">
                  <div className="row text-center">
                    <h3 className="page-title" style={{ color: "red" }}>
                      LOK JAGRUTI KENDRA UNIVERSITY
                    </h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-2 m-b-20">
                    <div style={{ fontWeight: "bold" }}>Enrollment Number:</div>
                    <div style={{ fontWeight: "bold" }}>Name:</div>
                    <div style={{ fontWeight: "bold" }}>Branch:</div>
                    <div style={{ fontWeight: "bold" }}>Phone Number:</div>
                  </div>
                  <div className="col-sm-6 m-b-20">
                    <div>{student?.enrollmentNumber || "NA"}</div>
                    <div>{student?.name || "NA"}</div>
                    <div>{student?.department || "NA"}</div>
                    <div>{student?.contactNumber || "NA"}</div>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="table-responsive table-striped table-hover">
                    <table className="table table-bordered mb-0">
                      {studentGrade && (
                        <>
                          <thead>
                            <tr
                              style={{
                                backgroundColor: "darkblue",
                                color: "white",
                              }}
                            >
                              <th>Enrollment No</th>
                              <th>CPI</th>
                              <th>SPI</th>
                              <th>TOTBACKL</th>
                              <th>BCK1</th>
                              <th>BCK2</th>
                              <th>BCK3</th>
                              <th>BCK4</th>
                              <th>BCK5</th>
                              <th>BCK6</th>
                              <th>BCK7</th>
                              <th>BCK8</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{student?.enrollmentNumber}</td>
                              <td>{studentGrade?.cpi}</td>
                              <td>
                                {(() => {
                                  const semestersWithValidSPI =
                                    studentGrade?.result.filter(
                                      (sem) => sem.spi > 0
                                    );

                                  if (
                                    semestersWithValidSPI &&
                                    semestersWithValidSPI.length > 0
                                  ) {
                                    const lastSemesterWithValidSPI =
                                      semestersWithValidSPI[
                                        semestersWithValidSPI.length - 1
                                      ];
                                    return lastSemesterWithValidSPI.spi || "-";
                                  }
                                  return "0";
                                })()}
                              </td>
                              <td>{studentGrade?.totalBacklogs}</td>
                              {studentGrade?.result.map((backlog, index) => {
                                return (
                                  <td key={index}>{backlog.backlogs || `0`}</td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </>
                      )}
                    </table>
                  </div>
                </div>
                <br />
                {studentGrade &&
                  studentGrade.result.map((sem, index) => {
                    return (
                      sem.subjectMarks.length > 0 && (
                        <>
                          <div className="row text-center">
                            <div className="table-responsive">
                              <table className="table table-bordered mb-0 table-striped">
                                <thead>
                                  <tr>
                                    <th
                                      colSpan={6}
                                      style={{ backgroundColor: "#add8e68f" }}
                                    >
                                      SEMESTER {sem.semester}
                                    </th>
                                  </tr>
                                  <tr>
                                    <th className="col-1">Course Code</th>
                                    <th className="col-7">Course Name</th>
                                    <th className="col-1">Credits</th>
                                    <th className="col-1">Theory Grade</th>
                                    <th className="col-1">Practical Grade</th>
                                    <th className="col-1">Overall Grade</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {subjectArray.map(
                                    (subject, index) =>
                                      subject.semester === sem.semester && (
                                        <tr key={index}>
                                          <td>
                                            {subject.subject?.subjectCode ||
                                              "-"}
                                          </td>
                                          <td>
                                            {subject.subject?.subjectName ||
                                              "-"}
                                          </td>
                                          <td>
                                            {subject.subject?.theoryCredit +
                                              subject.subject
                                                ?.practicalCredit || "-"}
                                          </td>
                                          <td
                                            style={{
                                              color: `${
                                                subject.subjectMarks
                                                  ?.theoryGrade === "F"
                                                  ? "red"
                                                  : ""
                                              }`,
                                            }}
                                          >
                                            {subject.subjectMarks?.theoryGrade}
                                          </td>
                                          <td
                                            style={{
                                              color: `${
                                                subject.subjectMarks
                                                  ?.practicalGrade === "F"
                                                  ? "red"
                                                  : ""
                                              }`,
                                            }}
                                          >
                                            {subject.subjectMarks
                                              ?.practicalGrade || "-"}
                                          </td>
                                          <td
                                            style={{
                                              color: `${
                                                subject.subjectMarks
                                                  ?.overallGrade === "F"
                                                  ? "red"
                                                  : ""
                                              }`,
                                            }}
                                          >
                                            {subject.subjectMarks
                                              ?.overallGrade || "-"}
                                          </td>
                                        </tr>
                                      )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <br />
                        </>
                      )
                    );
                  })}
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

export default StudentGradeHistory;
