import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { toast } from "react-hot-toast";
import network from "../config/network";
import axios from "axios";

function StudentGradeHistory() {
  const { token } = useContext(userContext);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [studentGrade, setStudentGrade] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

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
        .get(
          `${network.server}/api/admin/getmarks/${student.marks}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setStudentGrade(res.data.result);
          console.log(res.data.result);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  }, [student]);

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
                  <div className="row align-items-center">
                    <div className="col">
                      <h3 className="page-title">
                        Lok Jagruti Kendra University
                      </h3>
                    </div>
                    <div className="col-auto text-end float-end ms-auto download-grp">
                      <a href="#" className="btn btn-outline-primary me-2">
                        <i className="fas fa-download" /> Download
                      </a>
                    </div>
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
                    <div>{student?.enrollmentNumber}</div>
                    <div>{student?.name}</div>
                    <div>{student?.department}</div>
                    <div>{student?.contactNumber}</div>
                  </div>
                </div>
                <div className="row">
                    <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                        <thead>
                            <tr>
                            <th>Enrollment No</th>
                            <th>CPI</th>
                            <th>SPI</th>
                            <th>TOTAL BACKLOG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentGrade && 
                            <tr>
                            <td>{student?.enrollmentNumber}</td>
                            <td>{studentGrade?.cpi}</td>
                            <td>{studentGrade?.spi}</td>
                            <td>{studentGrade?.backlogs}</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
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
